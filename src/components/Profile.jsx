import React, { useState } from 'react';
import { User, CheckCircle, ShieldAlert, Info, Headphones, Shield } from 'lucide-react';
import { t } from '../translations';

export default function Profile({ navigateTo, lang, setLang, setGlobalRegion }) {
    const [aadhaar, setAadhaar] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [dob, setDob] = useState('');
    const [userName, setUserName] = useState('');

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
        const savedName = localStorage.getItem('userName');

        if (savedRegion) setRegion(savedRegion);
        if (savedDistrict) setDistrict(savedDistrict);
        if (savedAadhaar) setAadhaar(savedAadhaar);
        if (savedDob) setDob(savedDob);
        if (savedVerified === 'true') setIsVerified(true);
        if (savedName) setUserName(savedName);
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
            setValidationError(t('pleaseVerifyAadhaar', lang) || "Please verify your Aadhaar number before saving.");
            return;
        }
        setValidationError('');
        localStorage.setItem('userName', userName);
        localStorage.setItem('userRegion', region);
        localStorage.setItem('userDistrict', district);
        localStorage.setItem('userAadhaar', aadhaar);
        localStorage.setItem('userDOB', dob);
        localStorage.setItem('userVerified', 'true');

        if (setGlobalRegion) {
            setGlobalRegion(region);
        }

        setShowModal(true);
    };

    return (
        <div className="max-w-6xl mx-auto w-full pt-4 pb-12 px-2 transition-colors duration-300">
            <h1 className="text-3xl font-black text-[#0F1E36] dark:text-white mb-2 tracking-tight">{t('userProfileTitle', lang)}</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] rounded-full mb-8"></div>

            {validationError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-wider rounded-2xl flex items-center max-w-2xl shadow-sm">
                    <ShieldAlert className="w-5 h-5 mr-3 shrink-0" />
                    {validationError}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Setup (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-[0_8px_30px_rgba(15,30,54,0.06)] border-2 border-[#FF9933]/15 overflow-hidden transition-colors chakra-pattern-modern">
                        <div className="px-6 py-4.5 flex items-center bg-[#FAF9F6] dark:bg-[#070F1E]/40 border-b border-gray-150 dark:border-slate-800">
                            <div className="w-8 h-8 rounded-xl bg-[#FF9933]/10 dark:bg-[#FF9933]/5 border border-[#FF9933]/25 flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-[#FF9933]" />
                            </div>
                            <h2 className="text-base font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{t('profileSetup', lang)}</h2>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('fullName', lang)}</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('mobileNumberLabel', lang)}</label>
                                    <div className="relative">
                                        <input type="text" defaultValue="+91 98765 43210" disabled className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-800 bg-[#FAF9F6] dark:bg-[#070F1E]/60 rounded-xl text-xs font-black text-gray-405 dark:text-gray-500 cursor-not-allowed" />
                                        <div className="absolute right-3.5 top-2.5 bg-[#12820B]/10 dark:bg-[#12820B]/5 text-[#12820B] text-[9px] font-black px-2 py-1.5 rounded-lg border border-[#12820B]/20 flex items-center uppercase tracking-wider">
                                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> {t('verified', lang)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('fullAddress', lang)}</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 resize-none" placeholder="Enter your complete address..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('languagePreference', lang)}</label>
                                    <select 
                                        value={lang}
                                        onChange={(e) => setLang && setLang(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 appearance-none cursor-pointer"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Malayalam">Malayalam</option>
                                    </select>
                                </div>
                            </div>

                            {/* Aadhaar Card Container design */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('dob', lang)}</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                        {t('aadhaarNumber', lang)} <span className="text-[8px] text-gray-400 font-bold normal-case">({t('forVerification', lang)})</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="XXXX XXXX XXXX"
                                            value={aadhaar}
                                            onChange={handleAadhaarChange}
                                            className="w-full pl-4 pr-16 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-xs font-black text-[#0F1E36] dark:text-white tracking-widest focus:border-[#FF9933] focus:ring-0 font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyClick}
                                            className={`absolute right-2 top-2 bottom-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${isVerified ? 'bg-[#12820B]/10 text-[#12820B] border border-[#12820B]/20' : 'bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30 hover:bg-[#FF9933]/25 active:scale-95'}`}
                                        >
                                            {isVerified ? t('verified', lang) : t('verify', lang)}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('gender', lang)}</label>
                                    <select className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 appearance-none cursor-pointer">
                                        <option value="">{t('selectGender', lang) || "Select Gender"}</option>
                                        <option>{t('male', lang) || "Male"}</option>
                                        <option>{t('female', lang) || "Female"}</option>
                                        <option>{t('other', lang) || "Other"}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('regionState', lang)}</label>
                                    <select
                                        value={region}
                                        onChange={(e) => {
                                            setRegion(e.target.value);
                                            setDistrict('');
                                        }}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 appearance-none cursor-pointer"
                                    >
                                        <option value="">{t('selectState', lang)}</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Kerala">Kerala</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('city', lang)}</label>
                                    {region === 'Tamil Nadu' ? (
                                        <select
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 appearance-none cursor-pointer"
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
                                            className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white focus:border-[#FF9933] focus:ring-0 appearance-none cursor-pointer"
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
                                            className="w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-xs font-black text-gray-405 dark:text-gray-500 cursor-not-allowed"
                                            disabled
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('pincode', lang)}</label>
                                    <input type="text" placeholder="XXXXXX" className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-[#0F1E36] dark:text-white tracking-widest focus:border-[#FF9933] focus:ring-0" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 border-t border-gray-150 dark:border-slate-800 pt-6">
                                <button className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-gray-250 dark:border-slate-800 text-gray-650 dark:text-gray-300 font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-slate-850 shadow-sm transition-all transform active:scale-95">
                                    {t('discardChanges', lang)}
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    className="px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] hover:from-orange-655 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all transform active:scale-95"
                                >
                                    {t('saveProfile', lang)}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Digital India Banner in Ashoka Navy */}
                    <div className="bg-[#0F1E36] rounded-3xl overflow-hidden shadow-lg relative min-h-32 flex items-center px-6 sm:px-8 border-2 border-[#FF9933]/15">
                        <div className="absolute right-0 top-0 bottom-0 opacity-[0.03] pointer-events-none w-1/2 text-white">
                            <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                                <circle cx="80" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="80" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="80" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="80" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="80" cy="50" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 sm:py-0 gap-4">
                            <div>
                                <h3 className="text-white font-black text-base uppercase tracking-wider mb-1">{t('digitalIndiaInitiative', lang) || "Digital India Initiative"}</h3>
                                <p className="text-gray-300 text-xs font-bold leading-relaxed max-w-sm">{t('dataEncryptedDesc', lang) || "All personal Aadhaar data logs are securely encrypted at routing points under the State Data Security Guidelines."}</p>
                            </div>
                            <div className="w-16 h-16 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md flex flex-col items-center justify-center p-1.5 shrink-0 self-end sm:self-center">
                                <span className="text-[7px] text-gray-300 font-black text-center mb-1 leading-tight uppercase">GOVERNMENT OF BHARAT</span>
                                <div className="w-6 h-6 text-[#FF9933]"><LogoIcon /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* About Transit India */}
                    <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-sm border-2 border-[#FF9933]/15 overflow-hidden transition-colors">
                        <div className="px-6 py-4.5 flex items-center bg-[#FAF9F6] dark:bg-[#070F1E]/40 border-b border-gray-150 dark:border-slate-800">
                            <div className="w-8 h-8 rounded-xl bg-[#FF9933]/10 dark:bg-[#FF9933]/5 border border-[#FF9933]/25 flex items-center justify-center mr-3">
                                <Info className="w-4 h-4 text-[#FF9933]" />
                            </div>
                            <h2 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{t('aboutTransitIndia', lang)}</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-bold">
                                {t('aboutDesc1', lang)}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-bold">
                                {t('aboutDesc2', lang)}
                            </p>

                            <div className="bg-[#FF9933]/10 border-l-4 border-[#FF9933] p-4.5 rounded-r-2xl mb-6">
                                <h4 className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mb-1.5">{t('howItWorks', lang)}</h4>
                                <p className="text-[11px] text-orange-950 dark:text-orange-355 font-bold leading-relaxed">
                                    {t('howItWorksDesc', lang)}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="bg-[#FAF9F6] dark:bg-[#070F1E] border border-gray-150 dark:border-slate-800 text-gray-500 dark:text-gray-400 text-[9px] font-black py-1.5 px-3 rounded-xl uppercase tracking-wider">Real-Time GPS</span>
                                <span className="bg-[#FAF9F6] dark:bg-[#070F1E] border border-gray-150 dark:border-slate-800 text-gray-500 dark:text-gray-400 text-[9px] font-black py-1.5 px-3 rounded-xl uppercase tracking-wider">Predictive ML</span>
                                <span className="bg-[#FAF9F6] dark:bg-[#070F1E] border border-gray-150 dark:border-slate-800 text-gray-500 dark:text-gray-400 text-[9px] font-black py-1.5 px-3 rounded-xl uppercase tracking-wider">Multi-Modal</span>
                            </div>
                        </div>
                    </div>

                    {/* Help & Support */}
                    <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-sm border-2 border-[#FF9933]/15 overflow-hidden transition-colors">
                        <div className="px-6 py-4.5 flex items-center bg-[#FAF9F6] dark:bg-[#070F1E]/40 border-b border-gray-150 dark:border-slate-800">
                            <Headphones className="w-4.5 h-4.5 text-[#FF9933] mr-3" />
                            <h2 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{t('helpSupport', lang)}</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed font-bold">
                                {t('helpSupportDesc', lang)}
                            </p>
                            <button className="w-full py-2.5 bg-[#FAF9F6] dark:bg-slate-900 border-2 border-gray-250 dark:border-slate-800 text-gray-650 dark:text-gray-300 font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-slate-850 shadow-sm transition-all transform active:scale-95">
                                {t('contactSupport', lang)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-t-8 border-[#12820B] border-x border-b border-gray-150 dark:border-slate-800">
                        <div className="p-8 text-center pb-6">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/25 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={3} />
                            </div>

                            <h2 className="text-xl font-black text-[#0F1E36] dark:text-white mb-6 uppercase tracking-wide">{t('profileSavedSuccessfully', lang)}</h2>

                            <div className="bg-[#FAF9F6] dark:bg-[#070F1E]/50 border-l-4 border-green-500 p-4.5 rounded-r-2xl mb-8 text-left">
                                <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-bold">
                                    {t('profileUpdateDesc', lang)}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-4 bg-[#0F1E36] dark:bg-slate-700 text-white font-extrabold rounded-2xl hover:bg-[#1b2f4f] dark:hover:bg-slate-600 transition-all shadow-md mb-4 text-xs uppercase tracking-widest"
                            >
                                {t('acknowledgeContinue', lang)}
                            </button>

                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider pb-2">
                                REFERENCE ID: TRN-2024-B842-SHRM
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const LogoIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>;
