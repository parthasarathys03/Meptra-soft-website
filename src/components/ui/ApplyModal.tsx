import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/content";

export interface ApplyModalProps {
  roleTitle: string;
  onClose: () => void;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  resumeName: string;
}

const initialState: FormState = { name: "", phone: "", email: "", resumeName: "" };

/** Applies straight to WhatsApp + email — no backend, no visible contact info in the UI. */
export function ApplyModal({ roleTitle, onClose }: ApplyModalProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const formId = useId();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const lines = [
      `Job application: ${roleTitle}`,
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      values.resumeName ? `Resume: ${values.resumeName} (attach in reply email)` : "Resume: not attached",
    ];
    const messageText = lines.join("\n");

    const businessDigits = site.social.whatsapp.replace("https://wa.me/", "");
    window.open(`https://wa.me/${businessDigits}?text=${encodeURIComponent(messageText)}`, "_blank", "noopener,noreferrer");

    const mailSubject = `Job application: ${roleTitle} — ${values.name}`;
    const mailBody = `${lines.join("\n")}\n\nPlease attach the resume file before sending.`;
    window.open(
      `mailto:${site.applicationEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`,
      "_blank"
    );

    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020810]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel relative w-full max-w-md rounded-[var(--radius-lg)] p-6 text-hero-ink md:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-hero-soft transition-colors hover:bg-white/10 hover:text-hero-ink"
        >
          <Icon name="close" size={16} />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center" role="status" aria-live="polite">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aqua-400/20">
              <Icon name="check" size={32} className="text-aqua-400" />
            </span>
            <p className="text-lg font-bold tracking-[-0.01em]">Application sent</p>
            <p className="text-sm text-hero-soft">
              We opened WhatsApp and your email app with your details for {roleTitle}. Send both to complete your
              application — and attach your resume in the email before sending.
            </p>
            <Button type="button" variant="outline-light" size="md" className="mt-2" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <p className="eyebrow text-aqua-300">Apply</p>
            <h2 id={`${formId}-title`} className="mt-1 text-xl font-bold tracking-[-0.01em]">
              {roleTitle}
            </h2>

            <form className="mt-5 flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor={`${formId}-name`} className="text-[13px] font-semibold text-hero-ink">
                  Name <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  required
                  aria-required="true"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your name"
                  className="neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-phone`} className="text-[13px] font-semibold text-hero-ink">
                  Phone <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  required
                  aria-required="true"
                  autoComplete="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-email`} className="text-[13px] font-semibold text-hero-ink">
                  Email <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className="neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-resume`} className="text-[13px] font-semibold text-hero-ink">
                  Resume <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-resume`}
                  type="file"
                  required
                  aria-required="true"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleChange("resumeName", e.target.files?.[0]?.name ?? "")}
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] text-hero-soft outline-none",
                    "file:mr-3 file:rounded-full file:border-0 file:bg-aqua-400/20 file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-aqua-300"
                  )}
                />
              </div>

              <Button type="submit" variant="amber" size="lg" className="mt-1 w-full">
                Send application
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
