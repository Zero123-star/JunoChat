export interface Character {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    tags: string; // Stored as comma-separated string in Django
    color?: string;
    creator: string; // User ID or username
    creator_username?: string;
    favorites_count?: number;
    is_favorited?: boolean;
    created_at?: string;
    updated_at?: string;
}
  