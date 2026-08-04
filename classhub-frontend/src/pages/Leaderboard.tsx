import React, { useEffect, useMemo, useState } from "react";

import {
  Award,
  BarChart3,
  Filter,
  RefreshCw,
  Search,
  Trophy,
} from "lucide-react";

import { motion } from "motion/react";

import {
  leaderboardApi,
  LeaderboardEntryResponse,
} from "../api/leaderboardApi";

import { workspaceApi, WorkspaceResponse } from "../api/workspaceApi";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const getErrorMessage = (error: any, fallback: string): string => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const getStudentName = (entry: LeaderboardEntryResponse): string => {
  const name = entry.studentName?.trim();

  if (name) {
    return name;
  }

  const email = entry.studentEmail?.trim();

  if (email) {
    return email;
  }

  return `Student ${entry.studentId.slice(0, 8)}`;
};

const getStudentSecondaryText = (entry: LeaderboardEntryResponse): string => {
  const email = entry.studentEmail?.trim();

  if (email) {
    return email;
  }

  return entry.studentId;
};

const getStudentInitials = (entry: LeaderboardEntryResponse): string => {
  const name = entry.studentName?.trim();

  if (!name) {
    return "S";
  }

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryResponse[]>(
    [],
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const isTeacher = user?.role?.toUpperCase() === "TEACHER";

  const fetchWorkspaces = async () => {
    setLoadingWorkspaces(true);

    try {
      const data = isTeacher
        ? await workspaceApi.getMyWorkspaces()
        : await workspaceApi.getJoinedWorkspaces();

      const list = Array.isArray(data) ? data : [];

      setWorkspaces(list);

      setSelectedWorkspaceId((current) => {
        if (current && list.some((workspace) => workspace.id === current)) {
          return current;
        }

        return list[0]?.id || "";
      });
    } catch (error: any) {
      console.error("Failed to load workspaces:", error);

      addToast(getErrorMessage(error, "Failed to load classrooms."), "error");

      setWorkspaces([]);
      setSelectedWorkspaceId("");
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  const fetchLeaderboard = async (
    workspaceId: string,
    manualRefresh = false,
  ) => {
    if (!workspaceId) {
      setLeaderboard([]);
      return;
    }

    if (manualRefresh) {
      setRefreshing(true);
    } else {
      setLoadingLeaderboard(true);
    }

    try {
      const data = await leaderboardApi.getWorkspaceLeaderboard(workspaceId);

      setLeaderboard(Array.isArray(data) ? data : []);

      if (manualRefresh) {
        addToast("Leaderboard refreshed successfully.", "success");
      }
    } catch (error: any) {
      console.error("Failed to load leaderboard:", error);

      addToast(getErrorMessage(error, "Failed to load leaderboard."), "error");

      setLeaderboard([]);
    } finally {
      setLoadingLeaderboard(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [isTeacher]);

  useEffect(() => {
    if (selectedWorkspaceId) {
      fetchLeaderboard(selectedWorkspaceId);
    } else {
      setLeaderboard([]);
    }
  }, [selectedWorkspaceId]);

  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ||
    null;

  const filteredLeaderboard = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return leaderboard;
    }

    return leaderboard.filter((entry) => {
      const studentName = getStudentName(entry).toLowerCase();

      const studentEmail = getStudentSecondaryText(entry).toLowerCase();

      return (
        studentName.includes(query) ||
        studentEmail.includes(query) ||
        entry.studentId.toLowerCase().includes(query) ||
        entry.rank.toString().includes(query)
      );
    });
  }, [leaderboard, searchQuery]);

  const currentUserEntry =
    leaderboard.find((entry) => entry.studentId === user?.id) || null;

  const topScore =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((entry) => Number(entry.totalMarks) || 0))
      : 0;

  const totalGradedSubmissions = leaderboard.reduce(
    (sum, entry) => sum + (Number(entry.gradedSubmissions) || 0),
    0,
  );

  const topThree = leaderboard.slice(0, 3);

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  if (loadingWorkspaces || loadingLeaderboard) {
    return (
      <div className="space-y-6">
        <div className="h-52 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/50" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
            />
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/40 p-8"
      >
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-44 w-44 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8 text-zinc-950" />
            </div>

            <div>
              <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-amber-300">
                Classroom Leaderboard
              </span>

              <h1 className="mt-4 text-4xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Performance Rankings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                View classroom rankings based on graded assignments. Compare
                student performance, monitor progress, and celebrate top
                achievers.
              </p>

              {selectedWorkspace && (
                <div className="mt-5 inline-flex items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
                  <BarChart3 className="mr-2 h-4 w-4 text-indigo-400" />

                  <span className="text-sm text-indigo-200">
                    {selectedWorkspace.name}

                    {selectedWorkspace.subject &&
                      ` • ${selectedWorkspace.subject}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchLeaderboard(selectedWorkspaceId, true)}
            disabled={refreshing || !selectedWorkspaceId}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />

            {refreshing ? "Refreshing..." : "Refresh Rankings"}
          </button>
        </div>
      </motion.div>

      {!isTeacher && currentUserEntry && (
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base font-semibold">
                  {getStudentInitials(currentUserEntry)}
                </div>

                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-zinc-950 text-[9px] font-mono font-bold px-1 rounded">
                  #{currentUserEntry.rank}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Your Standing
                </h3>

                <p className="text-xs text-zinc-400 mt-0.5">
                  Rank #{currentUserEntry.rank} of {leaderboard.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full lg:w-auto text-center border-y lg:border-y-0 lg:border-x border-zinc-800 py-3 lg:py-0 lg:px-8">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Total Marks
                </span>

                <span className="text-base font-bold text-amber-400 font-mono">
                  {currentUserEntry.totalMarks}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Average
                </span>

                <span className="text-base font-bold text-zinc-200 font-mono">
                  {Number(currentUserEntry.averageMarks).toFixed(2)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Graded
                </span>

                <span className="text-base font-bold text-zinc-200 font-mono">
                  {currentUserEntry.gradedSubmissions}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {/* Ranked Students */}

        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="group relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-zinc-900 to-zinc-950 p-5 transition-all duration-300 hover:border-indigo-400/50 hover:shadow-[0_0_38px_rgba(99,102,241,0.28)]"
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-300 group-hover:bg-indigo-500/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Ranked Students
              </p>

              <p className="mt-3 text-3xl font-bold text-white">
                {leaderboard.length}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Students on the leaderboard
              </p>
            </div>

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 transition-all duration-300 group-hover:border-indigo-400/40 group-hover:bg-indigo-500/20">
              <div className="absolute inset-0 rounded-xl bg-indigo-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <BarChart3 className="relative h-5 w-5 text-indigo-400" />
            </div>
          </div>
        </motion.div>

        {/* Highest Score */}

        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 via-zinc-900 to-zinc-950 p-5 transition-all duration-300 hover:border-violet-400/50 hover:shadow-[0_0_38px_rgba(139,92,246,0.3)]"
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl transition-all duration-300 group-hover:bg-violet-500/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Highest Score
              </p>

              <p className="mt-3 text-3xl font-bold text-violet-400">
                {topScore}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Best total marks achieved
              </p>
            </div>

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 transition-all duration-300 group-hover:border-violet-400/40 group-hover:bg-violet-500/20">
              <div className="absolute inset-0 rounded-xl bg-violet-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <Trophy className="relative h-5 w-5 text-violet-400" />
            </div>
          </div>
        </motion.div>

        {/* Graded Submissions */}

        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 p-5 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_38px_rgba(16,185,129,0.28)]"
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300 group-hover:bg-emerald-500/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Graded Submissions
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {totalGradedSubmissions}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Total evaluated submissions
              </p>
            </div>

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/20">
              <div className="absolute inset-0 rounded-xl bg-emerald-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <Award className="relative h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        {topThree.length > 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-amber-400" />

              <div>
                <h2 className="text-xl font-bold text-white">Top Performers</h2>

                <p className="text-sm text-zinc-400">
                  Highest scoring students in this classroom
                </p>
              </div>
            </div>

            <div
              className={`grid gap-6 ${
                topThree.length === 1
                  ? "mx-auto max-w-md grid-cols-1"
                  : topThree.length === 2
                    ? "mx-auto max-w-4xl grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {/* Second */}

              {second && (
                <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700 text-2xl font-bold text-white">
                    {getStudentInitials(second)}
                  </div>

                  <div className="text-lg font-semibold text-white">
                    {getStudentName(second)}
                  </div>

                  <div className="mt-2 text-zinc-400">
                    {second.totalMarks} Marks
                  </div>

                  <div className="mt-5 inline-flex rounded-full bg-zinc-700 px-4 py-1 text-sm font-semibold text-white">
                    🥈 Rank #2
                  </div>
                </div>
              )}

              {/* First */}

              {first && (
                <motion.div
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                  }}
                  transition={{ duration: 0.25 }}
                  className={`relative rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-zinc-900 p-6 text-center shadow-xl shadow-amber-500/10 transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_0_55px_rgba(245,158,11,0.4)] ${
                    topThree.length >= 3 ? "md:scale-105" : ""
                  }`}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-5 py-1.5 text-xs font-bold tracking-wide text-zinc-950 shadow-lg shadow-amber-500/30">
                    👑 WINNER
                  </div>

                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-3xl font-bold text-zinc-950">
                    {getStudentInitials(first)}
                  </div>

                  <div className="text-xl font-bold text-white">
                    {getStudentName(first)}
                  </div>

                  <div className="mt-2 text-lg text-amber-300">
                    {first.totalMarks} Marks
                  </div>

                  <div className="mt-5 inline-flex rounded-full bg-amber-500 px-5 py-1.5 text-sm font-bold text-zinc-950">
                    🥇 Rank #1
                  </div>
                </motion.div>
              )}

              {/* Third */}

              {third && (
                <div className="rounded-2xl border border-violet-500/20 bg-zinc-900/60 p-6 text-center transition-all duration-300 hover:border-violet-400/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.25)]">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-2xl font-bold text-violet-300">
                    {getStudentInitials(third)}
                  </div>

                  <div className="text-lg font-semibold text-white">
                    {getStudentName(third)}
                  </div>

                  <div className="mt-2 text-zinc-400">
                    {third.totalMarks} Marks
                  </div>

                  <div className="mt-5 inline-flex rounded-full bg-violet-500/20 px-4 py-1 text-sm font-semibold text-violet-300">
                    🥉 Rank #3
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/40 border border-zinc-800 rounded-xl p-3"
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />

          <span className="text-xs text-zinc-400 hidden sm:inline">
            Classroom:
          </span>

          <select
            value={selectedWorkspaceId}
            disabled={loadingWorkspaces || workspaces.length === 0}
            onChange={(event) => setSelectedWorkspaceId(event.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-700 cursor-pointer w-full sm:w-64 disabled:opacity-50"
          >
            {workspaces.length === 0 ? (
              <option value="">No classrooms available</option>
            ) : (
              workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                  {workspace.subject ? ` (${workspace.subject})` : ""}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />

          <input
            type="text"
            placeholder="Search student name, email or rank..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl shadow-black/10"
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-950/40 p-5">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Student Rankings
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {selectedWorkspace
                ? selectedWorkspace.name
                : "Select a classroom"}
            </p>
          </div>

          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] font-mono text-zinc-400">
            {filteredLeaderboard.length} students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-zinc-800/80 bg-zinc-950/80 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="w-20 px-5 py-4 text-center">Rank</th>

                <th className="px-5 py-4">Student</th>

                <th className="px-5 py-4">Total Marks</th>

                <th className="px-5 py-4">Average</th>

                <th className="px-5 py-4 text-center">Graded</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {loadingWorkspaces || loadingLeaderboard ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />

                      <p className="mt-4 text-sm font-medium text-zinc-300">
                        Loading standings
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Fetching the latest classroom rankings.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : !selectedWorkspaceId ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                        <Trophy className="h-6 w-6 text-indigo-400" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-zinc-200">
                        No classroom selected
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-zinc-500">
                        Join or create a classroom to view its leaderboard
                        standings.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                        <Award className="h-6 w-6 text-amber-400" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-zinc-200">
                        No leaderboard data yet
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-zinc-500">
                        Rankings will appear after student submissions have been
                        graded.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((entry, index) => {
                  const isUser = entry.studentId === user?.id;

                  const studentName = getStudentName(entry);

                  const studentSecondaryText = getStudentSecondaryText(entry);

                  return (
                    <motion.tr
                      key={entry.studentId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.05,
                      }}
                      className={`transition-all duration-300 ${
                        isUser
                          ? "border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-950/40 to-violet-950/20 text-zinc-100"
                          : "hover:bg-zinc-800/50"
                      }`}
                    >
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold ${
                            entry.rank === 1
                              ? "border border-amber-500/40 bg-amber-500/15 text-amber-400"
                              : entry.rank === 2
                                ? "border border-zinc-500/40 bg-zinc-500/15 text-zinc-200"
                                : entry.rank === 3
                                  ? "border border-orange-700/40 bg-orange-900/25 text-orange-300"
                                  : "text-zinc-500"
                          }`}
                        >
                          {entry.rank === 1
                            ? "🥇"
                            : entry.rank === 2
                              ? "🥈"
                              : entry.rank === 3
                                ? "🥉"
                                : `#${entry.rank}`}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-semibold ${
                              entry.rank === 1
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                                : entry.rank === 2
                                  ? "border-zinc-500/30 bg-zinc-500/10 text-zinc-200"
                                  : entry.rank === 3
                                    ? "border-orange-700/30 bg-orange-900/20 text-orange-300"
                                    : "border-zinc-700 bg-zinc-800 text-zinc-300"
                            }`}
                          >
                            {getStudentInitials(entry)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium text-zinc-200">
                                {studentName}
                              </span>

                              {isUser && (
                                <span className="shrink-0 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-[9px] font-semibold text-indigo-300">
                                  YOU
                                </span>
                              )}
                            </div>

                            <span className="mt-0.5 block truncate text-[10px] text-zinc-500">
                              {studentSecondaryText}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-amber-400">
                          {entry.totalMarks}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-zinc-300">
                          {Number(entry.averageMarks).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-xs font-semibold text-emerald-400">
                          {entry.gradedSubmissions}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5"
      >
        <div className="flex items-start gap-3">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />

          <div>
            <h4 className="text-xs font-medium text-zinc-200">
              Ranking calculation
            </h4>

            <p className="text-[11px] text-zinc-400 mt-1">
              Students are ranked by total marks from graded submissions.
              Average marks and the number of graded submissions are shown for
              additional context.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
