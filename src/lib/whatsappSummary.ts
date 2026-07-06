// src/lib/whatsappSummary.ts
import type { Lead } from "@/lib/adminApi";

const WHATSAPP_NUMBER = "919345984804";

export function formatWhatsAppSummary(lead: Lead): string {
  const lines = [
    `*New lead: ${lead.name}*`,
    `Phone: ${lead.phone}`,
    `Interest: ${lead.interest}`,
    `Preferred contact: ${lead.preferredContact}`,
    lead.whatsappNumber && `WhatsApp: ${lead.whatsappNumber}`,
    lead.college && `College: ${lead.college}`,
    lead.year && `Year: ${lead.year}`,
    lead.location && `Location: ${lead.location}`,
    lead.message && `Message: ${lead.message}`,
    `Status: ${lead.status}`,
    lead.notes && `Notes: ${lead.notes}`,
  ].filter(Boolean);
  return lines.join("\n");
}

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

export async function copyAndOpenWhatsApp(lead: Lead): Promise<{ copied: boolean }> {
  const summary = formatWhatsAppSummary(lead);
  let copied = true;
  try {
    await copyText(summary);
  } catch {
    copied = false;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank", "noopener,noreferrer");
  return { copied };
}
