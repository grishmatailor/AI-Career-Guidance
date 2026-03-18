"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, gql } from "@apollo/client";
import { GET_CAREERS } from "@/graphql/queries";
import { Plus, Pencil, Trash2, Loader2, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Career } from "@/types";

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
      description
      skills_required
      salary_range
      growth_rate
    }
  }
`;

const UPDATE_CAREER = gql`
  mutation UpdateCareer(
    $id: ID!
    $title: String
    $description: String
    $skills_required: [String!]
    $salary_range: String
    $growth_rate: String
  ) {
    updateCareer(
      id: $id
      title: $title
      description: $description
      skills_required: $skills_required
      salary_range: $salary_range
      growth_rate: $growth_rate
    ) {
      id
      title
      description
      skills_required
      salary_range
      growth_rate
    }
  }
`;

const DELETE_CAREER = gql`
  mutation DeleteCareer($id: ID!) {
    deleteCareer(id: $id)
  }
`;

const emptyForm = {
  title: "",
  description: "",
  skills_required: "",
  salary_range: "",
  growth_rate: "",
};

type FormState = typeof emptyForm;

export default function ManageCareers() {
  const { data, loading, refetch } = useQuery(GET_CAREERS);
  const [createCareer, { loading: creating }] = useMutation(CREATE_CAREER);
  const [updateCareer, { loading: updating }] = useMutation(UPDATE_CAREER);
  const [deleteCareer, { loading: deleting }] = useMutation(DELETE_CAREER);

  const careers: Career[] = data?.getCareers || [];

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Career | null>(null);

  const openAdd = () => {
    setEditingCareer(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (career: Career) => {
    setEditingCareer(career);
    setForm({
      title: career.title,
      description: career.description,
      skills_required: career.skills_required.join(", "),
      salary_range: career.salary_range,
      growth_rate: career.growth_rate,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCareer(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = form.skills_required
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingCareer) {
        await updateCareer({
          variables: {
            id: editingCareer.id,
            title: form.title,
            description: form.description,
            skills_required: skillsArray,
            salary_range: form.salary_range,
            growth_rate: form.growth_rate,
          },
        });
        toast.success(`"${form.title}" updated!`);
      } else {
        await createCareer({
          variables: {
            title: form.title,
            description: form.description,
            skills_required: skillsArray,
            salary_range: form.salary_range,
            growth_rate: form.growth_rate,
          },
        });
        toast.success(`"${form.title}" added!`);
      }
      await refetch();
      closeModal();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (career: Career) => {
    try {
      await deleteCareer({ variables: { id: career.id } });
      toast.success(`"${career.title}" deleted.`);
      await refetch();
      setDeleteConfirm(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete career");
    }
  };

  const isSaving = creating || updating;

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="text-blue-500" />
            Manage Careers
          </h1>
          <p className="text-slate-400">
            Add, edit, or delete careers from the repository.{" "}
            <span className="text-blue-400 font-medium">{careers.length} total</span>
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAdd}>
          <Plus size={18} className="mr-2" /> Add Career
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-white/10">
        {careers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <TrendingUp className="text-slate-600 w-12 h-12 mb-4" />
            <p className="text-slate-500 mb-4">No careers yet. Add your first one!</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAdd}>
              <Plus size={16} className="mr-2" /> Add Career
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead className="text-slate-400">Title</TableHead>
                <TableHead className="text-slate-400">Description</TableHead>
                <TableHead className="text-slate-400">Skills</TableHead>
                <TableHead className="text-slate-400">Salary</TableHead>
                <TableHead className="text-slate-400">Growth</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {careers.map((career) => (
                <TableRow
                  key={career.id}
                  className="border-white/5 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-bold text-white">{career.title}</TableCell>
                  <TableCell className="text-slate-400 max-w-[200px] truncate">
                    {career.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {career.skills_required.slice(0, 2).map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                      {career.skills_required.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-500">
                          +{career.skills_required.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-400 font-medium">
                    {career.salary_range}
                  </TableCell>
                  <TableCell className="text-blue-400">{career.growth_rate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-blue-500/10"
                        onClick={() => openEdit(career)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteConfirm(career)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingCareer ? "Edit Career" : "Add New Career"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title *</label>
                <Input
                  required
                  placeholder="e.g. Senior AI Engineer"
                  className="bg-slate-800 border-white/10"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description *</label>
                <textarea
                  required
                  placeholder="Brief description of this career..."
                  rows={3}
                  className="w-full bg-slate-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Skills Required *{" "}
                  <span className="text-slate-600">(comma-separated)</span>
                </label>
                <Input
                  required
                  placeholder="Python, Machine Learning, SQL"
                  className="bg-slate-800 border-white/10"
                  value={form.skills_required}
                  onChange={(e) =>
                    setForm({ ...form, skills_required: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Salary Range *</label>
                  <Input
                    required
                    placeholder="$80k - $120k"
                    className="bg-slate-800 border-white/10"
                    value={form.salary_range}
                    onChange={(e) =>
                      setForm({ ...form, salary_range: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Growth Rate *</label>
                  <Input
                    required
                    placeholder="22%"
                    className="bg-slate-800 border-white/10"
                    value={form.growth_rate}
                    onChange={(e) =>
                      setForm({ ...form, growth_rate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-400"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  {editingCareer ? "Save Changes" : "Add Career"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 bg-slate-900 border border-red-500/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-400 w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2">Delete Career?</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                &quot;{deleteConfirm.title}&quot;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="ghost"
                className="text-slate-400"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirm)}
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
