"use client";

import { useState, useSyncExternalStore, type SetStateAction } from "react";
import { TourCard } from "@/components/TourCard";
import type { Tour } from "@/lib/tours";

type DurationFilter = "1-5" | "6-10" | "11+";
type SortOption = "curated" | "shortest" | "longest" | "az";

const durationOptions: { label: string; value: DurationFilter }[] = [
  { label: "1–5 days", value: "1-5" },
  { label: "6–10 days", value: "6-10" },
  { label: "11+ days", value: "11+" },
];

const subscribeToLocation = () => () => {};
const getLocationSearch = () => window.location.search;
const getServerSearch = () => "";

const sectionDefinitions = [
  {
    id: "odisha",
    eyebrow: "Our home ground",
    title: "Odisha",
    description:
      "Temple towns, forested hills, coastal wetlands and living craft traditions, explored with the perspective that comes from knowing a place closely.",
    regions: ["Odisha"],
    previewCount: 6,
  },
  {
    id: "northeast-india",
    eyebrow: "Eastern Himalaya",
    title: "Northeast India & Sikkim",
    description:
      "Mountain roads, wildlife-rich valleys and distinct cultural landscapes across India’s remarkable northeastern reaches.",
    regions: ["Northeast India"],
    previewCount: 4,
  },
  {
    id: "north-india",
    eyebrow: "Across the north",
    title: "North India",
    description:
      "Layered cities, sacred routes and high-altitude landscapes, brought together through journeys with room to look beyond the familiar.",
    regions: ["North India"],
    previewCount: 4,
  },
  {
    id: "rest-of-india",
    eyebrow: "Further across India",
    title: "South, Central & West India",
    description:
      "A varied collection spanning the southern coast, central forests and the craft-rich landscapes of western India.",
    regions: ["South India", "Central India", "West India"],
    previewCount: 4,
  },
  {
    id: "nepal-bhutan",
    eyebrow: "Himalayan neighbours",
    title: "Nepal & Bhutan",
    description:
      "Thoughtful routes through mountain kingdoms shaped by enduring traditions, Buddhist heritage and expansive Himalayan scenery.",
    regions: ["Nepal", "Bhutan"],
    previewCount: 4,
  },
  {
    id: "beyond-india",
    eyebrow: "Beyond India",
    title: "Sri Lanka, Tibet & Southeast Asia",
    description:
      "Island heritage, trans-Himalayan culture and Southeast Asian cityscapes extend the collection into neighbouring lands.",
    regions: ["Sri Lanka", "Tibet", "Southeast Asia"],
    previewCount: 4,
  },
  {
    id: "special-interest",
    eyebrow: "Follow an interest",
    title: "Special Interest & Across India",
    description:
      "Festival, cultural and multi-region itineraries that cross geographic boundaries and begin with a particular curiosity.",
    regions: ["India"],
    previewCount: 4,
  },
] as const;

function durationMatches(days: number | null, filter: DurationFilter) {
  if (days === null) return false;
  if (filter === "1-5") return days <= 5;
  if (filter === "6-10") return days >= 6 && days <= 10;
  return days >= 11;
}

function toggleValue(current: string[], value: string) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

function sortTours(tours: Tour[], sort: SortOption) {
  return [...tours].sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "shortest")
      return (a.durationDays ?? 999) - (b.durationDays ?? 999);
    if (sort === "longest")
      return (b.durationDays ?? -1) - (a.durationDays ?? -1);
    return 0;
  });
}

export function TourExplorer({
  tours,
  regions,
  styles,
}: {
  tours: Tour[];
  regions: string[];
  styles: string[];
}) {
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerSearch,
  );
  const query = new URLSearchParams(locationSearch);
  const queryRegion = query.get("region");
  const queryStyle = query.get("style");
  const defaultRegions =
    queryRegion && regions.includes(queryRegion) ? [queryRegion] : [];
  const defaultStyles =
    queryStyle && styles.includes(queryStyle) ? [queryStyle] : [];
  const [search, setSearch] = useState("");
  const [regionSelection, setRegionSelection] = useState<string[] | null>(null);
  const [styleSelection, setStyleSelection] = useState<string[] | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("curated");
  const [visibleCount, setVisibleCount] = useState(12);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const selectedRegions = regionSelection ?? defaultRegions;
  const selectedStyles = styleSelection ?? defaultStyles;

  function setSelectedRegions(action: SetStateAction<string[]>) {
    setRegionSelection((current) =>
      typeof action === "function" ? action(current ?? defaultRegions) : action,
    );
  }

  function setSelectedStyles(action: SetStateAction<string[]>) {
    setStyleSelection((current) =>
      typeof action === "function" ? action(current ?? defaultStyles) : action,
    );
  }

  const filteredTours = (() => {
    const query = search.trim().toLowerCase();
    const result = tours.filter((tour) => {
      const matchesSearch =
        !query ||
        `${tour.title} ${tour.route} ${tour.region} ${tour.travelStyle}`
          .toLowerCase()
          .includes(query);
      const matchesRegion =
        selectedRegions.length === 0 || selectedRegions.includes(tour.region);
      const matchesStyle =
        selectedStyles.length === 0 ||
        selectedStyles.includes(tour.travelStyle);
      const matchesDuration =
        selectedDurations.length === 0 ||
        selectedDurations.some((value) =>
          durationMatches(tour.durationDays, value as DurationFilter),
        );
      return matchesSearch && matchesRegion && matchesStyle && matchesDuration;
    });

    return sortTours(result, sort);
  })();

  const browseSections = sectionDefinitions
    .map((section) => ({
      ...section,
      tours: sortTours(
        tours.filter((tour) =>
          (section.regions as readonly string[]).includes(tour.region),
        ),
        sort,
      ),
    }))
    .filter((section) => section.tours.length > 0);

  const activeFilters = [
    ...selectedRegions,
    ...selectedStyles,
    ...selectedDurations,
  ];
  const isResultMode = search.trim().length > 0 || activeFilters.length > 0;

  function clearFilters() {
    setSearch("");
    setSelectedRegions([]);
    setSelectedStyles([]);
    setSelectedDurations([]);
    setVisibleCount(12);
  }

  function removeFilter(value: string) {
    setSelectedRegions((current) => current.filter((item) => item !== value));
    setSelectedStyles((current) => current.filter((item) => item !== value));
    setSelectedDurations((current) => current.filter((item) => item !== value));
  }

  function toggleSection(sectionId: string) {
    setExpandedSections((current) => toggleValue(current, sectionId));
  }

  return (
    <section
      className="tour-explorer shell"
      aria-labelledby="tour-results-title"
    >
      <div className="tour-toolbar">
        <label className="tour-search">
          <span className="sr-only">Search journeys</span>
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setVisibleCount(12);
            }}
            placeholder="Search by place, route or journey"
            type="search"
          />
        </label>
        <label className="tour-sort">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            <option value="curated">Curated order</option>
            <option value="shortest">Shortest first</option>
            <option value="longest">Longest first</option>
            <option value="az">A–Z</option>
          </select>
        </label>
      </div>

      <details className="tour-filters">
        <summary>
          <span>Filter & refine</span>
          <span>
            {activeFilters.length > 0
              ? `${activeFilters.length} selected`
              : "Destination · Style · Duration"}
          </span>
        </summary>
        <div className="tour-filters__content">
          <div className="filter-heading">
            <span>Refine your search</span>
            {activeFilters.length > 0 || search ? (
              <button type="button" onClick={clearFilters}>
                Reset all
              </button>
            ) : null}
          </div>
          <div className="tour-filter-groups">
            <fieldset>
              <legend>Destination</legend>
              <div className="filter-options">
                {regions.map((region) => (
                  <label key={region}>
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={() => {
                        setSelectedRegions((current) =>
                          toggleValue(current, region),
                        );
                        setVisibleCount(12);
                      }}
                    />
                    <span>{region}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Travel style</legend>
              <div className="filter-options">
                {styles.map((style) => (
                  <label key={style}>
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(style)}
                      onChange={() => {
                        setSelectedStyles((current) =>
                          toggleValue(current, style),
                        );
                        setVisibleCount(12);
                      }}
                    />
                    <span>{style}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Duration</legend>
              <div className="filter-options">
                {durationOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="checkbox"
                      checked={selectedDurations.includes(option.value)}
                      onChange={() => {
                        setSelectedDurations((current) =>
                          toggleValue(current, option.value),
                        );
                        setVisibleCount(12);
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <p className="filter-note">
            Season and activity filters will be added as the legacy itineraries
            complete editorial review.
          </p>
        </div>
      </details>

      {!isResultMode ? (
        <>
          <nav
            className="tour-section-nav px-1"
            aria-label="Journey destinations"
          >
            {browseSections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                <span>{section.title}</span>
                <strong>{section.tours.length}</strong>
              </a>
            ))}
          </nav>
          <div className="tour-groups">
            {browseSections.map((section, index) => {
              const expanded = expandedSections.includes(section.id);
              const visibleTours = expanded
                ? section.tours
                : section.tours.slice(0, section.previewCount);
              return (
                <section
                  className="tour-group"
                  id={section.id}
                  key={section.id}
                  aria-labelledby={
                    index === 0 ? "tour-results-title" : `${section.id}-title`
                  }
                >
                  <div className="tour-group__heading">
                    <div>
                      <p className="eyebrow">{section.eyebrow}</p>
                      <h2
                        id={
                          index === 0
                            ? "tour-results-title"
                            : `${section.id}-title`
                        }
                      >
                        {section.title}
                      </h2>
                      <p className="tour-group__count">
                        {section.tours.length} journeys
                      </p>
                    </div>
                    <p>{section.description}</p>
                  </div>
                  <div className="tour-collection-grid">
                    {visibleTours.map((tour) => (
                      <TourCard tour={tour} key={tour.slug} />
                    ))}
                  </div>
                  {section.tours.length > section.previewCount ? (
                    <button
                      className="button button--outline tour-group__action"
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={expanded}
                    >
                      {expanded
                        ? "Show fewer"
                        : `View all ${section.tours.length} journeys`}
                    </button>
                  ) : null}
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <div className="tour-results">
          <div className="tour-results__heading">
            <div>
              <p className="eyebrow">Search results</p>
              <h2 id="tour-results-title">{filteredTours.length} journeys</h2>
            </div>
            {activeFilters.length > 0 ? (
              <div className="active-filters" aria-label="Active filters">
                {activeFilters.map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => removeFilter(filter)}
                  >
                    {durationOptions.find((option) => option.value === filter)
                      ?.label ?? filter}{" "}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {filteredTours.length > 0 ? (
            <>
              <div className="tour-collection-grid">
                {filteredTours.slice(0, visibleCount).map((tour) => (
                  <TourCard tour={tour} key={tour.slug} />
                ))}
              </div>
              {visibleCount < filteredTours.length ? (
                <button
                  className="button button--outline load-more"
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 12)}
                >
                  Show more journeys
                </button>
              ) : null}
            </>
          ) : (
            <div className="tour-empty">
              <p className="eyebrow">No exact matches</p>
              <h3>Let’s widen the map.</h3>
              <p>
                Try removing a filter or search for a broader destination. We
                can also design a private journey beyond the listed routes.
              </p>
              <button className="button" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
