import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { DarkGradientBg } from "../components/DarkGradientBg";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { BrandLogo } from "../components/BrandLogo";

import {
  GraduationCap,
  ArrowLeft,
  Mail,
  Lock,
  User,
  BookOpen,
} from "lucide-react";

import { motion } from "motion/react";
import SpecularButton from "../components/SpecularButton";

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] =
    useState<"TEACHER" | "STUDENT">(
      "STUDENT",
    );

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setErrorMsg(
        "Please fill in all fields.",
      );

      return;
    }

    if (password.length < 6) {
      setErrorMsg(
        "Password must be at least 6 characters.",
      );

      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        "Password and confirm password do not match.",
      );

      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const message = await register(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password,
        role,
      );

      addToast(
        message ||
          "Registration successful. Please verify your email.",
        "success",
      );

      navigate("/verify-otp", {
        state: {
          email: email.trim(),
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed.";

      setErrorMsg(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
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
    Already have an account?
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
    onClick={() => navigate("/login")}
    className="min-w-[170px]"
  >
    <span className="flex items-center justify-center gap-2 text-xs font-medium">
      <ArrowLeft className="w-3.5 h-3.5 text-[#A855F7]" />
      Back to Sign In
    </span>
  </SpecularButton>
</div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-10 flex items-center justify-center relative z-10">
        <motion.div
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
          className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative text-left mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-zinc-100 to-purple-200 bg-clip-text text-transparent tracking-tight">
              Create an account
            </h2>

            <p className="mt-1 text-xs text-zinc-400">
              Register and verify your email
              to access ClassHub.
            </p>
          </div>

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
              className="mb-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium px-3.5 py-2.5 rounded-lg"
            >
              {errorMsg}
            </motion.div>
          )}

          <form
            className="relative space-y-4"
            onSubmit={handleSubmit}
          >
            {/* Role */}
            <div>
              <span className="block text-xs font-medium text-zinc-300 mb-1.5">
                Account type
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setRole("STUDENT")
                  }
                  className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    role === "STUDENT"
                      ? "border-[#A855F7]/80 bg-[#A855F7]/10 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/[0.08] hover:border-[#A855F7]/30"
                  }`}
                >
                  <BookOpen
                    className={`w-4 h-4 mb-1 transition-colors ${
                      role === "STUDENT"
                        ? "text-[#A855F7]"
                        : "text-zinc-500"
                    }`}
                  />

                  <span className="block text-xs font-medium text-zinc-200">
                    Student
                  </span>

                  <span className="text-[10px] text-zinc-400">
                    Join classrooms and submit
                    assignments
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole("TEACHER")
                  }
                  className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    role === "TEACHER"
                      ? "border-[#A855F7]/80 bg-[#A855F7]/10 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/[0.08] hover:border-[#A855F7]/30"
                  }`}
                >
                  <GraduationCap
                    className={`w-4 h-4 mb-1 transition-colors ${
                      role === "TEACHER"
                        ? "text-[#A855F7]"
                        : "text-zinc-500"
                    }`}
                  />

                  <span className="block text-xs font-medium text-zinc-200">
                    Teacher
                  </span>

                  <span className="text-[10px] text-zinc-400">
                    Create and manage classrooms
                  </span>
                </button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="first-name-input"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  First name
                </label>

                <div className="relative group/input">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                    <User className="w-4 h-4" />
                  </span>

                  <input
                    id="first-name-input"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value,
                      )
                    }
                    placeholder="Enter Your First Name"
                    className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="last-name-input"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Last name
                </label>

                <div className="relative group/input">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                    <User className="w-4 h-4" />
                  </span>

                  <input
                    id="last-name-input"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value,
                      )
                    }
                    placeholder="Enter Your Last Name"
                    className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email-input"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Email address
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Mail className="w-4 h-4" />
                </span>

                <input
                  id="register-email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="xyz@example.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password-input"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Password
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Lock className="w-4 h-4" />
                </span>

                <input
                  id="register-password-input"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="At least 6 characters"
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm-password-input"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Confirm password
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Lock className="w-4 h-4" />
                </span>

                <input
                  id="confirm-password-input"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Enter password again"
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                />
              </div>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              id="register_submit_btn"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#A855F7] hover:bg-[#9333EA] border-t border-white/20 rounded-xl shadow-[0_8px_24px_rgba(168,85,247,0.28)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Register account"
              )}
            </button>
          </form>

          <div className="relative mt-5 text-center text-xs text-zinc-400">
            <span>
              Already have an account?{" "}
            </span>

            <Link
              to="/login"
              className="font-medium text-[#A855F7] hover:text-purple-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
    </DarkGradientBg>
  );
};