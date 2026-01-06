'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function Footer() {
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalData, setLegalData] = useState<any>(null);

    useEffect(() => {
        // Populating with the exact content from the example project
        setLegalData({
            title: "Legal Notice & Content Usage Policy",
            sections: [
                {
                    id: 1,
                    title: "Section 1 — Content Ownership",
                    content: "All theses, articles, images, videos, and supplementary materials displayed on this platform remain the intellectual property of their respective authors unless explicitly stated otherwise."
                },
                {
                    id: 2,
                    title: "Section 2 — Author Consent",
                    content: "By submitting or allowing content to be published on The Thesis Vault, contributors confirm that:",
                    list: [
                        "They are the rightful owners or authorized distributors of the submitted materials",
                        "The content does not violate copyright, privacy, or institutional policies",
                        "They consent to public, non-commercial access to their work"
                    ]
                },
                {
                    id: 3,
                    title: "Section 3 — Repository Inclusion",
                    content: "Contributors acknowledge and accept that their work may be indexed, archived, and displayed within The Thesis Vault as part of a public academic library."
                },
                {
                    id: 4,
                    title: "Section 4 — User Responsibility",
                    content: "Users accessing this platform agree to:",
                    list: [
                        "Use the content for academic, educational, or research purposes only",
                        "Properly cite authors when referencing materials",
                        "Refrain from unauthorized commercial use or redistribution"
                    ]
                },
                {
                    id: 5,
                    title: "Section 5 — Limitation of Liability",
                    content: "The platform administrator does not guarantee the accuracy, completeness, or suitability of the published content and bears no responsibility for misuse."
                }
            ]
        });
    }, []);

    return (
        <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
            <div className="max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Left: Branding */}
                <div className="text-left py-1">
                    <p className="text-gray-900 leading-none">
                        <span className="text-base font-black tracking-tight">The Thesis Vault</span>
                        <span className="text-[10px] italic text-gray-400 ml-2 font-medium">by the thesis club</span>
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                        Your open academic repository for publicly shared research
                    </p>
                </div>

                {/* Middle: Copyright */}
                <div className="text-center py-1">
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                        © {new Date().getFullYear()} Mohamed Aziz Ben Haha
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        All rights reserved unless otherwise stated.
                    </p>
                </div>

                {/* Right: Policy Link */}
                <div className="flex justify-end py-1">
                    <button
                        onClick={() => setIsLegalModalOpen(true)}
                        className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all font-bold text-xs tracking-wide bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-100"
                    >
                        <ShieldCheck size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="border-b border-transparent group-hover:border-blue-200">Legal & Usage Policy</span>
                    </button>
                </div>
            </div>

            {/* Legal Modal - Styled exactly like ThesisModal */}
            {isLegalModalOpen && legalData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsLegalModalOpen(false)}
                    />

                    {/* Modal Container */}
                    <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 custom-scrollbar">

                        {/* Top Actions Overlay */}
                        <div className="absolute top-6 right-6 z-50">
                            <button
                                onClick={() => setIsLegalModalOpen(false)}
                                className="p-2.5 bg-white/70 hover:bg-white/90 backdrop-blur-xl rounded-full text-gray-900 transition-all border border-white/40 shadow-xl"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-12 sm:p-16">
                            <div className="mb-12 border-b border-gray-100 pb-8">
                                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
                                    {legalData.title}
                                </h1>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    Official Policy Terms
                                </p>
                            </div>

                            <div className="space-y-12">
                                {legalData.sections.map((section: any) => (
                                    <div key={section.id} className="space-y-6">
                                        <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                                            <ShieldCheck size={18} />
                                            {section.title}
                                        </h3>
                                        <div className="pl-4 border-l-2 border-blue-100 space-y-4">
                                            <p className="text-gray-600 leading-relaxed font-medium text-lg">
                                                {section.content}
                                            </p>
                                            {section.list && (
                                                <ul className="space-y-3 mt-4">
                                                    {section.list.map((item: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-gray-500 text-base font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 pt-10 border-t border-gray-100 flex justify-center">
                                <button
                                    onClick={() => setIsLegalModalOpen(false)}
                                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                                >
                                    Acknowledge & Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
