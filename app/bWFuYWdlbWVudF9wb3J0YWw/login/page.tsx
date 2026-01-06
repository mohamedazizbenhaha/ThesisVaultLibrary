'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, User, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                router.push('/bWFuYWdlbWVudF9wb3J0YWw');
            } else {
                setError(data.error || 'Identity verification failed');
            }
        } catch (error) {
            setError('Network communication error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-[100px] opacity-50 -ml-48 -mb-48" />

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100">
                        <Shield size={40} className="text-gray-900" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 lowercase">Vault <span className="text-blue-600">access</span></h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Laboratory Security Portal</p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 sm:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="bg-red-500 text-white p-1 rounded-full">
                                <ArrowLeft size={12} className="rotate-45" />
                            </div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Username</label>
                            <div className="relative group/input">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-600 transition-colors w-4 h-4" />
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-black"
                                    placeholder="admin_id"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Key</label>
                            <div className="relative group/input">
                                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-purple-600 transition-colors w-4 h-4" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all text-black"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200 mt-4 active:scale-95 flex items-center justify-center gap-3"
                        >
                            {loading ? <><Loader2 className="animate-spin" size={16} /> Authenticating...</> : 'Initialize Access'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                        >
                            <ArrowLeft size={14} /> Return to Public Archive
                        </button>
                    </div>
                </div>

                <div className="mt-8 p-6 border border-gray-100 bg-white/50 backdrop-blur-md rounded-[2rem] text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Laboratory Assistance</p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-left">
                            <p className="text-[10px] text-gray-300 font-black uppercase tracking-tight">ID</p>
                            <p className="text-xs text-black font-black">admin</p>
                        </div>
                        <div className="w-px h-6 bg-gray-100" />
                        <div className="text-left">
                            <p className="text-[10px] text-gray-300 font-black uppercase tracking-tight">KEY</p>
                            <p className="text-xs text-black font-black">admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
