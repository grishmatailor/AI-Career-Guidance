"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AdminCareersPage() {
  return (
    <DashboardLayout>
      <Card className="bg-slate-900 border-white/10">
        <CardHeader>
          <CardTitle>Career Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <AlertCircle className="text-blue-400" size={20} />
            <p className="text-slate-300 text-sm">
              Career data is now generated dynamically from AI recommendations. 
              Users can save AI-generated career suggestions instead of browsing static careers.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

