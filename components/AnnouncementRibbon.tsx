"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ANNOUNCEMENT_INTERVAL_MS, announcementLabels, announcementQueue, announcementsConfigured, currentAnnouncements, dismissalKey, fetchAnnouncements, nextAnnouncementKey, type PublicAnnouncement } from "@/lib/announcements";

export function AnnouncementRibbon({ onHeight }: { onHeight: (height: number) => void }) {
  const pathname = usePathname();
  const [loadedPath, setLoadedPath] = useState("");
  const [items, setItems] = useState<PublicAnnouncement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(() => Date.now());
  const [selectedKey, setSelectedKey] = useState("");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const ribbon = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const updatesButton = useRef<HTMLButtonElement>(null);
  const privatePage = /^\/(account|quote)(\/|$)/.test(pathname);

  useEffect(() => {
    if (!announcementsConfigured || privatePage) return;
    let disposed = false;
    let pending = false;
    let controller: AbortController | undefined;
    async function refresh() {
      if (document.hidden || pending) return;
      pending = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 8000);
      try {
        const data = await fetchAnnouncements(pathname, controller.signal);
        if (disposed) return;
        setItems(data);
        setLoadedPath(pathname);
        setNow(Date.now());
      } catch { if (!disposed) setItems([]); }
      finally { clearTimeout(timeout); pending = false; }
    }
    void refresh();
    const timer = setInterval(() => { setNow(Date.now()); void refresh(); }, 30000);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    const visible = () => { if (!document.hidden) { setNow(Date.now()); void refresh(); } };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("focus", visible);
    return () => { disposed = true; controller?.abort(); clearInterval(timer); clearInterval(clock); document.removeEventListener("visibilitychange", visible); window.removeEventListener("focus", visible); };
  }, [pathname, privatePage]);

  useEffect(() => {
    const visibility = () => setPageVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  const active = privatePage || loadedPath !== pathname ? [] : currentAnnouncements(items, now);
  const queue = announcementQueue(active, dismissed);
  const index = Math.max(0, queue.findIndex((item) => dismissalKey(item) === selectedKey));
  const featured = queue[index];
  const hasFeatured = Boolean(featured);
  const featuredKey = featured ? dismissalKey(featured) : "";
  const nextKey = nextAnnouncementKey(queue, featuredKey);
  const rotating = queue.length > 1 && !hovered && !focused && !dialogOpen && pageVisible;
  useEffect(() => {
    if (!rotating) return;
    const timer = setTimeout(() => setSelectedKey(nextKey), ANNOUNCEMENT_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [rotating, featuredKey, nextKey]);
  useEffect(() => {
    const element = ribbon.current;
    if (!element) { onHeight(0); return; }
    const measure = () => onHeight(element.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [featuredKey, onHeight]);
  const closeUpdates = useCallback(() => { dialog.current?.close(); setDialogOpen(false); }, []);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (dialogOpen && hasFeatured && !element.open) element.showModal();
    if ((!dialogOpen || !hasFeatured) && element.open) element.close();
  }, [dialogOpen, hasFeatured]);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    const lock = () => { document.body.style.overflow = element.open ? "hidden" : previousOverflow; };
    const observer = new MutationObserver(lock);
    observer.observe(element, { attributes: true, attributeFilter: ["open"] });
    return () => { observer.disconnect(); document.body.style.overflow = previousOverflow; };
  }, [hasFeatured]);
  if (!featured) return null;
  function dismiss() {
    if (!featured?.dismissible) return;
    const key = dismissalKey(featured);
    setSelectedKey(queue.length > 1 ? nextKey : "");
    if (queue.length === 1) { setHovered(false); setFocused(false); setDialogOpen(false); }
    setDismissed((old) => new Set([...old, key]));
  }
  return <>
    <aside ref={ribbon} className={`announcement-ribbon${featured.priority === "IMPORTANT" ? " announcement-ribbon--important" : ""}`} aria-label="Website announcements" aria-roledescription="carousel"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="shell announcement-ribbon__inner">
        <div className="announcement-ribbon__slides">
          {featured.linkUrl ? <a key={featuredKey} className="announcement-ribbon__slide announcement-ribbon__slide--linked is-active" href={featured.linkUrl}>
            <span className="announcement-ribbon__label">{announcementLabels[featured.category]}</span>
            <span className="announcement-ribbon__message">{featured.message}</span>
            <span className="announcement-ribbon__link">{featured.linkText} <span aria-hidden="true">↗</span></span>
          </a> : <div key={featuredKey} className="announcement-ribbon__slide is-active">
            <span className="announcement-ribbon__label">{announcementLabels[featured.category]}</span>
            <span className="announcement-ribbon__message">{featured.message}</span>
          </div>}
        </div>
        <div className="announcement-ribbon__actions">
          {queue.length > 1 && <button ref={updatesButton} type="button" className="announcement-ribbon__updates" onClick={() => setDialogOpen(true)}>All updates · {queue.length}</button>}
          {featured.dismissible ? <button type="button" className="announcement-ribbon__close" aria-label="Dismiss announcement" onClick={dismiss}>×</button> : <span className="announcement-ribbon__close" aria-hidden="true" style={{ visibility: "hidden" }}>×</span>}
        </div>
      </div>
    </aside>
    <dialog ref={dialog} className="announcement-dialog" hidden={!dialogOpen} aria-labelledby="announcement-dialog-title" onClose={() => { setDialogOpen(false); updatesButton.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) closeUpdates(); }}>
      {dialogOpen && <>
      <div className="announcement-dialog__heading"><div><p className="eyebrow">From Eastern Risen</p><h2 id="announcement-dialog-title">Latest updates</h2></div><button type="button" className="announcement-ribbon__close" aria-label="Close updates" onClick={closeUpdates}>×</button></div>
      <div className="announcement-dialog__list">{queue.map((item) => <article key={dismissalKey(item)}>{item.linkUrl ? <a className="announcement-dialog__entry" href={item.linkUrl}><span className="announcement-ribbon__label">{announcementLabels[item.category]}</span><p>{item.message}</p><span className="text-link">{item.linkText} <span aria-hidden="true">↗</span></span></a> : <><span className="announcement-ribbon__label">{announcementLabels[item.category]}</span><p>{item.message}</p></>}</article>)}</div>
      </>}
    </dialog>
  </>;
}
