import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface FormspreeError {
  field?: string;
  message?: string;
}

/**
 * React island: internship application form with client-side validation.
 * Field set mirrors the live site's "Apply for Internship" form.
 *
 * By default this POSTs to `action` (a form endpoint). Two easy options:
 *  1. Formspree / Getform — set action to your form URL, no backend needed.
 *  2. A serverless function — add an adapter (e.g. @astrojs/vercel), create
 *     src/pages/api/apply.ts, and send email via Resend. Then set action="/api/apply".
 */
export default function InternshipForm({
  action = "https://formspree.io/f/your-form-id",
}: {
  action?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setFieldErrors({});
    setGeneralError(null);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
        return;
      }

      // Formspree returns { errors: [{ field, message }] } on 4xx — surface
      // exactly what it says instead of a generic failure.
      const body = await res.json().catch(() => null);
      const errors: FormspreeError[] = body?.errors ?? [];

      if (errors.length > 0) {
        const perField: Record<string, string> = {};
        const general: string[] = [];
        for (const err of errors) {
          if (err.field && err.message) perField[err.field] = err.message;
          else if (err.message) general.push(err.message);
        }
        setFieldErrors(perField);
        setGeneralError(general.length > 0 ? general.join(" ") : null);
      } else {
        setGeneralError(
          body?.error ?? "The form couldn't be submitted. If this keeps happening, the form may not be confirmed yet in Formspree — check the inbox for a confirmation email.",
        );
      }
      setStatus("error");
    } catch {
      setGeneralError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  const fieldClass = (name: string) =>
    `w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${
      fieldErrors[name]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
    }`;
  const label = "mb-1.5 block text-sm font-medium text-ink";

  function FieldError({ name }: { name: string }) {
    if (!fieldErrors[name]) return null;
    return <p className="mt-1 text-xs text-red-600">{fieldErrors[name]}</p>;
  }

  if (status === "success") {
    return (
      <div className="animate-[fade-in_0.5s_ease-out] rounded-xl border border-gray-100 bg-gray-50 px-8 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            className="h-10 w-10 animate-[check-pop_0.4s_ease-out_0.15s_both]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold text-brand">Application Submitted!</h3>
        <p className="mx-auto mt-3 max-w-sm text-ink/70">
          Thanks for applying to intern with us. Our team will review your application and get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-block rounded bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Submit Another Response
        </button>
        <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes check-pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <h3 className="mb-4 font-display text-2xl font-extrabold text-brand sm:text-3xl">Apply for Internship</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">Your Name *</label>
          <input id="name" name="name" required className={fieldClass("name")} />
          <FieldError name="name" />
        </div>
        <div>
          <label className={label} htmlFor="email">E-Mail *</label>
          <input id="email" name="email" type="email" required className={fieldClass("email")} />
          <FieldError name="email" />
        </div>
        <div>
          <label className={label} htmlFor="fatherName">Father's Name *</label>
          <input id="fatherName" name="fatherName" required className={fieldClass("fatherName")} />
          <FieldError name="fatherName" />
        </div>
        <div>
          <label className={label} htmlFor="motherName">Mother's Name *</label>
          <input id="motherName" name="motherName" required className={fieldClass("motherName")} />
          <FieldError name="motherName" />
        </div>
        <div>
          <label className={label} htmlFor="phone">Mobile Number *</label>
          <input id="phone" name="phone" type="tel" required className={fieldClass("phone")} />
          <FieldError name="phone" />
        </div>
        <div>
          <label className={label} htmlFor="dob">Date of Birth *</label>
          <input id="dob" name="dob" type="date" required className={fieldClass("dob")} />
          <FieldError name="dob" />
        </div>
        <div>
          <label className={label} htmlFor="university">University *</label>
          <input id="university" name="university" required className={fieldClass("university")} />
          <FieldError name="university" />
        </div>
        <div>
          <label className={label} htmlFor="subjects">Subjects</label>
          <input id="subjects" name="subjects" className={fieldClass("subjects")} />
          <FieldError name="subjects" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="address">Address *</label>
        <input id="address" name="address" required className={fieldClass("address")} />
        <FieldError name="address" />
      </div>

      <label className="flex items-start gap-2 text-sm text-ink/80">
        <input type="checkbox" name="consent" required defaultChecked className="mt-1 h-4 w-4 flex-none rounded border-gray-300" />
        I am joining this program of my own choice, without any force. During this program I will stay in Jaipur at my own responsibility.
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="justify-self-start rounded bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Apply"}
      </button>

      {status === "error" && generalError && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{generalError}</p>
      )}
    </form>
  );
}
