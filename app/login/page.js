"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  // Initialize window-scoped singleton RecaptchaVerifier on mount if not present
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
        });
      } catch (e) {
        console.warn("RecaptchaVerifier initialization warning:", e);
      }
    }

    return () => {
      // Clear verifier only when navigating away from the login page entirely
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {}
          window.recaptchaVerifier = null;
        }
      }
    };
  }, []);

  function formatDisplay(val) {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + " " + digits.slice(5);
  }

  async function handleSendCode(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
        });
      }
      const phoneNumber = "+91" + digits;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      window.__confirmationResult = confirmationResult;
      sessionStorage.setItem("pendingPhone", phoneNumber);
      router.push("/verify");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Failed to send OTP. Please try again.");
    }
  }

  return (
    <>
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />

      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#10141a" }}>
        <div className="absolute inset-0 bg-surface" style={{ backgroundColor: "#10141a" }} />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "rgba(124,217,161,0.2)",
              border: "1px solid rgba(124,217,161,0.4)",
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -20, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-screen max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-center px-5 h-16 w-full shrink-0">
          <span className="font-bold tracking-tight" style={{ fontFamily: "Inter", fontSize: "28px", fontWeight: 700, color: "#7cd9a1" }}>
            ScanGo
          </span>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Icon */}
            <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(124,217,161,0.15)" }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <svg width="52" height="52" viewBox="0 0 24 24" fill="#7cd9a1" className="relative z-10">
                <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-5-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>

            {/* Headings */}
            <h1 className="text-center mb-2" style={{ fontFamily: "Inter", fontSize: "28px", fontWeight: 700, color: "#dfe2eb" }}>
              Welcome to ScanGo
            </h1>
            <p className="text-center mb-10 max-w-[260px] mx-auto" style={{ fontFamily: "Inter", fontSize: "16px", color: "rgba(190,202,191,0.7)" }}>
              Enter your mobile number to receive a one-time verification code.
            </p>

            {/* Form */}
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div
                className="flex items-center gap-3 px-4 rounded-2xl h-16"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)" }}
              >
                {/* Country prefix */}
                <div className="flex items-center gap-2 pr-3" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "22px" }}>🇮🇳</span>
                  <span style={{ fontFamily: "Inter", fontSize: "16px", fontWeight: 500, color: "#dfe2eb" }}>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={formatDisplay(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontFamily: "Inter", fontSize: "18px", fontWeight: 500, color: "#dfe2eb", letterSpacing: "0.06em" }}
                  autoComplete="tel"
                  disabled={status === "loading"}
                />
              </div>

              {/* Error */}
              {status === "error" && errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm"
                  style={{ color: "#ffb4ab", fontFamily: "Inter" }}
                >
                  {errorMsg}
                </motion.p>
              )}

              {/* Button */}
              <motion.button
                type="submit"
                disabled={status === "loading" || phone.replace(/\D/g, "").length !== 10}
                className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 mt-2 transition-all active:scale-[0.98]"
                style={{
                  background: phone.replace(/\D/g, "").length === 10 ? "#7cd9a1" : "rgba(124,217,161,0.3)",
                  color: "#00391f",
                  fontFamily: "Inter",
                  fontSize: "18px",
                  fontWeight: 700,
                  cursor: phone.replace(/\D/g, "").length === 10 ? "pointer" : "not-allowed",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {status === "loading" ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 rounded-full"
                      style={{ borderColor: "#00391f transparent #00391f transparent" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Sending Code…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    Send Code
                  </>
                )}
              </motion.button>
            </form>

            {/* Staff link */}
            <p className="text-center mt-8" style={{ fontFamily: "Inter", fontSize: "13px", color: "rgba(190,202,191,0.5)" }}>
              Staff member?{" "}
              <a href="/staff/login" style={{ color: "#7cd9a1", fontWeight: 500 }}>
                Sign in here →
              </a>
            </p>
          </motion.div>
        </main>
      </div>
    </>
  );
}
