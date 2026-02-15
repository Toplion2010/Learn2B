"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { addPoints, updateStreak } from "./profiles";
import { POINTS } from "@/lib/constants";
import type { Post, Comment as DbComment } from "@/types/database";

type PostWithProfile = Post & {
  profiles: { full_name: string; avatar_url: string | null; role: string } | null;
};
type PostWithProfileEmail = Post & {
  profiles: { full_name: string; email: string } | null;
};
type CommentWithProfile = DbComment & {
  profiles: { full_name: string; avatar_url: string | null; role: string } | null;
};

export async function getPosts(
  page = 1,
  category?: string,
  limit = 20
): Promise<PostWithProfile[]> {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(full_name, avatar_url, role)")
    .eq("is_hidden", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1) as any;

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return (data || []) as PostWithProfile[];
}

export async function getPostById(id: string): Promise<PostWithProfile | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(full_name, avatar_url, role)")
    .eq("id", id)
    .single() as any);

  return data as PostWithProfile | null;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = ((formData.get("category") as string) || "general") as "general" | "speaking" | "writing" | "tips" | "motivation" | "question";

  if (!title || title.trim().length < 3) {
    return { error: "Title must be at least 3 characters" };
  }
  if (!content || content.trim().length < 10) {
    return { error: "Content must be at least 10 characters" };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: title.trim(),
      content: content.trim(),
      category,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await addPoints(user.id, POINTS.CREATE_POST);
  await updateStreak();

  revalidatePath("/community");
  return { success: true, data };
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("posts")
    .update({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as "general" | "speaking" | "writing" | "tips" | "motivation" | "question",
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath("/community");
  return { success: true };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath("/community");
  return { success: true };
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("post_likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);

    try {
      await supabase.rpc("decrement_likes" as never, { post_id: postId } as never);
    } catch {
      // If RPC doesn't exist, ignore
    }
  } else {
    await supabase
      .from("post_likes")
      .insert({ user_id: user.id, post_id: postId });
  }

  // Update likes count
  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  await supabase
    .from("posts")
    .update({ likes_count: count || 0 })
    .eq("id", postId);

  revalidatePath("/community");
  return { success: true, liked: !existing };
}

export async function hasLiked(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("post_likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  return !!data;
}

// Comments
export async function getComments(postId: string): Promise<CommentWithProfile[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("comments")
    .select("*, profiles!comments_author_id_fkey(full_name, avatar_url, role)")
    .eq("post_id", postId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true }) as any);

  return (data || []) as CommentWithProfile[];
}

export async function createComment(postId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const content = formData.get("content") as string;
  const parentId = formData.get("parentId") as string;

  if (!content || content.trim().length < 1) {
    return { error: "Comment cannot be empty" };
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content: content.trim(),
    parent_id: parentId || null,
  });

  if (error) return { error: error.message };

  // Update comments count
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("is_hidden", false);

  await supabase
    .from("posts")
    .update({ comments_count: count || 0 })
    .eq("id", postId);

  revalidatePath(`/community/${postId}`);
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath("/community");
  return { success: true };
}

// Admin functions
export async function getAllPosts(): Promise<PostWithProfileEmail[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(full_name, email)")
    .order("created_at", { ascending: false }) as any);

  return (data || []) as PostWithProfileEmail[];
}

export async function togglePostVisibility(postId: string) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("is_hidden")
    .eq("id", postId)
    .single();

  if (!post) return { error: "Post not found" };

  const { error } = await supabase
    .from("posts")
    .update({ is_hidden: !post.is_hidden })
    .eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath("/admin/posts");
  revalidatePath("/community");
  return { success: true };
}
