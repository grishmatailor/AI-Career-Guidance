"use client";

import { useMutation } from "@apollo/client";
import { GENERATE_RECOMMENDATION } from "@/graphql/mutations";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Bookmark, CheckCircle2, DollarSign, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function RecommendationsPage() {
  const [generateRecommendation, { loading, data }] = useMutation(GENERATE_RECOMMENDATION);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Check if we should auto-generate
    const handleGenerate = async () => {
      try {
        const res = await generateRecommendation();
        setRecommendations(res.data.generateCareerRecommendation.careers);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    handleGenerate();
  }, [generateRecommendation]);

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="text-blue-500" />
          Your AI Career Matches
        </h1>
        <p className="text-slate-400">Our AI has analyzed your profile. Here are the most suitable paths for you.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing your profile...</h2>
          <p className="text-slate-500 max-w-sm">We're finding the best industries, matching your skills, and calculating your potential.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {recommendations.map((career, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="bg-slate-900 border-white/10 hover:border-blue-500/50 transition-all group h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 uppercase tracking-tighter">
                        MATCH # {i + 1}
                      </span>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Bookmark size={20} />
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
                          {career.requiredSkills.slice(0, 3).map((s: string, j: number) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-300">
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
                        <div className="font-bold text-slate-200">{career.salaryRange}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tight">
                        <Lightbulb size={14} className="text-yellow-500" />
                        Learning Roadmap
                      </div>
                      <div className="space-y-1">
                        {career.roadmap.map((step: string, j: number) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-slate-400">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-6 border-t border-white/5">
                    <Button className="w-full bg-slate-800 hover:bg-blue-600 transition-colors rounded-xl">
                      View Full Roadmap
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}
