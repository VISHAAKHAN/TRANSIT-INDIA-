import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { t } from '../translations';
import { api } from '../api';

export default function OTP({ navigateTo, lang }) {
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
        <div className="max-w-md mx-auto w-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 relative overflow-hidden text-center z-10 transition-colors">
                <button
                    onClick={() => navigateTo('login')}
                    className="absolute top-6 left-6 text-gray-400 hover:text-ti-navy dark:hover:text-white transition-colors pointer-cursor"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-3xl font-extrabold text-ti-navy dark:text-white mb-1 uppercase transition-colors">{t('otpVerification', lang)}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-2 transition-colors">{t('enter6DigitCode', lang)}</p>
                {phone && (
                    <p className="text-gray-400 dark:text-gray-500 text-xs mb-4 transition-colors">
                        Sent to +91 {phone.substring(0, 4)}****{phone.substring(8)}
                    </p>
                )}
                <div className="w-12 h-1 bg-ti-saffron rounded-full mx-auto mb-4 transition-colors"></div>

                {debugOtp && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">SMS delivery unavailable. Your OTP:</p>
                        <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 tracking-[0.3em] mt-1">{debugOtp}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-bold rounded-lg">
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
                                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-ti-saffron dark:focus:border-ti-saffron focus:ring-0 text-ti-navy dark:text-white transition-all shadow-sm"
                                required
                            />
                        ))}
                    </div>

                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                        {t('didNotReceiveCode', lang)}{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="font-bold text-ti-navy dark:text-white hover:text-ti-saffron dark:hover:text-ti-saffron transition-colors"
                        >
                            {resending ? 'Sending...' : t('resendOtp', lang)}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[52px] bg-gradient-to-r from-ti-saffron to-ti-saffron-light text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center uppercase tracking-wide disabled:opacity-60"
                        disabled={otp.join('').length < 6 || verifying}
                    >
                        {verifying ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
                        ) : (
                            <>{t('verifyOtpSecurely', lang)} <ArrowRight className="w-5 h-5 ml-2" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
