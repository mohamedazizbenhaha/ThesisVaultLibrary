'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, BookOpen, GraduationCap, X, Search, ChevronDown, LucideIcon } from 'lucide-react';

interface SearchableSelectProps {
    options: string[];
    value: string | null;
    onChange: (val: string) => void;
    placeholder: string;
    icon: LucideIcon;
    className?: string;
}

function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    icon: Icon,
    className
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

    return (
        <div className={clsx("relative min-w-[200px] flex-1", className)} ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold cursor-pointer shadow-sm hover:border-gray-200 transition-all text-black flex items-center justify-between"
            >
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <span className={clsx(!value && "text-gray-400")}>
                    {value || placeholder}
                </span>
                <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform absolute right-2 top-1/2 -translate-y-1/2", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Filter options..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-transparent rounded-xl py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all text-black"
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-2 px-1 custom-scrollbar">
                        <div
                            onClick={() => { onChange(''); setIsOpen(false); setSearchTerm(''); }}
                            className="px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors"
                        >
                            Reset Selection
                        </div>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }}
                                    className={clsx(
                                        "px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-colors mt-0.5",
                                        value === opt ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {opt}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-[10px] font-black uppercase text-gray-400 text-center tracking-widest">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

interface SearchFiltersProps {
    availableFields: string[];
    availableUniversities: string[];
    availableYears: string[];
}

export default function SearchFilters({
    availableFields = [],
    availableUniversities = [],
    availableYears = []
}: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeField = searchParams.get('field');
    const activeUniversity = searchParams.get('university');
    const activeYear = searchParams.get('year');

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('field');
        params.delete('university');
        params.delete('year');
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    const hasFilters = activeField || activeUniversity || activeYear;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
                <SearchableSelect
                    options={availableFields}
                    value={activeField}
                    onChange={(val) => updateFilter('field', val)}
                    placeholder="All Research Fields"
                    icon={GraduationCap}
                />

                <SearchableSelect
                    options={availableUniversities}
                    value={activeUniversity}
                    onChange={(val) => updateFilter('university', val)}
                    placeholder="All Institutions"
                    icon={BookOpen}
                />

                <SearchableSelect
                    options={availableYears}
                    value={activeYear}
                    onChange={(val) => updateFilter('year', val)}
                    placeholder="Year"
                    icon={Calendar}
                    className="flex-none w-48"
                />

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-100"
                    >
                        <X size={14} /> Clear
                    </button>
                )}
            </div>
        </div>
    );
}
