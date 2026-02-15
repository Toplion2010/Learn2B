"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { addPoints, updateStreak } from "./profiles";
import { POINTS } from "@/lib/constants";
import type { Course, Lesson, Enrollment } from "@/types/database";

type CourseWithLessonCount = Course & { lessons: { count: number }[] };
type CourseWithLessons = Course & { lessons: Pick<Lesson, "id" | "title" | "slug" | "summary" | "sort_order" | "points_reward" | "is_published">[] };
type EnrollmentWithCourse = Enrollment & { courses: Course | null };

export async function getCourses(category?: string): Promise<CourseWithLessonCount[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase
    .from("courses")
    .select("*, lessons(count)")
    .eq("is_published", true)
    .order("sort_order") as any;

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) return [];
  return data as CourseWithLessonCount[];
}

export async function getCourseBySlug(slug: string): Promise<CourseWithLessons | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("courses")
    .select("*, lessons(id, title, slug, summary, sort_order, points_reward, is_published)")
    .eq("slug", slug)
    .single() as any);

  if (data?.lessons) {
    data.lessons.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
    );
  }

  return data as CourseWithLessons | null;
}

export async function getCourseById(id: string): Promise<CourseWithLessons | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("courses")
    .select("*, lessons(id, title, slug, summary, sort_order, points_reward, is_published)")
    .eq("id", id)
    .single() as any);

  return data as CourseWithLessons | null;
}

export async function getLesson(courseId: string, lessonSlug: string): Promise<Lesson | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("slug", lessonSlug)
    .single();

  return data as Lesson | null;
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  return data as Lesson | null;
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("enrollments")
    .insert({ user_id: user.id, course_id: courseId });

  if (error) {
    if (error.code === "23505") return { error: "Already enrolled" };
    return { error: error.message };
  }

  revalidatePath("/courses");
  return { success: true };
}

export async function getEnrollments(): Promise<EnrollmentWithCourse[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("user_id", user.id) as any);

  return (data || []) as EnrollmentWithCourse[];
}

export async function isEnrolled(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  return !!data;
}

export async function completeLesson(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("lesson_completions")
    .insert({ user_id: user.id, lesson_id: lessonId });

  if (error) {
    if (error.code === "23505") return { success: true }; // Already completed
    return { error: error.message };
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("points_reward")
    .eq("id", lessonId)
    .single();

  if (lesson) {
    await addPoints(user.id, lesson.points_reward || POINTS.LESSON_COMPLETE);
  }

  await updateStreak();

  revalidatePath("/courses");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getLessonCompletions(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId);

  if (!lessons?.length) return [];

  const lessonIds = lessons.map((l) => l.id);
  const { data } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds);

  return data?.map((c) => c.lesson_id) || [];
}

// Admin functions
export async function createCourse(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description") as string;
  const category = formData.get("category") as "speaking" | "writing";
  const difficulty = formData.get("difficulty") as "beginner" | "intermediate" | "advanced";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description,
      category,
      difficulty,
      created_by: user?.id,
      is_published: formData.get("is_published") === "true",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/courses");
  return { success: true, data };
}

export async function updateCourse(courseId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("courses")
    .update({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as "speaking" | "writing",
      difficulty: formData.get("difficulty") as "beginner" | "intermediate" | "advanced",
      is_published: formData.get("is_published") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId);

  if (error) return { error: error.message };

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}

export async function createLesson(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      title,
      slug: (formData.get("slug") as string) || title.toLowerCase().replace(/\s+/g, "-"),
      content: formData.get("content") as string,
      summary: (formData.get("summary") as string) || null,
      sort_order: parseInt(formData.get("sortOrder") as string) || 0,
      points_reward: parseInt(formData.get("pointsReward") as string) || 10,
      is_published: formData.get("is_published") === "true",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/admin/courses/\${courseId}`);
  return { success: true, data };
}

export async function getAllCourses(): Promise<CourseWithLessonCount[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("courses")
    .select("*, lessons(count)")
    .order("created_at", { ascending: false }) as any);

  return (data || []) as CourseWithLessonCount[];
}
