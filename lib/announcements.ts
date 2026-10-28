export const announcementLabels = {
  GENERAL: "Latest",
  NEW_JOURNEY: "New journey",
  SEASONAL: "Seasonal highlight",
  TRAVEL_ADVISORY: "Travel update",
  SERVICE_UPDATE: "Service update",
} as const;
export type PublicAnnouncement = {
  id: string;
  revision: number;
  category: keyof typeof announcementLabels;
  message: string;
  linkText: string | null;
  linkUrl: string | null;
  priority: "NORMAL" | "IMPORTANT";
  dismissible: boolean;
  startsAt: string;
  endsAt: string | null;
};
const configuredBase = process.env.NEXT_PUBLIC_CORE_API_BASE_URL || process.env.NEXT_PUBLIC_QUOTE_API_BASE_URL || "";
export const announcementsConfigured = Boolean(configuredBase);
export function dismissalKey(item: PublicAnnouncement) { return `er-announcement:${item.id}:${item.revision}`; }
export function safeAnnouncementLink(value: unknown): value is string {
  if (typeof value !== "string" || /[\\\s\u0000-\u001f]/.test(value)) return false;
  try {
    const url = new URL(value, "https://website.invalid");
    return value.startsWith("/") ? !value.startsWith("//") && !/^\/(account|quote|api)(\/|$)/i.test(url.pathname) : url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}
export function parseAnnouncements(payload: unknown): PublicAnnouncement[] {
  if (!payload || typeof payload !== "object" || !("data" in payload) || !Array.isArray(payload.data)) throw new Error("Unreadable announcements");
  return payload.data.filter((item): item is PublicAnnouncement => Boolean(item &&
    typeof item.id === "string" && Number.isInteger(item.revision) && item.revision > 0 &&
    Object.hasOwn(announcementLabels, item.category) && typeof item.message === "string" && item.message.trim() && item.message.length <= 140 &&
    ["NORMAL", "IMPORTANT"].includes(item.priority) && typeof item.dismissible === "boolean" &&
    Number.isFinite(Date.parse(item.startsAt)) && (item.endsAt === null || Number.isFinite(Date.parse(item.endsAt))) &&
    ((item.linkText === null && item.linkUrl === null) || (typeof item.linkText === "string" && item.linkText.trim() && safeAnnouncementLink(item.linkUrl)))));
}
export function currentAnnouncements(items: PublicAnnouncement[], now = Date.now()) {
  return items.filter((item) => Date.parse(item.startsAt) <= now && (item.endsAt === null || Date.parse(item.endsAt) > now));
}
export const ANNOUNCEMENT_INTERVAL_MS = 5000;
export function announcementQueue(items: PublicAnnouncement[], dismissed: ReadonlySet<string>) {
  return items.filter((item) => !item.dismissible || !dismissed.has(dismissalKey(item)));
}
export function nextAnnouncementKey(items: PublicAnnouncement[], currentKey: string, direction = 1) {
  if (!items.length) return "";
  const index = Math.max(0, items.findIndex((item) => dismissalKey(item) === currentKey));
  return dismissalKey(items[(index + direction % items.length + items.length) % items.length]);
}
export async function fetchAnnouncements(path: string, signal: AbortSignal) {
  if (!configuredBase) return [];
  const root = configuredBase.replace(/\/+$/, "").replace(/\/api\/v1(?:\/core)?$/, "");
  const response = await fetch(`${root}/api/v1/core/public/announcements?page=${encodeURIComponent(path)}`, { signal, credentials: "omit", mode: "cors", cache: "no-store", referrerPolicy: "no-referrer", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Announcements unavailable");
  return parseAnnouncements(await response.json());
}
