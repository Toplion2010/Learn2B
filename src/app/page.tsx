import Link from "next/link";
import {
  BookOpen,
  Users,
  MessageSquare,
  Trophy,
  CheckCircle,
  ArrowRight,
  Send,
  Star,
  Target,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TELEGRAM_CHANNEL, CONTACT_HANDLE } from "@/lib/constants";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Courses",
    description:
      "Structured Speaking and Writing lessons designed by IELTS experts with real exam strategies.",
  },
  {
    icon: MessageSquare,
    title: "Expert Feedback",
    description:
      "Submit your essays and speaking tasks to receive detailed teacher feedback and band scores.",
  },
  {
    icon: Users,
    title: "Learning Community",
    description:
      "Connect with fellow students, share tips, discuss strategies, and stay motivated together.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & Badges",
    description:
      "Earn points, maintain streaks, climb the leaderboard, and collect achievement badges.",
  },
  {
    icon: Target,
    title: "Track Your Progress",
    description:
      "Monitor your improvement with detailed progress tracking across all courses and assignments.",
  },
  {
    icon: Flame,
    title: "Daily Challenges",
    description:
      "Stay consistent with daily streaks, weekly challenges, and mini-events to boost your score.",
  },
];

const stats = [
  { value: "8.0+", label: "Target Band Score" },
  { value: "500+", label: "Active Students" },
  { value: "50+", label: "Expert Lessons" },
  { value: "95%", label: "Success Rate" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              L2B
            </div>
            <span className="text-xl font-bold">Learn2B</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href={TELEGRAM_CHANNEL} target="_blank">
              <Button variant="ghost" size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                Telegram
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          <Star className="mr-1 h-3 w-3" />
          Join 500+ IELTS students
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Master IELTS with{" "}
          <span className="text-primary">Learn2B</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Interactive courses, expert feedback, and a supportive community — everything you need to achieve your target IELTS band score.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="gap-2 text-base">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={TELEGRAM_CHANNEL} target="_blank">
            <Button variant="outline" size="lg" className="gap-2 text-base">
              <Send className="h-4 w-4" />
              Join Our Telegram
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete platform designed for IELTS success
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 transition-colors hover:border-primary/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to start improving your IELTS score
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sign Up & Enroll",
                description:
                  "Create your account, choose your target band score, and enroll in Speaking or Writing courses.",
              },
              {
                step: "2",
                title: "Learn & Practice",
                description:
                  "Work through interactive lessons, complete assignments, and submit your work for expert review.",
              },
              {
                step: "3",
                title: "Improve & Achieve",
                description:
                  "Get detailed feedback, track your progress, earn badges, and reach your IELTS goals.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Courses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Focused preparation for the most challenging IELTS sections
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-2">
            <CardContent className="p-8">
              <Badge className="mb-4">Speaking</Badge>
              <h3 className="text-2xl font-bold">IELTS Speaking Mastery</h3>
              <p className="mt-3 text-muted-foreground">
                Master all three parts of the IELTS Speaking test. Learn strategies for fluency, vocabulary, pronunciation, and grammar.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Part 1, 2 & 3 strategies",
                  "Topic-specific vocabulary",
                  "Pronunciation tips",
                  "Practice with feedback",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-2">
            <CardContent className="p-8">
              <Badge className="mb-4" variant="secondary">
                Writing
              </Badge>
              <h3 className="text-2xl font-bold">IELTS Writing Excellence</h3>
              <p className="mt-3 text-muted-foreground">
                Develop strong Task 1 and Task 2 writing skills. Learn essay structure, coherence, and academic vocabulary.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Task 1 & Task 2 techniques",
                  "Essay structure templates",
                  "Academic vocabulary",
                  "Sample essays with corrections",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="border-y bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <Send className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Join Our Telegram Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Get daily tips, updates, and connect with fellow IELTS students. Our Telegram channel is the heart of the Learn2B community.
          </p>
          <Link href={TELEGRAM_CHANNEL} target="_blank">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 gap-2 text-base"
            >
              <Send className="h-4 w-4" />
              Join @IELTS_8 on Telegram
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  L2B
                </div>
                <span className="text-xl font-bold">Learn2B</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Your gateway to IELTS success. Interactive courses, expert feedback, and a supportive community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Platform</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-foreground">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-foreground">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Community</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={TELEGRAM_CHANNEL}
                    target="_blank"
                    className="hover:text-foreground"
                  >
                    Telegram Channel
                  </Link>
                </li>
                <li>
                  <span>Contact: {CONTACT_HANDLE}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Contact & Ads</h4>
              <p className="mt-3 text-sm text-muted-foreground">
                For support, advertising inquiries, or partnership opportunities:
              </p>
              <p className="mt-2 font-medium">{CONTACT_HANDLE}</p>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Learn2B. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
