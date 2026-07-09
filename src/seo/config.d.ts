export type JsonLd = Record<string, unknown>;
export interface Crumb {
  name: string;
  path: string;
}
export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  priority?: number;
  changefreq?: string;
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: Crumb[];
  schema?: JsonLd[];
}

export const ORIGIN: string;
export const site: {
  name: string;
  legalName: string;
  origin: string;
  logo: string;
  image: string;
  email: string;
  telephone: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  streetAddress: string;
  addressCountry: string;
  sameAs: string[];
};
export const serviceAreas: string[];
export function abs(path: string): string;
export function organizationSchema(): JsonLd;
export function websiteSchema(): JsonLd;
export function courseSchema(a: { name: string; description: string; path: string }): JsonLd;
export function faqSchema(items: { question: string; answer: string }[]): JsonLd;
export function serviceSchema(a: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  areas?: string[];
}): JsonLd;
export function breadcrumbSchema(items: Crumb[]): JsonLd;
export function crumb(items: Crumb[]): JsonLd;
export function localBusinessSchema(a: {
  city: string;
  region: string;
  path: string;
  areas?: string[];
}): JsonLd;
export function articleSchema(a: {
  title: string;
  description: string;
  path: string;
  image?: string;
  date?: string;
  author?: string;
}): JsonLd;
