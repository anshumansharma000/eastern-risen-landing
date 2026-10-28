"use client";

import { useId, useRef, useState, type FormEvent, type MouseEvent } from "react";

import { inquiryAttempt, submitInquiry } from "@/lib/inquiries/api";

type TourEnquiryModalProps = {
  tourTitle?: string;
  region?: string;
  duration?: string;
  compact?: boolean;
  general?: boolean;
};

export function TourEnquiryModal({ tourTitle = "", region = "", duration = "", compact = false, general = false }: TourEnquiryModalProps) {
  const attempt = useRef<{ content: string; id: string } | null>(null);
  const sending = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function openModal() {
    setSubmitted(false);
    setSubmitError("");
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeModal();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (sending.current) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());

    sending.current = true;
    setSubmitting(true);
    try {
      const payload = { ...fields, type: general ? "TOUR" as const : "TOUR_DETAIL" as const,
        tourTitle, region, duration, pageUrl: window.location.origin + window.location.pathname };
      attempt.current = inquiryAttempt(attempt.current, payload);
      await submitInquiry({ ...payload, submissionId: attempt.current.id });
      attempt.current = null;
      form.reset();
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not send your enquiry. Please try again.");
    } finally {
      sending.current = false;
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="button" type="button" onClick={openModal}>
        {general ? "Plan a journey" : "Make this yours"} {!compact ? <span aria-hidden="true">↗</span> : null}
      </button>

      <dialog
        className="tour-enquiry-modal"
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={handleBackdropClick}
      >
        <div className="tour-enquiry-modal__panel">
          <button className="tour-enquiry-modal__close" type="button" onClick={closeModal} aria-label="Close enquiry form">
            <span aria-hidden="true">×</span>
          </button>

          {submitted ? (
            <div className="tour-enquiry-success" role="status">
              <span aria-hidden="true">✓</span>
              <p className="eyebrow eyebrow--warm">Your journey brief</p>
              <h2 id={titleId}>Thank you. Your requirements are ready for review.</h2>
              <p id={descriptionId}>Our team will analyse your requirements and prepare a personalised plan and quote for the email address and phone number you provided.</p>
              <p className="tour-enquiry-success__note">Your enquiry has been sent to our planning team for processing.</p>
              <button className="button" type="button" onClick={closeModal}>Close</button>
            </div>
          ) : (
            <>
              <header className="tour-enquiry-modal__header">
                <p className="eyebrow eyebrow--warm">Make it yours</p>
                <h2 id={titleId}>Tell us how you would like to travel.</h2>
                <p id={descriptionId}>Share the essentials and anything you would change. Our team will analyse and review your requirements, then send a personalised plan and quote to your contact email and number.</p>
                {!general && <div className="tour-enquiry-modal__journey" aria-label="Selected journey">
                  <span>Selected journey</span>
                  <strong>{tourTitle}</strong>
                  <small>{region} · {duration}</small>
                </div>}
              </header>

              <form className="tour-enquiry-form" onSubmit={handleSubmit}>
                <label className="tour-enquiry-form__honeypot" aria-hidden="true">
                  <span>Website</span>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
                <fieldset disabled={submitting}>
                  <legend>Your details</legend>
                  <div className="tour-enquiry-form__grid">
                    <label>
                      <span>Full name *</span>
                      <input name="fullName" maxLength={200} type="text" autoComplete="name" required />
                    </label>
                    <label>
                      <span>Email address *</span>
                      <input name="email" maxLength={320} type="email" autoComplete="email" required />
                    </label>
                    <label>
                      <span>Phone or WhatsApp *</span>
                      <input name="phone" maxLength={64} type="tel" autoComplete="tel" placeholder="Include country code" required />
                    </label>
                    <label>
                      <span>Country of residence *</span>
                      <input name="country" maxLength={100} type="text" autoComplete="country-name" required />
                    </label>
                    <label className="tour-enquiry-form__wide">
                      <span>Preferred contact method *</span>
                      <select name="contactMethod" defaultValue="" required>
                        <option value="" disabled>Select one</option>
                        <option>Email</option>
                        <option>Phone call</option>
                        <option>WhatsApp</option>
                      </select>
                    </label>
                  </div>
                </fieldset>

                <fieldset disabled={submitting}>
                  <legend>Your travel plans</legend>
                  <div className="tour-enquiry-form__grid">
                    <label className="tour-enquiry-form__wide">
                      <span>Preferred travel dates *</span>
                      <input name="travelDates" maxLength={300} type="text" placeholder="For example, 12–20 October 2026 or flexible" required />
                    </label>
                    <label>
                      <span>Adults *</span>
                      <select name="adults" defaultValue="2" required>
                        {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count}>{count}</option>)}
                        <option value="10+">10+</option>
                      </select>
                    </label>
                    <label>
                      <span>Children</span>
                      <select name="children" defaultValue="0">
                        {Array.from({ length: 7 }, (_, index) => index).map((count) => <option key={count}>{count}</option>)}
                        <option value="6+">6+</option>
                      </select>
                    </label>
                    <label>
                      <span>Interests or changes you would like</span>
                      <textarea name="interests" maxLength={5000} rows={3} placeholder="Places, experiences, pace or parts of the route you would like us to adapt" />
                    </label>
                    <label>
                      <span>Dietary, accessibility or other requirements</span>
                      <textarea name="requirements" maxLength={5000} rows={3} />
                    </label>
                    <label className="tour-enquiry-form__wide">
                      <span>Anything else you would like us to know?</span>
                      <textarea name="additionalNotes" maxLength={10000} rows={4} placeholder="Add anything that does not have a dedicated field above" />
                    </label>
                  </div>
                </fieldset>

                <div className="tour-enquiry-form__footer">
                  <div>
                    <p>Submitting this form does not confirm a booking. We will contact you with a tailored plan and quote first.</p>
                    {submitError ? <p className="tour-enquiry-form__error" role="alert">{submitError}</p> : null}
                  </div>
                  <button className="button" type="submit" disabled={submitting} aria-busy={submitting}>
                    {submitting ? "Sending…" : "Send my requirements"} {!submitting ? <span aria-hidden="true">↗</span> : null}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
