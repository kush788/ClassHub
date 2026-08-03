// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   workspaceApi,
//   WorkspaceResponse,
// } from "../api/workspaceApi";
// import { useAuth } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
// import {
//   Plus,
//   Copy,
//   Check,
//   Users,
//   BookOpen,
//   Search,
//   PlusCircle,
//   ArrowRight,
// } from "lucide-react";
// import { AnimatePresence, motion } from "motion/react";

// export const TeacherDashboard: React.FC = () => {
//   const { user } = useAuth();
//   const { addToast } = useToast();

//   const [workspaces, setWorkspaces] = useState<
//     WorkspaceResponse[]
//   >([]);

//   const [loading, setLoading] = useState(true);

//   const [isModalOpen, setIsModalOpen] =
//     useState(false);

//   const [workspaceName, setWorkspaceName] =
//     useState("");

//   const [workspaceSubject, setWorkspaceSubject] =
//     useState("");

//   const [
//     workspaceDescription,
//     setWorkspaceDescription,
//   ] = useState("");

//   const [createLoading, setCreateLoading] =
//     useState(false);

//   const [searchTerm, setSearchTerm] =
//     useState("");

//   const [copiedCodeStr, setCopiedCodeStr] =
//     useState<string | null>(null);

//   const fetchWorkspaces = async () => {
//     setLoading(true);

//     try {
//       const data =
//         await workspaceApi.getMyWorkspaces();

//       setWorkspaces(
//         Array.isArray(data) ? data : [],
//       );
//     } catch (error: any) {
//       console.error(
//         "Failed to fetch teacher workspaces:",
//         error,
//       );

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to load workspaces.";

//       addToast(message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWorkspaces();
//   }, []);

//   const handleCopyCode = async (
//     code: string,
//   ) => {
//     try {
//       await navigator.clipboard.writeText(code);

//       setCopiedCodeStr(code);

//       addToast(
//         `Join Code "${code}" copied to clipboard!`,
//         "success",
//       );

//       window.setTimeout(() => {
//         setCopiedCodeStr(null);
//       }, 2000);
//     } catch (error) {
//       console.error(
//         "Unable to copy join code:",
//         error,
//       );

//       addToast(
//         "Failed to copy code. Try copying it manually.",
//         "error",
//       );
//     }
//   };

//   const handleCreateWorkspace = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     const trimmedName =
//       workspaceName.trim();

//     const trimmedSubject =
//       workspaceSubject.trim();

//     const trimmedDescription =
//       workspaceDescription.trim();

//     if (!trimmedName || !trimmedSubject) {
//       addToast(
//         "Please provide both a classroom name and subject.",
//         "warning",
//       );

//       return;
//     }

//     setCreateLoading(true);

//     try {
//       const newWorkspace =
//         await workspaceApi.createWorkspace({
//           name: trimmedName,
//           subject: trimmedSubject,
//           description: trimmedDescription,
//         });

//       addToast(
//         `Classroom "${newWorkspace.name}" created successfully!`,
//         "success",
//       );

//       setWorkspaceName("");
//       setWorkspaceSubject("");
//       setWorkspaceDescription("");
//       setIsModalOpen(false);

//       await fetchWorkspaces();
//     } catch (error: any) {
//       console.error(
//         "Failed to create workspace:",
//         error,
//       );

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to create classroom.";

//       addToast(message, "error");
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     if (createLoading) {
//       return;
//     }

//     setIsModalOpen(false);
//     setWorkspaceName("");
//     setWorkspaceSubject("");
//     setWorkspaceDescription("");
//   };

//   const normalizedSearchTerm =
//     searchTerm.trim().toLowerCase();

//   const filteredWorkspaces =
//     workspaces.filter((workspace) => {
//       const name =
//         workspace.name?.toLowerCase() || "";

//       const subject =
//         workspace.subject?.toLowerCase() || "";

//       const description =
//         workspace.description?.toLowerCase() ||
//         "";

//       return (
//         name.includes(normalizedSearchTerm) ||
//         subject.includes(
//           normalizedSearchTerm,
//         ) ||
//         description.includes(
//           normalizedSearchTerm,
//         )
//       );
//     });

//   const totalStudentsEnrolled =
//     workspaces.reduce(
//       (total, workspace) =>
//         total +
//         (workspace.enrolledStudentCount ??
//           0),
//       0,
//     );

//   return (
//     <div className="space-y-6">
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{
//           duration: 0.4,
//           ease: "easeOut",
//         }}
//         className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60"
//       >
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
//             Welcome back,{" "}
//             {user?.name || "Teacher"}
//           </h1>

//           <p className="mt-1 text-xs text-zinc-400 font-normal">
//             Manage your virtual classrooms,
//             syllabus files, assignments, and
//             student submissions.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() =>
//             setIsModalOpen(true)
//           }
//           id="create_classroom_btn"
//           className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-98"
//         >
//           <Plus className="w-4 h-4" />

//           Create Classroom
//         </button>
//       </motion.div>

//       <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             duration: 0.4,
//             ease: "easeOut",
//             delay: 0.05,
//           }}
//           className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-3.5"
//         >
//           <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 flex items-center justify-center shrink-0">
//             <BookOpen className="w-5 h-5" />
//           </div>

//           <div>
//             <div className="text-xl font-semibold text-zinc-100 font-mono">
//               {workspaces.length}
//             </div>

//             <div className="text-[11px] text-zinc-400 font-medium">
//               Active Classrooms
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             duration: 0.4,
//             ease: "easeOut",
//             delay: 0.1,
//           }}
//           className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-3.5"
//         >
//           <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
//             <Users className="w-5 h-5" />
//           </div>

//           <div>
//             <div className="text-xl font-semibold text-zinc-100 font-mono">
//               {totalStudentsEnrolled}
//             </div>

//             <div className="text-[11px] text-zinc-400 font-medium">
//               Enrolled Students
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{
//           duration: 0.4,
//           ease: "easeOut",
//           delay: 0.15,
//         }}
//         className="relative w-full max-w-md"
//       >
//         <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />

//         <input
//           type="text"
//           placeholder="Filter classrooms by title or subject..."
//           className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors text-zinc-100"
//           value={searchTerm}
//           onChange={(event) =>
//             setSearchTerm(
//               event.target.value,
//             )
//           }
//         />
//       </motion.div>

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
//           {[1, 2, 3].map((item) => (
//             <div
//               key={item}
//               className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3 animate-pulse"
//             >
//               <div className="h-5 bg-zinc-800 rounded w-3/4" />

//               <div className="h-3 bg-zinc-800 rounded w-1/2" />

//               <div className="h-8 bg-zinc-800/60 rounded-lg" />
//             </div>
//           ))}
//         </div>
//       ) : filteredWorkspaces.length ===
//         0 ? (
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl p-10 text-center max-w-md mx-auto"
//         >
//           <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 mx-auto mb-3">
//             <BookOpen className="w-6 h-6" />
//           </div>

//           <h3 className="text-sm font-medium text-zinc-200">
//             No classrooms found
//           </h3>

//           <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
//             {searchTerm
//               ? "Refine your search terms to locate your classroom."
//               : "Create your first virtual classroom to get started."}
//           </p>

//           {!searchTerm && (
//             <button
//               type="button"
//               onClick={() =>
//                 setIsModalOpen(true)
//               }
//               className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all cursor-pointer"
//             >
//               <PlusCircle className="w-4 h-4" />

//               Create Classroom
//             </button>
//           )}
//         </motion.div>
//       ) : (
//         <div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//           id="workspaces_grid"
//         >
//           {filteredWorkspaces.map(
//             (workspace, index) => (
//               <motion.div
//                 key={workspace.id}
//                 initial={{
//                   opacity: 0,
//                   y: 12,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 transition={{
//                   duration: 0.4,
//                   ease: "easeOut",
//                   delay:
//                     0.15 +
//                     index * 0.05,
//                 }}
//                 className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 shadow-xs rounded-xl p-5 transition-all flex flex-col justify-between group"
//               >
//                 <div>
//                   <div className="flex items-start justify-between gap-3 mb-2.5">
//                     <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 rounded">
//                       {workspace.subject}
//                     </span>

//                     <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
//                       <Users className="w-3.5 h-3.5 text-zinc-500" />

//                       <span>
//                         {workspace.enrolledStudentCount ??
//                           0}{" "}
//                         enrolled
//                       </span>
//                     </div>
//                   </div>

//                   <h3 className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
//                     <Link
//                       to={`/workspace/${workspace.id}`}
//                       id={`workspace-card-link-${workspace.id}`}
//                       className="flex items-center justify-between"
//                     >
//                       <span>
//                         {workspace.name}
//                       </span>

//                       <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" />
//                     </Link>
//                   </h3>

//                   {workspace.description && (
//                     <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
//                       {
//                         workspace.description
//                       }
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-3 mt-5">
//                   <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg px-3 py-2 flex items-center justify-between">
//                     <div>
//                       <span className="block text-[9px] text-zinc-500 uppercase font-mono leading-none mb-0.5">
//                         Class Join Code
//                       </span>

//                       <span className="text-xs font-mono font-semibold text-zinc-200">
//                         {workspace.joinCode}
//                       </span>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleCopyCode(
//                           workspace.joinCode,
//                         )
//                       }
//                       id={`copy-code-btn-${workspace.id}`}
//                       className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
//                       title="Copy Join Code"
//                     >
//                       {copiedCodeStr ===
//                       workspace.joinCode ? (
//                         <Check className="w-3.5 h-3.5 text-emerald-400" />
//                       ) : (
//                         <Copy className="w-3.5 h-3.5" />
//                       )}
//                     </button>
//                   </div>

//                   <Link
//                     to={`/workspace/${workspace.id}`}
//                     className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-medium border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors group-hover:border-zinc-700"
//                   >
//                     Enter Workspace
//                   </Link>
//                 </div>
//               </motion.div>
//             ),
//           )}
//         </div>
//       )}

//       <AnimatePresence>
//         {isModalOpen && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             id="create_modal"
//           >
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-md"
//               onClick={handleCloseModal}
//             />

//             <motion.div
//               initial={{
//                 scale: 0.98,
//                 opacity: 0,
//                 y: 10,
//               }}
//               animate={{
//                 scale: 1,
//                 opacity: 1,
//                 y: 0,
//               }}
//               exit={{
//                 scale: 0.98,
//                 opacity: 0,
//                 y: 10,
//               }}
//               transition={{ duration: 0.2 }}
//               className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 w-full max-w-md relative z-10"
//             >
//               <h3 className="text-base font-semibold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
//                 Create New Classroom
//               </h3>

//               <p className="text-zinc-400 text-xs mt-1">
//                 Establish a virtual classroom
//                 for homework and resource
//                 sharing.
//               </p>

//               <form
//                 onSubmit={
//                   handleCreateWorkspace
//                 }
//                 className="space-y-4 mt-5"
//               >
//                 <div>
//                   <label
//                     className="block text-xs font-medium text-zinc-300 mb-1.5"
//                     htmlFor="ws-name"
//                   >
//                     Classroom Title
//                   </label>

//                   <input
//                     id="ws-name"
//                     type="text"
//                     required
//                     maxLength={100}
//                     placeholder="e.g. Advanced Java"
//                     className="block w-full px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 focus:bg-zinc-900/80 transition-all"
//                     value={workspaceName}
//                     onChange={(event) =>
//                       setWorkspaceName(
//                         event.target.value,
//                       )
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label
//                     className="block text-xs font-medium text-zinc-300 mb-1.5"
//                     htmlFor="ws-subject"
//                   >
//                     Subject Field
//                   </label>

//                   <input
//                     id="ws-subject"
//                     type="text"
//                     required
//                     maxLength={100}
//                     placeholder="e.g. Computer Science"
//                     className="block w-full px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 focus:bg-zinc-900/80 transition-all"
//                     value={workspaceSubject}
//                     onChange={(event) =>
//                       setWorkspaceSubject(
//                         event.target.value,
//                       )
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label
//                     className="block text-xs font-medium text-zinc-300 mb-1.5"
//                     htmlFor="ws-description"
//                   >
//                     Description
//                     <span className="text-zinc-500 ml-1">
//                       (optional)
//                     </span>
//                   </label>

//                   <textarea
//                     id="ws-description"
//                     rows={3}
//                     maxLength={500}
//                     placeholder="Add a short description about this classroom..."
//                     className="block w-full px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 focus:bg-zinc-900/80 transition-all resize-none"
//                     value={
//                       workspaceDescription
//                     }
//                     onChange={(event) =>
//                       setWorkspaceDescription(
//                         event.target.value,
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="flex gap-2 justify-end pt-3">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     disabled={createLoading}
//                     className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     id="modal_create_submit_btn"
//                     disabled={createLoading}
//                     className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {createLoading ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Plus className="w-4 h-4" />

//                         Create Class
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

import React, {
  useEffect,
  useMemo,
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
  Check,
  Copy,
  GraduationCap,
  Plus,
  PlusCircle,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [workspaces, setWorkspaces] = useState<
    WorkspaceResponse[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [workspaceSubject, setWorkspaceSubject] =
    useState("");

  const [
    workspaceDescription,
    setWorkspaceDescription,
  ] = useState("");

  const [createLoading, setCreateLoading] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [copiedCodeStr, setCopiedCodeStr] =
    useState<string | null>(null);

  const fetchWorkspaces = async (): Promise<void> => {
    setLoading(true);

    try {
      const data =
        await workspaceApi.getMyWorkspaces();

      setWorkspaces(
        Array.isArray(data) ? data : [],
      );
    } catch (error: any) {
      console.error(
        "Failed to fetch teacher workspaces:",
        error,
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load workspaces.";

      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchWorkspaces();
  }, []);

  const handleCopyCode = async (
    code: string,
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCodeStr(code);

      addToast(
        `Join code "${code}" copied to clipboard!`,
        "success",
      );

      window.setTimeout(() => {
        setCopiedCodeStr(null);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to copy join code:",
        error,
      );

      addToast(
        "Failed to copy code. Try copying it manually.",
        "error",
      );
    }
  };

  const handleCreateWorkspace = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedName =
      workspaceName.trim();

    const trimmedSubject =
      workspaceSubject.trim();

    const trimmedDescription =
      workspaceDescription.trim();

    if (!trimmedName || !trimmedSubject) {
      addToast(
        "Please provide both a classroom name and subject.",
        "warning",
      );

      return;
    }

    setCreateLoading(true);

    try {
      const newWorkspace =
        await workspaceApi.createWorkspace({
          name: trimmedName,
          subject: trimmedSubject,
          description: trimmedDescription,
        });

      addToast(
        `Classroom "${newWorkspace.name}" created successfully!`,
        "success",
      );

      setWorkspaceName("");
      setWorkspaceSubject("");
      setWorkspaceDescription("");
      setIsModalOpen(false);

      await fetchWorkspaces();
    } catch (error: any) {
      console.error(
        "Failed to create workspace:",
        error,
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create classroom.";

      addToast(message, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    if (createLoading) {
      return;
    }

    setIsModalOpen(false);
    setWorkspaceName("");
    setWorkspaceSubject("");
    setWorkspaceDescription("");
  };

  const filteredWorkspaces = useMemo(() => {
    const normalizedSearchTerm =
      searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return workspaces;
    }

    return workspaces.filter((workspace) => {
      const name =
        workspace.name?.toLowerCase() || "";

      const subject =
        workspace.subject?.toLowerCase() || "";

      const description =
        workspace.description?.toLowerCase() ||
        "";

      return (
        name.includes(normalizedSearchTerm) ||
        subject.includes(
          normalizedSearchTerm,
        ) ||
        description.includes(
          normalizedSearchTerm,
        )
      );
    });
  }, [searchTerm, workspaces]);

  const totalStudentsEnrolled = useMemo(
    () =>
      workspaces.reduce(
        (total, workspace) =>
          total +
          (workspace.enrolledStudentCount ??
            0),
        0,
      ),
    [workspaces],
  );

  const firstName =
    user?.name?.trim().split(" ")[0] ||
    "Teacher";

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome section */}
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
  className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-xl"
>
  {/* Subtle blueprint grid */}
  <div className="pointer-events-none absolute inset-0 opacity-30">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(9,9,11,0.78)_85%)]" />
  </div>

  {/* Purple glow */}
  <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#A855F7]/15 blur-[90px]" />

  <div className="pointer-events-none absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-purple-700/10 blur-[100px]" />

  {/* Content */}
  <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="max-w-2xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#A855F7]/20 bg-[#A855F7]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-purple-300">
        <Sparkles className="h-3 w-3 text-[#A855F7]" />

        Teaching Dashboard
      </div>

      <h1 className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
        Welcome back, {firstName}

        <span
          className="ml-2 inline-block"
          role="img"
          aria-label="Waving hand"
        >
          👋
        </span>
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        Manage your classrooms, share learning resources, create assignments,
        and monitor student progress from one place.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      id="create_classroom_btn"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-[#A855F7] to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(168,85,247,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-500 hover:to-purple-700 hover:shadow-[0_16px_42px_rgba(168,85,247,0.38)] active:translate-y-0"
    >
      <Plus className="h-4 w-4" />

      Create Classroom
    </button>
  </div>
</motion.section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            delay: 0.08,
          }}
          whileHover={{
            y: -3,
          }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 backdrop-blur-xl transition-colors hover:border-[#A855F7]/35"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#A855F7]/10 blur-[55px]" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400">
                Active Classrooms
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                {workspaces.length}
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">
                Classrooms currently managed
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A855F7]/25 bg-[#A855F7]/10 text-[#C084FC] transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="h-5 w-5" />
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
            delay: 0.14,
          }}
          whileHover={{
            y: -3,
          }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 backdrop-blur-xl transition-colors hover:border-emerald-500/30"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-[55px]" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400">
                Enrolled Students
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                {totalStudentsEnrolled}
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">
                Students across all classrooms
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Workspaces heading and search */}
      <motion.section
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
          delay: 0.18,
        }}
        className="space-y-5"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              My Classrooms
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Open a classroom to manage
              resources, assignments, members,
              and submissions.
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search classrooms..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 py-3 pl-10 pr-4 text-sm text-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.25)] outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-600 focus:border-[#A855F7] focus:bg-zinc-900 focus:ring-4 focus:ring-[#A855F7]/20"              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/10 bg-zinc-950/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 rounded bg-zinc-800" />
                  <div className="h-5 w-16 rounded bg-zinc-800" />
                </div>

                <div className="mt-5 h-6 w-2/3 rounded bg-zinc-800" />

                <div className="mt-3 h-3 w-full rounded bg-zinc-800/70" />

                <div className="mt-2 h-3 w-4/5 rounded bg-zinc-800/70" />

                <div className="mt-6 h-14 rounded-xl bg-zinc-900" />

                <div className="mt-4 h-10 rounded-xl bg-zinc-800/70" />
              </div>
            ))}
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="mx-auto max-w-xl rounded-2xl border border-dashed border-white/15 bg-zinc-950/35 px-6 py-14 text-center backdrop-blur-xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#A855F7]/20 bg-[#A855F7]/10 text-[#C084FC]">
              {searchTerm ? (
                <Search className="h-6 w-6" />
              ) : (
                <GraduationCap className="h-7 w-7" />
              )}
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              {searchTerm
                ? "No matching classrooms"
                : "Start your first classroom"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
              {searchTerm
                ? "Try searching with a different classroom name, subject, or description."
                : "Create a classroom, invite students with a join code, and begin sharing assignments and resources."}
            </p>

            {!searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(true)
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#A855F7] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_28px_rgba(168,85,247,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#9333EA]"
              >
                <PlusCircle className="h-4 w-4" />

                Create Classroom
              </button>
            )}
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            id="workspaces_grid"
          >
            {filteredWorkspaces.map(
              (workspace, index) => (
                <motion.article
  key={workspace.id}
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.45,
    delay: 0.2 + index * 0.05,
    ease: [0.22, 1, 0.36, 1],
  }}
  whileHover={{
    y: -6,
    scale: 1.015,
  }}
  className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/55 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-colors duration-300 hover:border-[#A855F7]/40 hover:shadow-[0_22px_60px_rgba(168,85,247,0.12)]"
>
  {/* Top gradient line */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  {/* Decorative background glows */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#A855F7]/12 blur-[65px] transition-all duration-500 group-hover:bg-[#A855F7]/20" />

  <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-[70px]" />

  <div className="relative z-10 flex flex-1 flex-col">
    {/* Subject and students */}
    <div className="flex items-start justify-between gap-3">
      <span className="inline-flex max-w-[65%] items-center gap-1.5 rounded-full border border-[#A855F7]/25 bg-[#A855F7]/10 px-2.5 py-1 text-[10px] font-semibold text-purple-200">
        <BookOpen className="h-3 w-3 shrink-0 text-[#C084FC]" />

        <span className="truncate">
          {workspace.subject}
        </span>
      </span>

      <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1 text-[10px] font-medium text-zinc-400">
        <Users className="h-3 w-3 text-emerald-400" />

        <span>
          {workspace.enrolledStudentCount ?? 0}
        </span>

        <span className="hidden sm:inline">
          students
        </span>
      </div>
    </div>

    {/* Workspace information */}
    <Link
      to={`/workspace/${workspace.id}`}
      id={`workspace-card-link-${workspace.id}`}
      className="mt-5 block"
    >
      <h3 className="flex items-start justify-between gap-3 text-xl font-bold tracking-[-0.025em] text-zinc-100 transition-colors duration-300 group-hover:text-white">
        <span className="line-clamp-2">
          {workspace.name}
        </span>

        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#A855F7] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
      </h3>
    </Link>

    <p className="mt-3 min-h-[48px] line-clamp-2 text-xs leading-6 text-zinc-500">
      {workspace.description ||
        "A collaborative classroom for sharing resources, assignments, submissions, and student updates."}
    </p>

    <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    {/* Join code */}
    <div className="mt-auto rounded-xl border border-white/10 bg-black/25 p-3.5 transition-colors duration-300 group-hover:border-white/15">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Class join code
          </span>

          <span className="mt-1.5 block truncate font-mono text-base font-semibold tracking-[0.18em] text-zinc-200">
            {workspace.joinCode}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            handleCopyCode(workspace.joinCode)
          }
          id={`copy-code-btn-${workspace.id}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold text-zinc-400 transition-all duration-200 hover:border-[#A855F7]/35 hover:bg-[#A855F7]/10 hover:text-purple-200"
          title="Copy join code"
        >
          {copiedCodeStr === workspace.joinCode ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>

    {/* Open workspace */}
    <Link
      to={`/workspace/${workspace.id}`}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#A855F7]/20 bg-[#A855F7]/8 px-4 py-2.5 text-xs font-semibold text-purple-100 transition-all duration-200 hover:border-[#A855F7]/45 hover:bg-[#A855F7]/15 hover:text-white"
    >
      Enter Workspace

      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  </div>
</motion.article>
              ),
            )}
          </div>
        )}
      </motion.section>

      {/* Create classroom modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            id="create_modal"
          >
            <motion.button
              type="button"
              aria-label="Close modal"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 cursor-default bg-black/70 backdrop-blur-md"
              onClick={handleCloseModal}
            />

            <motion.div
              initial={{
                scale: 0.96,
                opacity: 0,
                y: 18,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.96,
                opacity: 0,
                y: 18,
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#A855F7]/15 blur-[75px]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#A855F7]/25 bg-[#A855F7]/10 text-[#C084FC]">
                      <Plus className="h-5 w-5" />
                    </div>

                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      Create New Classroom
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Create a workspace for
                      assignments, resources,
                      submissions, and student
                      collaboration.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={createLoading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form
                  onSubmit={
                    handleCreateWorkspace
                  }
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium text-zinc-300"
                      htmlFor="ws-name"
                    >
                      Classroom Title
                    </label>

                    <input
                      id="ws-name"
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g. Advanced Java"
                      className="block w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2.5 text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-[#A855F7]/60 focus:ring-4 focus:ring-[#A855F7]/10"
                      value={workspaceName}
                      onChange={(event) =>
                        setWorkspaceName(
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium text-zinc-300"
                      htmlFor="ws-subject"
                    >
                      Subject
                    </label>

                    <input
                      id="ws-subject"
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g. Computer Science"
                      className="block w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2.5 text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-[#A855F7]/60 focus:ring-4 focus:ring-[#A855F7]/10"
                      value={workspaceSubject}
                      onChange={(event) =>
                        setWorkspaceSubject(
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium text-zinc-300"
                      htmlFor="ws-description"
                    >
                      Description

                      <span className="ml-1 font-normal text-zinc-600">
                        (optional)
                      </span>
                    </label>

                    <textarea
                      id="ws-description"
                      rows={4}
                      maxLength={500}
                      placeholder="Add a short description about this classroom..."
                      className="block w-full resize-none rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2.5 text-xs leading-5 text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-[#A855F7]/60 focus:ring-4 focus:ring-[#A855F7]/10"
                      value={
                        workspaceDescription
                      }
                      onChange={(event) =>
                        setWorkspaceDescription(
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={createLoading}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      id="modal_create_submit_btn"
                      disabled={createLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#A855F7] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_28px_rgba(168,85,247,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#9333EA] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {createLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />

                          Create Classroom
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};