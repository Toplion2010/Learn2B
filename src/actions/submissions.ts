"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { addPoints, updateStreak } from "./profiles";
import { POINTS } from "@/lib/constants";
import type { Assignment, Submission, Profile } from "@/types/database";

type AssignmentWithCourse = Assignment & { courses: { title: string; slug: string } | null };
type SubmissionWithAssignment = Submission & { assignments: { title: string; assignment_type: string } | null };
type SubmissionWithDetails = Submission & {
  assignments: { title: string; assignment_type: string; description: string; max_score: number } | null;
  profiles: { full_name: string; avatar_url: string | null } | null;
};
type SubmissionWithProfile = Submission & {
  profiles: { full_name: string; avatar_url: string | null; email: string } | null;
};
type AssignmentWithCourseTitle = Assignment & { courses: { title: string } | null };

export async function getAssignments(courseId?: string): Promise<AssignmentWithCourse[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase
    .from("assignments")
    .select("*, courses(title, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false }) as any;

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data } = await query;
  return (data || []) as AssignmentWithCourse[];
}

export async function getAssignmentById(id: string): Promise<AssignmentWithCourse | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("assignments")
    .select("*, courses(title, slug)")
    .eq("id", id)
    .single() as any);

  return data as AssignmentWithCourse | null;
}

export async function submitAssignment(
  assignmentId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const content = formData.get("content") as string;
  if (!content || content.trim().length < 10) {
    return { error: "Submission must be at least 10 characters" };
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      assignment_id: assignmentId,
      user_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await addPoints(user.id, POINTS.ASSIGNMENT_SUBMIT);
  await updateStreak();

  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  return { success: true, data };
}

export async function getMySubmissions(): Promise<SubmissionWithAssignment[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("submissions")
    .select("*, assignments(title, assignment_type)")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false }) as any);

  return (data || []) as SubmissionWithAssignment[];
}

export async function getSubmissionById(id: string): Promise<SubmissionWithDetails | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("submissions")
    .select("*, assignments(title, assignment_type, description, max_score), profiles!submissions_user_id_fkey(full_name, avatar_url)")
    .eq("id", id)
    .single() as any);

  return data as SubmissionWithDetails | null;
}

export async function getSubmissionsForAssignment(assignmentId: string): Promise<SubmissionWithProfile[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("submissions")
    .select("*, profiles!submissions_user_id_fkey(full_name, avatar_url, email)")
    .eq("assignment_id", assignmentId)
    .order("submitted_at", { ascending: false }) as any);

  return (data || []) as SubmissionWithProfile[];
}

export async function gradeSubmission(
  submissionId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const score = parseFloat(formData.get("score") as string);
  const feedback = formData.get("feedback") as string;

  if (isNaN(score) || score < 0 || score > 9) {
    return { error: "Score must be between 0 and 9" };
  }

  const { data: submission } = await supabase
    .from("submissions")
    .select("user_id")
    .eq("id", submissionId)
    .single();

  const { error } = await supabase
    .from("submissions")
    .update({
      score,
      feedback: feedback || null,
      status: "graded",
      graded_by: user.id,
      graded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) return { error: error.message };

  // Bonus points for high score
  if (submission && score >= 6.5) {
    await addPoints(submission.user_id, POINTS.HIGH_SCORE_BONUS);
  }

  revalidatePath("/admin/assignments");
  return { success: true };
}

// Admin functions
export async function getAllAssignments(): Promise<AssignmentWithCourseTitle[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("assignments")
    .select("*, courses(title)")
    .order("created_at", { ascending: false }) as any);

  return (data || []) as AssignmentWithCourseTitle[];
}

export async function createAssignment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("assignments")
    .insert({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignment_type: formData.get("assignmentType") as "writing_task1" | "writing_task2" | "speaking_part1" | "speaking_part2" | "speaking_part3",
      course_id: (formData.get("courseId") as string) || null,
      due_date: (formData.get("dueDate") as string) || null,
      points_reward:
        parseInt(formData.get("pointsReward") as string) || 20,
      is_published: formData.get("is_published") === "true",
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/assignments");
  return { success: true, data };
}

export async function updateAssignment(
  assignmentId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("assignments")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignment_type: formData.get("assignmentType") as "writing_task1" | "writing_task2" | "speaking_part1" | "speaking_part2" | "speaking_part3",
      course_id: (formData.get("courseId") as string) || null,
      due_date: (formData.get("dueDate") as string) || null,
      points_reward:
        parseInt(formData.get("pointsReward") as string) || 20,
      is_published: formData.get("is_published") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", assignmentId);

  if (error) return { error: error.message };

  revalidatePath("/admin/assignments");
  revalidatePath("/assignments");
  return { success: true };
}

export async function getUserSubmissionForAssignment(assignmentId: string): Promise<Submission | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();

  return data as Submission | null;
}
