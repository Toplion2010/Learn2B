"use client";

import { useState } from "react";
import { completeLesson } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function MarkLessonComplete({
  lessonId,
  courseId,
}: {
  lessonId: string;
  courseId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const result = await completeLesson(lessonId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setCompleted(true);
      toast.success("Lesson completed! Points earned.");
    }
    setLoading(false);
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Lesson completed!</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button onClick={handleComplete} disabled={loading} size="lg" className="gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Marking complete...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            Mark as Complete
          </>
        )}
      </Button>
    </div>
  );
}
