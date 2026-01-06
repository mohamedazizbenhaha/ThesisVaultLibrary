'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    LogOut,
    Globe,
    Database,
    PlusCircle,
    Search,
    Trash2,
    Edit3,
    Calendar
} from 'lucide-react';

interface Thesis {
    id: number;
    title: string;
    universities: string[];
    year: number;
    fields: string[];
    cover_image_url: string;
    university_logos: string[];
}

interface Stats {
    totalTheses: number;
    totalUniversities: number;
    totalFields: number;
}

export default function ManagePage() {
    const router = useRouter();
    const [theses, setTheses] = useState<Thesis[]>([]);
    const [stats, setStats] = useState<Stats>({ totalTheses: 0, totalUniversities: 0, totalFields: 0 });
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUsername = localStorage.getItem('username');

        if (!token) {
            router.push('/bWFuYWdlbWVudF9wb3J0YWw/login');
            return;
        }

        setUsername(storedUsername || 'Admin');
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const [thesesRes, statsRes] = await Promise.all([
                fetch('/api/theses').then(res => res.json()),
                fetch('/api/stats').then(res => res.json())
            ]);

            setTheses(thesesRes);
            setStats(statsRes);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this thesis? This action is permanent.')) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/theses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchData();
            } else {
                alert('Failed to delete thesis');
            }
        } catch (error) {
            console.error('Error deleting thesis:', error);
            alert('Error deleting thesis');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        router.push('/');
    };

    const filteredTheses = theses.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.universities && t.universities.some(u => u.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-screen-2xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-900 text-white p-2 rounded-2xl">
                                <Database size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Vault Management</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Authenticated: {username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                            >
                                <Globe size={16} /> Public View
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Records</p>
                        <p className="text-4xl font-black text-gray-900">{stats.totalTheses}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Universities</p>
                        <p className="text-4xl font-black text-blue-600">{stats.totalUniversities}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Research Fields</p>
                        <p className="text-4xl font-black text-purple-600">{stats.totalFields}</p>
                    </div>
                    <button
                        onClick={() => router.push('/bWFuYWdlbWVudF9wb3J0YWw/add')}
                        className="bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200 hover:bg-blue-600 transition-all group overflow-hidden relative text-left"
                    >
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Quick Action</p>
                            <p className="text-2xl font-black text-white">Add Thesis</p>
                        </div>
                        <PlusCircle size={80} className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight lowercase">
                            <span className="text-blue-600">active</span> repository
                        </h2>

                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by title or university..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                    <th className="px-8 py-6">Thesis Details</th>
                                    <th className="px-8 py-6">Universities</th>
                                    <th className="px-8 py-6">Year</th>
                                    <th className="px-8 py-6">Fields</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTheses.map((thesis) => (
                                    <tr key={thesis.id} className="hover:bg-gray-50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={thesis.cover_image_url}
                                                    className="w-12 h-16 object-cover rounded-lg shadow-sm bg-gray-200"
                                                    onError={(e: any) => { e.target.src = 'https://picsum.photos/seed/cover/48/64'; }}
                                                />
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-black text-gray-900 line-clamp-1">{thesis.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #{thesis.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex -space-x-2">
                                                {thesis.university_logos && thesis.university_logos.map((logo, idx) => (
                                                    <img key={idx} src={logo} className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-sm" onError={(e: any) => e.target.style.display = 'none'} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-bold text-gray-600 mt-2">{thesis.universities?.join(', ') || '-'}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                                <Calendar size={14} className="text-blue-500" />
                                                {thesis.year}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                {thesis.fields && thesis.fields.slice(0, 2).map((field, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500 rounded-md">
                                                        {field}
                                                    </span>
                                                ))}
                                                {thesis.fields && thesis.fields.length > 2 && (
                                                    <span className="px-2 py-1 bg-blue-50 text-[9px] font-black uppercase tracking-widest text-blue-600 rounded-md">
                                                        +{thesis.fields.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => router.push(`/bWFuYWdlbWVudF9wb3J0YWw/edit/${thesis.id}`)}
                                                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Edit Thesis"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(thesis.id)}
                                                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Delete Thesis"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTheses.length === 0 && (
                            <div className="p-20 text-center">
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No matching laboratory records</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
