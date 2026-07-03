import React from 'react';

export default function BusAnimation() {
    return (
        <div className="w-full h-16 overflow-hidden relative border-t border-[#FF9933]/20 bg-[#FDFBF7] dark:bg-[#070F1E] pointer-events-none z-10 flex items-end opacity-90 transition-colors duration-300">
            {/* Road Track Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#0F1E36] dark:bg-slate-800 flex items-center">
                <div className="w-full h-0.5 border-t border-dashed border-white/40"></div>
            </div>

            {/* The animated moving container */}
            <div className="absolute bottom-1 whitespace-nowrap will-change-transform flex items-center animate-bus-move">
                {/* SVG of a traditional Indian State Bus (Express Style) */}
                <svg width="120" height="42" viewBox="0 0 120 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_6px_rgba(15,30,54,0.15)]">
                    {/* Bus Main Chassis Body */}
                    <path d="M5 8 C 5 4, 10 3, 16 3 L 105 3 C 112 3, 115 5, 115 10 L 115 35 L 5 35 Z" fill="#FAF9F6" />
                    
                    {/* Saffron Top Section (Traditional Livery) */}
                    <path d="M5 8 C 5 4, 10 3, 16 3 L 105 3 C 112 3, 115 5, 115 10 L 115 13 L 5 13 Z" fill="#FF9933" />
                    
                    {/* Emerald Green Bottom Stripe */}
                    <rect x="5" y="30" width="110" height="4" fill="#12820B" />

                    {/* Roof Luggage Carrier (Very Indian!) */}
                    <rect x="25" y="0" width="65" height="3" fill="#64748b" rx="1" />
                    <line x1="38" y1="3" x2="38" y2="0" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="58" y1="3" x2="58" y2="0" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="78" y1="3" x2="78" y2="0" stroke="#64748b" strokeWidth="1.5" />

                    {/* Windshield / Front Window */}
                    <path d="M98 12 L 112 12 C 114 12, 115 13, 115 15 L 115 24 L 98 24 Z" fill="#1b2f4f" />
                    <rect x="99" y="14" width="11" height="8" rx="0.5" fill="#bae6fd" opacity="0.8" />

                    {/* Passenger Windows */}
                    <rect x="10" y="14" width="12" height="10" rx="1" fill="#1b2f4f" />
                    <rect x="10" y="15" width="12" height="8" rx="0.5" fill="#bae6fd" opacity="0.8" />
                    
                    <rect x="27" y="14" width="12" height="10" rx="1" fill="#1b2f4f" />
                    <rect x="27" y="15" width="12" height="8" rx="0.5" fill="#bae6fd" opacity="0.8" />

                    <rect x="44" y="14" width="12" height="10" rx="1" fill="#1b2f4f" />
                    <rect x="44" y="15" width="12" height="8" rx="0.5" fill="#bae6fd" opacity="0.8" />

                    <rect x="61" y="14" width="12" height="10" rx="1" fill="#1b2f4f" />
                    <rect x="61" y="15" width="12" height="8" rx="0.5" fill="#bae6fd" opacity="0.8" />

                    <rect x="78" y="14" width="12" height="10" rx="1" fill="#1b2f4f" />
                    <rect x="78" y="15" width="12" height="8" rx="0.5" fill="#bae6fd" opacity="0.8" />

                    {/* Destination Board (Hindi / Devnagri style outline) */}
                    <rect x="52" y="5" width="28" height="5" fill="#000000" rx="0.5" />
                    <text x="66" y="9" fill="#fde047" fontSize="3.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">भारत</text>

                    {/* Indian Flag Tricolor Band */}
                    <rect x="110" y="27" width="4" height="1.5" fill="#FF9933" />
                    <rect x="110" y="28.5" width="4" height="1.5" fill="#FAF9F6" />
                    <rect x="110" y="30" width="4" height="1.5" fill="#12820B" />

                    {/* Headlights & Taillight */}
                    <path d="M115 28 L 116 28 C 116.5 28, 117 28.5, 117 29 L 117 31 C 117 31.5, 116.5 32, 116 32 L 115 32 Z" fill="#fde047" />
                    <circle cx="5" cy="25" r="2.5" fill="#ef4444" /> {/* Rear Red Light */}

                    {/* Chrome bumper front & rear */}
                    <rect x="113" y="34" width="3" height="3" fill="#cbd5e1" rx="0.5" />
                    <rect x="3" y="34" width="3" height="3" fill="#cbd5e1" rx="0.5" />

                    {/* Wheels */}
                    <circle cx="24" cy="35" r="6" fill="#0F1E36" />
                    <circle cx="24" cy="35" r="3" fill="#e2e8f0" />
                    <circle cx="24" cy="35" r="1" fill="#0F1E36" />

                    <circle cx="84" cy="35" r="6" fill="#0F1E36" />
                    <circle cx="84" cy="35" r="3" fill="#e2e8f0" />
                    <circle cx="84" cy="35" r="1" fill="#0F1E36" />
                </svg>

                {/* Trailing exhaust smoke puff */}
                <span className="text-gray-400 text-[10px] font-bold tracking-tighter opacity-50 ml-1.5 animate-pulse select-none">HORN OK PLEASE</span>
            </div>
            
            <style jsx="true">{`
                @keyframes busMove {
                    0% {
                        transform: translateX(100vw);
                    }
                    100% {
                        transform: translateX(-160px);
                    }
                }
                .animate-bus-move {
                    animation: busMove 14s linear infinite;
                }
            `}</style>
        </div>
    );
}
