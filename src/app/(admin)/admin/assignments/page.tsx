import Link from "next/link";
import { getAllAssignments } from "@/actions/submissions";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Eye } from "lucide-react";
import { format } from "date-fns";

export const metadata = { title: "Manage Assignments" };

const typeLabels: Record<string, string> = {
  writing_task1: "Writing T1",
  writing_task2: "Writing T2",
  speaking_part1: "Speaking P1",
  speaking_part2: "Speaking P2",
  speaking_part3: "Speaking P3",
};

export default async function AdminAssignmentsPage() {
  const assignments = await getAllAssignments();

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Assignments" description="Create and manage student assignments">
        <Link href="/admin/assignments/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Assignment
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const course = assignment.courses as { title: string } | null;
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[assignment.assignment_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{course?.title || "-"}</TableCell>
                    <TableCell>
                      {assignment.due_date
                        ? format(new Date(assignment.due_date), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={assignment.is_published ? "default" : "secondary"}>
                        {assignment.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link href={`/admin/assignments/${assignment.id}/submissions`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/assignments/${assignment.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No assignments yet.
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
