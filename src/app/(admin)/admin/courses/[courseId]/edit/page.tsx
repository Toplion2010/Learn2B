"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourseById, updateCourse, createLesson } from "@/actions/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { use } from "react";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<Awaited<ReturnType<typeof getCourseById>>>(null);
  const [loading, setLoading] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCourseById(courseId).then(setCourse);
  }, [courseId]);

  if (!course) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    const result = await updateCourse(courseId, formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Course updated!");
    }
    setLoading(false);
  }

  async function handleAddLesson(formData: FormData) {
    setLessonLoading(true);
    formData.set("courseId", courseId);
    const result = await createLesson(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Lesson added!");
      const updated = await getCourseById(courseId);
      setCourse(updated);
    }
    setLessonLoading(false);
  }

  const lessons = (course.lessons || []) as {
    id: string;
    title: string;
    slug: string;
    sort_order: number;
    is_published: boolean;
  }[];

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <PageHeader title={`Edit: ${course.title}`} />

      {/* Edit Course */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={course.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={course.slug} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={course.description} rows={4} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category" defaultValue={course.category}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select name="difficulty" defaultValue={course.difficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" name="is_published" value="true" defaultChecked={course.is_published} className="rounded" />
              <Label htmlFor="is_published">Published</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lessons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lessons ({lessons.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lessons.sort((a, b) => a.sort_order - b.sort_order).map((lesson, i) => (
            <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{i + 1}. {lesson.title}</p>
                <p className="text-xs text-muted-foreground">/{lesson.slug}</p>
              </div>
              <Badge variant={lesson.is_published ? "default" : "secondary"}>
                {lesson.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          ))}

          {/* Add Lesson Form */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Add New Lesson</h4>
            <form action={handleAddLesson} className="space-y-3">
              <Input name="title" placeholder="Lesson title" required />
              <Input name="slug" placeholder="lesson-slug" />
              <Input name="summary" placeholder="Short summary (optional)" />
              <Textarea name="content" placeholder="Lesson content (Markdown)..." rows={6} required />
              <div className="grid grid-cols-2 gap-4">
                <Input name="sortOrder" type="number" placeholder="Sort order" defaultValue="0" />
                <Input name="pointsReward" type="number" placeholder="Points" defaultValue="10" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="lesson_published" name="is_published" value="true" className="rounded" />
                <Label htmlFor="lesson_published">Publish</Label>
              </div>
              <Button type="submit" variant="secondary" disabled={lessonLoading} className="gap-2">
                {lessonLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Lesson
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
