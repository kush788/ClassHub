import React from "react";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ConfirmDialogVariant = "danger" | "warning" | "default";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const confirmButtonClass =
    variant === "danger"
      ? "border-red-500/30 bg-red-500/15 text-red-200 hover:bg-red-500/25"
      : variant === "warning"
        ? "border-amber-400/30 bg-amber-400/15 text-amber-100 hover:bg-amber-400/25"
        : "border-indigo-400/30 bg-indigo-500/15 text-indigo-100 hover:bg-indigo-500/25";

  const iconClass =
    variant === "danger"
      ? "border-red-500/25 bg-red-500/10 text-red-400"
      : variant === "warning"
        ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
        : "border-indigo-400/25 bg-indigo-400/10 text-indigo-300";

  const handleBackdropClick = () => {
    if (!loading) {
      onCancel();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={handleBackdropClick}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 16,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            onMouseDown={(event) => event.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/10 blur-[70px]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconClass}`}
                >
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close confirmation dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {description}
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelText}
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${confirmButtonClass}`}
                >
                  {loading && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}

                  {loading ? "Please wait..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;