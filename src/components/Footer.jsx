import React from 'react';
import { ShieldCheck, Bus, Map, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t-4 border-ti-saffron mt-auto relative z-10 w-full text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-ti-saffron flex items-center justify-center">
                                <Bus className="text-ti-navy w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Transit India</h2>
                        </div>
                        <p className="text-gray-400 max-w-sm text-sm leading-relaxed mb-6">
                            A transparent, AI-powered public transportation information system designed to bring predictable arrival times and rapid emergency response to Bharat.
                        </p>
                        <div className="flex space-x-4">
                            <span className="flex items-center text-xs font-bold text-gray-300 bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
                                <ShieldCheck className="w-4 h-4 mr-2 text-ti-emerald" /> Built for Bharat Conditions
                            </span>
                            <span className="flex items-center text-xs font-bold text-gray-300 bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
                                <Map className="w-4 h-4 mr-2 text-blue-400" /> Digital India
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-gray-200">Resources</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-ti-saffron transition-colors">API Documentation</a></li>
                            <li><a href="#" className="hover:text-ti-saffron transition-colors">Safety Guidelines</a></li>
                            <li><a href="#" className="hover:text-ti-saffron transition-colors">Depot Contact</a></li>
                            <li><a href="#" className="hover:text-ti-saffron transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-gray-200">Helpdesk</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center"><strong className="mr-2 text-white">112</strong> National Emergency</li>
                            <li className="flex items-center"><strong className="mr-2 text-white">1091</strong> Women Helpline</li>
                            <li className="flex items-center"><strong className="mr-2 text-white">108</strong> Medical Emergency</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© 2026 Transit India Prototype. Internal Testing Only.</p>
                    <p className="mt-2 md:mt-0 flex items-center">
                        Crafted with <Heart className="w-3 h-3 mx-1 text-red-500" /> for reliable public transport.
                    </p>
                </div>
            </div>
        </footer>
    );
}
