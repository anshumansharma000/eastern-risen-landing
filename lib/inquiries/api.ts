const configuredBase = process.env.NEXT_PUBLIC_CORE_API_BASE_URL || process.env.NEXT_PUBLIC_QUOTE_API_BASE_URL || "";

export type InquiryReceipt = { id: string; createdAt: string };
export type InquiryInput = Record<string, string> & { submissionId: string; type: "CONTACT" | "TOUR" | "TOUR_DETAIL" };

export async function submitInquiry(input: InquiryInput): Promise<InquiryReceipt> {
  if (!configuredBase) throw new Error("Enquiry delivery is not configured yet. Please contact us by email or phone.");
  const root = configuredBase.replace(/\/+$/, "").replace(/\/api\/v1(?:\/core)?$/, "");
  let response: Response;
  try {
    response = await fetch(`${root}/api/v1/core/public/inquiries`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(input), signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error("We could not confirm your enquiry. Please check your connection and try again.");
  }
  if (response.status === 429) throw new Error("Too many enquiries just now. Please wait a minute before trying again.");
  if (response.status === 400 || response.status === 422) throw new Error("Please check your details and complete all required fields.");
  let payload;
  try { payload = await response.json(); } catch { /* Never treat an unreadable response as success. */ }
  if (response.status !== 201 || payload?.data?.id !== input.submissionId || typeof payload?.data?.createdAt !== "string" || !Number.isFinite(Date.parse(payload.data.createdAt))) {
    throw new Error("We could not confirm your enquiry. Please try again or contact us by email or phone.");
  }
  return payload.data;
}

// Keep IDs stable for retries of unchanged content, and rotate them after edits.
export function inquiryAttempt(previous: { content: string; id: string } | null, content: object) {
  const serialized = JSON.stringify(content);
  return previous?.content === serialized ? previous : { content: serialized, id: crypto.randomUUID() };
}
