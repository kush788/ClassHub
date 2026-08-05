import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle } from "lucide-react";

import { loadingStore } from "../api/loadingStore";

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined,
);

export const LoadingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingStore.subscribe(setIsLoading);

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
    }),
    [isLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 top-0 z-[100]"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="h-1 origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_18px_rgba(139,92,246,0.8)]"
            />

            <div className="absolute right-5 top-4 flex items-center gap-2 rounded-xl border border-violet-500/20 bg-zinc-950/90 px-3 py-2 text-xs font-semibold text-zinc-200 shadow-xl backdrop-blur-xl">
              <LoaderCircle className="h-4 w-4 animate-spin text-violet-400" />
              Loading
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error(
      "useLoading must be used inside LoadingProvider",
    );
  }

  return context;
};