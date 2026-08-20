"use client";

import { useId, useRef, useState, type FormEvent, type MouseEvent } from "react";

const enquiryEndpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL;

type TourEnquiryModalProps = {
  tourTitle: string;
  region: string;
  duration: string;
  compact?: boolean;
};

export function TourEnquiryModal({ tourTitle, region, duration, compact = false }: TourEnquiryModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function openModal() {
    setSubmitted(false);
    setSubmitting(false);
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

    if (!enquiryEndpoint) {
      setSubmitError("Enquiry delivery is not configured yet. Please contact us by email or phone.");
      return;
    }

    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);

    try {
      // Apps Script does not return browser CORS headers. A simple no-cors POST
      // lets this static site deliver the enquiry without exposing credentials.
      await fetch(enquiryEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...fields,
          tourTitle,
          region,
          duration,
          pageUrl: window.location.href,
        }),
      });

      form.reset();
      setSubmitted(true);
    } catch {
      setSubmitError("We could not send your enquiry. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="button" type="button" onClick={openModal}>
        Make this yours {!compact ? <span aria-hidden="true">↗</span> : null}
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
                <div className="tour-enquiry-modal__journey" aria-label="Selected journey">
                  <span>Selected journey</span>
                  <strong>{tourTitle}</strong>
                  <small>{region} · {duration}</small>
                </div>
              </header>

              <form className="tour-enquiry-form" onSubmit={handleSubmit}>
                <label className="tour-enquiry-form__honeypot" aria-hidden="true">
                  <span>Website</span>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
                <fieldset>
                  <legend>Your details</legend>
                  <div className="tour-enquiry-form__grid">
                    <label>
                      <span>Full name *</span>
                      <input name="fullName" type="text" autoComplete="name" required />
                    </label>
                    <label>
                      <span>Email address *</span>
                      <input name="email" type="email" autoComplete="email" required />
                    </label>
                    <label>
                      <span>Phone or WhatsApp *</span>
                      <input name="phone" type="tel" autoComplete="tel" placeholder="Include country code" required />
                    </label>
                    <label>
                      <span>Country of residence *</span>
                      <input name="country" type="text" autoComplete="country-name" required />
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

                <fieldset>
                  <legend>Your travel plans</legend>
                  <div className="tour-enquiry-form__grid">
                    <label className="tour-enquiry-form__wide">
                      <span>Preferred travel dates *</span>
                      <input name="travelDates" type="text" placeholder="For example, 12–20 October 2026 or flexible" required />
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
                      <textarea name="interests" rows={3} placeholder="Places, experiences, pace or parts of the route you would like us to adapt" />
                    </label>
                    <label>
                      <span>Dietary, accessibility or other requirements</span>
                      <textarea name="requirements" rows={3} />
                    </label>
                    <label className="tour-enquiry-form__wide">
                      <span>Anything else you would like us to know?</span>
                      <textarea name="additionalNotes" rows={4} placeholder="Add anything that does not have a dedicated field above" />
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
