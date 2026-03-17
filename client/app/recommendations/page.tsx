"use client";

import { useMutation } from "@apollo/client";
import {
  GENERATE_RECOMMENDATION,
  SAVE_AI_RECOMMENDATION,
} from "@/graphql/mutations";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  DollarSign,
  Lightbulb,
  RefreshCcw,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CareerRecommendation {
  title: string;
  explanation: string;
  requiredSkills: string[];
  salaryRange: string;
  roadmap: string[];
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    CareerRecommendation[]
  >([]);
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());
  const [savingTitle, setSavingTitle] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [generateRecommendation, { loading: generating }] = useMutation(
    GENERATE_RECOMMENDATION
  );

  const [saveAIRecommendation] = useMutation(SAVE_AI_RECOMMENDATION);

  const handleGenerate = async () => {
    try {
      const res = await generateRecommendation();
      const careers: CareerRecommendation[] =
        res.data?.generateCareerRecommendation?.careers ?? [];
      setRecommendations(careers);
      // Reset saved states on fresh generation
      setSavedTitles(new Set());
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate recommendations"
      );
    }
  };

  // Auto-generate on first mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (career: CareerRecommendation) => {
    if (savedTitles.has(career.title)) return; // already saved
    setSavingTitle(career.title);
    try {
      await saveAIRecommendation({
        variables: {
          title: career.title,
          explanation: career.explanation,
          requiredSkills: career.requiredSkills,
          salaryRange: career.salaryRange,
          roadmap: career.roadmap,
        },
      });
      setSavedTitles((prev) => new Set([...prev, career.title]));
      toast.success(`"${career.title}" saved to your collection!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Already saved") {
        setSavedTitles((prev) => new Set([...prev, career.title]));
        toast.info("Already in your saved recommendations.");
      } else {
        toast.error(msg || "Failed to save recommendation");
      }
    } finally {
      setSavingTitle(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="text-blue-500" />
              AI Career Matches
            </h1>
            <p className="text-slate-400">
              AI has analyzed your profile. Click{" "}
              <span className="text-blue-400 font-semibold">Save</span> on any
              career to add it to your saved collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/saved-recommendations">
              <Button
                variant="outline"
                className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 flex items-center gap-2"
              >
                <BookmarkCheck size={16} />
                Saved ({savedTitles.size})
              </Button>
            </Link>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="outline"
              className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 flex items-center gap-2"
            >
              <RefreshCcw
                size={16}
                className={generating ? "animate-spin" : ""}
              />
              {generating ? "Generating…" : "Regenerate"}
            </Button>
          </div>
        </div>
      </div>

      {generating ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing your profile…</h2>
          <p className="text-slate-500 max-w-sm">
            Finding the best career paths, matching your skills, and calculating
            your potential — this may take a moment.
          </p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Sparkles className="text-slate-600 w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-slate-400">
            No recommendations yet
          </h2>
          <p className="text-slate-500 mb-6 max-w-sm">
            Complete your assessment first, then come back here to generate AI
            career matches.
          </p>
          <Link href="/assessment">
            <Button className="bg-blue-600 hover:bg-blue-500">
              Take Assessment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {recommendations.map((career, i) => {
              const isSaved = savedTitles.has(career.title);
              const isSaving = savingTitle === career.title;

              return (
                <motion.div
                  key={`${career.title}-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.09 }}
                >
                  <Card
                    className={`bg-slate-900 border transition-all group h-full flex flex-col ${
                      isSaved
                        ? "border-purple-500/50"
                        : "border-white/10 hover:border-blue-500/50"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 uppercase tracking-tighter">
                          MATCH #{i + 1}
                        </span>

                        {/* ── Per-card Save Button ── */}
                        <Button
                          id={`save-btn-${i}`}
                          variant="ghost"
                          size="sm"
                          disabled={isSaving || isSaved}
                          onClick={() => handleSave(career)}
                          className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
                            isSaved
                              ? "text-purple-400 cursor-default"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck size={16} className="text-purple-400" />
                              Saved
                            </>
                          ) : isSaving ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                              Saving…
                            </>
                          ) : (
                            <>
                              <Bookmark size={16} />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                        {career.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-6">
                      <p className="text-slate-400 leading-relaxed">
                        {career.explanation}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 uppercase font-bold tracking-tight">
                            <CheckCircle2 size={14} className="text-green-500" />
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
                            <DollarSign size={14} className="text-orange-500" />
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
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}
