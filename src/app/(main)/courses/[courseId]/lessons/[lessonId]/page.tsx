import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonById, getCourseById } from "@/actions/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { MarkLessonComplete } from "@/components/courses/mark-lesson-complete";
import ReactMarkdown from "react-markdown";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const lesson = await getLessonById(lessonId);
  const course = await getCourseById(courseId);

  if (!lesson || !course) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href={`/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {course.title}
      </Link>

      <div>
        <Badge variant="secondary" className="mb-2">
          {course.title}
        </Badge>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        {lesson.summary && (
          <p className="mt-2 text-muted-foreground">{lesson.summary}</p>
        )}
      </div>

      <Card>
        <CardContent className="prose prose-slate max-w-none pt-6 dark:prose-invert">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </CardContent>
      </Card>

      <MarkLessonComplete lessonId={lessonId} courseId={courseId} />
    </div>
  );
}
