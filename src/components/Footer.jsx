import React from 'react';
import { ShieldCheck, Award, Share2, HelpCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] dark:bg-slate-950 text-white py-10 w-full z-20 relative transition-colors">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center">

                {/* Left Column */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center space-x-2 mb-3">
                        <ShieldCheck className="text-[#f97316] dark:text-orange-500 w-6 h-6 transition-colors" />
                        <span className="text-xl font-bold tracking-wide">TransitIndia</span>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm leading-relaxed transition-colors">
                        An initiative of the Ministry of Electronics and IT, providing reliable public transport intelligence.
                    </p>
                </div>

                {/* Center Column */}
                <div className="flex flex-col items-center justify-center space-y-5">
                    <div className="flex space-x-8">
                        <Award className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-white cursor-pointer transition-colors" />
                        <Share2 className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-white cursor-pointer transition-colors" />
                        <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-white cursor-pointer transition-colors" />
                    </div>
                    <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-gray-300 dark:text-gray-400 uppercase shadow-sm transition-colors">
                        Designed for Bharat Conditions
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right justify-center space-y-2 text-xs text-gray-500 dark:text-gray-600 font-medium transition-colors">
                    <p>© 2024 Digital India Corporation</p>
                    <p>Last Updated: Today, 09:15 AM</p>
                </div>

            </div>
        </footer>
    );
}
