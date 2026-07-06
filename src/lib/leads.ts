// src/lib/leads.ts
import { parseDevice } from "@/lib/device";

export interface LeadFormValues {
  name: string;
  phone: string;
  interest: string;
  preferredContact: string;
  whatsappNumber: string;
  college: string;
  year: string;
  location: string;
  message: string;
}

export interface LeadPayload extends LeadFormValues {
  submissionId: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const QUEUE_KEY = "meptrasoft_lead_queue";

export function buildLeadPayload(values: LeadFormValues): LeadPayload {
  const { device, browser } = parseDevice(navigator.userAgent);
  return {
    ...values,
    submissionId: crypto.randomUUID(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    device,
    browser,
  };
}

function readQueue(): LeadPayload[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: LeadPayload[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function enqueue(payload: LeadPayload) {
  writeQueue([...readQueue(), payload]);
}

async function postLead(payload: LeadPayload): Promise<boolean> {
  if (!ENDPOINT) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "submit", lead: payload }),
    });
    const body = await res.json();
    return !!body.ok;
  } catch {
    return false;
  }
}

/** Returns {ok:true} only if the lead actually reached the server this call. */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  const ok = await postLead(payload);
  if (!ok) enqueue(payload);
  return { ok };
}

/** Retries anything queued from a prior failed submission. Call on app/page load. */
export async function flushQueuedLeads(): Promise<void> {
  const queue = readQueue();
  if (queue.length === 0) return;
  const remaining: LeadPayload[] = [];
  for (const payload of queue) {
    const ok = await postLead(payload);
    if (!ok) remaining.push(payload);
  }
  writeQueue(remaining);
}
