import React, { useEffect } from 'react';
import { CheckCircle, Shield } from 'lucide-react';

export default function LogoutSuccess({ navigateTo }) {
    useEffect(() => {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('operatorId');
        sessionStorage.removeItem('authToken');
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex flex-col items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={3} />
                    </div>

                    <h2 className="text-xl md:text-2xl font-extrabold text-[#0f1d3a] mb-6">Successfully Logged Out</h2>

                    <div className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-8 text-left w-full">
                        <p className="text-sm text-[#0f1d3a] leading-relaxed font-medium">
                            You have been securely signed out of your Transit India account. Thank you for using our service. We look forward to seeing you again.
                        </p>
                    </div>

                    <button
                        onClick={() => navigateTo('track')}
                        className="w-full py-3.5 bg-[#0b162c] hover:bg-[#1a2b4c] text-white font-bold rounded-lg shadow-md transition-colors mb-6"
                    >
                        Return to Home
                    </button>

                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center">
                        <Shield className="w-3 h-3 mr-1.5" />
                        Official Government Confirmation
                    </p>
                </div>

                <div className="h-2 w-full bg-green-500"></div>
            </div>
        </div>
    );
}
