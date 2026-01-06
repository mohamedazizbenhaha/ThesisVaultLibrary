'use client';

import { X, Calendar, ExternalLink, GraduationCap, Building2, User, Globe, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Thesis } from '@/lib/types';
import clsx from 'clsx';

interface ThesisModalProps {
    thesis: Thesis | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ThesisModal({ thesis, isOpen, onClose }: ThesisModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !mounted) return null;
    if (!thesis) return null;

    const {
        title,
        abstract,
        fields = [],
        year,
        universities = [],
        thesis_url,
        cover_image_url,
        university_logos = [],
        author_icons = [],
        author_names = [],
        author_roles = []
    } = thesis;

    return (
        <div
            className={clsx(
                "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={clsx(
                    "relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 transform",
                    isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-12"
                )}
            >
                {/* Top Actions Overlay - Premium White Glass Effect */}
                <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                    <a
                        href={thesis_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/70 hover:bg-white/90 backdrop-blur-xl rounded-full text-gray-900 text-[10px] font-black uppercase tracking-widest transition-all border border-white/40 shadow-xl"
                    >
                        Go to Thesis <ExternalLink size={14} />
                    </a>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-white/70 hover:bg-white/90 backdrop-blur-xl rounded-full text-gray-900 transition-all border border-white/40 shadow-xl"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content Area (Scrollable) */}
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {/* Header Image Section */}
                    <div className="relative aspect-video sm:aspect-[21/9] w-full bg-gray-900">
                        <img
                            src={cover_image_url || '/placeholder-cover.jpg'}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e: any) => { e.target.src = 'https://picsum.photos/seed/thesis-modal/1200/600'; }}
                        />
                    </div>

                    <div className="px-10 py-12">
                        {/* Title & Fields Area */}
                        <div className="mb-10">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight max-w-5xl mb-6">
                                {title}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {fields.map((field, idx) => (
                                    <span key={idx} className="px-4 py-1.5 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm hover:border-blue-300 transition-colors">
                                        {field}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Left Column: Abstract Only */}
                            <div className="lg:col-span-2 space-y-12">
                                <div>
                                    <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 font-primary">
                                        <Tag size={14} /> Research Abstract
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        {abstract || "No abstract available for this research record."}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Year & Personnel */}
                            <div className="space-y-12">
                                {/* Year */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Graduation Year</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                            <Calendar size={20} />
                                        </div>
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">{year}</span>
                                    </div>
                                </div>

                                {/* Personnel */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Research Personnel</h3>
                                    <div className="space-y-6">
                                        {author_names.map((name, idx) => (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                {author_icons[idx] ? (
                                                    <img
                                                        src={author_icons[idx]}
                                                        alt={name}
                                                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-110 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                                                        <User className="text-gray-400" size={20} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                                                            {author_roles[idx] === 'Supervisor' ? 'Supervisor' : 'Author'}
                                                        </span>
                                                        {author_roles[idx] !== 'Supervisor' && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900 leading-tight">{name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Footer: Clean Institutions Row - Minimized Height */}
                <div className="px-10 py-4 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                        {universities.map((uni, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                {university_logos[idx] ? (
                                    <div className="w-16 h-8 bg-white flex-shrink-0 p-1 border border-gray-100 rounded shadow-sm group-hover:scale-110 transition-transform">
                                        <img src={university_logos[idx]} alt={uni} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-8 bg-white flex items-center justify-center rounded border border-gray-100 flex-shrink-0">
                                        <Building2 className="text-gray-300" size={16} />
                                    </div>
                                )}
                                <span className="text-[11px] font-black text-gray-800 leading-tight uppercase tracking-tight">
                                    {uni}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
