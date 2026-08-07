import { useEffect, useState } from "react";
import { BookOpen, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

import { workspaceApi, WorkspaceResponse } from "../api/workspaceApi";
import { useAuth } from "../context/AuthContext";

export default function PlaygroundHome() {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState<
    WorkspaceResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isTeacher =
    user?.role?.toUpperCase() === "TEACHER";

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        setLoading(true);
        setError("");

        const data = isTeacher
          ? await workspaceApi.getMyWorkspaces()
          : await workspaceApi.getJoinedWorkspaces();

        setWorkspaces(
          Array.isArray(data) ? data : [],
        );
      } catch (requestError: any) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Failed to load classrooms.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, [isTeacher]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
            <Code2 className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white">
            Coding Playground
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Select a classroom to open its coding questions,
            run programs, and save responses.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-8 text-sm text-zinc-400">
          Loading classrooms...
        </div>
      ) : workspaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-zinc-500" />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No classrooms available
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {isTeacher
              ? "Create a classroom first."
              : "Join a classroom first."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              to={`/workspace/${workspace.id}/playground`}
              className="group rounded-2xl border border-white/10 bg-zinc-950/50 p-5 transition-all hover:-translate-y-1 hover:border-purple-400/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                <Code2 className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white">
                {workspace.name}
              </h2>

              <p className="mt-1 text-xs uppercase tracking-wide text-purple-300">
                {workspace.subject}
              </p>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                {workspace.description ||
                  "Open this classroom's coding playground."}
              </p>

              <div className="mt-5 text-sm font-medium text-purple-300 transition-colors group-hover:text-purple-200">
                Open Playground →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}