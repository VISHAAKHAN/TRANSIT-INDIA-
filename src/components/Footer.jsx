import React from 'react';
import { ShieldCheck, Award, Share2, HelpCircle } from 'lucide-react';
import { t } from '../translations';

export default function Footer({ lang }) {
    return (
        <footer className="bg-[#0F1E36] dark:bg-[#070F1E] text-white py-12 w-full z-20 relative border-t-2 border-[#12820B]/30 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center">

                {/* Left Column — Brand */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center space-x-2 mb-3">
                        <ShieldCheck className="text-[#FF9933] w-6 h-6 transition-colors" />
                        <span className="text-xl font-black tracking-wide bg-gradient-to-r from-[#FF9933] to-[#FAF9F6] bg-clip-text text-transparent">{t('transitIndia', lang)}</span>
                    </div>
                    <p className="text-xs text-gray-300 dark:text-gray-400 max-w-sm leading-relaxed transition-colors">
                        {t('footerDescription', lang)}
                    </p>
                </div>

                {/* Center Column — Icons, Bharat badge & copyright */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex space-x-6">
                        <Award className="w-5 h-5 text-gray-300 hover:text-[#FF9933] cursor-pointer transition-colors" />
                        <Share2 className="w-5 h-5 text-gray-300 hover:text-[#FF9933] cursor-pointer transition-colors" />
                        <HelpCircle className="w-5 h-5 text-gray-300 hover:text-[#FF9933] cursor-pointer transition-colors" />
                    </div>

                    {/* Designed for Bharat badge with Ashoka Chakra */}
                    <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#FF9933] uppercase shadow-inner transition-colors">
                        <svg className="w-4 h-4 text-blue-500 animate-spin" style={{ animationDuration: '40s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" />
                            {Array.from({ length: 12 }).map((_, i) => (
                                <line
                                    key={i}
                                    x1="12" y1="12"
                                    x2={12 + 9 * Math.cos((i * Math.PI) / 6)}
                                    y2={12 + 9 * Math.sin((i * Math.PI) / 6)}
                                />
                            ))}
                        </svg>
                        <span>{t('designedForBharat', lang)}</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1 text-[11px] text-gray-400 dark:text-gray-550 font-bold transition-colors">
                        <p>© 2026 {t('digitalIndiaCorp', lang)}</p>
                        <p className="text-gray-500 dark:text-gray-600">{t('lastUpdatedText', lang)}</p>
                    </div>
                </div>

                {/* Right Column — Govt of India Emblem (no border box) */}
                <div className="flex flex-col items-center md:items-end justify-center">
                    <div className="flex items-center space-x-5">
                        <img
                            src="/emblem.png"
                            alt="State Emblem of India"
                            className="h-20 w-auto shrink-0 object-contain brightness-[1.15]"
                        />
                        <div className="flex flex-col text-left leading-none space-y-2">
                            <span className="text-xl text-white font-black tracking-widest">सत्यमेव जयते</span>
                            <span className="text-[13px] text-[#FF9933] font-black uppercase tracking-wider">{t('governmentOfIndia', lang)}</span>
                            <div className="flex items-center space-x-2 mt-1">
                                {/* Mini Tiranga */}
                                <svg className="w-8 h-5 rounded-sm border border-white/10 shrink-0" viewBox="0 0 90 60">
                                    <rect width="90" height="20" fill="#FF9933" />
                                    <rect y="20" width="90" height="20" fill="#FFFFFF" />
                                    <rect y="40" width="90" height="20" fill="#12820B" />
                                    <circle cx="45" cy="30" r="8" stroke="#000080" strokeWidth="1" fill="none" />
                                    <circle cx="45" cy="30" r="1.5" fill="#000080" />
                                    {Array.from({ length: 12 }).map((_, idx) => {
                                        const angle = (idx * Math.PI) / 6;
                                        return (
                                            <line
                                                key={idx}
                                                x1="45" y1="30"
                                                x2={45 + 8 * Math.cos(angle)}
                                                y2={30 + 8 * Math.sin(angle)}
                                                stroke="#000080" strokeWidth="0.5"
                                            />
                                        );
                                    })}
                                </svg>
                                <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">India</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
