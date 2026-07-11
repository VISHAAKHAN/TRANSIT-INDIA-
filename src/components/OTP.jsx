import React, { useState, useRef } from 'react';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, Loader2, Shield, Phone, Bell } from 'lucide-react';
import { t } from '../translations';
import { api } from '../api';

export default function OTP({ navigateTo, lang, setLang, region = localStorage.getItem('userRegion') || 'Tamil Nadu' }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const inputs = useRef([]);

    const phone = sessionStorage.getItem('otpPhone') || '';
    const debugOtp = sessionStorage.getItem('debugOtp') || '';

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);
        setError('');

        if (val && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) return;

        setVerifying(true);
        setError('');

        const result = await api.verifyOTP(phone, otpCode);
        setVerifying(false);

        if (result.status === 'verified') {
            sessionStorage.setItem('authToken', result.token);
            sessionStorage.setItem('userRole', 'operator');
            sessionStorage.setItem('operatorName', result.operator_name || 'Vishaakhan');
            if (result.operator_id) {
                sessionStorage.setItem('operatorId', result.operator_id);
            }
            sessionStorage.removeItem('otpPhone');
            sessionStorage.removeItem('debugOtp');
            navigateTo('operatorDashboard');
        } else {
            setError(result.detail || 'Verification failed. Please try again.');
        }
    };

    const handleResend = async () => {
        if (!phone) {
            navigateTo('login');
            return;
        }
        setResending(true);
        setError('');
        await api.sendOTP(phone);
        setResending(false);
        setOtp(['', '', '', '', '', '']);
        if (inputs.current[0]) inputs.current[0].focus();
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
                        {/* Back navigation button */}
                        <button
                            onClick={() => navigateTo('login')}
                            className="absolute top-6 left-6 text-gray-400 hover:text-[#0F1E36] dark:hover:text-white transition-colors cursor-pointer"
                            title="Back to login"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Brand Logo Badge */}
                        <div className="flex justify-center mb-6">
                            <img
                                src="/transit_logo.png"
                                alt="Transit India Logo"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-150 dark:border-slate-800 shadow-md"
                            />
                        </div>

                        <h3 className="text-lg md:text-xl font-black text-[#0F1E36] dark:text-white text-center mb-1.5 uppercase tracking-wide">
                            {t('otpVerification', lang)}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-555 text-center mb-1">
                            {t('enter6DigitCode', lang)}
                        </p>
                        {phone && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mb-5 font-bold uppercase tracking-wider">
                                Sent to +91 {phone.substring(0, 4)}****{phone.substring(8)}
                            </p>
                        )}

                        {debugOtp && (
                            <div className="mb-6 p-4 bg-[#FF9933]/5 dark:bg-[#FF9933]/5 border-2 border-dashed border-[#FF9933]/30 rounded-2xl text-center">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">Debug Mode OTP (SMS Mocked)</p>
                                <p className="text-3xl font-black text-[#FF9933] tracking-[0.3em] mt-2 font-mono">{debugOtp}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-250 text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-wider rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="flex justify-between space-x-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(el) => (inputs.current[index] = el)}
                                        className="w-10 h-12 text-center text-xl font-black bg-[#FAF9F6] dark:bg-[#070F1E] border border-gray-250 dark:border-slate-800 rounded-xl focus:border-[#008060] focus:ring-0 text-[#0F1E36] dark:text-white transition-all shadow-sm font-mono"
                                        required
                                    />
                                ))}
                            </div>

                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-center">
                                {t('didNotReceiveCode', lang)}{' '}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="font-black text-[#008060] hover:text-[#005c45] transition-colors uppercase tracking-wider cursor-pointer"
                                >
                                    {resending ? t('sending', lang) : t('resendOtp', lang)}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-[#007054] to-[#005c45] hover:from-[#006048] hover:to-[#004e3b] text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center uppercase tracking-widest text-[10px] disabled:opacity-60 transform active:scale-95 space-x-2 cursor-pointer mb-6"
                                disabled={otp.join('').length < 6 || verifying}
                            >
                                {verifying ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> <span>{t('verifying', lang)}</span></>
                                ) : (
                                    <><ShieldCheck className="w-3.5 h-3.5" /> <span>{t('verifyOtpSecurely', lang)}</span></>
                                )}
                            </button>
                        </form>

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
