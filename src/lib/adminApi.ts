// src/lib/adminApi.ts

export type LeadStatus = "New" | "Contacted" | "Follow-up" | "Closed" | "Converted";

export interface Lead {
  submissionId: string;
  createdAt: string;
  name: string;
  phone: string;
  interest: string;
  preferredContact: string;
  whatsappNumber: string;
  college: string;
  year: string;
  location: string;
  message: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
  status: LeadStatus;
  notes: string;
  updatedAt: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const TOKEN_KEY = "meptrasoft_admin_token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function post(body: Record<string, unknown>) {
  if (!ENDPOINT) return { ok: false, error: "missing_endpoint" };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function login(username: string, password: string) {
  return post({ action: "login", username, password }) as Promise<{ ok: boolean; token?: string; error?: string }>;
}

export async function listLeads(token: string) {
  if (!ENDPOINT) return { ok: false, error: "missing_endpoint" };
  try {
    const res = await fetch(`${ENDPOINT}?action=list&token=${encodeURIComponent(token)}`);
    return (await res.json()) as { ok: boolean; leads?: Lead[]; error?: string };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function updateLead(token: string, submissionId: string, updates: Partial<Lead>) {
  return post({ action: "update", token, submissionId, updates }) as Promise<{ ok: boolean; error?: string }>;
}

export async function deleteLead(token: string, submissionId: string) {
  return post({ action: "delete", token, submissionId }) as Promise<{ ok: boolean; error?: string }>;
}

export type ApplicationStatus = "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired";

export interface Application {
  submissionId: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  roleTitle: string;
  resumeUrl: string;
  resumeFileName: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
  status: ApplicationStatus;
  notes: string;
  updatedAt: string;
}

export async function listApplications(token: string) {
  if (!ENDPOINT) return { ok: false, error: "missing_endpoint" };
  try {
    const res = await fetch(`${ENDPOINT}?action=list_apps&token=${encodeURIComponent(token)}`);
    return (await res.json()) as { ok: boolean; applications?: Application[]; error?: string };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function updateApplication(token: string, submissionId: string, updates: Partial<Application>) {
  return post({ action: "update_app", token, submissionId, updates }) as Promise<{ ok: boolean; error?: string }>;
}

export async function deleteApplication(token: string, submissionId: string) {
  return post({ action: "delete_app", token, submissionId }) as Promise<{ ok: boolean; error?: string }>;
}
