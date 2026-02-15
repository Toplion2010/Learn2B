"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const teacherCode = (formData.get("teacherCode") as string)?.trim();
  const isTeacher =
    teacherCode !== "" &&
    teacherCode === process.env.TEACHER_SECRET_CODE;

  if (teacherCode && !isTeacher) {
    return { error: "Invalid teacher code." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
        role: isTeacher ? "teacher" : "student",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Update profile role if teacher
  if (isTeacher && data.user) {
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    await supabaseAdmin
      .from("profiles")
      .update({ role: "teacher" })
      .eq("id", data.user.id);
  }

  if (data.user && !data.session) {
    return { success: "Check your email for a confirmation link." };
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const redirectTo = (formData.get("redirect") as string) || "/dashboard";
  redirect(redirectTo);
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
