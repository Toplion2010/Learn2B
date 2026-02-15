import Link from "next/link";
import { getAssignments } from "@/actions/submissions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText, Clock, Mic, PenTool } from "lucide-react";
import { format } from "date-fns";

export const metadata = { title: "Assignments" };

const typeIcons: Record<string, typeof Mic> = {
  writing_task1: PenTool,
  writing_task2: PenTool,
  speaking_part1: Mic,
  speaking_part2: Mic,
  speaking_part3: Mic,
};

const typeLabels: Record<string, string> = {
  writing_task1: "Writing Task 1",
  writing_task2: "Writing Task 2",
  speaking_part1: "Speaking Part 1",
  speaking_part2: "Speaking Part 2",
  speaking_part3: "Speaking Part 3",
};

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Complete tasks and get expert feedback on your IELTS responses"
      />

      {assignments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No assignments available"
          description="Check back soon for new assignments!"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const Icon = typeIcons[assignment.assignment_type] || FileText;
            const course = assignment.courses as { title: string; slug: string } | null;
            const isOverdue =
              assignment.due_date &&
              new Date(assignment.due_date) < new Date();

            return (
              <Link key={assignment.id} href={`/assignments/${assignment.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        <Icon className="mr-1 h-3 w-3" />
                        {typeLabels[assignment.assignment_type]}
                      </Badge>
                      {assignment.due_date && (
                        <Badge
                          variant={isOverdue ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(assignment.due_date), "MMM d")}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {assignment.description}
                    </p>
                    {course && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Course: {course.title}
                      </p>
                    )}
                    <Badge variant="outline" className="mt-3">
                      +{assignment.points_reward} pts
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
