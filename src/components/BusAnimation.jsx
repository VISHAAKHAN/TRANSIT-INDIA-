import React from 'react';

export default function BusAnimation() {
    return (
        <div className="w-full h-16 overflow-hidden relative border-t border-gray-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 pointer-events-none z-10 flex items-end opacity-80">
            {/* The animated moving container */}
            <div className="absolute whitespace-nowrap will-change-transform flex items-center animate-bus-move">
                {/* SVG of an Indian Bus (Setc / City Bus style) */}
                <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                    {/* Bus Body */}
                    <path d="M5 10 C 5 5, 10 5, 15 5 L 85 5 C 90 5, 95 10, 95 15 L 95 35 L 5 35 Z" fill="#ea580c" />

                    {/* Bus Top Stripe */}
                    <rect x="5" y="8" width="90" height="3" fill="#bef264" />

                    {/* Windows */}
                    <rect x="10" y="14" width="12" height="10" rx="1" fill="#bae6fd" />
                    <rect x="25" y="14" width="12" height="10" rx="1" fill="#bae6fd" />
                    <rect x="40" y="14" width="12" height="10" rx="1" fill="#bae6fd" />
                    <rect x="55" y="14" width="12" height="10" rx="1" fill="#bae6fd" />
                    <rect x="70" y="14" width="12" height="10" rx="1" fill="#bae6fd" />

                    {/* Door */}
                    <rect x="85" y="12" width="7" height="23" fill="#cbd5e1" />
                    <rect x="85" y="14" width="3" height="10" fill="#bae6fd" />
                    <rect x="89" y="14" width="3" height="10" fill="#bae6fd" />

                    {/* Headlights & Details */}
                    <circle cx="92" cy="28" r="2" fill="#fde047" />
                    <circle cx="8" cy="28" r="2" fill="#ef4444" />

                    {/* Wheels */}
                    <circle cx="20" cy="35" r="4" fill="#334155" />
                    <circle cx="20" cy="35" r="2" fill="#94a3b8" />

                    <circle cx="75" cy="35" r="4" fill="#334155" />
                    <circle cx="75" cy="35" r="2" fill="#94a3b8" />
                </svg>
                {/* Trailing Exhaust / Wind effect */}
                <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 opacity-50">
                    <line x1="0" y1="10" x2="15" y2="10" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                    <line x1="5" y1="15" x2="25" y2="15" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                    <line x1="10" y1="5" x2="20" y2="5" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                </svg>
            </div>
            {/* Adding inline styles for the keyframes since it's a specific custom animation */}
            <style jsx="true">{`
                @keyframes busMove {
                    0% {
                        transform: translateX(100vw);
                    }
                    100% {
                        transform: translateX(-150px);
                    }
                }
                .animate-bus-move {
                    animation: busMove 12s linear infinite;
                }
            `}</style>
        </div>
    );
}
