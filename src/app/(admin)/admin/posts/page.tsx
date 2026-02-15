import { getAllPosts } from "@/actions/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ToggleVisibilityButton } from "@/components/admin/toggle-visibility-button";

export const metadata = { title: "Moderate Posts" };

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-6">
      <PageHeader title="Moderate Posts" description="Manage community posts" />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                const author = post.profiles as { full_name: string; email: string };
                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>{author?.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>{post.likes_count}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(post.created_at), "MMM d")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_hidden ? "destructive" : "default"}>
                        {post.is_hidden ? "Hidden" : "Visible"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ToggleVisibilityButton postId={post.id} isHidden={post.is_hidden} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
