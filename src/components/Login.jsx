import React, { useState } from 'react';
import { RefreshCcw, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { t } from '../translations';
import { api } from '../api';

const CAPTCHA_OPTIONS = [
    'H K 9 2 Q',
    'A 7 X P 3',
    '8 B T N 5',
    'M 4 V 2 C',
    '9 G Y 6 W',
    'R 3 K L 8',
    'J 5 F Z 1',
    'X 2 P M 9'
];

export default function Login({ navigateTo, lang }) {
    const [mobile, setMobile] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [currentCaptcha, setCurrentCaptcha] = useState(CAPTCHA_OPTIONS[0]);

    const handleRefreshCaptcha = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * CAPTCHA_OPTIONS.length);
        } while (CAPTCHA_OPTIONS[randomIndex] === currentCaptcha && CAPTCHA_OPTIONS.length > 1);
        setCurrentCaptcha(CAPTCHA_OPTIONS[randomIndex]);
        setCaptchaInput('');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const expectedCaptcha = currentCaptcha.replace(/\s/g, '');
        if (captchaInput.replace(/\s/g, '').toUpperCase() !== expectedCaptcha) {
            setError(t('incorrectCaptcha', lang));
            return;
        }
        setError('');
        setSending(true);

        // Send real OTP via AWS SNS
        const result = await api.sendOTP(mobile);
        setSending(false);

        if (result.status === 'sent') {
            sessionStorage.setItem('otpPhone', mobile);
            // If SMS failed, backend returns debug_otp for testing
            if (result.debug_otp) {
                sessionStorage.setItem('debugOtp', result.debug_otp);
            }
            navigateTo('otp');
        } else {
            setError(result.detail || 'Failed to send OTP. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto w-full pt-12 pb-20">
            <h2 className="text-xl font-bold text-[#0f172a] dark:text-gray-100 text-center mb-6 tracking-[0.2em] uppercase transition-colors">{t('citizenLogin', lang)}</h2>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 relative z-10 transition-colors">
                <div className="mb-8">
                    <h3 className="text-3xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight transition-colors">{t('pleaseSignIn', lang)}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors">{t('enterMobileDesc', lang)}</p>
                </div>
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-lg flex items-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 text-left">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 transition-colors">{t('mobileNumber', lang)}</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 font-bold rounded-l-lg transition-colors">
                                +91
                            </span>
                            <input
                                type="tel"
                                placeholder={t('mobilePlaceholder', lang)}
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-r-lg focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-colors text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500"
                                required
                                pattern="[0-9]{10}"
                            />
                        </div>
                    </div>

                    {/* CAPTCHA Box */}
                    <div className="border border-gray-200 dark:border-slate-600 rounded-xl p-5 bg-gray-50/50 dark:bg-slate-900/50 transition-colors">
                        <div className="flex items-center mb-4">
                            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                            <label className="block text-sm font-bold text-[#0f172a] dark:text-gray-200 tracking-wide">{t('securityVerification', lang)}</label>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded text-center py-2.5 text-2xl font-mono text-gray-600 dark:text-gray-300 font-bold tracking-[0.4em] select-none italic line-through decoration-gray-400 dark:decoration-gray-500 decoration-2 transition-colors">
                                {currentCaptcha}
                            </div>
                            <button
                                type="button"
                                onClick={handleRefreshCaptcha}
                                className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder={t('enterCaptcha', lang)}
                            value={captchaInput}
                            onChange={(e) => {
                                setCaptchaInput(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-colors text-sm font-medium uppercase text-gray-900 dark:text-white dark:placeholder-gray-500"
                            required
                        />
                    </div>

                    <div className="flex items-start mb-6">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                className="w-4 h-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-[#f97316] checked:bg-[#f97316] transition-colors"
                                required
                            />
                        </div>
                        <label htmlFor="terms" className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                            {t('agreeTerms', lang)}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group uppercase tracking-widest text-sm disabled:opacity-60"
                    >
                        {sending ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending OTP...</>
                        ) : (
                            <>{t('sendOTP', lang)} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium border-t border-gray-100 dark:border-slate-700 pt-6 transition-colors">
                    {t('facingIssues', lang)} <a href="#" className="font-bold text-[#0f172a] dark:text-white hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors">{t('contactHelpdesk', lang)}</a>
                </div>
            </div>
        </div>
    );
}
