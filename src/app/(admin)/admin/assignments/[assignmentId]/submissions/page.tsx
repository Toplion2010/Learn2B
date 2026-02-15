import { notFound } from "next/navigation";
import { getAssignmentById, getSubmissionsForAssignment } from "@/actions/submissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { GradeForm } from "@/components/assignments/grade-form";

export default async function AdminSubmissionsPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) notFound();

  const submissions = await getSubmissionsForAssignment(assignmentId);

  return (
    <div className="space-y-6">
      <Link href="/admin/assignments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <PageHeader
        title={`Submissions: ${assignment.title}`}
        description={`${submissions.length} submission${submissions.length !== 1 ? "s" : ""}`}
      />

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No submissions yet for this assignment.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const student = sub.profiles as {
              full_name: string;
              avatar_url: string | null;
              email: string;
            };
            const initials = student?.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "??";

            return (
              <Card key={sub.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student?.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {format(new Date(sub.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        sub.status === "graded" ? "default" : sub.status === "in_review" ? "secondary" : "outline"
                      }
                    >
                      {sub.status === "graded" && sub.score ? `Band ${sub.score}` : sub.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="whitespace-pre-wrap text-sm">{sub.content}</p>
                  </div>

                  {sub.status === "graded" && sub.feedback && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                      <p className="text-sm font-medium mb-1">Feedback:</p>
                      <p className="text-sm whitespace-pre-wrap">{sub.feedback}</p>
                    </div>
                  )}

                  {sub.status !== "graded" && (
                    <GradeForm submissionId={sub.id} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
