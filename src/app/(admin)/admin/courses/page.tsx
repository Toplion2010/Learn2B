import Link from "next/link";
import { getAllCourses } from "@/actions/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";

export const metadata = { title: "Manage Courses" };

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Courses" description="Create and manage IELTS courses">
        <Link href="/admin/courses/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Lessons</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const lessonCount =
                  (course.lessons as unknown as { count: number }[])?.[0]
                    ?.count || 0;
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">
                      {course.difficulty}
                    </TableCell>
                    <TableCell>{lessonCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={course.is_published ? "default" : "secondary"}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No courses yet. Create your first course!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
