export interface Thesis {
    id: number;
    title: string;
    abstract?: string;
    fields?: string[];
    year: number;
    universities?: string[];
    thesis_url: string;
    cover_image_url?: string;
    university_logos?: string[];
    author_icons?: string[];
    author_names?: string[];
    author_roles?: string[];
}
