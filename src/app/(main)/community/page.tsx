import Link from "next/link";
import { getPosts } from "@/actions/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare, Heart, MessageCircle, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreatePostDialog } from "@/components/community/create-post-dialog";

export const metadata = { title: "Community" };

const categories = ["all", "general", "speaking", "writing", "tips", "motivation", "question"];

export default async function CommunityPage() {
  const posts = await getPosts();

  function PostList({ posts: filteredPosts }: { posts: typeof posts }) {
    if (filteredPosts.length === 0) {
      return (
        <EmptyState
          icon={MessageSquare}
          title="No posts yet"
          description="Be the first to start a discussion!"
        />
      );
    }

    return (
      <div className="space-y-4">
        {filteredPosts.map((post) => {
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
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="transition-all hover:shadow-sm hover:border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={author?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">
                          {author?.full_name}
                        </span>
                        {author?.role !== "student" && (
                          <Badge variant="secondary" className="text-xs">
                            {author?.role}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        {post.is_pinned && (
                          <Badge className="text-xs">Pinned</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mt-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Community" description="Discuss, share tips, and learn together">
        <CreatePostDialog />
      </PageHeader>

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-6">
            <PostList
              posts={
                cat === "all"
                  ? posts
                  : posts.filter((p) => p.category === cat)
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
