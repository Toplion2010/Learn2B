import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById, getComments } from "@/actions/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "@/components/community/like-button";
import { CommentForm } from "@/components/community/comment-form";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPostById(postId);
  if (!post) notFound();

  const comments = await getComments(postId);

  const author = post.profiles as {
    full_name: string;
    avatar_url: string | null;
    role: string;
  };

  const initials = author?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author?.avatar_url || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{author?.full_name}</span>
                {author?.role !== "student" && (
                  <Badge variant="secondary" className="text-xs">
                    {author?.role}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Badge variant="outline" className="mb-2">
              {post.category}
            </Badge>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t pt-4">
            <LikeButton postId={postId} initialCount={post.likes_count} />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {comments.length} comments
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Comments ({comments.length})
        </h2>

        <CommentForm postId={postId} />

        <div className="mt-6 space-y-4">
          {comments.map((comment) => {
            const commentAuthor = comment.profiles as {
              full_name: string;
              avatar_url: string | null;
              role: string;
            };
            const commentInitials = commentAuthor?.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "??";

            return (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={commentAuthor?.avatar_url || undefined}
                      />
                      <AvatarFallback className="text-xs">
                        {commentInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {commentAuthor?.full_name}
                        </span>
                        {commentAuthor?.role !== "student" && (
                          <Badge variant="secondary" className="text-xs">
                            {commentAuthor?.role}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(comment.created_at),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
