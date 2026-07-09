export type BlogBlock =
  | { h2: string }
  | { p: string }
  | { ul: string[] }
  | { cta: { label: string; to: string } };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  body: BlogBlock[];
  related: { label: string; to: string }[];
}

export const posts: BlogPost[];
export function getPost(slug: string): BlogPost | undefined;
