import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById, getLessonCompletions, isEnrolled } from "@/actions/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { EnrollButton } from "@/components/courses/enroll-button";
import { BookOpen, CheckCircle, Circle, ArrowLeft } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) notFound();

  const enrolled = await isEnrolled(courseId);
  const completions = enrolled ? await getLessonCompletions(courseId) : [];

  const lessons = (course.lessons || []) as {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    sort_order: number;
    points_reward: number;
    is_published: boolean;
  }[];

  const publishedLessons = lessons.filter((l) => l.is_published);
  const totalLessons = publishedLessons.length;
  const completedCount = completions.length;
  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{course.category}</Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            {course.description}
          </p>
        </div>
        {!enrolled && <EnrollButton courseId={courseId} />}
      </div>

      {enrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalLessons} lessons
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Lessons ({totalLessons})
        </h2>
        <div className="space-y-3">
          {publishedLessons.map((lesson, index) => {
            const isCompleted = completions.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={
                  enrolled
                    ? `/courses/${courseId}/lessons/${lesson.id}`
                    : "#"
                }
                className={!enrolled ? "pointer-events-none" : ""}
              >
                <Card
                  className={`transition-all ${enrolled ? "hover:shadow-sm hover:border-primary/20 cursor-pointer" : "opacity-60"}`}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {index + 1}. {lesson.title}
                      </p>
                      {lesson.summary && (
                        <p className="text-sm text-muted-foreground truncate">
                          {lesson.summary}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      +{lesson.points_reward} pts
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          {publishedLessons.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No lessons available yet. Check back soon!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
