import React from 'react';
import { Database, Server, Smartphone, BrainCircuit, Activity, LineChart, Shield, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutAI() {
    return (
        <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4 shadow-inner">
                    <BrainCircuit size={40} className="text-ti-navy" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-ti-navy mb-4 tracking-tight">AI-Powered Decision Intelligence</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base px-4">
                    Transparently explaining the predictive engines and classification models operating beneath the Transit India infrastructure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12">
                {/* Flow Diagram / Explainers */}
                <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <LineChart className="w-6 h-6 mr-3 text-ti-saffron" /> Predictive Arrival Window
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 font-medium border-l-4 border-gray-200 pl-4 py-1">
                            Time-series regression model that calculates arrival estimates.
                        </p>
                        <div className="pl-4 sm:pl-8 space-y-4 pt-2">
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-ti-saffron mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs sm:text-sm text-gray-500"><strong className="text-gray-700">Inputs:</strong> Live GPS ping, historical speed at this hour, day of the week.</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-ti-saffron mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs sm:text-sm text-gray-500"><strong className="text-gray-700">Output:</strong> A window (e.g., 15-20 mins) instead of a fixed minute to maintain passenger trust.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <Activity className="w-6 h-6 mr-3 text-red-500" /> Delay Classification
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 font-medium border-l-4 border-gray-200 pl-4 py-1">
                            Pattern comparison model analyzing anomalies.
                        </p>
                        <div className="pl-4 sm:pl-8 space-y-4 pt-2">
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs sm:text-sm text-gray-500"><strong className="text-gray-700">Inputs:</strong> Sustained speed drops vs normal historical speed.</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs sm:text-sm text-gray-500"><strong className="text-gray-700">Action:</strong> Dynamically widens arrival confidence window & communicates exact delay reason.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Visual & Architecture */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <div className="bg-gradient-to-br from-ti-navy to-blue-900 rounded-2xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden flex-grow group">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-blue-800 rounded-full opacity-20 transform translate-x-12 -translate-y-12 blur-3xl group-hover:bg-ti-saffron transition-all duration-700"></div>

                        <h3 className="text-lg font-bold text-white mb-8 border-b border-blue-800 pb-4">Architectural Flow</h3>

                        <div className="flex flex-col space-y-6 relative ml-4 sm:ml-6">
                            <div className="absolute w-0.5 bg-blue-800/60 left-[11px] top-6 bottom-6 z-0"></div>

                            <div className="relative z-10 flex items-center group/item hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-ti-saffron border border-yellow-200 flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(255,153,51,0.5)]">
                                    <Smartphone className="w-3.5 h-3.5 text-orange-900" />
                                </div>
                                <div className="bg-white/10 backdrop-blur px-4 py-2 sm:py-3 rounded-lg border border-white/5 flex-grow">
                                    <span className="font-bold text-xs sm:text-sm block">Passenger Interface</span>
                                    <span className="text-[10px] sm:text-xs text-blue-200 block mt-0.5">React.js + Tailwind CSS</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center group/item hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center mr-4 shadow-md">
                                    <Server className="w-3.5 h-3.5 text-ti-navy" />
                                </div>
                                <div className="bg-white/10 backdrop-blur px-4 py-2 sm:py-3 rounded-lg border border-white/5 flex-grow">
                                    <span className="font-bold text-xs sm:text-sm block">Core Services API</span>
                                    <span className="text-[10px] sm:text-xs text-blue-200 block mt-0.5">Node.js + Express</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center group/item hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-ti-emerald border border-green-200 flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(19,136,8,0.5)]">
                                    <BrainCircuit className="w-3.5 h-3.5 text-green-900" />
                                </div>
                                <div className="bg-white/10 backdrop-blur px-4 py-2 sm:py-3 rounded-lg border border-ti-emerald/30 shadow-[inset_0_0_10px_rgba(19,136,8,0.1)] flex-grow">
                                    <span className="font-bold text-xs sm:text-sm block text-green-300">AI Intelligence Engine</span>
                                    <span className="text-[10px] sm:text-xs text-blue-200 block mt-0.5">FastAPI + Python Time-Series Models</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center group/item hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-red-500 border border-red-200 flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                    <Shield className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white/10 backdrop-blur px-4 py-2 sm:py-3 rounded-lg border border-white/5 flex-grow">
                                    <span className="font-bold text-xs sm:text-sm block">Depot Control Room</span>
                                    <span className="text-[10px] sm:text-xs text-blue-200 block mt-0.5">Automated Escalation Pipeline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Infrastructure badges */}
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-6 border-t border-gray-200">
                <div className="flex items-center text-gray-500 hover:text-ti-navy transition-colors whitespace-nowrap text-xs sm:text-sm font-medium">
                    <Cloud className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> AWS GovCloud Ready
                </div>
                <div className="flex items-center text-gray-500 hover:text-ti-navy transition-colors whitespace-nowrap text-xs sm:text-sm font-medium">
                    <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> MongoDB Distributed
                </div>
                <div className="flex items-center text-gray-500 hover:text-ti-navy transition-colors whitespace-nowrap text-xs sm:text-sm font-medium">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Twilio Backend Integ.
                </div>
            </div>
        </div>
    );
}
