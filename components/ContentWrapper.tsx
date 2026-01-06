'use client';

import { usePathname } from 'next/navigation';

export function ContentWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/bWFuYWdlbWVudF9wb3J0YWw');

    return (
        <main className={`flex-grow pb-12 w-full ${isAdmin ? 'pt-[calc(var(--spacing)*32)]' : 'pt-[calc(var(--spacing)*40)]'}`}>
            {children}
        </main>
    );
}
