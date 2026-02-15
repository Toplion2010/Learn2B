"use client";

import { useState } from "react";
import { submitAssignment } from "@/actions/submissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function SubmissionForm({ assignmentId }: { assignmentId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 10) {
      toast.error("Your response must be at least 10 characters");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.set("content", content);

    const result = await submitAssignment(assignmentId, formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Submission sent! You'll receive feedback soon.");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Response</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Write your response here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="resize-y"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span>Minimum 10 characters</span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading || content.trim().length < 10}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Response
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
