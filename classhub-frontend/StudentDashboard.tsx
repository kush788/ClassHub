

import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  workspaceApi,
  WorkspaceResponse,
} from "../api/workspaceApi";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Search,
  Sparkles,
} from "lucide-react";

import { motion } from "motion/react";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [workspaces, setWorkspaces] = useState<
    WorkspaceResponse[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [joinCode, setJoinCode] =
    useState("");

  const [enrolling, setEnrolling] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const getErrorMessage = (
    error: any,
    fallback: string,
  ): string => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );
  };

  const fetchWorkspaces = async () => {
    setLoading(true);

    try {
      const data =
        await workspaceApi.getJoinedWorkspaces();

      setWorkspaces(
        Array.isArray(data) ? data : [],
      );
    } catch (error: any) {
      console.error(
        "Failed to load joined workspaces:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to load enrolled classrooms.",
        ),
        "error",
      );

      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchWorkspaces();
    }
  }, [user?.id]);

  const handleEnroll = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedJoinCode =
      joinCode.trim().toUpperCase();

    if (!normalizedJoinCode) {
      addToast(
        "Please enter a classroom join code.",
        "warning",
      );

      return;
    }

    setEnrolling(true);

    try {
      const response =
        await workspaceApi.joinWorkspace(
          normalizedJoinCode,
        );

      addToast(
        response.message ||
          `Successfully joined ${
            response.workspaceName ||
            "the classroom"
          }.`,
        "success",
      );

      setJoinCode("");

      await fetchWorkspaces();
    } catch (error: any) {
      console.error(
        "Failed to join workspace:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Invalid or non-existent join code.",
        ),
        "error",
      );
    } finally {
      setEnrolling(false);
    }
  };

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredWorkspaces =
    workspaces.filter((workspace) => {
      const name =
        workspace.name?.toLowerCase() || "";

      const subject =
        workspace.subject?.toLowerCase() || "";

      const description =
        workspace.description?.toLowerCase() ||
        "";

      return (
        name.includes(normalizedSearch) ||
        subject.includes(normalizedSearch) ||
        description.includes(
          normalizedSearch,
        )
      );
    });

  const activeClassrooms =
    workspaces.filter(
      (workspace) => workspace.active,
    ).length;

  const studentName =
    user?.name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-7">
      {/* Hero */}
      <motion.section
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl sm:p-8"
      >
        {/* Blueprint grid */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(9,9,11,0.82)_86%)]" />
        </div>

        {/* Background glows */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-[#A855F7]/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-indigo-200">
              <Sparkles className="h-3 w-3 text-indigo-400" />

              Learning Dashboard
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
              Welcome back, {studentName}

              <span
                className="ml-2 inline-block"
                role="img"
                aria-label="Waving hand"
              >
                👋
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Access your classrooms, study
              resources, complete assignments,
              and continue your learning journey
              from one place.
            </p>
          </div>

          {/* Join classroom */}
          <form
            onSubmit={handleEnroll}
            className="w-full rounded-2xl border border-white/10 bg-black/25 p-3.5 sm:max-w-md"
          >
            <label
              htmlFor="join-code-input"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
            >
              Join a new classroom
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                <input
                  id="join-code-input"
                  type="text"
                  placeholder="Enter join code"
                  maxLength={20}
                  value={joinCode}
                  onChange={(event) =>
                    setJoinCode(
                      event.target.value.toUpperCase(),
                    )
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 py-2.5 pl-10 pr-3 font-mono text-xs uppercase tracking-[0.12em] text-zinc-100 outline-none transition-all placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              <button
                type="submit"
                id="enroll_classroom_btn"
                disabled={enrolling}
                className="inline-flex min-w-[105px] items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-[#A855F7] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 hover:shadow-[0_14px_36px_rgba(99,102,241,0.34)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enrolling ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Joining
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    Join Class
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.section>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.05,
          }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 backdrop-blur-xl transition-colors hover:border-indigo-400/30"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-[45px]" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <div className="font-mono text-2xl font-semibold text-white">
                {workspaces.length}
              </div>

              <div className="mt-0.5 text-[11px] font-medium text-zinc-400">
                Enrolled Classrooms
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.1,
          }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 backdrop-blur-xl transition-colors hover:border-emerald-400/30"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-[45px]" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <div className="font-mono text-2xl font-semibold text-white">
                {activeClassrooms}
              </div>

              <div className="mt-0.5 text-[11px] font-medium text-zinc-400">
                Active Classrooms
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and heading */}
      <motion.div
        initial={{
          opacity: 0,
          y: 14,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.15,
        }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            My Classrooms
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Continue learning from your joined
            workspaces.
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Search classrooms..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 py-2.5 pl-10 pr-4 text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
          />
        </div>
      </motion.div>

      {/* Workspace content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="min-h-[300px] animate-pulse rounded-2xl border border-white/10 bg-zinc-950/45 p-5"
            >
              <div className="flex justify-between">
                <div className="h-6 w-24 rounded-full bg-zinc-800" />
                <div className="h-6 w-14 rounded-full bg-zinc-800" />
              </div>

              <div className="mt-6 h-6 w-3/4 rounded bg-zinc-800" />

              <div className="mt-3 h-3 w-full rounded bg-zinc-800/80" />

              <div className="mt-2 h-3 w-2/3 rounded bg-zinc-800/80" />

              <div className="mt-20 h-10 w-full rounded-xl bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[60px]" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
              <GraduationCap className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-zinc-100">
              {searchTerm
                ? "No matching classrooms"
                : "Your learning space is empty"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
              {searchTerm
                ? "Try searching using another classroom name, subject, or description."
                : "Ask your teacher for a classroom join code, then enter it in the form above."}
            </p>
          </div>
        </motion.div>
      ) : (
        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          id="student_workspaces_grid"
        >
          {filteredWorkspaces.map(
            (workspace, index) => (
              <motion.article
                key={workspace.id}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay:
                    0.2 + index * 0.05,
                }}
                whileHover={{
                  y: -6,
                  scale: 1.015,
                }}
                className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-300 hover:border-indigo-400/35 hover:shadow-[0_22px_60px_rgba(99,102,241,0.12)]"
              >
                {/* Top glow line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Card glows */}
                <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-indigo-500/10 blur-[60px] transition-all duration-500 group-hover:bg-indigo-500/20" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#A855F7]/5 blur-[70px]" />

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex max-w-[65%] items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-400/10 px-2.5 py-1 text-[10px] font-semibold text-indigo-200">
                      <BookOpen className="h-3 w-3 shrink-0 text-indigo-300" />

                      <span className="truncate">
                        {workspace.subject}
                      </span>
                    </span>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                        workspace.active
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 bg-white/[0.04] text-zinc-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          workspace.active
                            ? "bg-emerald-400"
                            : "bg-zinc-600"
                        }`}
                      />

                      {workspace.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <Link
                    to={`/workspace/${workspace.id}`}
                    id={`student-workspace-link-${workspace.id}`}
                    className="mt-5 block"
                  >
                    <h3 className="flex items-start justify-between gap-3 text-xl font-bold tracking-[-0.025em] text-zinc-100 transition-colors group-hover:text-white">
                      <span className="line-clamp-2">
                        {workspace.name}
                      </span>

                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-indigo-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    </h3>
                  </Link>

                  <p className="mt-3 min-h-[48px] line-clamp-2 text-xs leading-6 text-zinc-500">
                    {workspace.description ||
                      "Access classroom resources, assignments, announcements, and learning activities."}
                  </p>

                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <div className="mt-auto rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      Classroom reference
                    </span>

                    <span className="mt-1.5 block font-mono text-xs font-medium tracking-[0.12em] text-zinc-400">
                      {workspace.id.slice(0, 8)}
                      ...
                    </span>
                  </div>

                  <Link
                    to={`/workspace/${workspace.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-4 py-2.5 text-xs font-semibold text-indigo-100 transition-all duration-200 hover:border-indigo-400/45 hover:bg-indigo-400/15 hover:text-white"
                  >
                    Enter Classroom

                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ),
          )}
        </div>
      )}
    </div>
  );
};