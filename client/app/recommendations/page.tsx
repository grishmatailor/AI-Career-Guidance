"use client";

import { useMutation, useQuery } from "@apollo/client";
import {
  GENERATE_RECOMMENDATION,
  SAVE_AI_RECOMMENDATION,
} from "@/graphql/mutations";
import { GET_SAVED_AI_RECOMMENDATIONS } from "@/graphql/queries";
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
  ClipboardList,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CareerRecommendation {
  title: string;
  explanation: string;
  requiredSkills: string[];
  salaryRange: string;
  roadmap: string[];
}

interface SavedRecommendation {
  id: string;
  title: string;
  explanation: string;
  requiredSkills: string[];
  salaryRange: string;
  roadmap: string[];
  created_at: string;
}

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const fromAssessment = searchParams.get("fromAssessment") === "true";

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

  // Fetch previously saved recommendations to show when not coming from assessment
  const { data: savedData, loading: savedLoading } = useQuery(
    GET_SAVED_AI_RECOMMENDATIONS,
    { fetchPolicy: "network-only" }
  );
  const savedRecs: SavedRecommendation[] =
    savedData?.getSavedAIRecommendations ?? [];

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

  // Auto-generate ONLY when the user arrives from the assessment page
  useEffect(() => {
    if (fromAssessment && !hasFetched.current) {
      hasFetched.current = true;
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAssessment]);

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

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // ─── State: NOT from assessment, no fresh recommendations ──────────────────
  const showAssessmentPrompt = !fromAssessment && recommendations.length === 0;

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
              {fromAssessment || recommendations.length > 0
                ? <>AI has analyzed your profile. Click{" "}<span className="text-blue-400 font-semibold">Save</span> on any career to add it to your saved collection.</>
                : "Complete the assessment so our AI can analyze your profile and generate personalized career matches."}
            </p>
          </div>

          {(fromAssessment || recommendations.length > 0) && (
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
          )}
        </div>
      </div>

      {/* ── Generating Spinner ── */}
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
      ) : recommendations.length > 0 ? (
        /* ── Fresh Recommendations Grid ── */
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
      ) : (
        /* ── No fresh recommendations: show prompt + saved list ── */
        <div>
          {/* Assessment CTA */}
          {showAssessmentPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-16 text-center mb-12"
            >
              <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <ClipboardList className="text-blue-400 w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-200">
                Take the Assessment First
              </h2>
              <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
                Our AI needs to learn about your skills, interests, and goals before
                it can generate personalized career matches. Complete the assessment
                and your results will appear here automatically.
              </p>
              <Link href="/assessment">
                <Button
                  id="go-to-assessment-btn"
                  className="bg-blue-600 hover:bg-blue-500 flex items-center gap-2 px-6 py-5 text-base"
                >
                  <ClipboardList size={18} />
                  Start Assessment
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Previously Saved Recommendations */}
          {!savedLoading && savedRecs.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <BookmarkCheck className="text-purple-400" size={20} />
                <h2 className="text-lg font-semibold text-slate-300">
                  Your Previously Saved Careers
                </h2>
                <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                  {savedRecs.length} saved
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence>
                  {savedRecs.map((career, i) => (
                    <motion.div
                      key={career.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                      <Card className="bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-all group h-full flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20 uppercase tracking-tighter">
                              SAVED #{i + 1}
                            </span>
                            <p className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Clock size={11} />
                              {formatDate(career.created_at)}
                            </p>
                          </div>
                          <CardTitle className="text-2xl font-bold group-hover:text-purple-400 transition-colors">
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
            </div>
          )}

          {/* Saved loading skeleton */}
          {savedLoading && showAssessmentPrompt && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </DashboardLayout>
      }
    >
      <RecommendationsContent />
    </Suspense>
  );
}
