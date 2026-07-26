"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import Image from "next/image";

export default function ScanPage() {
  const [cart, setCart] = useState([
    {
      id: "banana",
      name: "Organic Bananas",
      price: 1.99,
      qty: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIyPXxNrGMBBJwN773yS3v1GiBhCxWf975_aDcCMD7bV_B5BaqOeEuJGvyklZFsFPVczafPKMJxNGQfBX0jDQ9MdRqS7bJvSUPat2cPeVo5PVcHEZqe602ZaaRPuYvrYEFyXU5WwMTuuE1k4K3Ew9DUe4zCGvRKVfbljn8BoLGoqdV9VDLNgHJlwN0riBIv3yTzshHvVyJSUw5sXLcnDvAw0wwq_-ZFOjPOpgS4M0ryJsx_br_9xy-9zzXB1KDI0Cw94vkcIfvfVv7"
    },
    {
      id: "milk",
      name: "Whole Milk",
      price: 3.50,
      qty: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKAUvMMfKm8Heia0LUmY85kGCcKIGk5GQaNtF8hXSb2a67ShYWCLGDc8jJQ1laF43DLHVOxIGLLMDPkmICLSg6NlBmVe2OoJH2WtqVw4yzdPEE-IxcYk9E9vOtZ99xKNbET9hiNpDi0jSEg8sEoTMZU8sbjJZ0joIjD0VwyoCmTWBOSNvNT8w56oW0rl1WX0DEmZHYZD07_kaU1aqS2_nFJSomfQoOD5WN6mA5hL11hszirkl8qHrMURBm1EVNGmya-dd8BHwe3Pls"
    }
  ]);
  
  const scannerRef = useRef(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    // We instantiate Html5QrcodeScanner only once
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          aspectRatio: 4/3,
        },
        /* verbose= */ false
      );
      
      scannerRef.current.render(
        (decodedText, decodedResult) => {
          // In a real app, we'd lookup the decodedText (barcode) in Firestore.
          console.log(`Scan result: ${decodedText}`);
        },
        (errorMessage) => {
          // console.warn(errorMessage);
        }
      );
    }
    
    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, []);

  const updateQty = (id, delta) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  return (
    <>
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse-reticle {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .scan-line-animation { animation: scan-line 3s ease-in-out infinite; }
        .pulse-animation { animation: pulse-reticle 2s ease-in-out infinite; }
        
        /* Custom scrollbar for cart */
        .cart-scroll::-webkit-scrollbar { width: 4px; }
        .cart-scroll::-webkit-scrollbar-track { background: transparent; }
        .cart-scroll::-webkit-scrollbar-thumb {
          background: rgba(124, 217, 161, 0.2);
          border-radius: 10px;
        }

        /* html5-qrcode overrides to hide ugly defaults and let our CSS shine */
        #reader {
          border: none !important;
          width: 100% !important;
        }
        #reader__dashboard_section_csr span {
           display: none !important;
        }
        #reader__dashboard_section_swaplink {
           display: none !important;
        }
        #reader__dashboard_section_csr select {
           margin: 10px;
           padding: 5px;
           background: #181c22;
           color: #dfe2eb;
           border: 1px solid rgba(255,255,255,0.1);
           border-radius: 8px;
        }
        #reader button {
           background: #7cd9a1 !important;
           color: #00391f !important;
           border-radius: 8px !important;
           padding: 8px 16px !important;
           font-weight: bold !important;
           margin-top: 10px;
        }
        #reader__scan_region {
           min-height: 100%;
        }
        #reader__scan_region img {
           display: none !important;
        }
        #reader__scan_region video {
           object-fit: cover !important;
           width: 100% !important;
           height: 100% !important;
        }
      `}</style>

      {/* TopAppBar */}
      <header className="bg-surface/5 backdrop-blur-md text-primary font-headline-lg-mobile text-headline-lg-mobile docked full-width top-0 z-50 border-b border-white/10 shadow-lg shadow-black/20 flex justify-between items-center px-container-margin h-16 w-full fixed">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtnPq6i4TQmA71bsoEURa0B_ZJWGQkPjNIha9hZbCVGSQX_u8hXcYGyPhqhin_fkwl3duQ-6hPrL5UE__mjaIEzw3DlbhayAMl-QF5DLRoBon63IhTo5ZDBrp5VP7Ktp8xqQgRmn75wfWjG3d7ykSI88accKHQB0xRDYqiuznVrVlAiAWvjXY6do8wxuIYsFkQe7PrYWbjK0BE1zStdem-ZXqia_3-f2JhF_oMEUI5-uGMMqvEIs9teGHLG5vcIBl0elE-00QsQF0e"
              alt="User"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="font-bold tracking-tight">ScanGo</h1>
        </div>
        <button className="material-symbols-outlined text-primary hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 duration-150">
          help_outline
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 pb-40">
        
        {/* Viewfinder Section (Camera) */}
        <section className="relative w-full aspect-[4/3] bg-surface-container-lowest overflow-hidden flex items-center justify-center">
          
          {/* HTML5 QR Code Scanner Target */}
          <div id="reader" className="absolute inset-0 z-0 w-full h-full"></div>

          {/* Scanning UI Overlay */}
          <div className="relative z-10 w-64 h-64 pointer-events-none">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary-container rounded-tl-xl pulse-animation"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary-container rounded-tr-xl pulse-animation"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary-container rounded-bl-xl pulse-animation"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary-container rounded-br-xl pulse-animation"></div>
            {/* Vertical Scan Line */}
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent scan-line-animation shadow-[0_0_15px_rgba(124,217,161,0.8)]"></div>
          </div>

          {/* Dynamic Prompt */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-2 rounded-full flex items-center gap-2 pointer-events-none">
            <span className="material-symbols-outlined text-primary text-sm">center_focus_strong</span>
            <p className="font-label-sm text-label-sm text-on-surface tracking-wide">ALIGN BARCODE WITHIN BOX</p>
          </div>
        </section>

        {/* Cart Section */}
        <section className="px-container-margin -mt-6 relative z-20 flex-1 flex flex-col">
          <div className="glass-modal rounded-t-3xl p-6 flex-1 flex flex-col shadow-2xl bg-surface/80 backdrop-blur-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">Your Basket</h2>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm">
                {totalItems} ITEMS
              </span>
            </div>

            {/* Item List */}
            <div className="cart-scroll space-y-4 overflow-y-auto max-h-[353px] pr-2">
              {cart.map(item => (
                <div key={item.id} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-highest relative">
                      <Image 
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-body-lg text-body-lg text-on-surface">{item.name}</h3>
                      <p className="font-price-display text-price-display text-primary">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center glass-card rounded-lg overflow-hidden h-10 border border-white/5 bg-black/20">
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        className="w-10 h-full flex items-center justify-center text-on-surface-variant hover:bg-white/10 active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-8 text-center font-price-display text-on-surface">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        className="w-10 h-full flex items-center justify-center text-on-surface-variant hover:bg-white/10 active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Suggestion (Subtle) */}
            <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-center gap-2 opacity-40">
              <span className="material-symbols-outlined text-sm">info</span>
              <p className="font-label-sm text-label-sm">KEEP SCANNING FOR REAL-TIME UPDATES</p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar (Pinned) */}
      <div className="fixed bottom-24 left-0 w-full z-40 px-container-margin pb-4 pointer-events-none">
        <div className="max-w-md mx-auto w-full pointer-events-auto">
          <div className="glass-modal rounded-2xl p-4 flex items-center justify-between shadow-2xl bg-surface/90 border border-white/20">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total</p>
              <p className="font-price-display text-[28px] text-on-surface leading-none">${total}</p>
            </div>
            <button className="bg-primary-container text-on-primary-container px-6 py-4 rounded-xl font-headline-md text-body-lg font-bold flex items-center gap-3 active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(15,122,75,0.4)]">
              <span>Proceed to Pay</span>
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
