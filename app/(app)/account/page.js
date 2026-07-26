"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AccountPage() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth);
    router.push("/login");
  }

  const user = auth.currentUser;

  return (
    <main className="flex-1 pt-24 pb-32 px-container-margin max-w-md mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline-lg-mobile text-on-surface font-bold mb-1">My Account</h1>
        <p className="font-body-md text-on-surface-variant/80">Your ScanGo profile</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6 mb-6 bg-white/5 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 border border-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
          </div>
          <div>
            <p className="font-headline-md text-on-surface">{user?.displayName || "Customer"}</p>
            <p className="font-body-md text-primary">{user?.phoneNumber || "+91 •••• •••• ••••"}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Total Orders</span>
            <span className="font-price-display text-on-surface">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Account Status</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-medium">VERIFIED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Member Since</span>
            <span className="font-body-md text-on-surface">Jul 2026</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6">
        {[
          { icon: "notifications", label: "Notifications" },
          { icon: "security", label: "Privacy & Security" },
          { icon: "help", label: "Help & Support" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
            <span className="font-body-md text-on-surface flex-1">{item.label}</span>
            <span className="material-symbols-outlined text-on-surface-variant/40">chevron_right</span>
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full h-14 rounded-xl border border-error/40 text-error font-headline-md flex items-center justify-center gap-2 hover:bg-error/10 transition-colors active:scale-[0.98]"
      >
        <span className="material-symbols-outlined">logout</span>
        Sign Out
      </button>
    </main>
  );
}
