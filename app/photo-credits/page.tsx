import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import tourImages from "@/content-bank/data/tour_images.json";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Licensing and creator credits for the Eastern Risen journey collection.",
};

export default function PhotoCreditsPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" />
      <main id="main-content" className="inner-page">
        <section className="shell credits-page">
          <div className="credits-intro">
            <p className="eyebrow">Image provenance</p>
            <h1>Photo credits.</h1>
            <p>Every journey has its own cover. Sourced photographs retain their creator and licence details; original generated scenes are identified separately.</p>
          </div>
          <ol className="credits-list">
            <li className="credit-item">
              <strong>Homepage carousel · Jagannath Temple</strong>
              <span>Jagannath Temple on 2022 Snana Jatra · Government of Odisha · CC BY 4.0 · <a href="https://commons.wikimedia.org/wiki/File:Jagannath_Temple_on_2022_Snana_Jatra.jpg" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage carousel · Konark Sun Temple</strong>
              <span>Stone wheel at the Konark Sun Temple · Subhrajyoti07 · CC BY-SA 4.0 · <a href="https://commons.wikimedia.org/wiki/File:Stone_wheel_engraved_in_the_13th_century_built_Konark_Sun_Temple_in_Orissa,_India.jpg" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage carousel · Chilika Lake</strong>
              <span>Chilika · Government of Odisha · CC BY 4.0 · <a href="https://commons.wikimedia.org/wiki/File:Chilika_Bhubaneswar.me.jpg" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage carousel · Odissi dance</strong>
              <span>Odissi Dance Form · Swaprabha Chattopadhyay · CC BY-SA 4.0 · <a href="https://commons.wikimedia.org/wiki/File:Odissi_Dance_Form.jpg" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage carousel · Pattachitra artist</strong>
              <span>Pattachitra artist at work in Odisha · Euphoric Captures · CC BY-SA 4.0 · <a href="https://commons.wikimedia.org/wiki/File:Pattachitra_artist_at_work_in_Odisha,_India.jpg" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage · Local depth</strong>
              <span>Konark Sun Temple wheel · Ankur Panchbudhe · CC BY 2.0 · <a href="https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple_wheel.jpg" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage · Your pace</strong>
              <span>Hikers in Himachal Pradesh · Jay Johnson · Pexels License · <a href="https://www.pexels.com/photo/hikers-exploring-scenic-himalayas-in-india-35601221/" target="_blank" rel="noreferrer">View source</a></span>
            </li>
            <li className="credit-item">
              <strong>Homepage · Personal care</strong>
              <span>Original generated hospitality scene created for Eastern Risen.</span>
            </li>
            {tourImages.map((entry) => (
              <li className="credit-item" key={entry.index}>
                <strong>{entry.tour}</strong>
                {entry.generated ? (
                  <span>Original generated asset created for Eastern Risen.</span>
                ) : (
                  <span>
                    {entry.sourceTitle} · {entry.creator || "Creator not listed"} · {entry.license}{" "}
                    {entry.sourcePage && <a href={entry.sourcePage} target="_blank" rel="noreferrer">View source</a>}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
