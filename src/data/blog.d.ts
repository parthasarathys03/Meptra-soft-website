export type BlogBlock =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { code: string }
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
