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
import { useQuery, useMutation, gql } from "@apollo/client";
import { GET_QUESTIONS } from "@/graphql/queries";
import { Plus, Pencil, Trash2, Loader2, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { AssessmentQuestion } from "@/types";

const CREATE_QUESTION = gql`
  mutation CreateQuestion($question: String!, $category: String!) {
    createQuestion(question: $question, category: $category) {
      id
      question
      category
    }
  }
`;

const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $question: String, $category: String) {
    updateQuestion(id: $id, question: $question, category: $category) {
      id
      question
      category
    }
  }
`;

const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

const CATEGORIES = [
  "interests",
  "skills",
  "education",
  "goals",
  "experience",
  "other",
];

const emptyForm = { question: "", category: "interests" };
type FormState = typeof emptyForm;

export default function ManageQuestions() {
  const { data, loading, refetch } = useQuery(GET_QUESTIONS);
  const [createQuestion, { loading: creating }] = useMutation(CREATE_QUESTION);
  const [updateQuestion, { loading: updating }] = useMutation(UPDATE_QUESTION);
  const [deleteQuestion, { loading: deleting }] = useMutation(DELETE_QUESTION);

  const questions: AssessmentQuestion[] = data?.getQuestions || [];

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<AssessmentQuestion | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<AssessmentQuestion | null>(
    null,
  );

  const openAdd = () => {
    setEditingQuestion(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setForm({ question: q.question, category: q.category });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingQuestion(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await updateQuestion({
          variables: {
            id: editingQuestion.id,
            question: form.question,
            category: form.category,
          },
        });
        toast.success("Question updated!");
      } else {
        await createQuestion({
          variables: {
            question: form.question,
            category: form.category,
          },
        });
        toast.success("Question added!");
      }
      await refetch();
      closeModal();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (q: AssessmentQuestion) => {
    try {
      await deleteQuestion({ variables: { id: q.id } });
      toast.success("Question deleted.");
      await refetch();
      setDeleteConfirm(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete question",
      );
    }
  };

  const isSaving = creating || updating;

  const categoryColor: Record<string, string> = {
    interests: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    skills: "bg-green-500/10 text-green-400 border-green-500/20",
    education: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    goals: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    experience: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
            <Settings className="text-blue-500 h-6 w-6 md:h-8 md:w-8" />
            Manage Questions
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Add, edit, or delete assessment questions.{" "}
            <span className="text-blue-400 font-medium">
              {questions.length} total
            </span>
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm w-full md:w-auto" onClick={openAdd}>
          <Plus size={16} className="mr-2" /> Add Question
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-white/10">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
            <Settings className="text-slate-600 w-10 h-10 md:w-12 md:h-12 mb-4" />
            <p className="text-slate-500 mb-4 text-sm">
              No questions yet. Add your first one!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm" onClick={openAdd}>
              <Plus size={16} className="mr-2" /> Add Question
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-slate-400 text-xs md:text-sm w-8">#</TableHead>
                    <TableHead className="text-slate-400 text-xs md:text-sm">Question</TableHead>
                    <TableHead className="text-slate-400 text-xs md:text-sm">Category</TableHead>
                    <TableHead className="text-slate-400 text-xs md:text-sm text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q, i) => (
                    <TableRow
                      key={q.id}
                      className="border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="text-slate-600 font-mono text-xs md:text-sm">
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-white text-xs md:text-sm max-w-[420px]">
                        {q.question}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                            categoryColor[q.category] ?? categoryColor.other
                          }`}
                        >
                          {q.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-blue-500/10"
                            onClick={() => openEdit(q)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => setDeleteConfirm(q)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {questions.map((q, i) => (
                <div key={q.id} className="bg-slate-800/50 border border-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{q.question}</h3>
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded border capitalize mt-2 ${
                          categoryColor[q.category] ?? categoryColor.other
                        }`}
                      >
                        {q.category}
                      </span>
                    </div>
                    <span className="text-slate-500 text-xs font-mono">#{i + 1}</span>
                  </div>
                  <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-slate-400 hover:text-white hover:bg-blue-500/10 text-xs"
                      onClick={() => openEdit(q)}
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
                      onClick={() => setDeleteConfirm(q)}
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Question *
                </label>
                <textarea
                  required
                  placeholder="Enter the assessment question..."
                  rows={3}
                  className="w-full bg-slate-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${
                        form.category === cat
                          ? (categoryColor[cat] ?? categoryColor.other)
                          : "bg-slate-800 text-slate-400 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
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
                  {editingQuestion ? "Save Changes" : "Add Question"}
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
            <h2 className="text-xl font-bold mb-2">Delete Question?</h2>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Are you sure you want to delete this question? This action cannot
              be undone.
              <span className="block mt-2 italic text-slate-500 text-xs">
                &quot;{deleteConfirm.question}&quot;
              </span>
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
