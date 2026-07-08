import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  buildApplicationPayload,
  fileToBase64,
  flushQueuedApplications,
  submitApplication,
} from "@/lib/applications";

export interface ApplyModalProps {
  roleTitle: string;
  onClose: () => void;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
}

const initialState: FormState = { name: "", phone: "", email: "" };
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function isValidPhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

function hasAcceptedExtension(fileName: string) {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Applies through the same backend pipeline as the Contact form's LeadForm. */
export function ApplyModal({ roleTitle, onClose }: ApplyModalProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; resume?: string }>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitted" | "queued">("idle");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  useEffect(() => {
    flushQueuedApplications();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (!hasAcceptedExtension(file.name)) {
      setErrors((prev) => ({ ...prev, resume: "Only PDF, DOC, or DOCX files are accepted" }));
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({ ...prev, resume: "File is too large — max 5MB" }));
      setResumeFile(null);
      return;
    }
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResumeFile(file);
  }

  function validate() {
    const nextErrors: typeof errors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required";
    if (!values.phone.trim()) nextErrors.phone = "Phone number is required";
    else if (!isValidPhone(values.phone)) nextErrors.phone = "Enter a valid 10-digit phone number";
    if (!values.email.trim()) nextErrors.email = "Email is required";
    if (!resumeFile) nextErrors.resume = "Resume is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate() || isSubmitting || !resumeFile) return;

    setIsSubmitting(true);
    const subId = submissionId || crypto.randomUUID();
    try {
      const base64 = await fileToBase64(resumeFile);
      const payload = buildApplicationPayload(
        { name: values.name, phone: values.phone, email: values.email, roleTitle },
        { base64, fileName: resumeFile.name, mimeType: resumeFile.type },
        subId
      );
      const { ok } = await submitApplication(payload);
      setSubmissionId(subId);
      setSubmitState(ok ? "submitted" : "queued");
    } catch {
      setSubmitState("queued");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewSubmission() {
    setValues(initialState);
    setResumeFile(null);
    setSubmissionId(null);
    setSubmitState("idle");
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

        {submitState !== "idle" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center" role="status" aria-live="polite">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aqua-400/20">
              <Icon name="check" size={32} className="text-aqua-400" />
            </span>
            <p className="text-lg font-bold tracking-[-0.01em]">
              {submitState === "submitted" ? "Application received" : "Saved on this device"}
            </p>
            <p className="text-sm text-hero-soft">
              {submitState === "submitted"
                ? `Your application for ${roleTitle} is in — we'll reach out if it's a fit.`
                : "We'll finish sending it once you're back online — no need to reapply."}
            </p>
            <div className="mt-2 flex w-full flex-col gap-2">
              <Button type="button" variant="amber" size="md" onClick={handleNewSubmission}>
                Apply to another role
              </Button>
              <Button type="button" variant="outline-light" size="md" onClick={onClose}>
                Done
              </Button>
            </div>
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
                  aria-invalid={!!errors.name}
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your name"
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint",
                    errors.name && "outline outline-2 outline-red-500"
                  )}
                />
                {errors.name && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.name}</p>}
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
                  aria-invalid={!!errors.phone}
                  autoComplete="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint",
                    errors.phone && "outline outline-2 outline-red-500"
                  )}
                />
                {errors.phone && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.phone}</p>}
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
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint",
                    errors.email && "outline outline-2 outline-red-500"
                  )}
                />
                {errors.email && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.email}</p>}
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
                  aria-invalid={!!errors.resume}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] text-hero-soft outline-none",
                    "file:mr-3 file:rounded-full file:border-0 file:bg-aqua-400/20 file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-aqua-300",
                    errors.resume && "outline outline-2 outline-red-500"
                  )}
                />
                <p className="mt-1.5 text-[12px] text-hero-faint">PDF, DOC, or DOCX — max 5MB</p>
                {errors.resume && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.resume}</p>}
              </div>

              <Button type="submit" variant="amber" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Send application"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
