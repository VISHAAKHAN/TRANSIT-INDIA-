import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { t } from '../translations';

export default function OTP({ navigateTo, lang }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        if (val && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        // Assuming success on any input for demo
        navigateTo('track');
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
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6 transition-colors">{t('enter6DigitCode', lang)}</p>
                <div className="w-12 h-1 bg-ti-saffron rounded-full mx-auto mb-8 transition-colors"></div>

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
                        {t('didNotReceiveCode', lang)} <a href="#" className="font-bold text-ti-navy dark:text-white hover:text-ti-saffron dark:hover:text-ti-saffron transition-colors">{t('resendOtp', lang)}</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[52px] bg-gradient-to-r from-ti-saffron to-ti-saffron-light text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center uppercase tracking-wide"
                        disabled={otp.join('').length < 6}
                    >
                        {t('verifyOtpSecurely', lang)} <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
}
