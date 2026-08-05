import React from "react";
import { Link } from "react-router-dom";
import { FolderKanban, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const NotFound: React.FC = () => {
  const { user } = useAuth();
  const dashboardLink = user?.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-lg shadow-indigo-500/10">
        <FolderKanban className="w-8 h-8" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
        Classroom Not Found
      </h1>
      
      <p className="mt-2 text-zinc-400 max-w-sm text-sm font-medium">
        The workspace path or curriculum route you requested could not be resolved in ClassHub.
      </p>

      <div className="mt-8">
        <Link
          to={dashboardLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Safety
        </Link>
      </div>
    </div>
  );
};
