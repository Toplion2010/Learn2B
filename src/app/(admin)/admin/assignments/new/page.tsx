"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/actions/submissions";
import { getAllCourses } from "@/actions/courses";
import { Card, CardContent } from "@/components/ui/card";
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
import { PageHeader } from "@/components/shared/page-header";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Course } from "@/types/database";

export default function NewAssignmentPage() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    getAllCourses().then((c) => setCourses(c as Course[]));
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createAssignment(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Assignment created!");
      router.push("/admin/assignments");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/admin/assignments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <PageHeader title="Create Assignment" />

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Writing Task 2: Opinion Essay" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Instructions (Markdown)</Label>
              <Textarea id="description" name="description" placeholder="Write your instructions..." rows={6} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select name="assignmentType" defaultValue="writing_task2">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="writing_task1">Writing Task 1</SelectItem>
                    <SelectItem value="writing_task2">Writing Task 2</SelectItem>
                    <SelectItem value="speaking_part1">Speaking Part 1</SelectItem>
                    <SelectItem value="speaking_part2">Speaking Part 2</SelectItem>
                    <SelectItem value="speaking_part3">Speaking Part 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course (optional)</Label>
                <Select name="courseId">
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (optional)</Label>
                <Input id="dueDate" name="dueDate" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointsReward">Points Reward</Label>
                <Input id="pointsReward" name="pointsReward" type="number" defaultValue="20" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" name="is_published" value="true" className="rounded" />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Assignment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
