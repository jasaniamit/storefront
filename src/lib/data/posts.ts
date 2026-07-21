const API_URL = process.env.SPREE_API_URL;
const PUBLISHABLE_KEY = process.env.SPREE_PUBLISHABLE_KEY;

function headers(): HeadersInit {
  return { "X-Spree-API-Key": PUBLISHABLE_KEY ?? "" };
}

export interface PostCategory {
  id: number;
  title: string;
  slug: string;
}

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  meta_title: string;
  meta_description: string;
  image_url: string | null;
  category: PostCategory | null;
}

export interface Post extends PostSummary {
  content: string;
}

interface PostsListResponse {
  data: PostSummary[];
  meta: { page: number; limit: number; count: number; pages: number };
}

export async function listPosts(page = 1, limit = 12): Promise<PostsListResponse> {
  const res = await fetch(
    `${API_URL}/api/v3/store/posts?page=${page}&limit=${limit}`,
    {
      headers: headers(),
      next: { revalidate: 300 }, // cache for 5 minutes
    },
  );

  if (!res.ok) {
    console.error(`[posts] listPosts failed: ${res.status} ${res.statusText}`);
    return { data: [], meta: { page, limit, count: 0, pages: 0 } };
  }

  return res.json();
}

export async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/api/v3/store/posts/${slug}`, {
    headers: headers(),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status !== 404) {
      console.error(`[posts] getPost failed: ${res.status} ${res.statusText}`);
    }
    return null;
  }

  return res.json();
}

/** Strips HTML tags for use as a plain-text excerpt on the listing page. */
export function excerptFromContent(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}
