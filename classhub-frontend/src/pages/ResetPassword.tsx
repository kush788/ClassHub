// import React, { useState } from "react";
// import {
//   Link,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import {
//   ArrowLeft,
//   KeyRound,
//   Lock,
//   Mail,
// } from "lucide-react";

// import { motion } from "motion/react";

// import { authApi } from "../api/authApi";
// import { BrandLogo } from "../components/BrandLogo";
// import { useToast } from "../context/ToastContext";

// interface ResetPasswordLocationState {
//   email?: string;
// }

// function getErrorMessage(error: unknown): string {
//   if (
//     typeof error === "object" &&
//     error !== null &&
//     "response" in error
//   ) {
//     const response = (
//       error as {
//         response?: {
//           data?: {
//             message?: string;
//             error?: string;
//           };
//         };
//       }
//     ).response;

//     return (
//       response?.data?.message ||
//       response?.data?.error ||
//       "Password reset failed."
//     );
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return "Password reset failed.";
// }

// export const ResetPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToast } = useToast();

//   const state =
//     location.state as
//       | ResetPasswordLocationState
//       | null;

//   const [email, setEmail] = useState(
//     state?.email || "",
//   );

//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] =
//     useState("");
//   const [
//     confirmPassword,
//     setConfirmPassword,
//   ] = useState("");

//   const [loading, setLoading] =
//     useState(false);
//   const [errorMsg, setErrorMsg] =
//     useState("");

//   const handleSubmit = async (
//     event: React.FormEvent,
//   ) => {
//     event.preventDefault();

//     if (
//       !email.trim() ||
//       !otp.trim() ||
//       !newPassword ||
//       !confirmPassword
//     ) {
//       setErrorMsg(
//         "Please fill in all fields.",
//       );
//       return;
//     }

//     if (newPassword.length < 8) {
//       setErrorMsg(
//         "Password must be at least 8 characters.",
//       );
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setErrorMsg(
//         "Passwords do not match.",
//       );
//       return;
//     }

//     setErrorMsg("");
//     setLoading(true);

//     try {
//       const response =
//         await authApi.resetPassword({
//           email: email.trim(),
//           otp: otp.trim(),
//           newPassword,
//         });

//       addToast(
//         response.message ||
//           "Password reset successfully.",
//         "success",
//       );

//       navigate("/login", {
//         replace: true,
//       });
//     } catch (error) {
//       const message =
//         getErrorMessage(error);

//       setErrorMsg(message);
//       addToast(message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
//       <div className="fixed inset-0 pointer-events-none">
//         <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px]" />
//         <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-sky-500/15 blur-[130px]" />
//       </div>

//       <header className="relative z-10 border-b border-white/10 bg-zinc-950/60 backdrop-blur-xl py-3.5 px-6 sm:px-12 flex items-center justify-between">
//         <Link to="/">
//           <BrandLogo size="md" showSubtitle />
//         </Link>

//         <Link
//           to="/login"
//           className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
//         >
//           <ArrowLeft className="w-3.5 h-3.5" />
//           Back to sign in
//         </Link>
//       </header>

//       <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8"
//         >
//           <div className="mb-6">
//             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
//               <KeyRound className="w-5 h-5 text-indigo-400" />
//             </div>

//             <h1 className="text-xl font-semibold">
//               Reset password
//             </h1>

//             <p className="mt-1 text-xs text-zinc-400">
//               Enter the OTP from your email and
//               create a new password.
//             </p>
//           </div>

//           {errorMsg && (
//             <div className="mb-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs px-3.5 py-2.5 rounded-lg">
//               {errorMsg}
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//             className="space-y-4"
//           >
//             <div>
//               <label className="block text-xs font-medium text-zinc-300 mb-1.5">
//                 Email address
//               </label>

//               <div className="relative">
//                 <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />

//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(event) =>
//                     setEmail(event.target.value)
//                   }
//                   className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-zinc-300 mb-1.5">
//                 Reset OTP
//               </label>

//               <div className="relative">
//                 <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />

//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={6}
//                   required
//                   value={otp}
//                   onChange={(event) =>
//                     setOtp(
//                       event.target.value.replace(
//                         /\D/g,
//                         "",
//                       ),
//                     )
//                   }
//                   placeholder="Enter 6-digit OTP"
//                   className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs tracking-[0.25em] focus:outline-none focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-zinc-300 mb-1.5">
//                 New password
//               </label>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />

//                 <input
//                   type="password"
//                   required
//                   value={newPassword}
//                   onChange={(event) =>
//                     setNewPassword(
//                       event.target.value,
//                     )
//                   }
//                   placeholder="At least 8 characters"
//                   className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-zinc-300 mb-1.5">
//                 Confirm password
//               </label>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />

//                 <input
//                   type="password"
//                   required
//                   value={confirmPassword}
//                   onChange={(event) =>
//                     setConfirmPassword(
//                       event.target.value,
//                     )
//                   }
//                   placeholder="Enter password again"
//                   className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50"
//             >
//               {loading
//                 ? "Resetting password..."
//                 : "Reset password"}
//             </button>
//           </form>
//         </motion.div>
//       </main>
//     </div>
//   );
// };

import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  KeyRound,
  Lock,
  Mail,
} from "lucide-react";

import { motion } from "motion/react";
import { DarkGradientBg } from "../components/DarkGradientBg";
import { authApi } from "../api/authApi";
import { BrandLogo } from "../components/BrandLogo";
import { useToast } from "../context/ToastContext";
import SpecularButton from "../components/SpecularButton";

interface ResetPasswordLocationState {
  email?: string;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.message ||
      response?.data?.error ||
      "Password reset failed."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Password reset failed.";
}

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const state =
    location.state as
      | ResetPasswordLocationState
      | null;

  const [email, setEmail] = useState(
    state?.email || "",
  );

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (
      !email.trim() ||
      !otp.trim() ||
      !newPassword ||
      !confirmPassword
    ) {
      setErrorMsg(
        "Please fill in all fields.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg(
        "Password must be at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(
        "Passwords do not match.",
      );
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const response =
        await authApi.resetPassword({
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        });

      addToast(
        response.message ||
          "Password reset successfully.",
        "success",
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      const message =
        getErrorMessage(error);

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

      <header className="relative z-10 border-b border-white/10 bg-zinc-950/60 backdrop-blur-xl py-3.5 px-6 sm:px-12 flex items-center justify-between">

        <Link to="/">
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
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
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
          className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.12)]">
              <KeyRound className="w-5 h-5 text-[#A855F7]" />
            </div>

            <h1 className="text-xl font-semibold bg-gradient-to-r from-white via-zinc-100 to-purple-200 bg-clip-text text-transparent">
              Reset password
            </h1>

            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Enter the OTP from your email and
              create a new password.
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
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email address
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Mail className="w-4 h-4" />
                </span>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                />
              </div>
            </div>

            {/* OTP */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Reset OTP
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <KeyRound className="w-4 h-4" />
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs tracking-[0.25em] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                New password
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Lock className="w-4 h-4" />
                </span>

                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value,
                    )
                  }
                  placeholder="At least 8 characters"
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] transition-all duration-300"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Confirm password
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Lock className="w-4 h-4" />
                </span>

                <input
                  type="password"
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

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#A855F7] hover:bg-[#9333EA] border-t border-white/20 rounded-xl shadow-[0_8px_24px_rgba(168,85,247,0.28)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Reset password
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-zinc-500">
            Remember your password?{" "}
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