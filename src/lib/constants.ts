export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export const LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const COURSE_CATEGORIES = {
  SPEAKING: "speaking",
  WRITING: "writing",
} as const;

export const ASSIGNMENT_TYPES = {
  WRITING_TASK1: "writing_task1",
  WRITING_TASK2: "writing_task2",
  SPEAKING_PART1: "speaking_part1",
  SPEAKING_PART2: "speaking_part2",
  SPEAKING_PART3: "speaking_part3",
} as const;

export const SUBMISSION_STATUS = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  GRADED: "graded",
} as const;

export const POST_CATEGORIES = {
  GENERAL: "general",
  SPEAKING: "speaking",
  WRITING: "writing",
  TIPS: "tips",
  MOTIVATION: "motivation",
  QUESTION: "question",
} as const;

export const BADGE_CATEGORIES = {
  STREAK: "streak",
  COMPLETION: "completion",
  COMMUNITY: "community",
  SCORE: "score",
  SPECIAL: "special",
} as const;

export const POINTS = {
  LESSON_COMPLETE: 10,
  ASSIGNMENT_SUBMIT: 20,
  HIGH_SCORE_BONUS: 15,
  CREATE_POST: 5,
} as const;

export const TELEGRAM_CHANNEL = "https://t.me/IELTS_8";
export const CONTACT_HANDLE = "@nae0110";
export const SITE_NAME = "Learn2B";
export const SITE_DESCRIPTION =
  "Master IELTS with interactive courses, expert feedback, and a supportive learning community.";
