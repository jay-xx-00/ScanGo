"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerNav() {
  const pathname = usePathname();

  const links = [
    { name: "Scan", href: "/scan", icon: "qr_code_scanner" },
    { name: "History", href: "/history", icon: "receipt_long" },
    { name: "Account", href: "/account", icon: "person" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe pt-2 h-20 bg-surface/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-xl">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-primary-container/20 text-primary"
                : "text-on-surface-variant/60 hover:text-primary/80"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {link.icon}
            </span>
            <span className="font-label-sm text-label-sm mt-1">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
