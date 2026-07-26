"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function StaffLoginPage() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSignIn(e) {
    e.preventDefault();
    if (!staffId.trim() || !password.trim()) {
      setErrorMsg("Please enter your Staff ID and password.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const cleanId = staffId.trim().toLowerCase();
      const email = cleanId.includes("@") ? cleanId : `${cleanId}@scango-mart.internal`;
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("staffSession", cleanId);
      router.push("/staff/overview");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Invalid Staff ID or password. Please try again.");
    }
  }

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-surface">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              width: 60, height: 60, borderRadius: 12,
              background: "rgba(124,217,161,0.15)",
              border: "1px solid rgba(124,217,161,0.3)",
              left: `${20 + i * 20}%`, top: `${20 + (i % 2) * 30}%`,
            }}
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-screen max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <header className="flex flex-col items-center justify-center px-5 h-20 w-full shrink-0 pt-4">
          <span style={{ fontFamily: "Inter", fontSize: "28px", fontWeight: 700, color: "#7cd9a1" }}>ScanGo</span>
          <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "rgba(190,202,191,0.5)", letterSpacing: "0.12em" }}>
            ADMIN TERMINAL
          </span>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Icon */}
            <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <span className="material-symbols-outlined relative z-10" style={{ fontSize: "44px", color: "#7cd9a1" }}>
                admin_panel_settings
              </span>
            </div>

            <h1 className="text-center mb-2" style={{ fontFamily: "Inter", fontSize: "26px", fontWeight: 700, color: "#dfe2eb" }}>
              Staff Sign In
            </h1>
            <p className="text-center mb-10" style={{ fontFamily: "Inter", fontSize: "15px", color: "rgba(190,202,191,0.7)" }}>
              Enter your credentials to access the Admin Terminal.
            </p>

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              {/* Staff ID */}
              <div className="flex items-center gap-3 px-4 rounded-2xl h-14"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
                <span className="material-symbols-outlined" style={{ color: "rgba(190,202,191,0.5)", fontSize: "20px" }}>badge</span>
                <input
                  type="text"
                  placeholder="Staff ID  (e.g. admin123)"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontFamily: "Inter", fontSize: "16px", color: "#dfe2eb" }}
                  disabled={status === "loading"}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="flex items-center gap-3 px-4 rounded-2xl h-14"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
                <span className="material-symbols-outlined" style={{ color: "rgba(190,202,191,0.5)", fontSize: "20px" }}>lock</span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontFamily: "Inter", fontSize: "16px", color: "#dfe2eb" }}
                  disabled={status === "loading"}
                  autoComplete="current-password"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,180,171,0.1)", border: "1px solid rgba(255,180,171,0.2)" }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ color: "#ffb4ab" }}>error</span>
                  <p style={{ fontFamily: "Inter", fontSize: "14px", color: "#ffb4ab" }}>{errorMsg}</p>
                </motion.div>
              )}

              {/* Button */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 mt-2 transition-all"
                style={{ background: "#7cd9a1", color: "#00391f", fontFamily: "Inter", fontSize: "17px", fontWeight: 700 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === "loading" ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 rounded-full"
                      style={{ borderColor: "#00391f transparent #00391f transparent" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Signing In…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">login</span>
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center mt-8" style={{ fontFamily: "Inter", fontSize: "13px", color: "rgba(190,202,191,0.5)" }}>
              Customer?{" "}
              <a href="/login" style={{ color: "#7cd9a1", fontWeight: 500 }}>Customer login →</a>
            </p>
          </motion.div>
        </main>
      </div>
    </>
  );
}
