import Link from "next/link";
import { getCourses } from "@/actions/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen, Mic, PenTool } from "lucide-react";

export const metadata = { title: "Courses" };

export default async function CoursesPage() {
  const allCourses = await getCourses();
  const speakingCourses = allCourses.filter((c) => c.category === "speaking");
  const writingCourses = allCourses.filter((c) => c.category === "writing");

  function CourseGrid({ courses }: { courses: typeof allCourses }) {
    if (courses.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title="No courses available"
          description="Check back soon for new courses!"
        />
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const lessonCount =
            (course.lessons as unknown as { count: number }[])?.[0]?.count || 0;
          return (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        course.category === "speaking"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {course.category === "speaking" ? (
                        <Mic className="mr-1 h-3 w-3" />
                      ) : (
                        <PenTool className="mr-1 h-3 w-3" />
                      )}
                      {course.category}
                    </Badge>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <BookOpen className="mr-1 h-4 w-4" />
                    {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Master IELTS Speaking and Writing with structured lessons"
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="speaking">
            <Mic className="mr-1 h-3 w-3" />
            Speaking
          </TabsTrigger>
          <TabsTrigger value="writing">
            <PenTool className="mr-1 h-3 w-3" />
            Writing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <CourseGrid courses={allCourses} />
        </TabsContent>
        <TabsContent value="speaking" className="mt-6">
          <CourseGrid courses={speakingCourses} />
        </TabsContent>
        <TabsContent value="writing" className="mt-6">
          <CourseGrid courses={writingCourses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
