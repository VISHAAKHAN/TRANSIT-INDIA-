import React, { useEffect } from 'react';
import { CheckCircle, Shield } from 'lucide-react';

export default function LogoutSuccess({ navigateTo }) {
    useEffect(() => {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('operatorId');
        sessionStorage.removeItem('authToken');
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 transition-colors duration-300">
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-[0_8px_30px_rgba(15,30,54,0.06)] border-2 border-[#FF9933]/15 w-full max-w-sm overflow-hidden text-center relative z-10 chakra-pattern-modern">
                <div className="p-8 pb-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={3} />
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-[#0F1E36] dark:text-white mb-6 uppercase tracking-wider">Successfully Logged Out</h2>

                    <div className="bg-[#FAF9F6] dark:bg-[#070F1E]/50 border-l-4 border-green-500 p-4.5 rounded-r-2xl mb-8 text-left w-full">
                        <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-bold">
                            You have been securely signed out of your Transit India account. Thank you for using our service. We look forward to seeing you again.
                        </p>
                    </div>

                    <button
                        onClick={() => navigateTo('track')}
                        className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] hover:from-orange-655 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-md transition-all text-xs uppercase tracking-widest transform active:scale-95 mb-6"
                    >
                        Return to Home
                    </button>

                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 mr-1.5 text-[#FF9933]" />
                        Official Government Confirmation
                    </p>
                </div>

                <div className="h-1.5 w-full bg-green-500"></div>
            </div>
        </div>
    );
}
