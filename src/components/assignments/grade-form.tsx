"use client";

import { useState } from "react";
import { gradeSubmission } from "@/actions/submissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function GradeForm({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await gradeSubmission(submissionId, formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Submission graded!");
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <h4 className="text-sm font-semibold">Grade this submission</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`score-${submissionId}`}>Band Score (0-9)</Label>
          <Input
            id={`score-${submissionId}`}
            name="score"
            type="number"
            step="0.5"
            min="0"
            max="9"
            placeholder="6.5"
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`feedback-${submissionId}`}>Feedback</Label>
        <Textarea
          id={`feedback-${submissionId}`}
          name="feedback"
          placeholder="Provide detailed feedback..."
          rows={4}
        />
      </div>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Grading...
          </>
        ) : (
          "Submit Grade"
        )}
      </Button>
    </form>
  );
}
