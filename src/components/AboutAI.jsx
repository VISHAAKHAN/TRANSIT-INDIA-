import React from 'react';
import { Database, Server, Smartphone, BrainCircuit, Activity, LineChart, Shield, Cloud, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../translations';

export default function AboutAI({ lang }) {
    return (
        <div className="max-w-6xl mx-auto w-full px-2 pt-6 pb-12 transition-colors duration-300">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-[#FF9933]/15 to-[#12820B]/15 rounded-3xl mb-4 border border-[#FF9933]/30 shadow-sm animate-pulse">
                    <BrainCircuit size={40} className="text-[#FF9933]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] dark:text-white mb-4 tracking-tight">{t('aiDecisionTitle', lang)}</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm font-bold uppercase tracking-widest px-4">
                    {t('aiDecisionDesc', lang)}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                {/* Flow Diagram / Explainers */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-md border-2 border-[#FF9933]/15 p-6 sm:p-8 chakra-pattern-modern">
                        <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mb-6 flex items-center uppercase tracking-wider">
                            <LineChart className="w-5 h-5 mr-3 text-[#FF9933]" /> {t('predictiveArrivalWindow', lang)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-bold border-l-4 border-[#FF9933] pl-4 py-1">
                            {t('timeSeriesRegressionDesc', lang)}
                        </p>
                        <div className="pl-4 sm:pl-8 space-y-4 pt-2">
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs text-gray-555 dark:text-gray-450 font-bold">{t('predictiveInputs', lang)}</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs text-gray-555 dark:text-gray-450 font-bold">{t('predictiveOutputs', lang)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-md border-2 border-[#FF9933]/15 p-6 sm:p-8 chakra-pattern-modern">
                        <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mb-6 flex items-center uppercase tracking-wider">
                            <Activity className="w-5 h-5 mr-3 text-red-500" /> {t('delayClassification', lang)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-bold border-l-4 border-red-550 pl-4 py-1">
                            {t('speedAnomaliesDesc', lang)}
                        </p>
                        <div className="pl-4 sm:pl-8 space-y-4 pt-2">
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs text-gray-555 dark:text-gray-450 font-bold">{t('delayInputs', lang)}</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-xs text-gray-555 dark:text-gray-450 font-bold">{t('delayOutputs', lang)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Visual & Architecture */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-gradient-to-br from-[#0F1E36] to-[#070F1E] rounded-3xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden flex-grow border-2 border-[#FF9933]/20">
                        {/* Soft Ashoka Chakra decorative background */}
                        <div className="absolute right-0 top-0 w-48 h-48 bg-[#FF9933]/10 rounded-full blur-3xl"></div>

                        <h3 className="text-base font-black text-white mb-8 border-b-2 border-slate-800 pb-4 uppercase tracking-widest">{t('architecturalFlow', lang)}</h3>

                        <div className="flex flex-col space-y-6 relative ml-2 sm:ml-4">
                            <div className="absolute w-0.5 bg-slate-800 left-[11px] top-6 bottom-6 z-0"></div>

                            <div className="relative z-10 flex items-center hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-[#FF9933] border border-orange-300 flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(255,153,51,0.4)]">
                                    <Smartphone className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex-grow">
                                    <span className="font-extrabold text-xs block uppercase tracking-wider">{t('passengerInterface', lang)}</span>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">React.js + Tailwind CSS</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center mr-4 shadow-md">
                                    <Server className="w-3.5 h-3.5 text-[#0F1E36]" />
                                </div>
                                <div className="bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex-grow">
                                    <span className="font-extrabold text-xs block uppercase tracking-wider">{t('coreServicesApi', lang)}</span>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">FastAPI Backend (Python)</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-[#12820B] border border-green-300 flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(18,130,11,0.4)]">
                                    <BrainCircuit className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-[#12820B]/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#12820B]/30 flex-grow">
                                    <span className="font-extrabold text-xs block text-[#12820B] uppercase tracking-wider">{t('aiIntelligenceEngine', lang)}</span>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">SageMaker Forecast + LSTM</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center hover:-translate-x-1 transition-transform">
                                <div className="w-6 h-6 rounded bg-red-600 border border-red-300 flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                                    <Shield className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex-grow">
                                    <span className="font-extrabold text-xs block uppercase tracking-wider">{t('depotControlRoom', lang)}</span>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">Automated Escalation Pipeline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Infrastructure badges */}
            <div className="bg-[#FAF9F6] dark:bg-[#0B1E36] rounded-2xl p-5 border border-gray-150 dark:border-slate-800/80 flex flex-wrap justify-center sm:justify-between items-center gap-4 transition-colors">
                <div className="flex items-center text-gray-500 hover:text-[#0F1E36] dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                    <Cloud className="w-4.5 h-4.5 mr-2 text-[#FF9933]" /> {t('awsGovCloud', lang)}
                </div>
                <div className="flex items-center text-gray-500 hover:text-[#0F1E36] dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                    <Database className="w-4.5 h-4.5 mr-2 text-[#FF9933]" /> {t('postgresqlDistributed', lang)}
                </div>
                <div className="flex items-center text-gray-500 hover:text-[#0F1E36] dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                    <Phone className="w-4.5 h-4.5 mr-2 text-[#FF9933]" /> {t('smsAlertsChannel', lang)}
                </div>
            </div>
        </div>
    );
}
