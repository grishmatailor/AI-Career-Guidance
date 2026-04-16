"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@apollo/client";
import { GET_QUESTIONS } from "@/graphql/queries";
import { SUBMIT_ASSESSMENT } from "@/graphql/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import type { AssessmentQuestion } from "@/types";

export default function AssessmentPage() {
  const { data, loading } = useQuery(GET_QUESTIONS);
  const [submitAssessment, { loading: submitting }] = useMutation(SUBMIT_ASSESSMENT);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const questions = data?.getQuestions || [];
  const totalSteps = questions.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([id, answer]) => ({
      question_id: id,
      answer,
    }));

    if (formattedAnswers.length < totalSteps) {
      toast.error("Please answer all questions");
      return;
    }

    try {
      await submitAssessment({ variables: { answers: formattedAnswers } });
      toast.success("Assessment submitted!");
      router.push("/recommendations?fromAssessment=true");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit assessment");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-6 md:py-10 px-2 md:px-0">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Career Assessment</h1>
          <p className="text-xs md:text-sm text-slate-400">Answer these questions to help our AI understand you better.</p>
          <div className="mt-4 flex gap-1">
            {questions.map((_: AssessmentQuestion, i: number) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-colors ${i <= currentStep ? "bg-blue-600" : "bg-slate-800"}`} 
              />
            ))}
          </div>
        </div>

        {currentQuestion && (
          <Card className="bg-slate-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-wider">
                Step {currentStep + 1} of {totalSteps} • {currentQuestion.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold">{currentQuestion.question}</h2>
              <Input
                placeholder="Type your answer here..."
                className="bg-slate-800 border-white/10 h-12 md:h-14 text-base"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && (currentStep === totalSteps - 1 ? handleSubmit() : handleNext())}
                autoFocus
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className="text-slate-400 w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2" size={18} /> Back
              </Button>
              {currentStep === totalSteps - 1 ? (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="mr-2 animate-spin" /> : "Finish & Generate"}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!answers[currentQuestion.id]}
                >
                  Next <ArrowRight className="ml-2" size={18} />
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
