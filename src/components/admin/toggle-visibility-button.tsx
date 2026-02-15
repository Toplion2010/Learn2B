"use client";

import { togglePostVisibility } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function ToggleVisibilityButton({
  postId,
  isHidden,
}: {
  postId: string;
  isHidden: boolean;
}) {
  async function handleToggle() {
    const result = await togglePostVisibility(postId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isHidden ? "Post is now visible" : "Post hidden");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle}>
      {isHidden ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  );
}
