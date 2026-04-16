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
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const [role, setRole] = useState<string>("user");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setRole(user.role || "user");
    } catch {
      setRole("user");
    }

    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Mobile menu button
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40 md:hidden">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="text-blue-500 h-5 w-5" />
            AI Career
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu */}
            <div className="fixed top-16 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-40 md:hidden overflow-y-auto">
              <nav className="flex flex-col p-4 space-y-2">
                {menuItems
                  .filter((item) => item.role === role)
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                        pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  ))}
              </nav>

              <div className="p-4 border-t border-slate-800 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-slate-400 text-sm font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden md:flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300 fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-blue-500" />
          AI Career Portal
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.filter((item) => item.role === role).map((item) => (
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
