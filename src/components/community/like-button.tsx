"use client";

import { useState } from "react";
import { toggleLike } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  async function handleLike() {
    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setCount((c) => c + (optimisticLiked ? 1 : -1));

    const result = await toggleLike(postId);
    if (result.error) {
      setLiked(!optimisticLiked);
      setCount((c) => c + (optimisticLiked ? -1 : 1));
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={cn("gap-1", liked && "text-red-500")}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      {count}
    </Button>
  );
}
