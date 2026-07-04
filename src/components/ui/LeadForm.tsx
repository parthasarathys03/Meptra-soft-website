import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/content";

const interests = ["Business enquiry", "A course", "An internship", "Project help"] as const;
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

/** wa.me only accepts digits — strip spaces, dashes, parens, leading +. */
function toWhatsAppDigits(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

/** Phone-first lead capture — students convert over call/WhatsApp, not email forms. */
export function LeadForm({ variant = "light", className }: LeadFormProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const formId = useId();

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
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const whatsappNumber = values.whatsappSameAsPhone ? values.phone : values.whatsappNumber;
    const lines = [
      `New enquiry from ${values.name || "website"}`,
      `Phone: ${values.phone}`,
      `Interest: ${values.interest}`,
      `Preferred contact: ${values.preferredContact}`,
      whatsappNumber && `WhatsApp: ${whatsappNumber}`,
      values.college && `College: ${values.college}`,
      values.year && `Year: ${values.year}`,
      values.location && `Location: ${values.location}`,
      values.message && `Message: ${values.message}`,
    ].filter(Boolean);

    const businessDigits = toWhatsAppDigits(site.social.whatsapp.replace("https://wa.me/", ""));
    const waLink = `https://wa.me/${businessDigits}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(waLink, "_blank", "noopener,noreferrer");

    setSubmitted(true);
  }

  if (submitted) {
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
          <p className="text-xl font-bold tracking-[-0.01em]">Meptrasoft team will contact you</p>
          <p className={cn("mt-2 text-sm", isDark ? "text-hero-soft" : "text-slate-500")}>
            We'll reach out via {values.preferredContact} shortly — keep your phone handy.
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
          autoComplete="name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
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
          autoComplete="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
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

      <Button type="submit" variant="amber" size="lg" className="mt-1 w-full">
        Get started
      </Button>
    </form>
  );
}
