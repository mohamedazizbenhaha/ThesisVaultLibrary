'use client';

import { Calendar, ExternalLink } from 'lucide-react';
import { Thesis } from '@/lib/types';

interface ThesisCardProps {
    thesis: Thesis;
    onSelect: (thesis: Thesis) => void;
}

export default function ThesisCard({ thesis, onSelect }: ThesisCardProps) {
    const {
        title,
        fields = [],
        year,
        universities = [],
        thesis_url,
        cover_image_url,
        university_logos = [],
        author_icons = [],
        author_names = []
    } = thesis;

    return (
        <div
            onClick={() => onSelect(thesis)}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative cursor-pointer"
        >
            {/* Cover Image Section */}
            <div className="relative aspect-video overflow-hidden bg-gray-50">
                <img
                    src={cover_image_url || '/placeholder-cover.jpg'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e: any) => { e.target.src = 'https://picsum.photos/seed/thesis/400/300'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    {university_logos && university_logos.map((logo, idx) => (
                        logo && (
                            <div key={idx} className="w-20 h-10 bg-white p-1 rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all duration-500 hover:scale-110">
                                <img
                                    src={logo}
                                    alt={universities[idx] || "University Logo"}
                                    title={universities[idx] || "University Logo"}
                                    className="w-full h-full object-contain"
                                    onError={(e: any) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )
                    ))}
                </div>

            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 line-clamp-2 transition-colors">
                    {title}
                </h3>

                {/* Metadata Row: Year (Left) | Authors (Right) */}
                <div className="flex items-center justify-between mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{year}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {author_icons && author_icons.map((icon, idx) => (
                                icon && (
                                    <img
                                        key={idx}
                                        src={icon}
                                        alt={author_names[idx] || "Author"}
                                        title={author_names[idx] || "Author"}
                                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                        onError={(e: any) => { e.target.style.display = 'none'; }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fields List */}
                <div className="mt-auto pt-4 border-t border-gray-50 h-[80px] overflow-hidden relative">
                    <div className="flex flex-wrap gap-2">
                        {fields && fields.slice(0, 4).map((field, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all"
                            >
                                {field}
                            </span>
                        ))}
                        {fields && fields.length > 4 && (
                            <span className="px-3 py-1 bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                                +{fields.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
