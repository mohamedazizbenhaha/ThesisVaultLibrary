'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft,
    Plus,
    Trash2,
    Image as ImageIcon,
    Link as LinkIcon,
    Save,
    Info,
    Building2,
    Camera,
    User
} from 'lucide-react';
import { PREDEFINED_FIELDS } from '@/lib/constants';

interface Institution {
    name: string;
    logo: string;
}

interface Author {
    name: string;
    icon: string;
    role: string;
}

interface FormData {
    title: string;
    abstract: string;
    fields: string[];
    year: number;
    institutions: Institution[];
    authors: Author[];
    thesis_url: string;
    cover_image_url: string;
}

export default function EditThesisPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        abstract: '',
        fields: [],
        year: new Date().getFullYear(),
        institutions: [{ name: '', logo: '' }],
        authors: [{ name: '', icon: '', role: 'Author' }],
        thesis_url: '',
        cover_image_url: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/bWFuYWdlbWVudF9wb3J0YWw/login');
            return;
        }

        if (id) {
            fetchThesis();
        }
    }, [id, router]);

    const fetchThesis = async () => {
        try {
            const response = await fetch(`/api/theses/${id}`);
            if (!response.ok) throw new Error('Thesis not found');
            const data = await response.json();

            // Transform data arrays to objects
            const universities = data.universities || [];
            const logos = data.university_logos || [];
            const names = data.author_names || [];
            const icons = data.author_icons || [];
            const roles = data.author_roles || [];

            const institutions: Institution[] = universities.map((name: string, i: number) => ({
                name,
                logo: logos[i] || ''
            }));
            if (institutions.length === 0) institutions.push({ name: '', logo: '' });

            const authors: Author[] = names.map((name: string, i: number) => ({
                name,
                icon: icons[i] || '',
                role: roles[i] || 'Author'
            }));
            if (authors.length === 0) authors.push({ name: '', icon: '', role: 'Author' });

            setFormData({
                title: data.title || '',
                abstract: data.abstract || '',
                fields: data.fields || [],
                year: data.year || new Date().getFullYear(),
                institutions,
                authors,
                thesis_url: data.thesis_url || '',
                cover_image_url: data.cover_image_url || ''
            });
        } catch (error) {
            console.error('Error fetching thesis:', error);
            alert('Error loading thesis');
            router.push('/bWFuYWdlbWVudF9wb3J0YWw');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldToggle = (field: string) => {
        const newFields = (formData.fields || []).includes(field)
            ? formData.fields.filter(f => f !== field)
            : [...(formData.fields || []), field];
        setFormData({ ...formData, fields: newFields });
    };

    const handleInstitutionChange = (index: number, field: keyof Institution, value: string) => {
        const newInstitutions = [...formData.institutions];
        newInstitutions[index][field] = value;
        setFormData({ ...formData, institutions: newInstitutions });
    };

    const addInstitution = () => {
        setFormData({ ...formData, institutions: [...formData.institutions, { name: '', logo: '' }] });
    };

    const removeInstitution = (index: number) => {
        const newInstitutions = formData.institutions.filter((_, i) => i !== index);
        setFormData({ ...formData, institutions: newInstitutions });
    };

    const handleAuthorChange = (index: number, field: keyof Author, value: string) => {
        const newAuthors = [...formData.authors];
        newAuthors[index][field] = value;
        setFormData({ ...formData, authors: newAuthors });
    };

    const addAuthor = () => {
        setFormData({ ...formData, authors: [...formData.authors, { name: '', icon: '', role: 'Author' }] });
    };

    const removeAuthor = (index: number) => {
        const newAuthors = formData.authors.filter((_, i) => i !== index);
        setFormData({ ...formData, authors: newAuthors });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Filter valid authors/institutions first to maintain index alignment
            const validInstitutions = formData.institutions.filter(i => i.name.trim() !== '');
            const validAuthors = formData.authors.filter(a => a.name.trim() !== '');

            const cleanedData = {
                title: formData.title,
                abstract: formData.abstract,
                fields: formData.fields,
                year: formData.year,
                universities: validInstitutions.map(i => i.name),
                university_logos: validInstitutions.map(i => i.logo || ''),
                author_names: validAuthors.map(a => a.name),
                author_icons: validAuthors.map(a => a.icon || ''),
                author_roles: validAuthors.map(a => a.role || 'Author'),
                thesis_url: formData.thesis_url,
                cover_image_url: formData.cover_image_url
            };

            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/theses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (response.ok) {
                router.push('/bWFuYWdlbWVudF9wb3J0YWw');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to update thesis'}`);
            }
        } catch (error) {
            console.error('Error updating thesis:', error);
            alert('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Retrieving Record...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/bWFuYWdlbWVudF9wb3J0YWw')}
                                className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Modify Research</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Editing Record #{id}</p>
                            </div>
                        </div>
                        <button
                            form="edit-thesis-form"
                            type="submit"
                            disabled={saving || (formData.fields || []).length === 0}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                        >
                            {saving ? 'Saving...' : <><Save size={16} /> Update Record</>}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <form id="edit-thesis-form" onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                <Info size={18} />
                            </div>
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Metadata</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Research Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-black placeholder:text-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Research Abstract</label>
                                <textarea
                                    value={formData.abstract}
                                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-black placeholder:text-gray-300 min-h-[150px]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Research Fields</label>
                                <div className="flex flex-wrap gap-2">
                                    {PREDEFINED_FIELDS.map((field) => (
                                        <button
                                            key={field}
                                            type="button"
                                            onClick={() => handleFieldToggle(field)}
                                            className={clsx(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                (formData.fields || []).includes(field)
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                                                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                            )}
                                        >
                                            {field}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Year</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Repository URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="url"
                                            required
                                            value={formData.thesis_url}
                                            onChange={(e) => setFormData({ ...formData, thesis_url: e.target.value })}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-black placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Universities Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-50 text-purple-600 p-2 rounded-xl">
                                    <Building2 size={18} />
                                </div>
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Institutions</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addInstitution}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all border border-purple-100"
                            >
                                <Plus size={14} /> Add University
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.institutions.map((uni, idx) => (
                                <div key={idx} className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl relative group animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">University Name</label>
                                            <input
                                                type="text"
                                                value={uni.name}
                                                onChange={(e) => handleInstitutionChange(idx, 'name', e.target.value)}
                                                className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all text-black placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Logo URL</label>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={uni.logo}
                                                    onChange={(e) => handleInstitutionChange(idx, 'logo', e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 transition-all text-black placeholder:text-gray-300"
                                                />
                                                {uni.logo && (
                                                    <img src={uni.logo} className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 object-contain" onError={(e: any) => e.target.style.display = 'none'} />
                                                )}
                                            </div>
                                            <p className="mt-1 ml-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                                Recommended: 400x400px (Transparent PNG)
                                            </p>
                                        </div>
                                    </div>
                                    {formData.institutions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstitution(idx)}
                                            className="absolute -top-2 -right-2 p-2 bg-white border border-gray-100 text-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Authors Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-50 text-amber-600 p-2 rounded-xl">
                                    <User size={18} />
                                </div>
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Authors</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addAuthor}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-100"
                            >
                                <Plus size={14} /> Add Author
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.authors.map((author, idx) => (
                                <div key={idx} className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl relative group animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Author Name</label>
                                            <input
                                                type="text"
                                                value={author.name}
                                                onChange={(e) => handleAuthorChange(idx, 'name', e.target.value)}
                                                className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all text-black placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Icon URL</label>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={author.icon}
                                                    onChange={(e) => handleAuthorChange(idx, 'icon', e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all text-black placeholder:text-gray-300"
                                                />
                                                {author.icon && (
                                                    <img src={author.icon} className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-white shadow-sm" onError={(e: any) => e.target.style.display = 'none'} />
                                                )}
                                            </div>
                                            <p className="mt-1 ml-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                                Recommended: 200x200px (Square)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Role</label>
                                        <div className="flex gap-4">
                                            {['Author', 'Supervisor'].map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => handleAuthorChange(idx, 'role', role)}
                                                    className={clsx(
                                                        "flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                                                        author.role === role
                                                            ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                                    )}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {formData.authors.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAuthor(idx)}
                                            className="absolute -top-2 -right-2 p-2 bg-white border border-gray-100 text-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Assets Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                                <Camera size={18} />
                            </div>
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Visual Assets</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Cover Image */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Cover Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="url"
                                            value={formData.cover_image_url}
                                            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-black placeholder:text-gray-300"
                                        />
                                    </div>
                                    <p className="mt-2 ml-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                        Recommended: 1280x720px (16:9) for best quality
                                    </p>
                                </div>
                                {formData.cover_image_url && (
                                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                        <img src={formData.cover_image_url} className="w-full aspect-video object-cover rounded-2xl shadow-lg shadow-gray-200" onError={(e: any) => e.target.src = 'https://via.placeholder.com/1600x900?text=Invalid+Image'} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');
