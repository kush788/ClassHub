import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { BrandLogo } from "../components/BrandLogo";
import SoftBlurIn from "../components/smoothui/soft-blur-in";
import SpecularButton from "../components/SpecularButton";

import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  BookOpen,
  FileText,
} from "lucide-react";

import {
  motion,
  type Variants,
} from "motion/react";
import { DarkGradientBg } from "../components/DarkGradientBg";

interface LoginLocationState {
  email?: string;
  verified?: boolean;
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const locationState =
    location.state as LoginLocationState | null;

  const [email, setEmail] = useState(
    locationState?.email ?? "",
  );

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg(
        "Please fill in all fields.",
      );
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const loggedInUser =
        await login(
          trimmedEmail,
          password,
        );

      addToast(
        "Successfully authenticated. Welcome back!",
        "success",
      );

      navigate(
        loggedInUser.role === "TEACHER"
          ? "/teacher/dashboard"
          : "/student/dashboard",
        {
          replace: true,
        },
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Authentication failed. Please check your credentials.";

      setErrorMsg(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const heroContainerVariants: Variants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const heroItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.5,
        ease: [
          0.21,
          0.47,
          0.32,
          0.98,
        ],
      },
    },
  };

  return (
  <DarkGradientBg intensity="medium">
    <div className="relative min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-purple-500/20 selection:text-purple-200 overflow-x-hidden">


      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/60 backdrop-blur-xl py-3.5 px-6 sm:px-12 flex items-center justify-between">
        <Link
          to="/"
          className="inline-block"
        >
          <BrandLogo
            size="md"
            showSubtitle
          />
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-zinc-400">
            Don't have an account?
          </span>

          <SpecularButton
            size="sm"
            radius={18}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#f5f5f5"
            lineColor="#A855F7"
            baseColor="#525252"
            intensity={2.7}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={() =>
              navigate("/register")
            }
            className="min-w-[145px]"
          >
            <span className="flex items-center justify-center gap-2 text-xs font-medium">
              Create account

              <ArrowRight className="w-3.5 h-3.5 text-[#A855F7]" />
            </span>
          </SpecularButton>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          {/* Left column */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-8 text-left"
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                <SoftBlurIn
                  delay={150}
                  stagger={32}
                  className="block bg-gradient-to-r from-white via-zinc-100 to-purple-200 bg-clip-text text-transparent"
                >
                  Elevate Learning with
                </SoftBlurIn>

                <SoftBlurIn
                  delay={700}
                  stagger={45}
                  className="block bg-gradient-to-r from-white via-zinc-100 to-purple-300 bg-clip-text text-transparent"
                >
                  ClassHub
                </SoftBlurIn>
              </h1>

              <motion.p
                variants={heroItemVariants}
                className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal"
              >
                A unified digital classroom
                platform for modern educators
                and students. Distribute course
                materials, manage homework
                assignments, and track academic
                growth seamlessly.
              </motion.p>
            </div>

            <motion.div
              variants={heroItemVariants}
              className="space-y-3.5 pt-1"
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#A855F7]/40 hover:bg-white/[0.07] transition-all duration-300 shadow-lg shadow-black/20 group cursor-default"
              >
                <div className="p-2.5 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    Course Syllabus & Resource
                    Hub
                  </h4>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Publish lecture slides,
                    reading material, and
                    worksheets with instant
                    student notifications.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#A855F7]/40 hover:bg-white/[0.07] transition-all duration-300 shadow-lg shadow-black/20 group cursor-default"
              >
                <div className="p-2.5 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    Smart Assignment Tracker
                  </h4>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Submit homework, review
                    assignments, receive grades,
                    and track academic
                    performance.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Login panel */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="lg:col-span-6 w-full max-w-md mx-auto"
          >
            <div className="bg-zinc-950/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-left mb-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent tracking-tight">
                  Authenticate Account
                </h2>

                <p className="mt-1 text-xs text-zinc-400">
                  Enter your credentials to
                  access your virtual
                  classrooms.
                </p>
              </div>

              {locationState?.verified && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mb-4 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs font-medium px-3.5 py-2.5 rounded-lg"
                >
                  Email verified successfully.
                  You can now sign in.
                </motion.div>
              )}

              {errorMsg && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mb-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium px-3.5 py-2.5 rounded-lg backdrop-blur-md"
                >
                  {errorMsg}
                </motion.div>
              )}

              <form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                    htmlFor="email-input"
                  >
                    Email address
                  </label>

                  <div className="relative group/input">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                      <Mail className="w-4 h-4" />
                    </span>

                    <input
                      id="email-input"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className="block w-full pl-9 pr-3 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] focus:bg-zinc-900/80 transition-all duration-300"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="block text-xs font-medium text-zinc-300"
                      htmlFor="password-input"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-[#A855F7] hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative group/input">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                      <Lock className="w-4 h-4" />
                    </span>

                    <input
                      id="password-input"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••••••"
                      className="block w-full pl-9 pr-3 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] focus:bg-zinc-900/80 transition-all duration-300"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="login_submit_btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#A855F7] hover:bg-[#9333EA] border-t border-white/20 rounded-xl shadow-[0_8px_24px_rgba(168,85,247,0.28)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Authenticate Account
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-zinc-400">
                New to ClassHub?{" "}

                <Link
                  to="/register"
                  className="font-medium text-[#A855F7] hover:text-purple-300 transition-colors"
                >
                  Create an account
                </Link>
              </div>

              <div className="mt-3 text-center">
                <Link
                  to="/verify-otp"
                  state={{
                    email: email.trim(),
                  }}
                  className="text-[11px] text-zinc-500 hover:text-[#A855F7] transition-colors"
                >
                  Didn't verify your email?
                  Verify or resend OTP
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="border-t border-white/10 py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} ClassHub. All rights reserved.
      </footer>
    </div>
    </DarkGradientBg>
  );
};