#!/usr/bin/env python3
"""Build a redesign-ready content bank from Eastern Risen's public website."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import shutil
import ssl
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from lxml import html


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content-bank"
BASE = "http://www.easternrisen.com/"
HOSTS = {"easternrisen.com", "www.easternrisen.com"}
USER_AGENT = "Mozilla/5.0 (compatible; EasternRisenContentArchive/1.0)"
MAX_PAGES = 300
PAGE_EXTENSIONS = {"", ".asp", ".aspx", ".htm", ".html"}
ASSET_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".pdf",
    ".css", ".js", ".swf", ".woff", ".woff2", ".ttf", ".eot",
}
SKIP_PREFIXES = ("/admin/",)
SEEDS = [
    BASE,
    urljoin(BASE, "default.asp"),
    urljoin(BASE, "about.asp"),
    urljoin(BASE, "contact.asp"),
    urljoin(BASE, "photo_gallery.asp"),
    urljoin(BASE, "disclaimer.asp"),
    urljoin(BASE, "privcy_pol.asp"),
    urljoin(BASE, "terms_use.asp"),
    urljoin(BASE, "feedback.asp"),
    urljoin(BASE, "Service/inbound_domstic_tour.asp"),
    urljoin(BASE, "Service/car_rental.asp"),
    urljoin(BASE, "Service/air_ticketing.asp"),
    urljoin(BASE, "Service/travel_docum.asp"),
]


@dataclass
class FetchResult:
    url: str
    final_url: str
    status: int | None
    content_type: str
    body: bytes | None
    error: str | None


def fetch(url: str, timeout: int = 30) -> FetchResult:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=timeout) as response:
            return FetchResult(
                url=url,
                final_url=response.geturl(),
                status=getattr(response, "status", 200),
                content_type=response.headers.get("Content-Type", ""),
                body=response.read(),
                error=None,
            )
    except (HTTPError, URLError, TimeoutError, ssl.SSLError, OSError) as exc:
        return FetchResult(url, url, getattr(exc, "code", None), "", None, str(exc))


def normalized_url(raw: str, base: str) -> str | None:
    if not raw:
        return None
    raw = raw.strip().replace(" ", "%20")
    if raw.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None
    absolute = urljoin(base, raw)
    parts = urlsplit(absolute)
    if parts.scheme not in {"http", "https"} or parts.hostname not in HOSTS:
        return None
    path = parts.path or "/"
    if any(path.lower().startswith(prefix) for prefix in SKIP_PREFIXES):
        return None
    query = urlencode(sorted(parse_qsl(parts.query, keep_blank_values=True)))
    return urlunsplit(("http", "www.easternrisen.com", path, query, ""))


def suffix_for(url: str) -> str:
    return Path(urlsplit(url).path).suffix.lower()


def is_page(url: str) -> bool:
    return suffix_for(url) in PAGE_EXTENSIONS


def is_asset(url: str) -> bool:
    return suffix_for(url) in ASSET_EXTENSIONS


def safe_name(url: str, default_ext: str = ".html") -> str:
    parts = urlsplit(url)
    path = parts.path.strip("/") or "index"
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", path)
    if parts.query:
        name += "__" + re.sub(r"[^A-Za-z0-9._-]+", "_", parts.query)
    if not Path(name).suffix:
        name += default_ext
    return name


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def document_text(tree) -> str:
    work = html.fromstring(html.tostring(tree))
    for bad in work.xpath("//script|//style|//noscript"):
        bad.drop_tree()
    body_nodes = work.xpath("//body")
    text_root = body_nodes[0] if body_nodes else work
    text = text_root.text_content().replace("\xa0", " ")
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def extract_main_content(full_text: str) -> tuple[str, list[str]]:
    lines = [line.strip() for line in full_text.splitlines() if line.strip()]
    start = 0
    if lines and re.match(r"^India\s*\|\s*Srilanka\s*\|\s*Nepal\s*\|\s*Tibet\s*\|\s*Bhutan$", lines[0], re.I):
        start = 1
    for idx, line in enumerate(lines[:30]):
        if line.replace(" ", "").lower() == "contactus":
            start = idx + 1
    while start < len(lines) and re.fullmatch(r"[-–—_]{10,}", lines[start]):
        start += 1
    end = len(lines)
    for idx in range(start + 2, len(lines)):
        normalized = lines[idx].strip().lower()
        if normalized in {"tours", "client commendation"}:
            end = idx
            break
        if normalized == "our services" and idx > start + 3:
            end = idx
            break
    content = [line for line in lines[start:end] if not re.fullmatch(r"[-–—_]{10,}", line)]
    heading = content[0] if content else ""
    return heading, content


def meta_map(tree) -> dict[str, str]:
    result: dict[str, str] = {}
    for node in tree.xpath("//meta"):
        key = node.get("name") or node.get("property") or node.get("http-equiv")
        value = node.get("content")
        if key and value:
            result[key] = value
    return result


def classify(url: str, heading: str) -> str:
    path = urlsplit(url).path.lower()
    if "/tour/" in path:
        return "tour"
    if "/service/" in path:
        return "service"
    if path.endswith("about.asp"):
        return "about"
    if path.endswith("contact.asp"):
        return "contact"
    if "gallery" in path:
        return "gallery"
    if any(token in path for token in ("disclaimer", "privcy", "terms", "feedback")):
        return "legal_or_feedback"
    if path in {"/", "/default.asp"}:
        return "homepage"
    return "other"


def first_match(lines: list[str], pattern: str) -> str:
    regex = re.compile(pattern, re.I)
    for line in lines:
        match = regex.search(line)
        if match:
            return match.group(1).strip()
    return ""


def parse_page(result: FetchResult) -> tuple[dict, set[str], set[str], list[dict]]:
    assert result.body is not None
    encoding = "iso-8859-1"
    content_type_match = re.search(r"charset=([^;\s]+)", result.content_type, re.I)
    if content_type_match:
        encoding = content_type_match.group(1).strip("\"'")
    try:
        source = result.body.decode(encoding, errors="replace")
    except LookupError:
        source = result.body.decode("iso-8859-1", errors="replace")
    tree = html.fromstring(source, base_url=result.final_url)
    tree.make_links_absolute(result.final_url)
    full_text = document_text(tree)
    heading, content_lines = extract_main_content(full_text)
    title_nodes = tree.xpath("//title/text()")
    links: list[dict] = []
    page_urls: set[str] = set()
    asset_urls: set[str] = set()
    for node in tree.xpath("//a[@href]"):
        href = node.get("href", "")
        absolute = urljoin(result.final_url, href)
        links.append({
            "source_url": result.url,
            "text": re.sub(r"\s+", " ", node.text_content()).strip(),
            "target_url": absolute,
            "target": node.get("target", ""),
        })
        internal = normalized_url(href, result.final_url)
        if internal and is_page(internal):
            page_urls.add(internal)
        elif internal and is_asset(internal):
            asset_urls.add(internal)
    for attr in ("src", "data"):
        for value in tree.xpath(f"//*[@{attr}]/@{attr}"):
            internal = normalized_url(value, result.final_url)
            if internal and is_asset(internal):
                asset_urls.add(internal)
    for value in re.findall(r"(?:[A-Za-z0-9_./-]+\.asp(?:\?[^\"'\s<]*)?)", source, re.I):
        internal = normalized_url(value, result.final_url)
        if internal and is_page(internal):
            page_urls.add(internal)
    for value in re.findall(r"(?:[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|gif|svg|pdf|css|js|swf))", source, re.I):
        internal = normalized_url(value, result.final_url)
        if internal and is_asset(internal):
            asset_urls.add(internal)
    duration = first_match(content_lines, r"^Duration\s*:\s*(.+)$")
    destination = first_match(content_lines, r"^Destination\s*:\s*(.*)$")
    if not destination and duration:
        for index, line in enumerate(content_lines):
            if re.match(r"^Duration\s*:", line, re.I) and index + 1 < len(content_lines):
                candidate = content_lines[index + 1]
                if not re.match(r"^(DAY|BACK|Duration)", candidate, re.I):
                    destination = candidate
                break
    day_headings = [line for line in content_lines if re.match(r"^DAY\s*[-–:]?\s*0?\d+|^DAY\s*[-–:]?\s*\d+\s*[-–]|^DAY-\d+", line, re.I)]
    media = []
    for node in tree.xpath("//img|//embed|//object"):
        raw_url = node.get("src") or node.get("data") or ""
        media.append({
            "tag": node.tag.lower(),
            "url": urljoin(result.final_url, raw_url) if raw_url else "",
            "alt": node.get("alt", ""),
            "title": node.get("title", ""),
            "width": node.get("width", ""),
            "height": node.get("height", ""),
            "type": node.get("type", ""),
        })
    forms = []
    for position, form in enumerate(tree.xpath("//form"), 1):
        fields = []
        for field in form.xpath(".//input|.//textarea|.//select|.//button"):
            fields.append({
                "tag": field.tag.lower(),
                "type": field.get("type", ""),
                "name": field.get("name", ""),
                "id": field.get("id", ""),
                "value": field.get("value", "") if field.get("type", "").lower() in {"hidden", "submit", "button"} else "",
                "placeholder": field.get("placeholder", ""),
                "required": field.get("required") is not None,
            })
        forms.append({
            "position": position,
            "action": urljoin(result.final_url, form.get("action", "")),
            "method": form.get("method", "get").lower(),
            "name": form.get("name", ""),
            "id": form.get("id", ""),
            "fields": fields,
        })
    page = {
        "source_url": result.url,
        "final_url": result.final_url,
        "http_status": result.status,
        "content_type": result.content_type,
        "title": title_nodes[0].strip() if title_nodes else "",
        "heading": heading,
        "classification": classify(result.url, heading),
        "meta": meta_map(tree),
        "main_content": "\n".join(content_lines),
        "full_text": full_text,
        "duration": duration,
        "destination_or_route": destination,
        "day_headings": day_headings,
        "tour_page_role": "itinerary" if day_headings else ("catalog_or_landing" if classify(result.url, heading) == "tour" else ""),
        "forms": forms,
        "media": media,
        "link_count": len(links),
        "image_count": len(tree.xpath("//img")),
        "form_count": len(tree.xpath("//form")),
        "source_file": f"legacy-html/{safe_name(result.url)}",
        "source_sha256": hashlib.sha256(result.body).hexdigest(),
    }
    return page, page_urls, asset_urls, links


def offering_rows(page: dict) -> list[dict]:
    if page["classification"] != "tour":
        return []
    lines = page["main_content"].splitlines()
    rows: list[dict] = []
    for idx, line in enumerate(lines):
        if not re.match(r"^Duration\s*:", line, re.I) or idx == 0:
            continue
        name = lines[idx - 1].strip(" \t ")
        if name.upper() == "BACK" and idx >= 2:
            name = lines[idx - 2]
        duration = re.sub(r"^Duration\s*:\s*", "", line, flags=re.I)
        destination = ""
        if idx + 1 < len(lines):
            destination = re.sub(r"^Destination\s*:\s*", "", lines[idx + 1], flags=re.I)
            if re.match(r"^(DAY|BACK|Duration)", destination, re.I):
                destination = ""
        rows.append({
            "name": name,
            "duration": duration,
            "destination_or_route": destination,
            "category_page": page["heading"],
            "source_url": page["source_url"],
        })
    return rows


def markdown_for_page(page: dict) -> str:
    front = {
        "source_url": page["source_url"],
        "legacy_title": page["title"],
        "classification": page["classification"],
        "duration": page["duration"],
        "destination_or_route": page["destination_or_route"],
    }
    lines = ["---"]
    for key, value in front.items():
        escaped = str(value).replace('"', '\\"')
        lines.append(f'{key}: "{escaped}"')
    lines.extend(["---", "", f"# {page['heading'] or page['source_url']}", "", page["main_content"], ""])
    return "\n".join(lines)


def build() -> int:
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "legacy-html").mkdir(parents=True)
    (OUT / "legacy-assets").mkdir(parents=True)
    (OUT / "pages").mkdir(parents=True)
    (OUT / "tour-pages").mkdir(parents=True)
    (OUT / "itineraries").mkdir(parents=True)

    queued = list(dict.fromkeys(SEEDS))
    seen: set[str] = set()
    pages: list[dict] = []
    links: list[dict] = []
    assets: set[str] = {urljoin(BASE, "ATOAI1.pdf")}
    url_rows: list[dict] = []

    while queued and len(seen) < MAX_PAGES:
        batch: list[str] = []
        while queued and len(batch) < 12:
            candidate = queued.pop(0)
            if candidate not in seen:
                seen.add(candidate)
                batch.append(candidate)
        if not batch:
            continue
        with ThreadPoolExecutor(max_workers=8) as pool:
            futures = {pool.submit(fetch, url): url for url in batch}
            for future in as_completed(futures):
                result = future.result()
                url_rows.append({
                    "url": result.url,
                    "status": result.status or "",
                    "content_type": result.content_type,
                    "error": result.error or "",
                })
                if result.error or not result.body:
                    continue
                filename = safe_name(result.url)
                (OUT / "legacy-html" / filename).write_bytes(result.body)
                try:
                    page, discovered_pages, discovered_assets, page_links = parse_page(result)
                except Exception as exc:  # preserve source even if normalization fails
                    url_rows[-1]["error"] = f"Parse error: {exc}"
                    continue
                pages.append(page)
                links.extend(page_links)
                assets.update(discovered_assets)
                for discovered in sorted(discovered_pages):
                    if discovered not in seen and discovered not in queued:
                        queued.append(discovered)

    asset_rows: list[dict] = []
    asset_seen: set[str] = set()
    asset_queue = sorted(assets)
    while asset_queue:
        batch = []
        while asset_queue and len(batch) < 30:
            candidate = asset_queue.pop(0)
            if candidate not in asset_seen:
                asset_seen.add(candidate)
                batch.append(candidate)
        if not batch:
            continue
        with ThreadPoolExecutor(max_workers=10) as pool:
            futures = {pool.submit(fetch, url): url for url in batch}
            for future in as_completed(futures):
                result = future.result()
                row = {
                    "url": result.url,
                    "status": result.status or "",
                    "content_type": result.content_type,
                    "bytes": len(result.body or b""),
                    "sha256": hashlib.sha256(result.body).hexdigest() if result.body else "",
                    "local_file": "",
                    "error": result.error or "",
                }
                if result.body and not result.error:
                    filename = safe_name(result.url, default_ext=".bin")
                    destination = OUT / "legacy-assets" / filename
                    destination.write_bytes(result.body)
                    row["local_file"] = str(destination.relative_to(OUT))
                    if suffix_for(result.url) in {".css", ".js"}:
                        source = result.body.decode("iso-8859-1", errors="ignore")
                        references = re.findall(
                            r"(?:url\s*\(\s*['\"]?([^)'\"]+)|['\"]([^'\"]+\.(?:jpg|jpeg|png|gif|svg|ico|swf|woff2?|ttf|eot|css|js)))",
                            source,
                            re.I,
                        )
                        for groups in references:
                            value = next((item for item in groups if item), "")
                            internal = normalized_url(value, result.url)
                            if internal and is_asset(internal) and internal not in asset_seen and internal not in asset_queue:
                                asset_queue.append(internal)
                asset_rows.append(row)

    pages.sort(key=lambda item: item["source_url"])
    offering_occurrences: list[dict] = []
    for page in pages:
        offering_occurrences.extend(offering_rows(page))
        page_filename = safe_name(page["source_url"], default_ext=".md")
        page_filename = str(Path(page_filename).with_suffix(".md"))
        (OUT / "pages" / page_filename).write_text(markdown_for_page(page), encoding="utf-8")
        if page["classification"] == "tour":
            (OUT / "tour-pages" / page_filename).write_text(markdown_for_page(page), encoding="utf-8")
        if page["classification"] == "tour" and page["day_headings"]:
            (OUT / "itineraries" / page_filename).write_text(markdown_for_page(page), encoding="utf-8")

    offerings_by_key: dict[tuple[str, str, str], dict] = {}
    for row in offering_occurrences:
        key = (
            re.sub(r"[^a-z0-9]+", "", row["name"].lower()),
            re.sub(r"[^a-z0-9]+", "", row["duration"].lower()),
            re.sub(r"[^a-z0-9]+", "", row["destination_or_route"].lower()),
        )
        if key not in offerings_by_key:
            offerings_by_key[key] = {
                "name": row["name"],
                "duration": row["duration"],
                "destination_or_route": row["destination_or_route"],
                "category_pages": [row["category_page"]],
                "source_urls": [row["source_url"]],
            }
        else:
            record = offerings_by_key[key]
            if row["category_page"] not in record["category_pages"]:
                record["category_pages"].append(row["category_page"])
            if row["source_url"] not in record["source_urls"]:
                record["source_urls"].append(row["source_url"])
    offerings = sorted(offerings_by_key.values(), key=lambda row: row["name"].lower())
    same_name_counts = {}
    for row in offerings:
        name_key = re.sub(r"[^a-z0-9]+", "", row["name"].lower())
        same_name_counts[name_key] = same_name_counts.get(name_key, 0) + 1
    review_queue = []
    typo_markers = ("thiland", "srilanka", "gujrat", "glipms", "gangtak", "kathmadu", "jargon", "darsha")
    for row in offerings:
        flags = []
        searchable = " ".join((row["name"], row["duration"], row["destination_or_route"])).lower()
        name_key = re.sub(r"[^a-z0-9]+", "", row["name"].lower())
        if not row["destination_or_route"]:
            flags.append("missing_route")
        if same_name_counts.get(name_key, 0) > 1:
            flags.append("same_name_conflict")
        if any(marker in searchable for marker in typo_markers):
            flags.append("probable_spelling_issue")
        if re.search(r"\b20\d{2}\b", searchable):
            flags.append("dated_content")
        if row["name"].lower().startswith("itinerary") or "start from" in row["name"].lower():
            flags.append("unclear_package_name")
        if flags:
            review_queue.append({**row, "review_flags": flags})

    company = {
        "legal_name": "Eastern Risen Expedition Pvt. Ltd.",
        "brand_name": "Eastern Risen",
        "tagline": "Make Your Own Travel",
        "promotional_line": "Make Your Own Travel Safely",
        "founder": "Bijan Kumar Muduli",
        "emails": ["info@easternrisen.com", "bijan@easternrisen.com"],
        "phones_as_published": ["09777564596", "09777564695", "+9777564695"],
        "head_office": {
            "address_lines": [
                "Plot No.2382/9794 (First Floor), Elegance Villa",
                "Lane-03, Near Puri ByPass, NH-316",
                "Badagada Brit Colony, PS-Badagada",
                "Bhubaneswar-751018, Khurda, Odisha, India",
            ]
        },
        "guwahati_office": {
            "address_lines": ["2nd Floor, Hamtola", "Kamakhya Dham", "Guwahati-781010"]
        },
        "channel_offices": ["Delhi", "Mumbai", "Kolkata", "Hyderabad", "Bengaluru", "Chennai", "Ahmedabad", "Guwahati"],
        "memberships_as_claimed": ["IATO", "ADTOI", "ATOAI", "ITTA", "TOFTigers"],
        "recognition_as_claimed": [
            "Recognised by Ministry of Tourism, Government of India",
            "Authorised to operate in PVTG area",
            "Accredited by Odisha Tourism, Government of Odisha",
        ],
        "source_urls": [urljoin(BASE, "about.asp"), urljoin(BASE, "contact.asp"), BASE],
        "verification_status": "Legacy website claims; verify before publication",
    }
    services = [
        {"name": "Inbound & Domestic Tour Operation", "source_url": urljoin(BASE, "Service/inbound_domstic_tour.asp")},
        {"name": "Car Rental", "source_url": urljoin(BASE, "Service/car_rental.asp")},
        {"name": "Air Ticketing", "source_url": urljoin(BASE, "Service/air_ticketing.asp")},
        {"name": "Travel Documentation", "source_url": urljoin(BASE, "Service/travel_docum.asp")},
    ]
    navigation = {
        "primary": [
            {"label": "Home", "legacy_url": urljoin(BASE, "default.asp")},
            {"label": "About Us", "legacy_url": urljoin(BASE, "about.asp")},
            {"label": "Tours", "legacy_url": None},
            {"label": "Our Services", "legacy_url": None},
            {"label": "Contact Us", "legacy_url": urljoin(BASE, "contact.asp")},
        ],
        "destination_shortcuts": ["India", "Srilanka", "Nepal", "Tibet", "Bhutan"],
        "tour_groups": {
            "India": ["North India", "South India", "North East India", "East India", "West India", "Central India"],
            "Odisha": ["Golden Triangle", "Nature", "Wildlife", "Dream Destination", "Western Odisha"],
            "Special Interest": ["Wildlife", "Adventure & Trekking", "Ladakh", "Bike Safari", "Tribal", "Spiritual & Shaman", "Buddhist", "Textile"],
            "Neighbouring Countries": ["Nepal", "Sri Lanka", "Bhutan", "Tibet"],
            "Outbound Holidays": ["Thailand", "Malaysia", "Singapore", "Malaysia & Singapore"],
            "Festivals": ["Si-Donyi", "Torgya", "Reh", "Boori Boot", "Mopin", "Sangken", "Hornbill"],
        },
        "footer": ["Home", "About Us", "Photo Gallery", "Contact Us", "Disclaimer", "Privacy Policy", "Terms of Use", "Feedback"],
        "status": "Legacy information architecture; labels and grouping should be edited before implementation",
    }
    policies = [
        {"name": "Disclaimer", "source_url": urljoin(BASE, "disclaimer.asp"), "legacy_status": "heading_only", "redesign_status": "write_required"},
        {"name": "Privacy Policy", "source_url": urljoin(BASE, "privcy_pol.asp"), "legacy_status": "heading_only", "redesign_status": "write_required"},
        {"name": "Terms of Use", "source_url": urljoin(BASE, "terms_use.asp"), "legacy_status": "heading_only", "redesign_status": "write_required"},
        {"name": "Feedback", "source_url": urljoin(BASE, "feedback.asp"), "legacy_status": "heading_only", "redesign_status": "design_decision_required"},
        {"name": "Booking and cancellation policy", "source_url": None, "legacy_status": "not_found", "redesign_status": "write_required"},
        {"name": "Refund policy", "source_url": None, "legacy_status": "not_found", "redesign_status": "write_required"},
        {"name": "Cookie/analytics notice", "source_url": None, "legacy_status": "not_found", "redesign_status": "write_if_applicable"},
    ]
    redirects = []
    for page in pages:
        path = urlsplit(page["source_url"]).path
        slug = re.sub(r"[^a-z0-9]+", "-", (page["heading"] or Path(path).stem).lower()).strip("-") or "home"
        if page["classification"] == "tour":
            target = f"/tours/{slug}/"
        elif page["classification"] == "service":
            target = f"/services/{slug}/"
        elif page["classification"] == "homepage":
            target = "/"
        else:
            target = f"/{slug}/"
        redirects.append({"legacy_url": page["source_url"], "suggested_new_path": target, "status_code": 301})

    write_json(OUT / "data" / "company.json", company)
    write_json(OUT / "data" / "services.json", services)
    write_json(OUT / "data" / "navigation.json", navigation)
    write_json(OUT / "data" / "policies.json", policies)
    write_json(OUT / "data" / "pages.json", pages)
    write_json(OUT / "data" / "tour_catalog.json", offerings)
    write_json(OUT / "data" / "tour_occurrences.json", offering_occurrences)
    write_json(OUT / "data" / "tour_review_queue.json", review_queue)
    write_csv(
        OUT / "data" / "tour_catalog.csv",
        ["name", "duration", "destination_or_route", "category_pages", "source_urls"],
        ({**row, "category_pages": " | ".join(row["category_pages"]), "source_urls": " | ".join(row["source_urls"])} for row in offerings),
    )
    write_csv(OUT / "data" / "url_inventory.csv", ["url", "status", "content_type", "error"], sorted(url_rows, key=lambda row: row["url"]))
    write_csv(OUT / "data" / "links.csv", ["source_url", "text", "target_url", "target"], links)
    write_csv(
        OUT / "data" / "forms.csv",
        ["source_url", "form_position", "action", "method", "form_name", "form_id", "fields_json"],
        (
            {
                "source_url": page["source_url"],
                "form_position": form["position"],
                "action": form["action"],
                "method": form["method"],
                "form_name": form["name"],
                "form_id": form["id"],
                "fields_json": json.dumps(form["fields"], ensure_ascii=False),
            }
            for page in pages for form in page["forms"]
        ),
    )
    write_csv(
        OUT / "data" / "media_usage.csv",
        ["source_url", "tag", "url", "alt", "title", "width", "height", "type"],
        ({"source_url": page["source_url"], **media} for page in pages for media in page["media"]),
    )
    write_csv(OUT / "data" / "assets.csv", ["url", "status", "content_type", "bytes", "sha256", "local_file", "error"], sorted(asset_rows, key=lambda row: row["url"]))
    write_csv(OUT / "data" / "redirects.csv", ["legacy_url", "suggested_new_path", "status_code"], redirects)

    issues = [
        "HTTPS certificate failed validation during the 2026-08-05 browser audit.",
        "Login and enquiry forms submit over HTTP; do not reproduce this behavior.",
        "Legacy legal, privacy, terms, feedback, travel-documentation, and inbound-operation pages contain little or no substantive copy.",
        "All inspected pages use the same generic HTML title.",
        "Legacy spelling, route, duration, address, phone, accreditation, and factual claims require editorial verification.",
        "Flash, Google+, old JavaScript libraries, visitor counters, and the public login are archival material, not redesign requirements.",
    ]
    (OUT / "DATA_QUALITY.md").write_text("# Data quality and verification queue\n\n" + "\n".join(f"- {item}" for item in issues) + "\n", encoding="utf-8")

    manifest = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_base_url": BASE,
        "pages_discovered": len(seen),
        "pages_normalized": len(pages),
        "tour_page_count": sum(page["classification"] == "tour" for page in pages),
        "tour_markdown_count": len(list((OUT / "tour-pages").glob("*.md"))),
        "itinerary_markdown_count": len(list((OUT / "itineraries").glob("*.md"))),
        "catalog_record_count": len(offerings),
        "catalog_occurrence_count": len(offering_occurrences),
        "catalog_review_queue_count": len(review_queue),
        "asset_url_count": len(asset_rows),
        "assets_downloaded": sum(bool(row["local_file"]) for row in asset_rows),
        "failed_page_count": sum(bool(row["error"]) for row in url_rows),
        "failed_asset_count": sum(bool(row["error"]) for row in asset_rows),
    }
    write_json(OUT / "manifest.json", manifest)
    readme = f"""# Eastern Risen content bank

Generated from the public legacy site at {BASE} for redesign and migration.

## Repository map

- `data/company.json` - structured company, office, contact, recognition, and membership data
- `data/services.json` - service catalog
- `data/navigation.json` - legacy information architecture in reusable form
- `data/policies.json` - policy-page status and content gaps
- `data/tour_catalog.json` and `.csv` - deduplicated package records with provenance
- `data/tour_occurrences.json` - every package occurrence as printed across landing and detail pages
- `data/tour_review_queue.json` - records requiring editorial or factual review
- `data/pages.json` - complete normalized page records, including full and main text
- `data/url_inventory.csv` - crawl status and errors
- `data/links.csv` - complete observed hyperlink inventory
- `data/forms.csv` - form actions, methods, and field schemas
- `data/media_usage.csv` - media-to-page usage, alt text, dimensions, and type
- `data/assets.csv` - media/script/style/PDF inventory with hashes and download status
- `data/redirects.csv` - suggested legacy-to-new URL migration map
- `pages/` - one Markdown file per public page
- `tour-pages/` - one Markdown file for every tour page, including category pages
- `itineraries/` - tour pages containing detected day-by-day programs
- `legacy-html/` - byte-preserved source HTML snapshot
- `legacy-assets/` - downloaded same-origin public assets
- `DATA_QUALITY.md` - verification and editorial queue

## Coverage

- Public URLs discovered: {manifest['pages_discovered']}
- Pages normalized: {manifest['pages_normalized']}
- Tour pages: {manifest['tour_page_count']}
- Tour Markdown files: {manifest['tour_markdown_count']}
- Itinerary Markdown files: {manifest['itinerary_markdown_count']}
- Deduplicated catalog records / raw occurrences: {manifest['catalog_record_count']}/{manifest['catalog_occurrence_count']}
- Catalog records flagged for review: {manifest['catalog_review_queue_count']}
- Same-origin assets discovered/downloaded: {manifest['asset_url_count']}/{manifest['assets_downloaded']}

## Redesign usage

Use normalized JSON/Markdown as the working content source. Keep `legacy-html` and `legacy-assets` as provenance only. All business claims, contact data, prices (if any), dates, festival schedules, inclusions, policies, and destination facts must be verified before launch.
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")
    print(json.dumps(manifest, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(build())
