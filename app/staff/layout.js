"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import StaffNav from "@/components/StaffNav";

export default function StaffLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/staff/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/staff/login");
      } else {
        // Check staff email pattern
        const isStaff = user.email?.endsWith("@scango-mart.internal");
        if (!isStaff) {
          router.push("/staff/login");
        } else {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface flex-col gap-4">
        <span className="w-8 h-8 rounded-full bg-primary animate-ping"></span>
        <p className="font-label-sm text-on-surface-variant/60 text-xs tracking-widest uppercase">Verifying Access</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {children}
      <StaffNav />
    </div>
  );
}
