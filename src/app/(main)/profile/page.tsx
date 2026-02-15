import { redirect } from "next/navigation";
import { getCurrentProfile, getUserBadges } from "@/actions/profiles";
import { getMySubmissions } from "@/actions/submissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { Trophy, Flame, BookOpen, FileText, Award } from "lucide-react";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const submissions = await getMySubmissions();
  const badges = await getUserBadges(profile.id);

  const initials = profile.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader title="My Profile" />

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge>{profile.role}</Badge>
                <Badge variant="outline" className="capitalize">
                  {profile.level}
                </Badge>
              </div>
              {profile.bio && (
                <p className="mt-3 text-sm">{profile.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{profile.total_points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="text-center">
              <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
              <p className="text-2xl font-bold">{profile.current_streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <FileText className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-2xl font-bold">{submissions.length}</p>
              <p className="text-xs text-muted-foreground">Submissions</p>
            </div>
            <div className="text-center">
              <Award className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-2xl font-bold">{badges.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((ub) => {
                const badge = ub.badges as {
                  name: string;
                  description: string;
                  category: string;
                };
                return (
                  <Badge key={ub.id} variant="secondary" className="py-2 px-3">
                    <Award className="mr-1 h-3 w-3" />
                    {badge?.name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile */}
      <ProfileEditForm profile={profile} />

      {/* Recent Submissions */}
      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.slice(0, 10).map((sub) => {
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
                    <p className="text-sm font-medium">{assignment?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </p>
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
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
