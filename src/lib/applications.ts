// src/lib/applications.ts
import { parseDevice } from "@/lib/device";

export interface ApplicationFormValues {
  name: string;
  phone: string;
  email: string;
  roleTitle: string;
}

export interface ApplicationPayload extends ApplicationFormValues {
  submissionId: string;
  resumeBase64: string;
  resumeFileName: string;
  resumeMimeType: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const QUEUE_KEY = "meptrasoft_application_queue";

/** Strips the `data:...;base64,` prefix FileReader adds, leaving raw base64. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function buildApplicationPayload(
  values: ApplicationFormValues,
  resume: { base64: string; fileName: string; mimeType: string },
  submissionId?: string
): ApplicationPayload {
  const { device, browser } = parseDevice(navigator.userAgent);
  return {
    ...values,
    submissionId: submissionId || crypto.randomUUID(),
    resumeBase64: resume.base64,
    resumeFileName: resume.fileName,
    resumeMimeType: resume.mimeType,
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    device,
    browser,
  };
}

function readQueue(): ApplicationPayload[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: ApplicationPayload[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // localStorage unavailable (private browsing, quota) — queueing is best-effort
  }
}

function enqueue(payload: ApplicationPayload) {
  writeQueue([...readQueue(), payload]);
}

async function postApplication(payload: ApplicationPayload): Promise<boolean> {
  if (!ENDPOINT) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "apply", application: payload }),
    });
    const body = await res.json();
    return !!body.ok;
  } catch {
    return false;
  }
}

/** Returns {ok:true} only if the application actually reached the server this call. */
export async function submitApplication(payload: ApplicationPayload): Promise<{ ok: boolean }> {
  const ok = await postApplication(payload);
  if (!ok) enqueue(payload);
  return { ok };
}

/** Retries anything queued from a prior failed submission. Call on ApplyModal mount. */
export async function flushQueuedApplications(): Promise<void> {
  const queue = readQueue();
  if (queue.length === 0) return;
  const remaining: ApplicationPayload[] = [];
  for (const payload of queue) {
    const ok = await postApplication(payload);
    if (!ok) remaining.push(payload);
  }
  writeQueue(remaining);
}
