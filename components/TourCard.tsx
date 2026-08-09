import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/lib/tours";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="collection-card">
      <Link className="collection-card__link" href={`/tours/${tour.slug}`} aria-label={`View the ${tour.title} journey`}>
        <div className="collection-card__image">
          <Image src={tour.image} alt={tour.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, (max-width: 1100px) 48vw, 31vw" />
          <span>{tour.travelStyle}</span>
        </div>
        <div className="collection-card__body">
          <div className="collection-card__meta"><span>{tour.region}</span><span>{tour.duration}</span></div>
          <h3>{tour.title}</h3>
          <p>{tour.summary}</p>
          {tour.route ? <p className="collection-card__route"><strong>Route</strong>{tour.route}</p> : null}
          <div className="collection-card__footer">
            <span>{tour.status}</span>
            <span className="text-link">View journey <span aria-hidden="true">↗</span></span>
          </div>
        </div>
      </Link>
    </article>
  );
}
