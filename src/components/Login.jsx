import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Bell, Phone, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { t } from '../translations';
import { api } from '../api';

export default function Login({ navigateTo, lang, setLang, region = localStorage.getItem('userRegion') || 'Tamil Nadu', setGlobalRegion }) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!mobile || mobile.length !== 10) {
            setError(t('mobileError', lang) || 'Please enter a valid 10-digit mobile number as ADMIN ID.');
            return;
        }
        setError('');

        // Direct bypass for specified Admin ID and Password
        if (mobile === '1234567890' && password === '123123') {
            sessionStorage.setItem('authToken', 'mock-admin-token-123123');
            sessionStorage.setItem('userRole', 'operator');
            sessionStorage.setItem('operatorName', 'Vishaakhan');
            sessionStorage.setItem('operatorId', 'OP-1234');
            navigateTo('operatorDashboard');
            return;
        }

        setSending(true);

        // Send OTP via API
        const result = await api.sendOTP(mobile);
        setSending(false);

        if (result.status === 'sent') {
            sessionStorage.setItem('otpPhone', mobile);
            if (result.debug_otp) {
                sessionStorage.setItem('debugOtp', result.debug_otp);
            }
            navigateTo('otp');
        } else {
            setError(result.detail || 'Failed to send OTP. Please check your credentials.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#F4EFE3] dark:bg-[#070F1E] text-white overflow-y-auto">
            {/* Header */}
            <header className="bg-[#020B19] border-b-2 border-[#FF9933] px-6 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => navigateTo('track')} 
                        className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm"
                        title="Back to Home"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('goBack', lang)}</span>
                    </button>
                    <div className="border-l border-white/10 pl-3 text-left">
                        <div className="flex items-baseline">
                            <span className="text-lg font-black tracking-tight text-[#FF9933]">Transit</span>
                            <span className="text-lg font-black tracking-tight text-white ml-0.5">India</span>
                        </div>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none">{t('ministryOfTransport', lang)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <select 
                        value={lang} 
                        onChange={(e) => setLang(e.target.value)}
                        className="bg-[#0B1E36] text-xs font-black uppercase text-white border border-white/20 rounded-xl px-2.5 py-1.5 focus:ring-0 cursor-pointer shadow-sm"
                    >
                        <option value="English">English</option>
                        <option value="Hindi">हिन्दी</option>
                        <option value="Tamil">தமிழ்</option>
                        <option value="Malayalam">മലയാളം</option>
                    </select>
                    <select 
                        value={region} 
                        onChange={(e) => {
                            const newRegion = e.target.value;
                            localStorage.setItem('userRegion', newRegion);
                            if (setGlobalRegion) {
                                setGlobalRegion(newRegion);
                            }
                        }}
                        className="bg-[#0B1E36] text-xs font-black uppercase text-white border border-white/20 rounded-xl px-2.5 py-1.5 focus:ring-0 cursor-pointer shadow-sm"
                    >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Kerala">Kerala</option>
                    </select>
                    <div className="flex items-center space-x-1.5 text-[10px] font-black text-[#FF9933] uppercase tracking-widest shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
                        <span className="hidden md:inline">{t('securePortal', lang)}</span>
                    </div>
                </div>
            </header>

            {/* Split Content */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Left side panel (dark navy blue with HTML overlay) */}
                <div className="w-full md:w-1/2 bg-[#020B19] relative overflow-hidden shrink-0 min-h-[500px] md:min-h-0 border-r-[3px] border-[#FF9933] flex flex-col justify-between p-12 md:p-20 text-left">
                    {/* Decorative dot pattern */}
                    <div className="absolute top-10 left-10 w-32 h-32 opacity-15 pointer-events-none">
                        <div className="grid grid-cols-6 gap-3.5">
                            {Array.from({ length: 36 }).map((_, idx) => (
                                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            ))}
                        </div>
                    </div>

                    {/* Sree Rangam Temple Gopuram PNG */}
                    <img 
                        src="/sree_rangam_gopuram.png" 
                        alt="Sree Rangam Gopuram"
                        className="absolute bottom-0 right-0 w-[290px] sm:w-[340px] md:w-[410px] h-auto object-contain pointer-events-none select-none z-0 opacity-25"
                        style={{ mixBlendMode: 'screen' }}
                    />

                    <div className="my-auto z-10 max-w-md pt-12">
                        <p className="text-gray-400 text-sm font-extrabold uppercase tracking-[0.25em] mb-3">{t('secureAccessTo', lang)}</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                            {t('indiasSmartTransit', lang)}
                        </h2>
                        <h2 className="text-4xl md:text-5xl font-black text-[#00B074] leading-tight tracking-tight mb-5">
                            {t('network', lang)}
                        </h2>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-[#00B074] to-transparent mb-6"></div>
                        
                        <p className="text-sm md:text-base font-black tracking-wide leading-relaxed">
                            <span className="text-[#00B074]">{t('realTimeSlogan', lang)}</span>
                            <span className="text-white">{t('reliableSlogan', lang)}</span>
                            <span className="text-[#FF9933]">{t('responsibleSlogan', lang)}</span>
                        </p>
                    </div>

                    <div className="z-10 mt-auto pt-6 flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00B074] shadow-md shrink-0">
                            <Shield className="w-5.5 h-5.5" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-300 font-extrabold uppercase tracking-wider leading-tight">{t('protectedByNIC', lang)}</p>
                            <p className="text-[11px] text-gray-300 font-extrabold uppercase tracking-wider leading-tight">{t('nicSecurityProtocols', lang)}</p>
                        </div>
                    </div>
                </div>

                {/* Right side panel (warm white/cream) */}
                <div className="w-full md:w-1/2 bg-[#F4EFE3] flex items-center justify-center p-6 md:p-12">
                    <div className="bg-white dark:bg-[#0B1E36] rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800/80 p-8 max-w-md w-full relative z-10 transition-colors duration-300">
                        {/* Brand Logo Badge */}
                        <div className="flex justify-center mb-6">
                            <img
                                src="/transit_logo.png"
                                alt="Transit India Logo"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-150 dark:border-slate-800 shadow-md"
                            />
                        </div>

                        <h3 className="text-lg md:text-xl font-black text-[#0F1E36] dark:text-white text-center mb-1 tracking-tight">
                            {t('controlRoomAccess', lang)}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-555 text-center mb-5 uppercase tracking-wider">
                            {t('secureAdminPortal', lang)}
                        </p>

                        {/* Banner */}
                        <div className="mb-6 py-2 px-4 bg-[#E8F8F5] dark:bg-[#008060]/5 border border-[#B3F2E4] dark:border-[#008060]/20 rounded-xl flex items-center justify-center space-x-2 text-[#006048] dark:text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider text-center">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>{t('authTransportOnly', lang)}</span>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-250 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-wider rounded-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
                            <div>
                                <label className="block text-[9px] font-black text-black dark:text-white uppercase tracking-widest mb-1.5">
                                    {t('adminIdLabel', lang)}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <User className="h-4.5 w-4.5" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder={t('adminIdPlaceholder', lang)}
                                        value={mobile}
                                        onChange={(e) => {
                                            setMobile(e.target.value.replace(/\D/g, ''));
                                            if (error) setError('');
                                        }}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white bg-white dark:bg-[#070F1E] focus:border-[#008060] focus:ring-0 placeholder-gray-400 shadow-sm"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-[9px] font-black text-black dark:text-white uppercase tracking-widest">
                                        {t('passwordLabel', lang)}
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="h-4.5 w-4.5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('passwordPlaceholder', lang)}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white bg-white dark:bg-[#070F1E] focus:border-[#008060] focus:ring-0 placeholder-gray-400 shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-455 hover:text-[#008060]"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-bold">
                                <label className="flex items-center text-black dark:text-white cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-[#008060] border-gray-300 dark:border-slate-800 rounded focus:ring-0 mr-2 checked:bg-[#008060]"
                                    />
                                    {t('rememberDevice', lang)}
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); alert("Please contact your regional division transport administrator to reset your control room credentials."); }} className="text-[#008060] hover:underline font-black">
                                    {t('forgotPassword', lang)}
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-3.5 bg-gradient-to-r from-[#007054] to-[#005c45] hover:from-[#006048] hover:to-[#004e3b] text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center uppercase tracking-widest text-[10px] disabled:opacity-60 transform active:scale-95 space-x-2 cursor-pointer"
                            >
                                {sending ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>{t('sendingOtpStatus', lang) || "Sending OTP..."}</span></>
                                ) : (
                                    <><Lock className="w-3.5 h-3.5" /> <span>{t('secureLogin', lang)}</span></>
                                )}
                            </button>
                        </form>

                        {/* OR Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-150 dark:border-slate-850"></div>
                            </div>
                            <div className="relative flex justify-center text-[9px] font-bold uppercase">
                                <span className="bg-white dark:bg-[#0B1E36] px-3 text-gray-455 dark:text-gray-500">{t('or', lang)}</span>
                            </div>
                        </div>

                        {/* Log with Google Button */}
                        <button
                            type="button"
                            onClick={() => alert("Google login integration is restricted to transport authority directory accounts.")}
                            className="w-full py-3.5 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 font-extrabold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-xs uppercase tracking-widest space-x-2.5 cursor-pointer shadow-sm mb-6"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>{t('loginWithGoogle', lang)}</span>
                        </button>

                        {/* Powered by State government seal inside popup */}
                        <div className="pt-5 border-t border-gray-100 dark:border-slate-850 flex flex-col items-center justify-center space-y-1.5 text-gray-500 dark:text-gray-400 font-bold">
                            <span className="text-[9px] uppercase tracking-[0.25em]">{t('poweredBy', lang)}</span>
                            <img 
                                src={region === 'Kerala' ? '/kerala_seal.png' : '/tn_seal.png'} 
                                className={region === 'Kerala' ? "h-20 w-auto object-contain filter dark:brightness-90" : "h-12 w-auto object-contain filter dark:brightness-90"} 
                                alt={region === 'Kerala' ? 'Government of Kerala Seal' : 'Government of Tamil Nadu Seal'} 
                            />
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#0F1E36] dark:text-white mt-1">
                                {region === 'Kerala' ? t('govtOfKerala', lang) : t('govtOfTamilNadu', lang)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#020B19] border-t border-white/5 py-4 px-8 flex flex-col md:flex-row justify-between items-center text-white shrink-0 text-[10px] space-y-4 md:space-y-0 shadow-inner">
                <div className="text-gray-400 font-bold">
                    © 2026 {t('copyright', lang)}
                </div>
                <div className="flex items-center space-x-6 text-[9px]">
                    <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#00B074]"></span>
                        <span className="text-[#00B074]">{t('systemOnline', lang)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[#FF9933]">
                        <Shield className="w-3 h-3 text-[#FF9933]" />
                        <span>{t('sslEncrypted', lang)}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 font-bold">
                    <Phone className="w-3.5 h-3.5 text-[#00B074]" />
                    <span className="text-gray-400">{t('supportHotline', lang)}:</span>
                    <span className="text-white hover:text-[#00B074] transition-colors">1800-TRNS-IND</span>
                </div>
            </footer>
        </div>
    );
}
