"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@apollo/client";
import { CHAT_CAREER } from "@/graphql/mutations";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Career Guide powered by Groq. Ask me anything about careers, skills, or your professional journey! 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [chatCareer, { loading }] = useMutation(CHAT_CAREER, {
    onCompleted: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.chatCareer },
      ]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I ran into an error: ${error.message}. Please try again.`,
        },
      ]);
    },
  });

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    chatCareer({ variables: { message: trimmed } });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bot className="text-blue-500" />
          AI Career Assistant
        </h1>
        <p className="text-slate-400">
          Powered by{" "}
          <span className="text-blue-400 font-medium">Groq</span> —
          Ask anything about careers, skills, or industry trends.
        </p>
      </div>

      <Card className="bg-slate-900 border-white/10 flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 pb-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300"
                    }`}
                >
                  {m.role === "assistant" ? (
                    <Bot size={16} />
                  ) : (
                    <User size={16} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[78%] text-sm leading-relaxed whitespace-pre-wrap ${m.role === "assistant"
                    ? "bg-white/5 text-slate-200 border border-white/5 rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none"
                    }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center animate-pulse shrink-0">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <CardFooter className="p-4 border-t border-white/5 shrink-0">
          <div className="flex w-full gap-2">
            <Input
              id="chatbot-input"
              placeholder="Ask about careers, skills, salaries..."
              className="bg-slate-800 border-white/10 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 shrink-0"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
