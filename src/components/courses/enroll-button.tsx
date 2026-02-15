"use client";

import { useState } from "react";
import { enrollInCourse } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    const result = await enrollInCourse(courseId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Successfully enrolled!");
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleEnroll} disabled={loading} size="lg">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        "Enroll in Course"
      )}
    </Button>
  );
}
