import { getLeaderboard } from "@/actions/profiles";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Trophy, Flame, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rankColors: Record<number, string> = {
    0: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200",
    1: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200",
    2: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200",
  };

  const rankIcons: Record<number, string> = {
    0: "🥇",
    1: "🥈",
    2: "🥉",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard"
        description="Top IELTS learners ranked by points and activity"
      />

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid gap-4 md:grid-cols-3">
          {leaderboard.slice(0, 3).map((entry, index) => {
            const initials = entry.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "??";

            return (
              <Card
                key={entry.id}
                className={cn("border-2", rankColors[index])}
              >
                <CardContent className="flex flex-col items-center pt-6 text-center">
                  <span className="text-3xl mb-2">{rankIcons[index]}</span>
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage src={entry.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <p className="font-bold">{entry.full_name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{entry.level}</Badge>
                    {entry.role !== "student" && (
                      <Badge>{entry.role}</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 font-semibold">
                      <Trophy className="h-4 w-4 text-primary" />
                      {entry.total_points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {entry.current_streak} day
                      {entry.current_streak !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full ranking table */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const initials = entry.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "??";
              const isCurrentUser = user?.id === entry.id;

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-4 rounded-lg p-3 transition-colors",
                    isCurrentUser
                      ? "bg-primary/5 border border-primary/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="w-8 text-center font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={entry.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {entry.full_name}
                      {isCurrentUser && (
                        <span className="text-xs text-primary ml-2">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {entry.level}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {entry.current_streak}
                    </span>
                    <span className="font-semibold text-primary">
                      {entry.total_points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
