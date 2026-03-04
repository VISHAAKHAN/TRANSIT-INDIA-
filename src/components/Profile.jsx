import React, { useState } from 'react';
import { User, CheckCircle, ShieldAlert } from 'lucide-react';
import { t } from '../translations';

export default function Profile({ navigateTo, lang }) {
    const [aadhaar, setAadhaar] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [dob, setDob] = useState('');

    const tamilNaduDistricts = [
        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
        "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
        "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
        "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
        "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
        "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
        "Vellore", "Viluppuram", "Virudhunagar"
    ];
    const keralaDistricts = [
        "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
        "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
        "Thiruvananthapuram", "Thrissur", "Wayanad"
    ];

    React.useEffect(() => {
        const savedRegion = localStorage.getItem('userRegion');
        const savedDistrict = localStorage.getItem('userDistrict');
        const savedAadhaar = localStorage.getItem('userAadhaar');
        const savedDob = localStorage.getItem('userDOB');
        const savedVerified = localStorage.getItem('userVerified');

        if (savedRegion) setRegion(savedRegion);
        if (savedDistrict) setDistrict(savedDistrict);
        if (savedAadhaar) setAadhaar(savedAadhaar);
        if (savedDob) setDob(savedDob);
        if (savedVerified === 'true') setIsVerified(true);
    }, []);

    const handleAadhaarChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 12) val = val.substring(0, 12);
        let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
        setAadhaar(formatted);
        if (isVerified) setIsVerified(false);
    };

    const handleVerifyClick = () => {
        if (aadhaar.replace(/\s/g, '').length === 12) {
            setIsVerified(true);
            setValidationError('');
        } else {
            setValidationError(t('invalidAadhaar', lang) || "Invalid Aadhaar. Must be 12 digits.");
        }
    };

    const handleSaveClick = () => {
        if (!isVerified) {
            setValidationError(t('pleaseVerifyAadhaar', lang));
            return;
        }
        // Save core fields
        setValidationError('');
        localStorage.setItem('userRegion', region);
        localStorage.setItem('userDistrict', district);
        localStorage.setItem('userAadhaar', aadhaar);
        localStorage.setItem('userDOB', dob);
        localStorage.setItem('userVerified', 'true');

        setShowModal(true);
    };

    return (
        <div className="max-w-6xl mx-auto w-full pt-4 pb-12 transition-colors">
            <h1 className="text-3xl font-extrabold text-ti-navy dark:text-white mb-1 inline-block transition-colors">{t('userProfileTitle', lang)}</h1>
            <div className="w-16 h-1 bg-[#F25E22] mb-6"></div>

            {validationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-lg flex items-center max-w-2xl">
                    <ShieldAlert className="w-5 h-5 mr-2" />
                    {validationError}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Setup (Left Column) */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors">
                        <div className="px-6 py-4 flex items-center bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
                                <User className="w-3.5 h-3.5 text-[#F25E22]" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{t('profileSetup', lang)}</h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('fullName', lang)}</label>
                                    <input type="text" defaultValue="Arjun Sharma" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('mobileNumberLabel', lang)}</label>
                                    <div className="relative">
                                        <input type="text" defaultValue="+91 98765 43210" disabled className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-400 cursor-not-allowed transition-colors" />
                                        <div className="absolute right-3 top-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded flex items-center blur-none border border-green-100 dark:border-green-800 transition-colors">
                                            <CheckCircle className="w-3 h-3 mr-1" /> {t('verified', lang)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('fullAddress', lang)}</label>
                                    <textarea rows="4" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] transition-colors" placeholder="Enter your complete residential address"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('languagePreference', lang)}</label>
                                    <select className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] appearance-none transition-colors">
                                        <option>English</option>
                                        <option>Hindi</option>
                                        <option>Tamil</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('dob', lang)}</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] transition-colors max-h-[50px]"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('aadhaarNumber', lang)} <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal normal-case">{t('forVerification', lang)}</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="XXXX XXXX XXXX"
                                            value={aadhaar}
                                            onChange={handleAadhaarChange}
                                            className="w-full pl-4 pr-16 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 font-mono tracking-widest focus:ring-1 focus:ring-[#F25E22] transition-colors"
                                        />
                                        <button
                                            onClick={handleVerifyClick}
                                            className={`absolute right-2 top-2 bottom-2 px-3 rounded text-xs font-bold transition-colors ${isVerified ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60'}`}
                                        >
                                            {isVerified ? t('verified', lang) : t('verify', lang)}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('gender', lang)}</label>
                                    <select className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] appearance-none transition-colors">
                                        <option value="">{t('selectGender', lang) || "Select Gender"}</option>
                                        <option>{t('male', lang) || "Male"}</option>
                                        <option>{t('female', lang) || "Female"}</option>
                                        <option>{t('other', lang) || "Other"}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('regionState', lang)}</label>
                                    <select
                                        value={region}
                                        onChange={(e) => {
                                            setRegion(e.target.value);
                                            setDistrict('');
                                        }}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] appearance-none transition-colors"
                                    >
                                        <option value="">{t('selectState', lang)}</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Kerala">Kerala</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('city', lang)}</label>
                                    {region === 'Tamil Nadu' ? (
                                        <select
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] appearance-none transition-colors"
                                        >
                                            <option value="">{t('selectDistrict', lang) || "Select District"}</option>
                                            {tamilNaduDistricts.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    ) : region === 'Kerala' ? (
                                        <select
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#F25E22] appearance-none transition-colors"
                                        >
                                            <option value="">{t('selectDistrict', lang) || "Select District"}</option>
                                            {keralaDistricts.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            placeholder={t('enterDistrict', lang) || "Enter District"}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 cursor-not-allowed transition-colors"
                                            disabled
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">{t('pincode', lang)}</label>
                                    <input type="text" placeholder="XXXXXX" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 tracking-widest focus:ring-1 focus:ring-[#F25E22] transition-colors" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 border-t border-gray-100 dark:border-slate-700 pt-6 transition-colors">
                                <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                    {t('discardChanges', lang)}
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    className="px-6 py-2.5 bg-[#F25E22] hover:bg-[#d44d18] text-white font-bold rounded-lg shadow-sm transition-colors inline-block"
                                >
                                    {t('saveProfile', lang)}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Digital India Banner */}
                    <div className="bg-[#0f1d3a] rounded-xl overflow-hidden shadow-lg relative h-32 flex items-center px-8 border border-[#1b2b4e]">
                        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-1/2">
                            {/* fingerprint / concentric rings pattern mock */}
                            <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                                <circle cx="80" cy="50" r="10" fill="none" stroke="white" strokeWidth="2" />
                                <circle cx="80" cy="50" r="20" fill="none" stroke="white" strokeWidth="2" />
                                <circle cx="80" cy="50" r="30" fill="none" stroke="white" strokeWidth="2" />
                                <circle cx="80" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" />
                                <circle cx="80" cy="50" r="50" fill="none" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="relative z-10 w-full flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">{t('digitalIndiaInitiative', lang)}</h3>
                                <p className="text-gray-300 text-sm max-w-sm">{t('dataEncryptedDesc', lang)}</p>
                            </div>
                            <div className="w-16 h-16 border border-[#2a3c63] rounded bg-[#0b162c] flex flex-col items-center justify-center p-2">
                                <span className="text-[10px] text-gray-400 font-bold mb-1">GOVERNMENT OF INDIA</span>
                                <div className="w-8 h-8 opacity-50"><LogoIcon /></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* About Transit India */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                        <div className="px-6 py-4 flex items-center bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
                                <InfoIcon className="w-3.5 h-3.5 text-[#F25E22]" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{t('aboutTransitIndia', lang)}</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed transition-colors">
                                {t('aboutDesc1', lang)}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed transition-colors">
                                {t('aboutDesc2', lang)}
                            </p>

                            <div className="bg-orange-50 dark:bg-orange-950/30 border-l-4 border-[#F25E22] p-4 rounded-r-lg mb-6 transition-colors">
                                <h4 className="text-[10px] font-bold text-[#F25E22] uppercase tracking-wider mb-2">{t('howItWorks', lang)}</h4>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
                                    {t('howItWorksDesc', lang)}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider transition-colors">Real-Time GPS</span>
                                <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider transition-colors">Predictive ML</span>
                                <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider transition-colors">Multi-Modal</span>
                            </div>
                        </div>
                    </div>

                    {/* Help & Support */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                        <div className="px-6 py-4 flex items-center bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 transition-colors">
                            <HeadsetIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white transition-colors">{t('helpSupport', lang)}</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed transition-colors">
                                {t('helpSupportDesc', lang)}
                            </p>
                            <button className="w-full py-2.5 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 font-bold text-sm border border-gray-200 dark:border-slate-600 rounded-lg transition-colors">
                                {t('contactSupport', lang)}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
                        <div className="p-8 text-center pb-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" strokeWidth={3} />
                            </div>

                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors">{t('profileSavedSuccessfully', lang)}</h2>

                            <div className="bg-gray-50 dark:bg-slate-900/50 border-l-4 border-green-500 p-4 rounded-r-lg mb-8 text-left transition-colors">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium transition-colors">
                                    {t('profileUpdateDesc', lang)}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3.5 bg-[#0b162c] hover:bg-[#1a2b4c] dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg shadow-md transition-colors mb-4"
                            >
                                {t('acknowledgeContinue', lang)}
                            </button>

                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest pb-2 transition-colors">
                                REFERENCE ID: TRN-2024-B842-SHRM
                            </p>
                        </div>

                        <div className="h-1.5 w-full bg-green-500"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

const InfoIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
const HeadsetIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>;
const LogoIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>;
