import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const dashboardLink = user?.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 mb-6 shadow-lg shadow-rose-500/10 animate-bounce">
        <ShieldAlert className="w-8 h-8" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
        Permission Denied
      </h1>
      
      <p className="mt-2 text-zinc-400 max-w-md text-sm font-medium">
        Error 403: You do not have the authorization roles required to view this administrative resource.
      </p>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          to={dashboardLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Dashboard Home
        </Link>
        
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Log In Panel
        </Link>
      </div>
    </div>
  );
};
