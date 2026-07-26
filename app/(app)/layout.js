"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import CustomerNav from "@/components/CustomerNav";

export default function AppLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Not logged in as a customer, redirect to login
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <span className="w-8 h-8 rounded-full bg-primary animate-ping"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {children}
      <CustomerNav />
    </div>
  );
}
