"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        const isStaff = user.email?.endsWith("@scango-mart.internal");
        router.push(isStaff ? "/staff/overview" : "/scan");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Splash loading screen while checking auth
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-surface gap-6">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontFamily: "Inter", fontSize: "40px", fontWeight: 800, color: "#7cd9a1", letterSpacing: "-0.02em" }}>
          ScanGo
        </span>
      </motion.div>
      <span className="w-6 h-6 rounded-full bg-primary animate-ping opacity-40"></span>
    </div>
  );
}
