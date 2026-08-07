import Editor from "@monaco-editor/react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Code2,
  Edit3,
  FileCode2,
  LoaderCircle,
  Play,
  Plus,
  Save,
  Terminal,
  Trash2,
  Eye,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  CodingQuestion,
  CreateCodingQuestionRequest,
  ExecutionStatus,
  playgroundApi,
  ProgrammingLanguage,
  RunCodeResponse,
  UpdateCodingQuestionRequest,
} from "../api/playgroundApi";

import CreateQuestionModal from "../components/playground/CreateQuestionModal";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   STARTER CODE
========================================================= */

const starterCode: Record<ProgrammingLanguage, string> = {
  PYTHON: `# Write your code here
`,

  JAVA: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}
`,

  C: `#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}
`,

  CPP: `#include <iostream>
using namespace std;

int main() {
    // Write your code here

    return 0;
}
`,
};

/* =========================================================
   HELPERS
========================================================= */

const getMonacoLanguage = (language: ProgrammingLanguage): string => {
  switch (language) {
    case "JAVA":
      return "java";

    case "C":
      return "c";

    case "CPP":
      return "cpp";

    case "PYTHON":
      return "python";
  }
};

const getFileName = (language: ProgrammingLanguage): string => {
  switch (language) {
    case "JAVA":
      return "Main.java";

    case "C":
      return "main.c";

    case "CPP":
      return "main.cpp";

    case "PYTHON":
      return "main.py";
  }
};

const getErrorMessage = (error: any, fallback: string): string => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const getStatusStyles = (status: ExecutionStatus | undefined): string => {
  switch (status) {
    case "SUCCESS":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "COMPILATION_ERROR":
    case "RUNTIME_ERROR":
    case "INTERNAL_ERROR":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "TIME_LIMIT_EXCEEDED":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "RUNNING":
    case "PENDING":
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";

    default:
      return "border-white/10 bg-white/[0.04] text-zinc-400";
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Playground() {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.role?.toUpperCase() === "TEACHER";

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState<CodingQuestion | null>(
    null,
  );

  const [deletingQuestion, setDeletingQuestion] = useState(false);

  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const [questions, setQuestions] = useState<CodingQuestion[]>([]);

  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const [language, setLanguage] = useState<ProgrammingLanguage>("PYTHON");

  const [sourceCode, setSourceCode] = useState(starterCode.PYTHON);

  const [standardInput, setStandardInput] = useState("10");

  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [running, setRunning] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const selectedQuestion = useMemo(
    () =>
      questions.find((question) => question.id === selectedQuestionId) || null,
    [questions, selectedQuestionId],
  );

  const handleUpdateQuestion = async (
    questionId: string,
    request: UpdateCodingQuestionRequest,
  ) => {
    try {
      setCreatingQuestion(true);
      setError("");
      setSuccessMessage("");

      const updated = await playgroundApi.updateQuestion(questionId, request);

      setQuestions((current) =>
        current.map((question) =>
          question.id === updated.id ? updated : question,
        ),
      );

      setEditingQuestion(null);
      setCreateModalOpen(false);

      setSuccessMessage("Coding question updated successfully.");
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Failed to update coding question."),
      );

      throw requestError;
    } finally {
      setCreatingQuestion(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedQuestion.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingQuestion(true);
      setError("");
      setSuccessMessage("");

      await playgroundApi.deleteQuestion(selectedQuestion.id);

      const remainingQuestions = questions.filter(
        (question) => question.id !== selectedQuestion.id,
      );

      setQuestions(remainingQuestions);

      if (remainingQuestions.length > 0) {
        setSelectedQuestionId(remainingQuestions[0].id);
      } else {
        setSelectedQuestionId("");
        setRunResult(null);
      }

      setSuccessMessage("Coding question deleted successfully.");
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Failed to delete coding question."),
      );
    } finally {
      setDeletingQuestion(false);
    }
  };

  const outputText = useMemo(() => {
    if (!runResult) {
      return "Run your code to see the execution result.";
    }

    if (runResult.output) {
      return runResult.output;
    }

    if (runResult.compileError) {
      return runResult.compileError;
    }

    if (runResult.runtimeError) {
      return runResult.runtimeError;
    }

    return runResult.status;
  }, [runResult]);

  /* =======================================================
     LOAD QUESTIONS
  ======================================================= */

  useEffect(() => {
    const loadQuestions = async () => {
      if (!workspaceId) {
        setError("Workspace ID is missing.");

        setLoadingQuestions(false);
        return;
      }

      try {
        setLoadingQuestions(true);
        setError("");
        setSuccessMessage("");

        const data = await playgroundApi.getWorkspaceQuestions(workspaceId);

        const normalizedData = Array.isArray(data) ? data : [];

        setQuestions(normalizedData);

        if (normalizedData.length > 0) {
          const firstQuestion = normalizedData[0];

          setSelectedQuestionId(firstQuestion.id);

          const firstLanguage = firstQuestion.allowedLanguages[0] || "PYTHON";

          setLanguage(firstLanguage);

          setSourceCode(starterCode[firstLanguage]);

          setStandardInput(firstQuestion.sampleInput || "");
        } else {
          setSelectedQuestionId("");
          setRunResult(null);
        }
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, "Failed to load coding questions."),
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [workspaceId]);

  /* =======================================================
     SELECTED QUESTION CHANGE
  ======================================================= */

  useEffect(() => {
    if (!selectedQuestion) {
      return;
    }

    let nextLanguage = language;

    if (!selectedQuestion.allowedLanguages.includes(language)) {
      nextLanguage = selectedQuestion.allowedLanguages[0] || "PYTHON";

      setLanguage(nextLanguage);
    }

    setSourceCode(starterCode[nextLanguage]);

    setStandardInput(selectedQuestion.sampleInput || "");

    setRunResult(null);
    setError("");
    setSuccessMessage("");
  }, [selectedQuestionId]);

  /* =======================================================
     LANGUAGE CHANGE
  ======================================================= */

  const handleLanguageChange = (nextLanguage: ProgrammingLanguage) => {
    setLanguage(nextLanguage);

    setSourceCode(starterCode[nextLanguage]);

    setRunResult(null);
    setError("");
    setSuccessMessage("");
  };

  /* =======================================================
     CREATE QUESTION
  ======================================================= */

  const handleCreateQuestion = async (request: CreateCodingQuestionRequest) => {
    try {
      setCreatingQuestion(true);
      setError("");
      setSuccessMessage("");

      const created = await playgroundApi.createQuestion(request);

      setQuestions((current) => [created, ...current]);

      setSelectedQuestionId(created.id);

      const firstLanguage = created.allowedLanguages[0] || "PYTHON";

      setLanguage(firstLanguage);

      setSourceCode(starterCode[firstLanguage]);

      setStandardInput(created.sampleInput || "");

      setRunResult(null);
      setCreateModalOpen(false);

      setSuccessMessage("Coding question created successfully.");
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Failed to create coding question."),
      );

      throw requestError;
    } finally {
      setCreatingQuestion(false);
    }
  };

  /* =======================================================
     RUN CODE
  ======================================================= */

  const handleRun = async () => {
    if (!selectedQuestion) {
      setError("Please select a coding question.");

      return;
    }

    if (!sourceCode.trim()) {
      setError("Source code is required.");

      return;
    }

    try {
      setRunning(true);
      setError("");
      setSuccessMessage("");
      setRunResult(null);

      const result = await playgroundApi.runCode({
        questionId: selectedQuestion.id,
        language,
        sourceCode,
        standardInput,
      });

      setRunResult(result);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Failed to execute code."));
    } finally {
      setRunning(false);
    }
  };

  /* =======================================================
     SAVE STUDENT RESPONSE
  ======================================================= */

  const handleSave = async () => {
    if (isTeacher) {
      setError("Only students can save coding responses.");

      return;
    }

    if (!selectedQuestion) {
      setError("Please select a coding question.");

      return;
    }

    if (!runResult) {
      setError("Run your code before saving the response.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await playgroundApi.saveResponse({
        questionId: selectedQuestion.id,
        language,
        sourceCode,
        standardInput,
        output: runResult.output,
        compileError: runResult.compileError,
        runtimeError: runResult.runtimeError,
        executionStatus: runResult.status,
        executionTimeMs: runResult.executionTimeMs,
      });

      setSuccessMessage("Your code response was saved successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Failed to save response."));
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingQuestions) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <LoaderCircle className="h-8 w-8 animate-spin text-purple-400" />

          <p className="text-sm">Loading coding questions...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-400/15 bg-gradient-to-br from-zinc-950 via-zinc-950 to-purple-950/35 p-6 shadow-[0_25px_90px_rgba(88,28,135,0.16)] sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/20 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-indigo-500/15 blur-[110px]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-300">
              <Code2 className="h-3.5 w-3.5" />
              Interactive Coding Lab
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Coding Playground
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              {isTeacher
                ? "Create coding questions, test solutions, and manage classroom programming activities."
                : "Write, execute, debug, and save your solutions directly inside the classroom."}
            </p>
            {workspaceId && (
              <button
                type="button"
                onClick={() => navigate(`/workspace/${workspaceId}`)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-purple-400/30 hover:bg-purple-400/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> 
                Back to Classroom
              </button>
            )}

            {isTeacher && (
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setError("");
                  setSuccessMessage("");
                  setCreateModalOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(124,58,237,0.28)] transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
              >
                <Plus className="h-4 w-4" />
                Create Question
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold text-white">{questions.length}</p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Questions
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold text-purple-300">
                {selectedQuestion?.allowedLanguages.length || 0}
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Languages
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center backdrop-blur">
              <p className="truncate text-sm font-bold text-emerald-300">
                {runResult?.status || "READY"}
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Status
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Empty state */}
      {questions.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/50 p-12 text-center">
          <FileCode2 className="mx-auto h-12 w-12 text-zinc-600" />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No coding questions available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            {isTeacher
              ? "Create the first coding question for this classroom."
              : "Your teacher has not created any coding questions for this classroom yet."}
          </p>

          {isTeacher && (
            <button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setCreateModalOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Create First Question
            </button>
          )}
        </section>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
            {/* Question panel */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-[70px]" />

              <div className="relative z-10 space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-300">
                    Problem Selection
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-white">
                    Choose a question
                  </h2>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-zinc-400">
                    Coding question
                  </span>

                  <select
                    value={selectedQuestionId}
                    onChange={(event) =>
                      setSelectedQuestionId(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-purple-400/40"
                  >
                    {questions.map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.title}
                      </option>
                    ))}
                  </select>
                </label>

                {/* <label className="block">
                  <span className="mb-2 block text-xs font-medium text-zinc-400">
                    Coding question
                  </span>

                  <select
                    value={selectedQuestionId}
                    onChange={(event) =>
                      setSelectedQuestionId(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-purple-400/40"
                  >
                    {questions.map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.title}
                      </option>
                    ))}
                  </select>
                </label> */}

                {/* Teacher question actions */}
                {isTeacher && selectedQuestion && (
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(selectedQuestion);
                        setError("");
                        setSuccessMessage("");
                        setCreateModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-3 py-2.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-400/15"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteQuestion}
                      disabled={deletingQuestion}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingQuestion ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      {deletingQuestion ? "Deleting..." : "Delete"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/playground/question/${selectedQuestion.id}/responses`,
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
                    >
                      <Eye className="h-4 w-4" />
                      View Responses
                    </button>
                  </div>
                )}

                {selectedQuestion && (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-white">
                          {selectedQuestion.title}
                        </h3>

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            selectedQuestion.active
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-zinc-600 bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {selectedQuestion.active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                        {selectedQuestion.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          Sample input
                        </p>

                        <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-indigo-200">
                          {selectedQuestion.sampleInput || "No sample input"}
                        </pre>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          Sample output
                        </p>

                        <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-emerald-200">
                          {selectedQuestion.sampleOutput || "No sample output"}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Editor */}
            <section className="space-y-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950/50 p-4 sm:flex-row sm:items-end sm:justify-between">
                <label>
                  <span className="mb-2 block text-xs font-medium text-zinc-400">
                    Programming language
                  </span>

                  <select
                    value={language}
                    onChange={(event) =>
                      handleLanguageChange(
                        event.target.value as ProgrammingLanguage,
                      )
                    }
                    className="min-w-40 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-purple-400/40"
                  >
                    {selectedQuestion?.allowedLanguages.map(
                      (allowedLanguage) => (
                        <option key={allowedLanguage} value={allowedLanguage}>
                          {allowedLanguage}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={running}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(124,58,237,0.28)] transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {running ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}

                    {running ? "Running..." : "Run Code"}
                  </button>

                  {!isTeacher && (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || !runResult}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:-translate-y-0.5 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {saving ? "Saving..." : "Save Response"}
                    </button>
                  )}

                  {!isTeacher && workspaceId && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/workspace/${workspaceId}/playground/history`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-5 py-2.5 text-sm font-semibold text-indigo-300 transition hover:-translate-y-0.5 hover:bg-indigo-400/15"
                    >
                      My Responses
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_25px_70px_rgba(0,0,0,0.36)]">
                <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />

                    <span className="ml-3 text-xs font-medium text-zinc-400">
                      {getFileName(language)}
                    </span>
                  </div>

                  <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-purple-300">
                    {language}
                  </span>
                </div>

                <Editor
                  height="520px"
                  language={getMonacoLanguage(language)}
                  value={sourceCode}
                  onChange={(value) => {
                    setSourceCode(value || "");

                    setSuccessMessage("");
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    fontSize: 15,
                    lineHeight: 24,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    padding: {
                      top: 16,
                    },
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: "on",
                    bracketPairColorization: {
                      enabled: true,
                    },
                  }}
                />
              </div>
            </section>
          </div>

          {/* Input and output */}
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                  <Terminal className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Standard Input
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Values consumed by your program.
                  </p>
                </div>
              </div>

              <textarea
                value={standardInput}
                onChange={(event) => {
                  setStandardInput(event.target.value);

                  setSuccessMessage("");
                }}
                rows={9}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-sm leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/40"
                placeholder="Enter program input..."
              />
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <Terminal className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Execution Output
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                      Compiler and runtime results.
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusStyles(
                    runResult?.status,
                  )}`}
                >
                  {runResult?.status || "Not Run"}
                </span>
              </div>

              <pre className="min-h-[220px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black p-4 font-mono text-sm leading-6 text-emerald-300">
                {outputText}
              </pre>

              {runResult && runResult.executionTimeMs !== null && (
                <div className="mt-3 flex justify-end">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium text-zinc-400">
                    Execution time: {runResult.executionTimeMs} ms
                  </span>
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {/* Create-question modal */}
      {workspaceId && (
        <CreateQuestionModal
          open={createModalOpen}
          workspaceId={workspaceId}
          saving={creatingQuestion}
          question={editingQuestion}
          onClose={() => {
            if (!creatingQuestion) {
              setCreateModalOpen(false);
              setEditingQuestion(null);
            }
          }}
          onCreate={handleCreateQuestion}
          onUpdate={handleUpdateQuestion}
        />
      )}
    </div>
  );
}
