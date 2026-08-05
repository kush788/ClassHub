import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Mail,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type ToastType = "success" | "error" | "info" | "warning" | "email";

export interface EmailToastMeta {
  senderName: string;
  senderEmail: string;
  workspaceName: string;
  subject: string;
  body?: string;
  actionUrl?: string;
  onActionClick?: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  emailMeta?: EmailToastMeta;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  addEmailToast: (meta: EmailToastMeta) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast],
  );

  const addEmailToast = useCallback(
    (meta: EmailToastMeta) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [
        ...prev,
        {
          id,
          message: meta.subject,
          type: "email",
          emailMeta: meta,
        },
      ]);

      // Keep email notification toasts visible slightly longer (7 seconds)
      setTimeout(() => {
        removeToast(id);
      }, 7000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, addEmailToast, removeToast }}>
      {children}

      {/* Toast Portal/Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            if (toast.type === "email" && toast.emailMeta) {
              const meta = toast.emailMeta;
              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 25, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.92 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#0b101d] border border-indigo-500/40 shadow-2xl shadow-indigo-950/80 rounded-2xl p-4 pointer-events-auto backdrop-blur-xl relative overflow-hidden"
                  role="alert"
                  id={`email-toast-${toast.id}`}
                >
                  {/* Subtle top indicator border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600" />

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center shrink-0 text-indigo-300 mt-0.5">
                      <Mail className="w-5 h-5 animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-950 border border-indigo-800/60 rounded text-[9px] font-extrabold uppercase tracking-wider text-indigo-300">
                          📧 Email Alert
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          in{" "}
                          <strong className="text-slate-200">
                            {meta.workspaceName}
                          </strong>
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-white leading-snug line-clamp-1">
                        {meta.subject}
                      </h4>

                      <p className="text-[11px] text-slate-300 font-medium mt-1 leading-normal line-clamp-2">
                        {meta.body ||
                          `From ${meta.senderName} (${meta.senderEmail})`}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {meta.senderEmail}
                        </span>

                        {meta.onActionClick && (
                          <button
                            type="button"
                            onClick={() => {
                              meta.onActionClick?.();
                              removeToast(toast.id);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white transition-colors"
                          >
                            View Workspace <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeToast(toast.id)}
                      className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-900"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            }

            // Standard Toast Notifications
            let icon = (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 18,
                  delay: 0.08,
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </motion.div>
            );

            let bgClass =
              "border-emerald-500/30 bg-[#090d16] text-slate-100 shadow-[0_18px_55px_rgba(16,185,129,0.16)]";

            let progressClass =
              "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400";

            if (toast.type === "error") {
              icon = (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10"
                >
                  <XCircle className="h-5 w-5 text-rose-400" />
                </motion.div>
              );

              bgClass =
                "border-rose-500/30 bg-[#090d16] text-slate-100 shadow-[0_18px_55px_rgba(244,63,94,0.14)]";

              progressClass =
                "bg-gradient-to-r from-rose-500 via-rose-400 to-red-400";
            } else if (toast.type === "warning") {
              icon = (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </motion.div>
              );

              bgClass =
                "border-amber-500/30 bg-[#090d16] text-slate-100 shadow-[0_18px_55px_rgba(245,158,11,0.14)]";

              progressClass =
                "bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-400";
            } else if (toast.type === "info") {
              icon = (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10"
                >
                  <Info className="h-5 w-5 text-indigo-400" />
                </motion.div>
              );

              bgClass =
                "border-indigo-500/30 bg-[#090d16] text-slate-100 shadow-[0_18px_55px_rgba(99,102,241,0.16)]";

              progressClass =
                "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500";
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 45, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 35, scale: 0.94 }}
                transition={{
                  type: "spring",
                  stiffness: 330,
                  damping: 26,
                }}
                className={`relative overflow-hidden rounded-2xl border p-4 pointer-events-auto backdrop-blur-xl ${bgClass}`}
                role="alert"
                id={`toast-${toast.id}`}
              >
                <div className="flex items-center gap-3">
                  {icon}

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {toast.type === "success"
                        ? "Action completed"
                        : toast.type === "error"
                          ? "Something went wrong"
                          : toast.type === "warning"
                            ? "Please check"
                            : "Information"}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-100">
                      {toast.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-900 hover:text-slate-300"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{
                    duration: 4.5,
                    ease: "linear",
                  }}
                  className={`absolute bottom-0 left-0 h-1 w-full origin-left ${progressClass}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
