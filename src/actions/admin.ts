"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database, Profile } from "@/types/database";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [users, courses, submissions, posts] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("is_hidden", false),
  ]);

  return {
    totalUsers: users.count || 0,
    activeCourses: courses.count || 0,
    pendingSubmissions: submissions.count || 0,
    totalPosts: posts.count || 0,
  };
}

export async function getUsers(page = 1, search?: string) {
  const supabase = await createClient();
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data } = await query;
  return (data || []) as Profile[];
}

export async function updateUserRole(
  userId: string,
  role: "student" | "teacher" | "admin"
) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase
    .from("profiles") as any)
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}
