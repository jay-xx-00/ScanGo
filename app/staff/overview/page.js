"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const FLAGGED_ITEMS_INIT = [
  {
    id: "U-8821",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiR0F552jsPHwkZ6ZMjyx_5FipYu8WMoKP9-Jan8b0Vr4jUttbtPs0Bx73c4TuIzD9iebbvQ4S25L-upZ80kPEp_UfEbkwGFf-e3s9HujCniFK30gIfhr3mgblLXtatzLauctp72hjEoNK_OucZxZz47aobmwTLQDAWcBAg4NlR5viKWLK92wfx77sTMX2aohtetBYUrdcilbYUZiZqxlC6oizJnjfrfNAP6Y9Kvy44jKCx5Tl0X1gost133FKlium9OuwXp4YSo_h",
    risk: "HIGH RISK",
    riskColor: "text-tertiary",
    riskBg: "bg-tertiary-container/20",
    reason: "Weight Variance: +240g",
    time: "2 MINS AGO",
  },
  {
    id: "U-7492",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl0J20MDZgs1mFjLbpNfcqeK_aC2p-ztTf_8cNMCRFpd_SuY79lIZ_aTAf0NwcuOYUxqtL19bki3Z2J6vt3X0Lq2--U6JUY_cLD6xw3aEF4yHoM0uKjVTlQuEwUIvXNfXK0bo_O3ta56zHoeSpjhKQ9j5zP7d0taZDSb2RSRxEyYVx-0g3F08rhLXGXZ08-WcUPu_jY-thEaz9bjVAn-O5tqWIdG-_QlsTqHiKKLa4PjKpz0Na3hkLUTYAMCi1CjJXYOYQo0llGv-B",
    risk: "MODERATE",
    riskColor: "text-on-surface-variant",
    riskBg: "bg-white/10",
    reason: "Unexpected Item in Bag",
    time: "5 MINS AGO",
  },
  {
    id: "U-9104",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnk24su3wayx2QuOUrHCsK32ozw4KM75PYpFXMctU9aZxFPGnaU57DdeymtGyKxJINS4Fryu4tW0jzrbB7RDlatER_yKhSN1BfW9Gjq8BClVzctNecQW8V5J8mgswM3aK7mQVao8lohKmv0fFsRgQ77g5nqqNCRTZv0IR9ajOcDUrov4l5sZ4KPHB5fv2ld3y6zNy4-2J7uG_aniwhZ8Ycn5fNhXLsopwMrcAXqTut0Ksyho4f6xjrPObOUzEJEqY2o_7_0zWY1RWA",
    risk: "HIGH RISK",
    riskColor: "text-tertiary",
    riskBg: "bg-tertiary-container/20",
    reason: "Quantity Mismatch (3 vs 1)",
    time: "12 MINS AGO",
  },
];

const RECENT_RESOLUTIONS = [
  { id: "#U-1209", label: "Item Verified", status: "CLEARED", statusColor: "text-primary" },
  { id: "#U-5541", label: "Weight Alert", status: "MISMATCH", statusColor: "text-tertiary" },
];

export default function StaffOverviewPage() {
  const [flagged, setFlagged] = useState(FLAGGED_ITEMS_INIT);
  const router = useRouter();

  function resolve(id) {
    setFlagged((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSignOut() {
    await signOut(auth);
    sessionStorage.removeItem("staffSession");
    router.push("/staff/login");
  }

  const staffEmail = auth.currentUser?.email || "";
  const staffId = staffEmail.replace("@scango-mart.internal", "");

  return (
    <>
      {/* Top App Bar */}
      <header className="docked full-width top-0 z-50 bg-surface/5 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 flex justify-between items-center px-container-margin h-16 w-full fixed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative flex items-center justify-center bg-primary-container/20">
            <span className="material-symbols-outlined text-primary text-xl">person</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-primary tracking-tight font-headline-lg-mobile text-[18px]">ScanGo</span>
            <span className="text-on-surface-variant font-label-sm text-[10px] tracking-widest uppercase">Admin Terminal · {staffId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-error/80 hover:bg-error/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-label-sm text-[11px]">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-container-margin max-w-2xl mx-auto w-full">
        {/* Stats Row */}
        <section className="mb-8 flex gap-4">
          <div className="glass-card flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="font-label-sm text-on-surface-variant/60 text-[11px] mb-1">UNRESOLVED</p>
            <h3 className="font-headline-lg-mobile text-primary text-[28px] font-bold">{flagged.length}</h3>
          </div>
          <div className="glass-card flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="font-label-sm text-on-surface-variant/60 text-[11px] mb-1">AVG. SPEED</p>
            <h3 className="font-headline-lg-mobile text-on-surface text-[28px] font-bold">45s</h3>
          </div>
          <div className="glass-card flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="font-label-sm text-on-surface-variant/60 text-[11px] mb-1">TODAY</p>
            <h3 className="font-headline-lg-mobile text-on-surface text-[28px] font-bold">128</h3>
          </div>
        </section>

        {/* Header */}
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg-mobile text-on-surface font-bold">Flagged Transactions</h1>
            <p className="font-body-md text-on-surface-variant/80 text-sm mt-1">Manual verification required for AI mismatches</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-on-surface-variant text-[11px]">LIVE FEED</span>
          </div>
        </header>

        {/* Flagged List */}
        <div className="space-y-4">
          <AnimatePresence>
            {flagged.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <span className="material-symbols-outlined text-primary text-5xl mb-4">check_circle</span>
                <p className="font-headline-md text-on-surface mb-1">Queue Cleared</p>
                <p className="font-body-md text-on-surface-variant/60">No pending transactions require verification.</p>
              </motion.div>
            ) : (
              flagged.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100, transition: { duration: 0.4 } }}
                  className="glass-card p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-white/5 overflow-hidden relative">
                        <Image src={item.image} alt={item.id} fill className="object-cover opacity-80" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-price-display text-primary text-sm">#{item.id}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.riskColor} ${item.riskBg}`}>{item.risk}</span>
                        </div>
                        <p className="font-body-md text-on-surface text-sm">{item.reason}</p>
                      </div>
                    </div>
                    <span className="font-label-sm text-on-surface-variant/40 text-[10px]">{item.time}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => resolve(item.id)}
                      className="flex-1 py-3 px-4 rounded-xl font-label-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Clear
                    </button>
                    <button
                      onClick={() => resolve(item.id)}
                      className="flex-1 py-3 px-4 rounded-xl font-label-sm text-on-surface bg-[#c9432b] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">report</span>
                      Mismatch Found
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Terminal Logs */}
        <section className="mt-12">
          <h2 className="font-label-sm text-on-surface-variant/40 tracking-widest uppercase text-[10px] mb-4">Recent Resolutions</h2>
          <div className="space-y-2">
            {RECENT_RESOLUTIONS.map((r) => (
              <div key={r.id} className="flex justify-between items-center py-2 border-b border-white/5 text-[12px]">
                <span className="text-on-surface-variant">{r.id} • {r.label}</span>
                <span className={`font-medium ${r.statusColor}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
