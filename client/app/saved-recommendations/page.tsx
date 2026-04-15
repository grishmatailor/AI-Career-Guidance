"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { GET_SAVED_AI_RECOMMENDATIONS } from "@/graphql/queries";
import { DELETE_SAVED_AI_RECOMMENDATION } from "@/graphql/mutations";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookmarkCheck,
  Trash2,
  CheckCircle2,
  DollarSign,
  Lightbulb,
  Sparkles,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SavedRecommendation {
  id: string;
  title: string;
  explanation: string;
  requiredSkills: string[];
  salaryRange: string;
  roadmap: string[];
  created_at: string;
}

export default function SavedRecommendationsPage() {
  const { data, loading, error, refetch } = useQuery(
    GET_SAVED_AI_RECOMMENDATIONS,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to load saved recommendations");
  }, [error]);

  const [deleteRec, { loading: deleting }] = useMutation(
    DELETE_SAVED_AI_RECOMMENDATION
  );

  const saved: SavedRecommendation[] = data?.getSavedAIRecommendations ?? [];

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteRec({ variables: { id } });
      await refetch();
      toast.success(`"${title}" removed from saved.`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove recommendation"
      );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(Number(dateStr) || dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookmarkCheck className="text-purple-400" />
              Saved Recommendations
            </h1>
            <p className="text-slate-400">
              Career paths you&apos;ve saved from your AI matches.
            </p>
          </div>

          <Link href="/recommendations">
            <Button
              variant="outline"
              className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 flex items-center gap-2"
            >
              <Sparkles size={16} />
              Get AI Recommendations
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-500">Loading your saved recommendations…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && saved.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
            <BookmarkCheck className="text-purple-400 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-300">
            No saved recommendations yet
          </h2>
          <p className="text-slate-500 mb-6 max-w-sm">
            Go to AI Recommendations, generate your career matches, and click{" "}
            <span className="text-blue-400 font-semibold">Save</span> on the
            ones you like.
          </p>
          <Link href="/recommendations">
            <Button className="bg-blue-600 hover:bg-blue-500 flex items-center gap-2">
              <Sparkles size={16} />
              View AI Recommendations
            </Button>
          </Link>
        </div>
      )}

      {/* Cards grid */}
      {!loading && saved.length > 0 && (
        <>
          <p className="text-sm text-slate-500 mb-6">
            {saved.length} saved career{saved.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {saved.map((career, i) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <Card className="bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-all group h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20 uppercase tracking-tighter">
                            SAVED #{i + 1}
                          </span>
                        </div>

                        {/* Delete button */}
                        <Button
                          id={`delete-saved-${career.id}`}
                          variant="ghost"
                          size="sm"
                          disabled={deleting}
                          onClick={() => handleDelete(career.id, career.title)}
                          className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 flex items-center gap-1.5 text-sm transition-all"
                        >
                          <Trash2 size={15} />
                          Remove
                        </Button>
                      </div>

                      <CardTitle className="text-2xl font-bold group-hover:text-purple-400 transition-colors">
                        {career.title}
                      </CardTitle>

                      {/* Saved timestamp */}
                      <p className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                        <Clock size={11} />
                        Saved on {formatDate(career.created_at)}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-6">
                      <p className="text-slate-400 leading-relaxed">
                        {career.explanation}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 uppercase font-bold tracking-tight">
                            <CheckCircle2
                              size={14}
                              className="text-green-500"
                            />
                            Key Skills
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {career.requiredSkills
                              .slice(0, 3)
                              .map((s: string, j: number) => (
                                <span
                                  key={j}
                                  className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-300"
                                >
                                  {s}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 uppercase font-bold tracking-tight">
                            <DollarSign
                              size={14}
                              className="text-orange-500"
                            />
                            Avg. Salary
                          </div>
                          <div className="font-bold text-slate-200">
                            {career.salaryRange}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tight">
                          <Lightbulb size={14} className="text-yellow-500" />
                          Learning Roadmap
                        </div>
                        <div className="space-y-1">
                          {career.roadmap.map((step: string, j: number) => (
                            <div
                              key={j}
                              className="flex items-start gap-2 text-sm text-slate-400"
                            >
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
