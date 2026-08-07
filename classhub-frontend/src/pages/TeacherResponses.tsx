import Editor from "@monaco-editor/react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Code2,
  Eye,
  FileCode2,
  LoaderCircle,
  Terminal,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ExecutionStatus,
  playgroundApi,
  SavedCodeResponse,
} from "../api/playgroundApi";

const getErrorMessage = (error: any, fallback: string): string => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const getMonacoLanguage = (language: SavedCodeResponse["language"]): string => {
  switch (language) {
    case "JAVA":
      return "java";

    case "PYTHON":
      return "python";

    case "CPP":
      return "cpp";

    case "C":
      return "c";
  }
};

const getStatusStyles = (status: ExecutionStatus): string => {
  switch (status) {
    case "SUCCESS":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "COMPILATION_ERROR":
    case "RUNTIME_ERROR":
    case "INTERNAL_ERROR":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "TIME_LIMIT_EXCEEDED":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "PENDING":
    case "RUNNING":
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }
};

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function TeacherResponses() {
  const { questionId } = useParams<{
    questionId: string;
  }>();

  const navigate = useNavigate();

  const [responses, setResponses] = useState<SavedCodeResponse[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedResponse, setSelectedResponse] =
    useState<SavedCodeResponse | null>(null);

  const successfulResponses = useMemo(
    () =>
      responses.filter((response) => response.executionStatus === "SUCCESS")
        .length,
    [responses],
  );

  const averageExecutionTime = useMemo(() => {
    const validTimes = responses
      .map((response) => response.executionTimeMs)
      .filter((value): value is number => value !== null);

    if (validTimes.length === 0) {
      return null;
    }

    const total = validTimes.reduce((sum, value) => sum + value, 0);

    return Math.round(total / validTimes.length);
  }, [responses]);

  useEffect(() => {
    const loadResponses = async () => {
      if (!questionId) {
        setError("Question ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await playgroundApi.getQuestionResponses(questionId);

        setResponses(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, "Unable to load student responses."),
        );
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, [questionId]);

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
              Submission Review
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Student Responses
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Review saved solutions, execution status, output, and source code
              for this coding question.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-5 inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-purple-400/30 hover:bg-purple-400/10 hover:text-white"
            >
              Back to Playground
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold text-white">{responses.length}</p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Responses
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold text-emerald-300">
                {successfulResponses}
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Successful
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold text-purple-300">
                {averageExecutionTime ?? "-"}
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Avg. ms
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/50">
          <div className="flex flex-col items-center gap-3 text-zinc-400">
            <LoaderCircle className="h-8 w-8 animate-spin text-purple-400" />

            <p className="text-sm">Loading student responses...</p>
          </div>
        </div>
      ) : responses.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/50 p-12 text-center">
          <FileCode2 className="mx-auto h-12 w-12 text-zinc-600" />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No submissions yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Student responses will appear here after they run their code and
            click Save Response.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Saved Submissions
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Latest responses are shown first.
              </p>
            </div>

            <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[10px] font-semibold text-purple-300">
              {responses.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-black/25">
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  <th className="px-5 py-4">Student</th>

                  <th className="px-5 py-4">Language</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Time</th>

                  <th className="px-5 py-4">Updated</th>

                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {responses.map((response, index) => (
                  <tr
                    key={response.id}
                    className="border-t border-white/10 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                          <UserRound className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-200">
                            {response.studentName || `Student ${index + 1}`}
                          </p>

                          <p className="mt-1 max-w-[240px] truncate text-xs text-zinc-500">
                            {response.studentEmail || response.studentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-[10px] font-semibold text-indigo-300">
                        {response.language}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusStyles(
                          response.executionStatus,
                        )}`}
                      >
                        {response.executionStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Clock3 className="h-4 w-4 text-zinc-600" />
                        {response.executionTimeMs ?? "-"} ms
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-zinc-500">
                      {formatDate(response.updatedAt)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedResponse(response)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
                      >
                        <Eye className="h-4 w-4" />
                        View Submission
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedResponse && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedResponse(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-zinc-950/95 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                  <FileCode2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Student Submission
                  </h2>

                  <p className="mt-1 font-mono text-[10px] text-zinc-600">
                    {selectedResponse.studentId}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResponse(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/20 hover:text-red-200"
                aria-label="Close submission"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Language
                  </p>

                  <p className="mt-3 text-lg font-semibold text-indigo-300">
                    {selectedResponse.language}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Status
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusStyles(
                      selectedResponse.executionStatus,
                    )}`}
                  >
                    {selectedResponse.executionStatus}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Execution Time
                  </p>

                  <p className="mt-3 text-lg font-semibold text-emerald-300">
                    {selectedResponse.executionTimeMs ?? "-"} ms
                  </p>
                </div>
              </div>

              <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <Terminal className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Execution Output
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Output, compiler error, or runtime error.
                    </p>
                  </div>
                </div>

                <pre className="min-h-[150px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black p-4 font-mono text-sm leading-6 text-emerald-300">
                  {selectedResponse.output ||
                    selectedResponse.compileError ||
                    selectedResponse.runtimeError ||
                    "No output available."}
                </pre>
              </section>

              <section className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />

                    <span className="ml-3 text-xs font-medium text-zinc-400">
                      Submitted Source Code
                    </span>
                  </div>

                  <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[10px] font-semibold text-purple-300">
                    {selectedResponse.language}
                  </span>
                </div>

                <Editor
                  height="460px"
                  theme="vs-dark"
                  language={getMonacoLanguage(selectedResponse.language)}
                  value={selectedResponse.sourceCode}
                  options={{
                    readOnly: true,
                    minimap: {
                      enabled: false,
                    },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineHeight: 23,
                    wordWrap: "on",
                    padding: {
                      top: 16,
                    },
                  }}
                />
              </section>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-zinc-500">
                <span>Saved {formatDate(selectedResponse.updatedAt)}</span>

                {selectedResponse.executionStatus === "SUCCESS" && (
                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Successful execution
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
