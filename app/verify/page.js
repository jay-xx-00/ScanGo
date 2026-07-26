"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useRouter } from "next/navigation";

// ─── Inline SVG product icons (glyph-only, filled) ──────────────────────────
const PRODUCT_ICONS = [
  // Milk carton
  {
    id: "milk",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2v2H6a1 1 0 0 0-1 1v1.382l-1.447 2.894A1 1 0 0 0 3 9.764V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.764a1 1 0 0 0-.106-.447L19 6.382V5a1 1 0 0 0-1-1h-1V2H7Zm1 2h8v1H8V4Zm-1.764 3h11.528l1 2H5.236l1-2ZM5 11h14v9H5v-9Zm2 2v2h10v-2H7Zm0 4v1h4v-1H7Z" />
      </svg>
    ),
  },
  // Bread loaf
  {
    id: "bread",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.5 2 5 4.5 5 7c0 1.7.9 3.1 2 4v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9c1.1-.9 2-2.3 2-4 0-2.5-3.5-5-7-5Zm-3 9h6v2H9v-2Zm0 4h6v2H9v-2Z" />
      </svg>
    ),
  },
  // Apple / fruit
  {
    id: "fruit",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3c-.55 0-1 .45-1 1 0 1.1.9 2 2 2 .55 0 1-.45 1-1 0-1.1-.9-2-2-2ZM7 6c-2.76 0-5 2.24-5 5 0 4 3.5 8 5 8h10c1.5 0 5-4 5-8 0-2.76-2.24-5-5-5-1.5 0-2.84.67-3.75 1.72A4.986 4.986 0 0 0 10 6H7Z" />
      </svg>
    ),
  },
  // Water bottle
  {
    id: "bottle",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 2v2H8a1 1 0 0 0-1 1v2.382L5.106 10.17A2 2 0 0 0 5 11v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-.106-.83L17 7.382V5a1 1 0 0 0-1-1h-1V2H9Zm1 2h4v1h-4V4Zm-1.764 4h9.528l1.118 2H6.118L7.236 8ZM7 12h10v8H7v-8Zm2 2v1.5h6V14H9Zm0 3v1h4v-1H9Z" />
      </svg>
    ),
  },
  // Cereal box
  {
    id: "cereal",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H5Zm1 2h12v14H6V5Zm2 2v2h8V7H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z" />
      </svg>
    ),
  },
  // Soap bar
  {
    id: "soap",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM9 7h6v2H9V7Zm0 4h6v2H9v-2Zm0 4h4v2H9v-2ZM6 2h2v2H6V2Zm4 0h2v2h-2V2Zm4 0h2v2h-2V2Z" />
      </svg>
    ),
  },
  // Biscuit / cookie
  {
    id: "biscuit",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-4 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm5 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm3-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
      </svg>
    ),
  },
  // Grocery bag
  {
    id: "bag",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2Zm0 9c-2.21 0-4-1.79-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.21-1.79 4-4 4Z" />
      </svg>
    ),
  },
  // Can / tin
  {
    id: "can",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.5 2 5 3.12 5 5v14c0 1.88 3.5 3 7 3s7-1.12 7-3V5c0-1.88-3.5-3-7-3Zm0 2c2.97 0 5 .85 5 1s-2.03 1-5 1-5-.85-5-1 2.03-1 5-1Zm-5 4.22C8.21 9.06 10.05 9.5 12 9.5s3.79-.44 5-1.28V11c0 .15-2.03 1-5 1s-5-.85-5-1V8.22Zm0 5C8.21 14.06 10.05 14.5 12 14.5s3.79-.44 5-1.28V16c0 .15-2.03 1-5 1s-5-.85-5-1v-2.78ZM12 21c-2.97 0-5-.85-5-1v-2.78C8.21 18.06 10.05 18.5 12 18.5s3.79-.44 5-1.28V20c0 .15-2.03 1-5 1Z" />
      </svg>
    ),
  },
  // Egg carton
  {
    id: "egg",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3c-2.5 0-5 2.8-5 7s2.5 9 5 9 5-4.8 5-9-2.5-7-5-7Z" />
      </svg>
    ),
  },
];

// ─── Seeded deterministic values per icon slot ───────────────────────────────
function seededRandom(seed) {
  // Simple linear congruential generator for deterministic "random"
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildIconConfig(index) {
  const s = index * 7; // offset seed per property
  return {
    icon: PRODUCT_ICONS[index % PRODUCT_ICONS.length],
    size: 28 + seededRandom(s) * 20,          // 28–48px
    xStart: seededRandom(s + 1) * 90 + 5,     // 5–95vw
    xDrift: (seededRandom(s + 2) - 0.5) * 80, // ±40px horizontal drift
    duration: 8 + seededRandom(s + 3) * 6,    // 8–14s
    delay: seededRandom(s + 4) * 12,          // 0–12s stagger
  };
}

const ICON_CONFIGS = Array.from({ length: 10 }, (_, i) => buildIconConfig(i));

// ─── Floating Products background component ───────────────────────────────────
function FloatingProducts() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {ICON_CONFIGS.map(({ icon, size, xStart, xDrift, duration, delay }, i) => {
        const tint = "rgba(15,122,75,0.18)";

        if (prefersReduced) {
          // Static, faded — respect prefers-reduced-motion
          return (
            <div
              key={icon.id + i}
              style={{
                position: "absolute",
                left: `${xStart}%`,
                top: `${20 + seededRandom(i * 3) * 60}%`,
                width: size,
                height: size,
                color: tint,
                opacity: 0.1,
              }}
            >
              {icon.svg}
            </div>
          );
        }

        return (
          <motion.div
            key={icon.id + i}
            initial={{ y: "110vh", x: 0, opacity: 0 }}
            animate={{
              y: [
                "110vh",   // start below
                "95vh",    // fade in quickly
                "50vh",    // middle of travel
                "5vh",     // fade out zone
                "-10vh",   // exit above
              ],
              x: [0, xDrift * 0.25, xDrift * 0.6, xDrift * 0.85, xDrift],
              opacity: [0, 0.18, 0.17, 0.15, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.08, 0.5, 0.92, 1],
            }}
            style={{
              position: "absolute",
              left: `${xStart}%`,
              width: size,
              height: size,
              color: tint,
              filter: size < 34 ? "blur(0.8px)" : "none",
              willChange: "transform, opacity",
            }}
          >
            {icon.svg}
          </motion.div>
        );
      })}

      {/* Ambient glow blobs — static, matching Stitch */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "rgba(15,122,75,0.05)", filter: "blur(120px)" }} />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "rgba(15,122,75,0.04)", filter: "blur(120px)" }} />
    </div>
  );
}

// ─── OTP Input cluster ────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const inputRefs = useRef([]);

  const handleChange = useCallback(
    (e, index) => {
      const digit = e.target.value.replace(/\D/g, "").slice(-1);
      const next = [...value];
      next[index] = digit;
      onChange(next);
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace") {
        if (value[index]) {
          const next = [...value];
          next[index] = "";
          onChange(next);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const next = [...value];
          next[index - 1] = "";
          onChange(next);
        }
      }
    },
    [value, onChange]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (!pasted) return;
      const next = [...value];
      pasted.split("").forEach((ch, i) => { next[i] = ch; });
      onChange(next);
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
    },
    [value, onChange]
  );

  return (
    <motion.div
      className="flex gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
    >
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={i === 0}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          aria-label={`OTP digit ${i + 1}`}
          className="otp-box w-12 h-14 text-center rounded-xl font-bold text-xl transition-all duration-200 focus:outline-none"
          style={{
            fontFamily: "Geist, monospace",
            fontSize: "22px",
            lineHeight: "22px",
            letterSpacing: "0.02em",
            color: "#7cd9a1",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${value[i] ? "rgba(124,217,161,0.5)" : "rgba(255,255,255,0.1)"}`,
            boxShadow: value[i]
              ? "0 0 15px rgba(124,217,161,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        />
      ))}
    </motion.div>
  );
}

function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber) return "";
  const cleaned = phoneNumber.trim().replace(/\s+/g, "");
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 4) return phoneNumber;
  const last4 = digits.slice(-4);
  const countryCode = cleaned.startsWith("+")
    ? cleaned.slice(0, cleaned.length - 10)
    : "+91";
  return `${countryCode} ••••••${last4}`;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [resendSeconds, setResendSeconds] = useState(45);
  const [phoneNum, setPhoneNum] = useState("");

  // Grab confirmationResult injected by the phone-login step
  const confirmationResult =
    typeof window !== "undefined" ? window.__confirmationResult : null;

  // Guard: redirect to /login if no pending phone verification, or set phoneNum
  useEffect(() => {
    const pending = typeof window !== "undefined"
      ? sessionStorage.getItem("pendingPhone")
      : null;
    if (!pending) {
      router.replace("/login");
    } else {
      setPhoneNum(pending);
    }
  }, [router]);

  // Resend countdown timer
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSeconds]);

  const code = otp.join("");
  const isComplete = code.length === 6;

  async function handleVerify() {
    if (!isComplete || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(code);
        sessionStorage.removeItem("pendingPhone");
      } else {
        // Dev fallback — simulate success
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("success");
      setTimeout(() => router.push("/scan"), 900);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.code === "auth/invalid-verification-code"
          ? "Incorrect code. Please try again."
          : err?.message || "Verification failed. Please retry."
      );
    }
  }

  // Stitch-matched button states
  const btnLabel =
    status === "loading"
      ? "Verifying…"
      : status === "success"
      ? "✓ Verified!"
      : "Verify Code";

  const btnBg =
    status === "success"
      ? "#0f7a4b"
      : "#7cd9a1";

  return (
    <>
      {/* Inject OTP input focus styles */}
      <style>{`
        .otp-box:focus {
          border-color: #7cd9a1 !important;
          box-shadow: 0 0 15px rgba(124,217,161,0.4), inset 0 1px 0 rgba(255,255,255,0.06) !important;
          background: rgba(124,217,161,0.05) !important;
        }
      `}</style>

      {/* Animated background layer */}
      <FloatingProducts />

      {/* Full-screen container matching Stitch max-w-md centering */}
      <div
        className="relative z-10 flex flex-col h-screen max-w-md mx-auto overflow-hidden"
        style={{ background: "transparent" }}
      >
        {/* ── Top App Bar ── */}
        <header className="flex justify-between items-center px-5 h-16 w-full shrink-0">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            aria-label="Go back"
          >
            {/* Back arrow */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" fill="#dfe2eb"/>
            </svg>
          </button>

          <span
            className="font-bold tracking-tight"
            style={{
              fontFamily: "Inter",
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "34px",
              color: "#7cd9a1",
            }}
          >
            ScanGo
          </span>

          {/* Spacer to balance header */}
          <div className="w-10" />
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 pb-24">

          {/* Phone icon + heading + subtext */}
          <motion.div
            className="mb-12 flex flex-col items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Pulsing phone icon — Stitch: glass card, animate-ping ring */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              {/* Glass card base */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {/* Ping ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(124,217,161,0.2)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Phone icon SVG */}
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="#7cd9a1"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-5-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>

            <h1
              className="text-center mb-2"
              style={{
                fontFamily: "Inter",
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: "34px",
                color: "#dfe2eb",
              }}
            >
              Verify Identity
            </h1>
            <p
              className="text-center max-w-[280px]"
              style={{
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                color: "rgba(190,202,191,0.7)",
              }}
            >
              We&apos;ve sent a 6-digit code to{" "}
              <span style={{ color: "#7cd9a1", fontWeight: 500 }}>
                {maskPhoneNumber(phoneNum)}
              </span>
            </p>
          </motion.div>

          {/* OTP boxes */}
          <OtpInput value={otp} onChange={setOtp} />

          {/* Error message */}
          {status === "error" && errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-sm"
              style={{ color: "#ffb4ab", fontFamily: "Inter" }}
            >
              {errorMsg}
            </motion.p>
          )}

          {/* Resend timer */}
          <div className="flex items-center gap-2 mt-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(190,202,191,0.5)" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
            </svg>
            {resendSeconds > 0 ? (
              <p
                style={{
                  fontFamily: "Geist, monospace",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: "rgba(190,202,191,0.5)",
                }}
              >
                Resend code in{" "}
                <span style={{ color: "#7cd9a1" }}>
                  0:{resendSeconds.toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                onClick={() => setResendSeconds(45)}
                style={{
                  fontFamily: "Geist, monospace",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: "#7cd9a1",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Resend code
              </button>
            )}
          </div>
        </main>

        {/* ── Bottom CTA — fixed, Stitch: bg-primary, green glow shadow ── */}
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
          <div className="w-full max-w-md px-5 pb-5">
            <motion.button
              id="verify-btn"
              disabled={!isComplete || status === "loading" || status === "success"}
              onClick={handleVerify}
              whileTap={{ scale: 0.98 }}
              className="w-full h-16 rounded-xl flex items-center justify-center gap-3 transition-all font-semibold"
              style={{
                fontFamily: "Inter",
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: "32px",
                background: !isComplete ? "rgba(124,217,161,0.35)" : btnBg,
                color: "#00391f",
                boxShadow: isComplete
                  ? "0 8px 32px rgba(124,217,161,0.3)"
                  : "none",
                cursor: isComplete && status === "idle" ? "pointer" : "not-allowed",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {status === "loading" ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", width: 22, height: 22 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                  </motion.span>
                  Verifying…
                </>
              ) : (
                <>
                  {btnLabel}
                  {status !== "success" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                         className="group-hover:translate-x-1 transition-transform">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8Z"/>
                    </svg>
                  )}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
