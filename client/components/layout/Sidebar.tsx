"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  Settings, 
  LogOut,
  ShieldCheck,
  BookmarkCheck,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, role: "user" },
  { name: "Assessment", href: "/assessment", icon: BookOpen, role: "user" },
  { name: "AI Recommendations", href: "/recommendations", icon: Sparkles, role: "user" },
  { name: "Saved Recommendations", href: "/saved-recommendations", icon: BookmarkCheck, role: "user" },
  { name: "Chatbot", href: "/chatbot", icon: MessageSquare, role: "user" },
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: ShieldCheck, role: "admin" },
  { name: "Manage Questions", href: "/admin/questions", icon: Settings, role: "admin" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role] = useState<string>(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role || "user";
    } catch {
      return "user";
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-blue-500" />
          AI Career Portal
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.filter(item => item.role === role).map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href 
                ? "bg-blue-600 text-white" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-slate-400"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
