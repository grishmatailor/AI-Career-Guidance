"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useQuery, gql } from "@apollo/client";
import { Users, Sparkles, HelpCircle, TrendingUp, Loader2 } from "lucide-react";
import type { User } from "@/types";

const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    getAllUsers {
      id
      name
      email
      role
      created_at
    }
    getQuestions {
      id
    }
  }
`;

export default function AdminDashboard() {
  const { data, loading } = useQuery(GET_ADMIN_STATS);
  const users = data?.getAllUsers || [];
  const questions = data?.getQuestions || [];
  
  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter((u: User) => u.role === "admin").length;
  const regularUsers = totalUsers - adminUsers;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Manage the platform and view performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">{adminUsers} admin, {regularUsers} regular</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Assessment Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
            <p className="text-xs text-slate-500 mt-1">Used in assessments</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">AI Recommendations</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dynamic</div>
            <p className="text-xs text-slate-500 mt-1">Generated per assessment</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">System Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Operational</div>
            <p className="text-xs text-slate-500 mt-1">All systems active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-white/10">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Email</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 5).map((user: User) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-slate-800/50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === "admin" ? "bg-purple-900/30 text-purple-400 border border-purple-500/20" : "bg-blue-900/30 text-blue-400 border border-blue-500/20"}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(parseInt(user.created_at)).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

