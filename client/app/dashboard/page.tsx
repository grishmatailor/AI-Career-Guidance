"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  BookOpen,
  ArrowRight,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_USER_DASHBOARD, GET_USER_STATS, ME } from "@/graphql/queries";
import { useEffect, useState } from "react";

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`bg-slate-800 animate-pulse rounded-lg ${className ?? ""}`}
    />
  );
}

export default function UserDashboard() {
  const [localUser, setLocalUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  // Read cached user from localStorage for instant display
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setLocalUser(JSON.parse(stored));
    } catch {}
  }, []);

  const { data: meData, loading: meLoading } = useQuery(ME);
  const { data: statsData, loading: statsLoading } = useQuery(GET_USER_STATS);
  const { data: dashboardData, loading: dashboardLoading } =
    useQuery(GET_USER_DASHBOARD);

  const user = meData?.me ?? localUser;
  const stats = statsData?.getUserStats;
  const recommendations: any[] = dashboardData?.getUserDashboard ?? [];

  const isLoading = meLoading || statsLoading || dashboardLoading;

  // Derive a friendly first name
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-blue-400">
              {meLoading ? (
                <span className="inline-block w-24 h-7 bg-slate-700 animate-pulse rounded align-middle" />
              ) : (
                firstName
              )}
            </span>
            ! 👋
          </h1>
          <p className="text-slate-400">
            Here&apos;s your career progress and AI insights.
          </p>
        </div>

        {/* Member since badge */}
        {stats && (
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/60 px-4 py-2 rounded-xl border border-white/5">
            <Calendar size={14} className="text-blue-400" />
            Member since{" "}
            <span className="text-slate-200 font-medium">{stats.memberSince}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Assessments */}
        <Card className="bg-slate-900 border-white/10 hover:border-blue-500/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Assessments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <SkeletonBox className="h-8 w-12 mb-1" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalAssessments ?? 0}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {stats?.hasCompletedAssessment
                ? "Assessment completed ✓"
                : "No assessment taken yet"}
            </p>
          </CardContent>
        </Card>

        {/* Career Matches */}
        <Card className="bg-slate-900 border-white/10 hover:border-purple-500/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Career Matches
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <SkeletonBox className="h-8 w-12 mb-1" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.careerMatches ?? 0}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {stats?.careerMatches
                ? `${stats.careerMatches} career${stats.careerMatches > 1 ? "s" : ""} matched to your profile`
                : "Take assessment to get matches"}
            </p>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card className="bg-slate-900 border-white/10 hover:border-green-500/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Your Profile
            </CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {meLoading ? (
              <>
                <SkeletonBox className="h-5 w-32 mb-1" />
                <SkeletonBox className="h-4 w-40 mt-2" />
              </>
            ) : (
              <>
                <div className="text-lg font-bold truncate">
                  {user?.name ?? "—"}
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {user?.email ?? ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Recommendations */}
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Career Matches</CardTitle>
            {recommendations.length > 0 && (
              <Link
                href="/recommendations"
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonBox key={i} className="h-16" />
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.slice(0, 5).map((rec: any) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-100 truncate">
                        {rec.career.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star size={10} className="text-yellow-400" />
                          {rec.score}% match
                        </span>
                        {rec.career.salary_range && (
                          <span className="text-green-400">
                            {rec.career.salary_range}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="shrink-0 ml-3 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Link href={`/recommendations`}>
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center gap-3">
                <AlertCircle className="text-slate-600" size={40} />
                <p className="text-slate-500">
                  No career matches yet.
                </p>
                <p className="text-xs text-slate-600 mb-2">
                  Complete the assessment to get personalized career recommendations.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/assessment">Start Assessment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Overview / Quick Actions */}
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Assessment status */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div
                className={`rounded-full p-2 ${stats?.hasCompletedAssessment ? "bg-green-500/10" : "bg-blue-500/10"}`}
              >
                {stats?.hasCompletedAssessment ? (
                  <CheckCircle2 size={20} className="text-green-400" />
                ) : (
                  <BookOpen size={20} className="text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-200 text-sm">
                  {stats?.hasCompletedAssessment
                    ? "Assessment Complete"
                    : "Take the Assessment"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {stats?.hasCompletedAssessment
                    ? "You have completed the skill assessment"
                    : "Discover your best-fit career paths"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 border-white/10 hover:bg-slate-800">
                <Link href="/assessment">
                  {stats?.hasCompletedAssessment ? "Retake" : "Start"}
                </Link>
              </Button>
            </div>

            {/* AI Recommendations */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="rounded-full p-2 bg-purple-500/10">
                <Sparkles size={20} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-200 text-sm">
                  AI Recommendations
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {recommendations.length > 0
                    ? `${recommendations.length} career${recommendations.length > 1 ? "s" : ""} tailored for you`
                    : "Get AI-powered career suggestions"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 border-white/10 hover:bg-slate-800">
                <Link href="/recommendations">View</Link>
              </Button>
            </div>

            {/* Chatbot */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="rounded-full p-2 bg-yellow-500/10">
                <TrendingUp size={20} className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-200 text-sm">
                  AI Career Chatbot
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ask anything about your career journey
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 border-white/10 hover:bg-slate-800">
                <Link href="/chatbot">Chat</Link>
              </Button>
            </div>

            {/* Member since */}
            {!statsLoading && stats?.memberSince && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="rounded-full p-2 bg-slate-700">
                  <Clock size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-200 text-sm">
                    Member Since
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {stats.memberSince}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
