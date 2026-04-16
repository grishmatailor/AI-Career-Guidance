"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Users, Sparkles, HelpCircle, TrendingUp, Loader2 } from "lucide-react";
import { UPDATE_USER_STATUS } from "@/graphql/mutations";
import type { User } from "@/types";

const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    getAllUsers {
      id
      name
      email
      role
      isActive
      created_at
    }
    getQuestions {
      id
    }
  }
`;

export default function AdminDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_STATS);
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    onCompleted: () => {
      refetch();
    },
  });
  
  const users = data?.getAllUsers || [];
  const questions = data?.getQuestions || [];
  
  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter((u: User) => u.role === "admin").length;
  const regularUsers = totalUsers - adminUsers;

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus({
        variables: {
          id: userId,
          isActive: !currentStatus,
        },
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-20 text-red-400">
          <div className="text-center">
            <p className="font-bold mb-2">Error loading users</p>
            <p className="text-sm text-slate-400">{error.message}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-slate-400">Manage the platform and view performance metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">{adminUsers} admin, {regularUsers} regular</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Questions</CardTitle>
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
          <CardTitle className="text-lg md:text-xl">Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400 text-sm">Name</TableHead>
                  <TableHead className="text-slate-400 text-sm">Email</TableHead>
                  <TableHead className="text-slate-400 text-sm">Role</TableHead>
                  <TableHead className="text-slate-400 text-sm">Status</TableHead>
                  <TableHead className="text-slate-400 text-sm">Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user: User) => (
                  <TableRow key={user.id} className="border-white/5 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-sm">{user.name}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === "admin" ? "bg-purple-900/30 text-purple-400 border border-purple-500/20" : "bg-blue-900/30 text-blue-400 border border-blue-500/20"}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium text-green-400">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all duration-200 ${
                            user.isActive
                              ? "bg-emerald-600/80 text-white hover:bg-emerald-700 active:scale-95"
                              : "bg-rose-600/80 text-white hover:bg-rose-700 active:scale-95"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      {new Date(parseInt(user.created_at)).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {users.slice(0, 5).map((user: User) => (
              <div key={user.id} className="bg-slate-800/50 border border-white/5 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium text-white text-sm">{user.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${user.role === "admin" ? "bg-purple-900/30 text-purple-400 border border-purple-500/20" : "bg-blue-900/30 text-blue-400 border border-blue-500/20"}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    {new Date(parseInt(user.created_at)).toLocaleDateString()}
                  </span>
                  {user.role === "admin" ? (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium text-green-400">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                      className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-all duration-200 ${
                        user.isActive
                          ? "bg-emerald-600/80 text-white hover:bg-emerald-700 active:scale-95"
                          : "bg-rose-600/80 text-white hover:bg-rose-700 active:scale-95"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

