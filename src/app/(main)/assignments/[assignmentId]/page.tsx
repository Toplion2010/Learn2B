import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssignmentById, getUserSubmissionForAssignment } from "@/actions/submissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { SubmissionForm } from "@/components/assignments/submission-form";
import ReactMarkdown from "react-markdown";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) notFound();

  const existingSubmission = await getUserSubmissionForAssignment(assignmentId);

  const typeLabels: Record<string, string> = {
    writing_task1: "Writing Task 1",
    writing_task2: "Writing Task 2",
    speaking_part1: "Speaking Part 1",
    speaking_part2: "Speaking Part 2",
    speaking_part3: "Speaking Part 3",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/assignments"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge>{typeLabels[assignment.assignment_type]}</Badge>
          {assignment.due_date && (
            <Badge variant="outline">
              <Clock className="mr-1 h-3 w-3" />
              Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
            </Badge>
          )}
          <Badge variant="outline">+{assignment.points_reward} pts</Badge>
        </div>
        <h1 className="text-3xl font-bold">{assignment.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{assignment.description}</ReactMarkdown>
        </CardContent>
      </Card>

      {existingSubmission ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Submission
              <Badge
                variant={
                  existingSubmission.status === "graded"
                    ? "default"
                    : existingSubmission.status === "in_review"
                      ? "secondary"
                      : "outline"
                }
              >
                {existingSubmission.status === "graded" && existingSubmission.score
                  ? `Band ${existingSubmission.score}`
                  : existingSubmission.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="whitespace-pre-wrap text-sm">
                {existingSubmission.content}
              </p>
            </div>
            {existingSubmission.feedback && (
              <div>
                <h4 className="font-semibold mb-2">Teacher Feedback</h4>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                  <p className="text-sm whitespace-pre-wrap">
                    {existingSubmission.feedback}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <SubmissionForm assignmentId={assignmentId} />
      )}
    </div>
  );
}
