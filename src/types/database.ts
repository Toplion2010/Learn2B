export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: "student" | "teacher" | "admin";
          level: "beginner" | "intermediate" | "advanced";
          bio: string | null;
          telegram_handle: string | null;
          total_points: number;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: "student" | "teacher" | "admin";
          level?: "beginner" | "intermediate" | "advanced";
          bio?: string | null;
          telegram_handle?: string | null;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: "student" | "teacher" | "admin";
          level?: "beginner" | "intermediate" | "advanced";
          bio?: string | null;
          telegram_handle?: string | null;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: "speaking" | "writing";
          difficulty: "beginner" | "intermediate" | "advanced";
          cover_image_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          category: "speaking" | "writing";
          difficulty: "beginner" | "intermediate" | "advanced";
          cover_image_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          category?: "speaking" | "writing";
          difficulty?: "beginner" | "intermediate" | "advanced";
          cover_image_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          slug: string;
          content: string;
          summary: string | null;
          sort_order: number;
          points_reward: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          slug: string;
          content: string;
          summary?: string | null;
          sort_order?: number;
          points_reward?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          slug?: string;
          content?: string;
          summary?: string | null;
          sort_order?: number;
          points_reward?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_completions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrolled_at?: string;
        };
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          course_id: string | null;
          lesson_id: string | null;
          title: string;
          description: string;
          assignment_type:
            | "writing_task1"
            | "writing_task2"
            | "speaking_part1"
            | "speaking_part2"
            | "speaking_part3";
          max_score: number;
          points_reward: number;
          due_date: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          lesson_id?: string | null;
          title: string;
          description: string;
          assignment_type:
            | "writing_task1"
            | "writing_task2"
            | "speaking_part1"
            | "speaking_part2"
            | "speaking_part3";
          max_score?: number;
          points_reward?: number;
          due_date?: string | null;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string | null;
          lesson_id?: string | null;
          title?: string;
          description?: string;
          assignment_type?:
            | "writing_task1"
            | "writing_task2"
            | "speaking_part1"
            | "speaking_part2"
            | "speaking_part3";
          max_score?: number;
          points_reward?: number;
          due_date?: string | null;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          user_id: string;
          content: string;
          file_url: string | null;
          status: "pending" | "in_review" | "graded";
          score: number | null;
          feedback: string | null;
          graded_by: string | null;
          graded_at: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          user_id: string;
          content: string;
          file_url?: string | null;
          status?: "pending" | "in_review" | "graded";
          score?: number | null;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          user_id?: string;
          content?: string;
          file_url?: string | null;
          status?: "pending" | "in_review" | "graded";
          score?: number | null;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
          submitted_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          category:
            | "general"
            | "speaking"
            | "writing"
            | "tips"
            | "motivation"
            | "question";
          is_pinned: boolean;
          is_hidden: boolean;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          category?:
            | "general"
            | "speaking"
            | "writing"
            | "tips"
            | "motivation"
            | "question";
          is_pinned?: boolean;
          is_hidden?: boolean;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          category?:
            | "general"
            | "speaking"
            | "writing"
            | "tips"
            | "motivation"
            | "question";
          is_pinned?: boolean;
          is_hidden?: boolean;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          parent_id: string | null;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          content: string;
          parent_id?: string | null;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          content?: string;
          parent_id?: string | null;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon_url: string | null;
          category: "streak" | "completion" | "community" | "score" | "special";
          criteria: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon_url?: string | null;
          category: "streak" | "completion" | "community" | "score" | "special";
          criteria?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon_url?: string | null;
          category?: "streak" | "completion" | "community" | "score" | "special";
          criteria?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          awarded_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];
export type LessonCompletion =
  Database["public"]["Tables"]["lesson_completions"]["Row"];
