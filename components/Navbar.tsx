'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Phone, Mail, Linkedin, Youtube, LayoutGrid, Search, X } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const isAdminPage = pathname?.startsWith('/bWFuYWdlbWVudF9wb3J0YWw');

    // Initialize state from URL
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
    const [isKeysPressed, setIsKeysPressed] = useState(false);

    // Track Ctrl+Shift keys for hidden shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey) setIsKeysPressed(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.ctrlKey || !e.shiftKey) setIsKeysPressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Sync state with URL
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== searchValue) {
            setSearchValue(urlSearch);
        }
    }, [searchParams]);

    // Handle search update with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentSearch = params.get('search') || '';

            if (searchValue !== currentSearch) {
                if (searchValue) {
                    params.set('search', searchValue);
                } else {
                    params.delete('search');
                }
                router.replace(`/?${params.toString()}`, { scroll: false });
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchValue, router, searchParams]);

    const clearSearch = () => {
        setSearchValue('');
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        // Only on main page the logo has the secret trick
        if (!isAdminPage) {
            if (e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                router.push('/bWFuYWdlbWVudF9wb3J0YWw');
            } else {
                router.push('/');
            }
        }
        // On admin page, handleLogoClick does nothing or we just don't pass it
    };

    const ContactBar = () => (
        <div className="w-full bg-[#0a0a0a] text-white py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                <div className="flex items-center gap-6">
                    <span className="hidden sm:inline text-white font-black tracking-tighter">Mohamed Aziz Ben Haha</span>
                    <a href="https://wa.me/21625713413" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition-colors">
                        <Phone size={12} className="text-white" />
                        <span>00216 25 713 413</span>
                    </a>
                    <a href="mailto:mohamedaziz.benhaha@gmail.com" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 hover:text-gray-400 text-white transition-colors">
                        <Mail size={12} />
                        <span className="normal-case">mohamedaziz.benhaha@gmail.com</span>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://mohamedazizbenhaha.netlify.app" target="_blank" rel="noopener noreferrer" className="group flex items-center hover:opacity-80 transition-opacity">
                        <img src="/7a7aLogo.PNG" alt="7a7a" className="h-[18px] w-auto invert brightness-0 " />
                    </a>
                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                    <a href="https://www.linkedin.com/in/mohamed-aziz-ben-haha/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <Linkedin size={14} fill="currentColor" strokeWidth={0} />
                    </a>
                    <a href="https://www.youtube.com/@The_Thesis_Club" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <Youtube size={16} strokeWidth={2} />
                    </a>
                    <a href="https://bento.me/mohamed-aziz-ben-haha" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <LayoutGrid size={14} />
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <nav className="fixed top-0 w-full z-50">
            <ContactBar />
            <div className="w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo - Cursor changes ONLY when keys are pressed and only on main page */}
                        <div
                            className={clsx(
                                "flex items-center",
                                (!isAdminPage && isKeysPressed) ? "cursor-pointer" : "cursor-default"
                            )}
                            onClick={!isAdminPage ? handleLogoClick : undefined}
                        >
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 w-auto object-contain select-none pointer-events-none"
                            />
                        </div>

                        {/* Search on the Right - Covers 30% of Navbar */}
                        {!isAdminPage && (
                            <div className="w-[30%] hidden sm:block">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search researches..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-10 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-black"
                                    />
                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
