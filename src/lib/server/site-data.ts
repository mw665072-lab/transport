import "server-only";
import {
  getSettings,
  listPosts,
  listTestimonials,
  getPostBySlug,
  type Post,
  type Testimonial,
} from "@/lib/server/db";
import { BLOG_POSTS } from "@/lib/data/blog";
import { SOCIAL_KEYS, isPublishableUrl } from "@/lib/data/social";

export type SocialLink = { key: string; label: string; url: string };

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const settings = await getSettings();
    return SOCIAL_KEYS.map(({ key, label }) => ({
      key,
      label,
      url: (settings[key] ?? "").trim(),
    })).filter((link) => isPublishableUrl(link.url));
  } catch (cause) {
    console.error("[settings] could not read social links", cause);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await listTestimonials();
  } catch (cause) {
    console.error("[testimonials] could not read", cause);
    return [];
  }
}

/** Shape shared by database posts and the original typed article. */
export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  paragraphs: string[];
};

const seedPosts = (): PublicPost[] =>
  BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: "Guide",
    date: p.date,
    paragraphs: [...p.body],
  }));

const toPost = (row: Post): PublicPost => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  category: row.category,
  date: row.published_at,
  paragraphs: row.body
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean),
});

export async function getPosts(): Promise<PublicPost[]> {
  try {
    const rows = await listPosts();
    if (rows.length === 0) return seedPosts();
    return rows.map(toPost);
  } catch (cause) {
    console.error("[posts] falling back to the seeded article", cause);
    return seedPosts();
  }
}

export async function getPost(slug: string): Promise<PublicPost | null> {
  try {
    const row = await getPostBySlug(slug);
    if (row) return row.status === "published" ? toPost(row) : null;
    if ((await listPosts()).length > 0) return null;
  } catch (cause) {
    console.error("[posts] falling back to the seeded article", cause);
  }
  return seedPosts().find((p) => p.slug === slug) ?? null;
}
