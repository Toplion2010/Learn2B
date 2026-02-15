"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Profile, Badge, UserBadge } from "@/types/database";

type UserBadgeWithBadge = UserBadge & { badges: Badge | null };

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const fullName = formData.get("fullName") as string;
  const bio = formData.get("bio") as string;
  const telegramHandle = formData.get("telegramHandle") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      bio: bio || null,
      telegram_handle: telegramHandle || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { success: true };
}

export async function getLeaderboard(limit = 50, offset = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, level, total_points, current_streak, role")
    .order("total_points", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return [];
  return data;
}

export async function getUserBadges(userId: string): Promise<UserBadgeWithBadge[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", userId) as any);

  return (data || []) as UserBadgeWithBadge[];
}

export async function updateStreak() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("id", user.id)
    .single();

  if (!profile) return;

  const today = new Date().toISOString().split("T")[0];
  const lastActivity = profile.last_activity_date;

  if (lastActivity === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = 1;
  if (lastActivity === yesterdayStr) {
    newStreak = profile.current_streak + 1;
  }

  const longestStreak = Math.max(newStreak, profile.longest_streak);

  await supabase
    .from("profiles")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
}

export async function addPoints(userId: string, points: number) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", userId)
    .single();

  if (!profile) return;

  await supabase
    .from("profiles")
    .update({
      total_points: profile.total_points + points,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}
