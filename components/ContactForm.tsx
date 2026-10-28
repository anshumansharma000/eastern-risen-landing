"use client";

import { useRef, useState, type FormEvent } from "react";
import { inquiryAttempt, submitInquiry } from "@/lib/inquiries/api";

export function ContactForm({ service }: { service: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const sending = useRef(false);
  const attempt = useRef<{ content: string; id: string } | null>(null);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const payload = { ...fields, type: "CONTACT" as const, service: service.slice(0, 200), pageUrl: window.location.origin + window.location.pathname };
      attempt.current = inquiryAttempt(attempt.current, payload);
      const receipt = await submitInquiry({ ...payload, submissionId: attempt.current.id });
      attempt.current = null;
      form.reset();
      setReference(receipt.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "We could not send your message. Please try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return <section className="section shell" aria-labelledby="contact-form-title">
    <p className="eyebrow eyebrow--warm">Send an enquiry</p>
    <h2 id="contact-form-title">Tell us what you have in mind.</h2>
    {reference ? <div role="status" className="tour-enquiry-form">
      <p>Thank you. Your message has been received and our team will get in touch.</p>
      <p>Your reference: {reference}</p>
      <button className="button" type="button" onClick={() => setReference("")}>Send another message</button>
    </div> : <form className="tour-enquiry-form" onSubmit={send}>
      <label className="tour-enquiry-form__honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <fieldset disabled={busy}>
        <legend>Your message</legend>
        <div className="tour-enquiry-form__grid">
          <label>Full name *<input name="fullName" autoComplete="name" maxLength={200} required /></label>
          <label>Email address *<input name="email" type="email" autoComplete="email" maxLength={320} required /></label>
          <label>Phone or WhatsApp *<input name="phone" type="tel" autoComplete="tel" maxLength={64} placeholder="Include country code" required /></label>
          <label className="tour-enquiry-form__wide">How can we help? *<textarea name="message" rows={5} maxLength={10000} required /></label>
        </div>
      </fieldset>
      <div className="tour-enquiry-form__footer">
        <div><p>We will use these details to respond to your enquiry.</p>{error && <p className="tour-enquiry-form__error" role="alert">{error}</p>}</div>
        <button className="button" disabled={busy} aria-busy={busy}>{busy ? "Sending…" : "Send my enquiry"}</button>
      </div>
    </form>}
  </section>;
}
