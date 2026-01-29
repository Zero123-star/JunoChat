export interface Character {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    tags: string; // Stored as comma-separated string in Django
    color?: string;
    creator: string; // User ID or username
    created_at?: string;
    updated_at?: string;
    public?: boolean; // Add public/private field for visibility
}
