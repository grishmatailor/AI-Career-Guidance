"use client";

import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQuery, gql } from "@apollo/client";

const CHECK_USER_STATUS = gql`
  query CheckUserStatus {
    me {
      id
      isActive
    }
  }
`;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { error } = useQuery(CHECK_USER_STATUS, {
    pollInterval: 5000, // Check every 5 seconds
    skip: typeof window === "undefined" || !localStorage.getItem("token"),
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
    } else {
      setTimeout(() => setLoading(false), 0);
    }

    // Check mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />
      {/* Main content with responsive margin for mobile header */}
      <main className="flex-1 overflow-y-auto md:p-8 p-4 pt-20 md:pt-8 md:ml-64">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
