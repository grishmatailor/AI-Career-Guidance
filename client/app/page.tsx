"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="text-blue-500 fill-blue-500/20" />
            <span>AI Career Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <Sparkles size={14} />
              Powered by Advanced AI
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Discover Your Perfect <br /> Career Path with AI
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unlock your potential with personalized career recommendations, skill analysis, and structured learning roadmaps designed just for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full group">
                <Link href="/register">
                  Start FREE Assessment
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 rounded-full">
                <Link href="/login">View Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Analysis",
                desc: "Sophisticated AI models analyze your skills, interests, and personality to find the best fit.",
                icon: <Sparkles className="text-blue-500" />
              },
              {
                title: "Skill Roadmaps",
                desc: "Get detailed step-by-step guides on how to acquire the necessary skills for your dream job.",
                icon: <CheckCircle2 className="text-purple-500" />
              },
              {
                title: "Expert Guidance",
                desc: "Talk to our AI career chatbot anytime to get answers about industries, salaries, and trends.",
                icon: <Briefcase className="text-orange-500" />
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
                <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
