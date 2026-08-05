// import React, { useState } from "react";

// import {
//   Link,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import {
//   ArrowLeft,
//   KeyRound,
//   Mail,
//   RefreshCw,
// } from "lucide-react";

// import { motion } from "motion/react";

// import { authApi } from "../api/authApi";
// import { BrandLogo } from "../components/BrandLogo";
// import { useToast } from "../context/ToastContext";

// interface VerifyOtpLocationState {
//   email?: string;
// }

// function getErrorMessage(
//   error: unknown,
// ): string {
//   if (
//     typeof error === "object" &&
//     error !== null &&
//     "response" in error
//   ) {
//     const response =
//       (
//         error as {
//           response?: {
//             data?: {
//               message?: string;
//               error?: string;
//             };
//           };
//         }
//       ).response;

//     return (
//       response?.data?.message ||
//       response?.data?.error ||
//       "OTP verification failed."
//     );
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return "OTP verification failed.";
// }

// export const VerifyOtp: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToast } = useToast();

//   const locationState =
//     location.state as
//       | VerifyOtpLocationState
//       | null;

//   const [email, setEmail] =
//     useState(
//       locationState?.email || "",
//     );

//   const [otp, setOtp] =
//     useState("");

//   const [loading, setLoading] =
//     useState(false);

//   const [resending, setResending] =
//     useState(false);

//   const [errorMsg, setErrorMsg] =
//     useState("");

//   const handleVerify = async (
//     event: React.FormEvent,
//   ) => {
//     event.preventDefault();

//     if (!email.trim() || !otp.trim()) {
//       setErrorMsg(
//         "Email and OTP are required.",
//       );

//       return;
//     }

//     setErrorMsg("");
//     setLoading(true);

//     try {
//       const response =
//         await authApi.verifyOtp({
//           email: email.trim(),
//           otp: otp.trim(),
//         });

//       addToast(
//         response.message ||
//           "Email verified successfully.",
//         "success",
//       );

//       navigate("/login", {
//         replace: true,
//         state: {
//           email: email.trim(),
//           verified: true,
//         },
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

//   const handleResendOtp =
//     async () => {
//       if (!email.trim()) {
//         setErrorMsg(
//           "Enter your email address first.",
//         );

//         return;
//       }

//       setErrorMsg("");
//       setResending(true);

//       try {
//         const response =
//           await authApi.resendOtp({
//             email: email.trim(),
//           });

//         addToast(
//           response.message ||
//             "A new OTP has been sent.",
//           "success",
//         );
//       } catch (error) {
//         const message =
//           getErrorMessage(error);

//         setErrorMsg(message);
//         addToast(message, "error");
//       } finally {
//         setResending(false);
//       }
//     };

//   return (
//     <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
//       <div className="fixed inset-0 pointer-events-none">
//         <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px]" />
//         <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-sky-500/15 blur-[130px]" />
//       </div>

//       <header className="relative z-10 border-b border-white/10 bg-zinc-950/60 backdrop-blur-xl py-3.5 px-6 sm:px-12 flex items-center justify-between">
//         <Link to="/">
//           <BrandLogo
//             size="md"
//             showSubtitle
//           />
//         </Link>

//         <Link
//           to="/register"
//           className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
//         >
//           <ArrowLeft className="w-3.5 h-3.5" />
//           Back to registration
//         </Link>
//       </header>

//       <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 16,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8"
//         >
//           <div className="mb-6">
//             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
//               <KeyRound className="w-5 h-5 text-indigo-400" />
//             </div>

//             <h1 className="text-xl font-semibold">
//               Verify your email
//             </h1>

//             <p className="mt-1 text-xs text-zinc-400">
//               Enter the OTP sent to your
//               registered email address.
//             </p>
//           </div>

//           {errorMsg && (
//             <div className="mb-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs px-3.5 py-2.5 rounded-lg">
//               {errorMsg}
//             </div>
//           )}

//           <form
//             onSubmit={handleVerify}
//             className="space-y-4"
//           >
//             <div>
//               <label
//                 htmlFor="otp-email"
//                 className="block text-xs font-medium text-zinc-300 mb-1.5"
//               >
//                 Email address
//               </label>

//               <div className="relative">
//                 <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />

//                 <input
//                   id="otp-email"
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(event) =>
//                     setEmail(
//                       event.target.value,
//                     )
//                   }
//                   className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="otp-input"
//                 className="block text-xs font-medium text-zinc-300 mb-1.5"
//               >
//                 Verification OTP
//               </label>

//               <div className="relative">
//                 <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />

//                 <input
//                   id="otp-input"
//                   type="text"
//                   inputMode="numeric"
//                   required
//                   maxLength={6}
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

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50"
//             >
//               {loading
//                 ? "Verifying..."
//                 : "Verify account"}
//             </button>
//           </form>

//           <button
//             type="button"
//             onClick={handleResendOtp}
//             disabled={resending}
//             className="mt-4 w-full inline-flex items-center justify-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
//           >
//             <RefreshCw
//               className={`w-3.5 h-3.5 ${
//                 resending
//                   ? "animate-spin"
//                   : ""
//               }`}
//             />

//             {resending
//               ? "Sending OTP..."
//               : "Resend OTP"}
//           </button>

//           <div className="mt-5 text-center text-xs text-zinc-500">
//             Already verified?{" "}

//             <Link
//               to="/login"
//               className="text-indigo-400 hover:text-indigo-300"
//             >
//               Sign in
//             </Link>
//           </div>
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
  Mail,
  RefreshCw,
} from "lucide-react";

import { motion } from "motion/react";
import { DarkGradientBg } from "../components/DarkGradientBg";
import { authApi } from "../api/authApi";
import { BrandLogo } from "../components/BrandLogo";
import SpecularButton from "../components/SpecularButton";
import { useToast } from "../context/ToastContext";

interface VerifyOtpLocationState {
  email?: string;
}

const getErrorMessage = (
  error: unknown,
): string => {
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
      "OTP verification failed."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "OTP verification failed.";
};

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const locationState =
    location.state as
      | VerifyOtpLocationState
      | null;

  const [email, setEmail] = useState(
    locationState?.email ?? "",
  );

  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  const handleVerify = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) {
      setErrorMsg(
        "Email and OTP are required.",
      );
      return;
    }

    if (trimmedOtp.length !== 6) {
      setErrorMsg(
        "OTP must contain exactly 6 digits.",
      );
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const response =
        await authApi.verifyOtp({
          email: trimmedEmail,
          otp: trimmedOtp,
        });

      addToast(
        response.message ||
          "Email verified successfully.",
        "success",
      );

      navigate("/login", {
        replace: true,
        state: {
          email: trimmedEmail,
          verified: true,
        },
      });
    } catch (error: unknown) {
      const message =
        getErrorMessage(error);

      setErrorMsg(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp =
    async (): Promise<void> => {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setErrorMsg(
          "Enter your email address first.",
        );
        return;
      }

      setErrorMsg("");
      setResending(true);

      try {
        const response =
          await authApi.resendOtp({
            email: trimmedEmail,
          });

        addToast(
          response.message ||
            "A new OTP has been sent.",
          "success",
        );

        setOtp("");
      } catch (error: unknown) {
        const message =
          getErrorMessage(error);

        setErrorMsg(message);
        addToast(message, "error");
      } finally {
        setResending(false);
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
            Need to change your details?
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
            className="min-w-[190px]"
          >
            <span className="flex items-center justify-center gap-2 text-xs font-medium">
              <ArrowLeft className="w-3.5 h-3.5 text-[#A855F7]" />

              Back to Registration
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
          className="w-full max-w-md bg-zinc-950/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.12)]">
              <KeyRound className="w-5 h-5 text-[#A855F7]" />
            </div>

            <h1 className="text-xl font-semibold bg-gradient-to-r from-white via-zinc-100 to-purple-200 bg-clip-text text-transparent">
              Verify your email
            </h1>

            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Enter the six-digit OTP sent to
              your registered email address.
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
              className="relative mb-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium px-3.5 py-2.5 rounded-lg"
            >
              {errorMsg}
            </motion.div>
          )}

          <form
            onSubmit={handleVerify}
            className="relative space-y-4"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="otp-email"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Email address
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <Mail className="w-4 h-4" />
                </span>

                <input
                  id="otp-email"
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
                  placeholder="you@example.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] focus:bg-zinc-900/80 transition-all duration-300"
                />
              </div>
            </div>

            {/* OTP */}
            <div>
              <label
                htmlFor="otp-input"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Verification OTP
              </label>

              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within/input:text-[#A855F7] transition-colors">
                  <KeyRound className="w-4 h-4" />
                </span>

                <input
                  id="otp-input"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
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
                  className="block w-full pl-9 pr-3 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-xs tracking-[0.25em] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#A855F7] focus:bg-zinc-900/80 transition-all duration-300"
                />
              </div>
            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={loading || resending}
              id="verify_otp_submit_btn"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#A855F7] hover:bg-[#9333EA] border-t border-white/20 rounded-xl shadow-[0_8px_24px_rgba(168,85,247,0.28)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Verifying...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />

                  Verify Account
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending || loading}
            className="relative mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#A855F7] hover:text-purple-300 bg-[#A855F7]/5 hover:bg-[#A855F7]/10 border border-[#A855F7]/20 hover:border-[#A855F7]/40 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                resending
                  ? "animate-spin"
                  : ""
              }`}
            />

            {resending
              ? "Sending OTP..."
              : "Resend OTP"}
          </button>

          <div className="relative mt-5 text-center text-xs text-zinc-500">
            Already verified?{" "}

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