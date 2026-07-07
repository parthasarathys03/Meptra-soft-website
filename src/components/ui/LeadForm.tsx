import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { buildLeadPayload, flushQueuedLeads, submitLead } from "@/lib/leads";

const interests = ["Request a demo", "Business enquiry", "A course", "An internship", "Project help"] as const;
const contactMethods = ["WhatsApp", "Call"] as const;
const years = ["1st year", "2nd year", "3rd year", "4th year", "Passed out"] as const;

/** Interests that are student-facing — show college / year / location fields. */
const studentInterests: readonly (typeof interests)[number][] = [
  "A course",
  "An internship",
  "Project help",
];

export interface LeadFormProps {
  variant?: "light" | "dark";
  className?: string;
  /** product name to prefill (e.g. arriving from a "request demo" click) */
  defaultProduct?: string;
}

interface FormState {
  name: string;
  phone: string;
  interest: (typeof interests)[number];
  preferredContact: (typeof contactMethods)[number];
  whatsappSameAsPhone: boolean;
  whatsappNumber: string;
  college: string;
  year: string;
  location: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  phone: "",
  interest: interests[0],
  preferredContact: contactMethods[0],
  whatsappSameAsPhone: true,
  whatsappNumber: "",
  college: "",
  year: "",
  location: "",
  message: "",
};

/** 10-digit local number, optionally with a +91 country code in front. */
function isValidPhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

/** Phone-first lead capture — students convert over call/WhatsApp, not email forms. */
export function LeadForm({ variant = "light", className, defaultProduct }: LeadFormProps) {
  const [values, setValues] = useState<FormState>(() =>
    defaultProduct
      ? { ...initialState, interest: "Request a demo", message: `I'd like a demo of ${defaultProduct}.` }
      : initialState
  );
  const [submitState, setSubmitState] = useState<"idle" | "submitted" | "queued">("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  useEffect(() => {
    flushQueuedLeads();
  }, []);

  const isDark = variant === "dark";
  const showStudentFields = studentInterests.includes(values.interest);

  const labelClass = cn("text-[13px] font-semibold", isDark ? "text-hero-ink" : "text-navy-800");
  const inputClass = cn(
    "mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] outline-none transition-shadow duration-200",
    isDark
      ? "neu-field text-hero-ink placeholder:text-hero-faint"
      : "border border-line-200 bg-surface text-navy-800 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-aqua-400"
  );
  const selectClass = cn(inputClass, "appearance-none pr-10 cursor-pointer");

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === "name" || key === "phone") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate() {
    const nextErrors: { name?: string; phone?: string } = {};
    if (!values.name.trim()) nextErrors.name = "Name is required";
    if (!values.phone.trim()) nextErrors.phone = "Phone number is required";
    else if (!isValidPhone(values.phone)) nextErrors.phone = "Enter a valid 10-digit phone number";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    const whatsappNumber = values.whatsappSameAsPhone ? values.phone : values.whatsappNumber;
    const subId = submissionId || crypto.randomUUID();
    const payload = buildLeadPayload({
      name: values.name,
      phone: values.phone,
      interest: values.interest,
      preferredContact: values.preferredContact,
      whatsappNumber,
      college: values.college,
      year: values.year,
      location: values.location,
      message: values.message,
    }, subId);

    try {
      const { ok } = await submitLead(payload);
      setSubmissionId(subId);
      setSubmitState(ok ? "submitted" : "queued");
    } catch {
      setSubmitState("queued");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitState !== "idle") {
    const rows: [string, string][] = [
      ["Name", values.name],
      ["Phone", values.phone],
      ["Interest", values.interest],
      ["Contact via", values.preferredContact],
    ];
    if (!values.whatsappSameAsPhone && values.whatsappNumber) {
      rows.push(["WhatsApp", values.whatsappNumber]);
    }
    if (showStudentFields) {
      if (values.college) rows.push(["College", values.college]);
      if (values.year) rows.push(["Year", values.year]);
      if (values.location) rows.push(["Location", values.location]);
    }

    return (
      <div
        className={cn(
          "flex flex-col items-center gap-5 rounded-[var(--radius-md)] px-6 py-10 text-center",
          isDark ? "text-hero-ink" : "text-navy-800",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            isDark ? "bg-aqua-400/20" : "bg-aqua-400/15"
          )}
        >
          <Icon name="check" size={32} className="text-aqua-400" />
        </span>
        <div>
          <p className="text-xl font-bold tracking-[-0.01em]">
            {submitState === "submitted" ? "Meptrasoft team will contact you" : "Saved on this device"}
          </p>
          <p className={cn("mt-2 text-sm", isDark ? "text-hero-soft" : "text-slate-500")}>
            {submitState === "submitted"
              ? `We'll reach out via ${values.preferredContact} shortly — keep your phone handy.`
              : "We'll finish sending it once you're back online — no need to resubmit."}
          </p>
        </div>

        <dl
          className={cn(
            "w-full max-w-sm divide-y overflow-hidden rounded-[var(--radius-md)] text-left text-sm",
            isDark ? "divide-white/10 border border-white/10 bg-white/5" : "divide-line-200 border border-line-200 bg-surface"
          )}
        >
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt className={cn("font-medium", isDark ? "text-hero-soft" : "text-slate-500")}>{label}</dt>
              <dd className="text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className={cn(
            "mt-2 w-full max-w-sm rounded-[var(--radius-md)] py-2.5 text-sm font-semibold transition-all border",
            isDark
              ? "border-aqua-400/30 bg-aqua-400/10 text-aqua-300 hover:bg-aqua-400/20"
              : "border-line-300 bg-slate-50 text-navy-800 hover:bg-slate-100"
          )}
        >
          Edit details / Correct mistake
        </button>
      </div>
    );
  }

  return (
    <form className={cn("flex flex-col gap-3.5", className)} onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          Name <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          autoComplete="name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          className={cn(inputClass, errors.name && "outline outline-2 outline-red-500")}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className="mt-1.5 text-[13px] font-medium text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className={labelClass}>
          Phone <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          required
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
          autoComplete="tel"
          inputMode="tel"
          maxLength={13}
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+91 98765 43210"
          className={cn(inputClass, errors.phone && "outline outline-2 outline-red-500")}
        />
        {errors.phone && (
          <p id={`${formId}-phone-error`} className="mt-1.5 text-[13px] font-medium text-red-500">
            {errors.phone}
          </p>
        )}
      </div>

      <label
        htmlFor={`${formId}-same-number`}
        className={cn(
          "flex items-center gap-2.5 text-sm",
          isDark ? "text-hero-soft" : "text-slate-500"
        )}
      >
        <input
          id={`${formId}-same-number`}
          name="whatsappSameAsPhone"
          type="checkbox"
          checked={values.whatsappSameAsPhone}
          onChange={(e) => handleChange("whatsappSameAsPhone", e.target.checked)}
          className="h-4 w-4 accent-aqua-400"
        />
        Use same number for WhatsApp
      </label>

      {!values.whatsappSameAsPhone && (
        <div>
          <label htmlFor={`${formId}-whatsapp`} className={labelClass}>
            WhatsApp number
          </label>
          <input
            id={`${formId}-whatsapp`}
            name="whatsappNumber"
            type="tel"
            inputMode="tel"
            value={values.whatsappNumber}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor={`${formId}-interest`} className={labelClass}>
          Interest <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <div className="relative mt-1.5">
          <select
            id={`${formId}-interest`}
            name="interest"
            value={values.interest}
            onChange={(e) => handleChange("interest", e.target.value as FormState["interest"])}
            className={cn(selectClass, "mt-0")}
          >
            {interests.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            size={14}
            className={cn(
              "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
              isDark ? "text-hero-faint" : "text-slate-500"
            )}
          />
        </div>
      </div>

      {showStudentFields && (
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={`${formId}-college`} className={labelClass}>
              College <span className={cn("font-normal", isDark ? "text-hero-faint" : "text-slate-500")}>(optional)</span>
            </label>
            <input
              id={`${formId}-college`}
              name="college"
              type="text"
              value={values.college}
              onChange={(e) => handleChange("college", e.target.value)}
              placeholder="Your college name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-year`} className={labelClass}>
              Year <span className={cn("font-normal", isDark ? "text-hero-faint" : "text-slate-500")}>(optional)</span>
            </label>
            <div className="relative mt-1.5">
              <select
                id={`${formId}-year`}
                name="year"
                value={values.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className={cn(selectClass, "mt-0")}
              >
                <option value="">Select year</option>
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={14}
                className={cn(
                  "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
                  isDark ? "text-hero-faint" : "text-slate-500"
                )}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${formId}-location`} className={labelClass}>
              Location <span className={cn("font-normal", isDark ? "text-hero-faint" : "text-slate-500")}>(optional)</span>
            </label>
            <input
              id={`${formId}-location`}
              name="location"
              type="text"
              value={values.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City"
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${formId}-contact`} className={labelClass}>
          Contact via WhatsApp or call
        </label>
        <div className="relative mt-1.5">
          <select
            id={`${formId}-contact`}
            name="preferredContact"
            value={values.preferredContact}
            onChange={(e) => handleChange("preferredContact", e.target.value as FormState["preferredContact"])}
            className={cn(selectClass, "mt-0")}
          >
            {contactMethods.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            size={14}
            className={cn(
              "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
              isDark ? "text-hero-faint" : "text-slate-500"
            )}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelClass}>
          Message <span className={cn("font-normal", isDark ? "text-hero-faint" : "text-slate-500")}>(optional)</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={2}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Tell us a bit more"
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <Button type="submit" variant="amber" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Get started"}
      </Button>
    </form>
  );
}
