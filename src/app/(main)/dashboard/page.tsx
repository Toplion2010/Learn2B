import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import {
  BookOpen,
  FileText,
  Trophy,
  Flame,
  ArrowRight,
  Clock,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as any) as { data: { full_name: string; total_points: number; current_streak: number } | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: enrollments } = await (supabase
    .from("enrollments")
    .select("*, courses(id, title, slug, category, lessons(count))")
    .eq("user_id", user.id) as any) as { data: { id: string; courses: { id: string; title: string; slug: string; category: string; lessons: { count: number }[] } }[] | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentSubmissions } = await (supabase
    .from("submissions")
    .select("*, assignments(title, assignment_type)")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(5) as any) as { data: { id: string; submitted_at: string; status: string; score: number | null; assignments: { title: string; assignment_type: string } }[] | null };

  const { data: completions } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.id);

  const totalCompleted = completions?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile?.full_name?.split(" ")[0] || "Student"}!`}
        description="Track your IELTS preparation progress"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile?.total_points || 0}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {profile?.current_streak || 0}
              </p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <BookOpen className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCompleted}</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {recentSubmissions?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Submissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrolled Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Courses</CardTitle>
            <Link href="/courses">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrollments && enrollments.length > 0 ? (
              enrollments.map((enrollment) => {
                const course = enrollment.courses as {
                  id: string;
                  title: string;
                  slug: string;
                  category: string;
                  lessons: { count: number }[];
                };
                const totalLessons = course?.lessons?.[0]?.count || 0;
                const progress =
                  totalLessons > 0
                    ? Math.round((totalCompleted / totalLessons) * 100)
                    : 0;

                return (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${course?.id}`}
                    className="block"
                  >
                    <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{course?.title}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {course?.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="mt-3 h-2" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto h-8 w-8 mb-2" />
                <p>No courses enrolled yet</p>
                <Link href="/courses">
                  <Button variant="link" size="sm">
                    Browse courses
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
            <Link href="/assignments">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions && recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub) => {
                const assignment = sub.assignments as {
                  title: string;
                  assignment_type: string;
                };
                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {assignment?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        sub.status === "graded"
                          ? "default"
                          : sub.status === "in_review"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {sub.status === "graded" && sub.score
                        ? `Band ${sub.score}`
                        : sub.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="mx-auto h-8 w-8 mb-2" />
                <p>No submissions yet</p>
                <Link href="/assignments">
                  <Button variant="link" size="sm">
                    View assignments
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
