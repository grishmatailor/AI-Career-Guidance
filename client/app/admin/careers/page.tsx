"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CAREERS } from "@/graphql/queries";
import { gql } from "@apollo/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CREATE_CAREER = gql`
  mutation CreateCareer(
    $title: String!
    $description: String!
    $skills_required: [String!]!
    $salary_range: String!
    $growth_rate: String!
  ) {
    createCareer(
      title: $title
      description: $description
      skills_required: $skills_required
      salary_range: $salary_range
      growth_rate: $growth_rate
    ) {
      id
      title
    }
  }
`;

export default function ManageCareers() {
  const { data, loading, refetch } = useQuery(GET_CAREERS);
  const [createCareer] = useMutation(CREATE_CAREER);
  const careers = data?.getCareers || [];

  const handleAddDemo = async () => {
    try {
      await createCareer({
        variables: {
          title: "Senior AI Engineer",
          description:
            "Responsible for designing and implementing AI models and systems.",
          skills_required: [
            "Python",
            "PyTorch",
            "Mathematics",
            "Cloud Computing",
          ],
          salary_range: "$120k - $180k",
          growth_rate: "25%",
        },
      });
      toast.success("Career added!");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <Loader2 className="animate-spin mx-auto mt-20" />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Careers</h1>
          <p className="text-slate-400">
            Add, edit, or delete careers from the repository.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleAddDemo}
        >
          <Plus size={18} className="mr-2" /> Add Career
        </Button>
      </div>

      <Card className="bg-slate-900 border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Skills</TableHead>
              <TableHead className="text-slate-400">Salary</TableHead>
              <TableHead className="text-slate-400">Growth</TableHead>
              <TableHead className="text-slate-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {careers.map((career: any) => (
              <TableRow
                key={career.id}
                className="border-white/5 hover:bg-white/5 transition-colors"
              >
                <TableCell className="font-bold">{career.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {career.skills_required
                      .slice(0, 2)
                      .map((s: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </TableCell>
                <TableCell className="text-green-400 font-medium">
                  {career.salary_range}
                </TableCell>
                <TableCell className="text-blue-400">
                  {career.growth_rate}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
}
