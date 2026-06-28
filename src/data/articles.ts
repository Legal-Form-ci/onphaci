import raw from "./articles.json";

export interface Article {
  slug: string;
  title: string;
  date: string | null;
  category: string;
  cover: string | null;
  excerpt: string;
  content_html: string;
  inline_images: string[];
  source_url: string;
}

export const ARTICLES: Article[] = raw as Article[];

export const CATEGORIES = ["Actualité","Projets","National","Organisation","Politiques","Médiathèque"] as const;

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatDate(d: string | null | undefined): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch { return ""; }
}