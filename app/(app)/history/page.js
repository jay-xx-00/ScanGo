"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    // Mocking Firestore fetch for history
    setOrders([
      { id: "ORD-9281", date: "Today, 12:45 PM", total: 5.49, status: "Completed", items: 2 },
      { id: "ORD-8411", date: "Yesterday, 6:30 PM", total: 14.20, status: "Completed", items: 5 },
      { id: "ORD-7720", date: "Jul 20, 9:15 AM", total: 3.50, status: "Completed", items: 1 },
    ]);
  }, []);

  return (
    <main className="flex-1 pt-24 pb-32 px-container-margin max-w-md mx-auto w-full">
      <h1 className="font-headline-lg-mobile text-on-surface font-bold mb-2">Order History</h1>
      <p className="font-body-md text-on-surface-variant/80 mb-8">Past transactions for {auth.currentUser?.phoneNumber || "your account"}</p>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass-card p-4 rounded-xl flex justify-between items-center bg-white/5 border border-white/10">
            <div>
              <p className="font-label-sm text-primary mb-1">{order.id}</p>
              <p className="font-body-md text-on-surface">{order.date}</p>
              <p className="font-label-sm text-on-surface-variant/60 mt-1">{order.items} Items</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <p className="font-price-display text-on-surface">${order.total.toFixed(2)}</p>
              <span className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
