import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use Eastern Risen’s website and arrange travel services with us.",
  alternates: { canonical: "/terms-of-service/" },
};

const sections: LegalSection[] = [
  {
    id: "about-these-terms",
    title: "About these terms",
    content: <>
      <p>These terms govern your use of easternrisen.co.in and the travel planning and related services offered by Eastern Risen Expedition Pvt. Ltd., referred to here as “Eastern Risen”, “we”, “us” or “our”. By using this website, making an enquiry or confirming services with us, you agree to the parts of these terms that apply to you.</p>
      <p>Our website is intended for people who are at least 18 years old and able to enter into a binding agreement. If you make arrangements for other travellers, you confirm that you have their authority to share the information required for the journey and to accept applicable terms on their behalf.</p>
      <p>Your written itinerary, proposal, invoice or booking confirmation may contain trip-specific conditions. If a trip-specific condition conflicts with this page, the trip-specific condition will apply to that booking.</p>
    </>,
  },
  {
    id: "planning-and-booking",
    title: "Planning and booking",
    content: <>
      <p>An enquiry, sample itinerary or conversation with our team does not create a confirmed booking. Services are confirmed only after we accept your booking in writing and receive any deposit or information stated in your proposal or invoice.</p>
      <p>Prices and availability can change until a booking is confirmed. Quotations are based on the information available at the time and may be affected by exchange rates, taxes, permit charges, fuel costs, supplier tariffs and changes requested by you. We will explain any material change before asking you to confirm it.</p>
      <p>You are responsible for reviewing names, dates, destinations, inclusions, exclusions and other details in your documents. Please tell us promptly if anything is incorrect. Names used for tickets and permits must match the relevant travel document.</p>
    </>,
  },
  {
    id: "payments",
    title: "Prices and payments",
    content: <>
      <p>Your proposal or invoice will state the price, currency, payment schedule and accepted payment method. A booking may be released if a required payment is not received by its due date. Bank charges, card charges or currency conversion costs applied by your financial provider are your responsibility unless we expressly agree otherwise.</p>
      <p>Some services require immediate or non-refundable payment, including certain airfares, permits, festival arrangements and high-season accommodation. We will identify these conditions when they are known to us.</p>
      <p>Unless your confirmation says otherwise, personal expenses, gratuities, travel insurance, visa fees, vaccinations, meals and services not listed as included remain your responsibility.</p>
    </>,
  },
  {
    id: "changes-and-cancellations",
    title: "Changes and cancellations",
    content: <>
      <p>If you ask to change or cancel a confirmed booking, tell us in writing as soon as possible. Charges will depend on the timing of the request, work already completed and the terms of airlines, hotels, transport providers, guides and other suppliers. Your booking confirmation will set out the cancellation terms applicable to your journey.</p>
      <p>We will try to accommodate requested changes, but cannot guarantee that the same price or arrangements will remain available. Additional costs resulting from a change requested by you are payable by you.</p>
      <p>We may need to alter an itinerary before or during travel because of weather, road conditions, safety concerns, government action, permit restrictions, supplier changes or other circumstances outside reasonable control. Where possible, we will offer a suitable alternative of a comparable standard. If we cancel a service and no reasonable alternative is accepted, any refund will be limited to amounts recoverable for the unused affected service, subject to applicable law and supplier terms.</p>
    </>,
  },
  {
    id: "suppliers",
    title: "Independent travel suppliers",
    content: <>
      <p>Many parts of a journey are provided by independent businesses, such as airlines, hotels, vehicle operators, guides, cruise or boat operators, parks and permit authorities. We select and coordinate suppliers with care, but they are responsible for the services they operate and may apply their own conditions.</p>
      <p>Schedules, routes, facilities and operating standards can differ by destination and may change. Photographs and descriptions are provided in good faith to convey the character of an experience, not to guarantee that every detail will be identical on the day you travel.</p>
      <p>Where we act only as an intermediary for a clearly identified third-party service, your contract for that service may also be with the supplier. Nothing in these terms removes rights you have under applicable consumer law.</p>
    </>,
  },
  {
    id: "traveller-responsibilities",
    title: "Your responsibilities",
    content: <>
      <p>You are responsible for obtaining and carrying valid passports, visas, permits, insurance certificates and any health documentation required for your journey. Entry rules can change, and the final decision on admission rests with the relevant authority. Guidance from us is general assistance and should be checked with official sources.</p>
      <p>Please tell us before booking about mobility needs, medical conditions, allergies, dietary requirements or other circumstances that may affect the safe operation or suitability of a trip. We will handle health information with care and share it only when reasonably necessary to arrange your services.</p>
      <p>You must follow applicable laws, local customs, safety instructions and the reasonable directions of guides and suppliers. We may end a traveller’s participation when their conduct creates a serious risk, disrupts the journey or harms people, wildlife, property or local communities. Costs arising from that conduct will remain the traveller’s responsibility.</p>
    </>,
  },
  {
    id: "insurance-and-risk",
    title: "Insurance and travel risk",
    content: <>
      <p>We strongly recommend comprehensive travel insurance from the date you confirm your booking. It should be appropriate for your destination and activities and should normally cover medical treatment, evacuation, trip cancellation, interruption, baggage and personal liability.</p>
      <p>Travel can involve unfamiliar conditions, remote locations, altitude, wildlife, uneven terrain and changing weather. You are responsible for considering your fitness and personal risk tolerance. We will share relevant information known to us, but no journey can be made free from all risk.</p>
      <p>Government travel advisories, health authorities and your insurer are important independent sources of current advice. You remain responsible for deciding whether to begin or continue travel.</p>
    </>,
  },
  {
    id: "website-use",
    title: "Using this website",
    content: <>
      <p>The text, design, brand elements, photographs and other material on this website belong to Eastern Risen or are used with permission. You may view and save reasonable portions for personal trip planning. You may not republish, sell, scrape at scale, alter or commercially exploit the website without written permission.</p>
      <p>Do not use the website in a way that is unlawful, deceptive, harmful, disruptive or likely to compromise its security. Links to third-party websites are provided for convenience and do not mean that we control or endorse their content.</p>
      <p>We try to keep information accurate and useful, but destination details, opening arrangements, seasons and travel requirements change. Website content is general information and is not a binding offer or a substitute for current official advice.</p>
    </>,
  },
  {
    id: "liability",
    title: "Responsibility and liability",
    content: <>
      <p>We will provide our services with reasonable care and skill. To the extent permitted by law, we are not responsible for loss caused by your actions, inaccurate information supplied by you, the independent acts of a supplier, or events that could not reasonably have been prevented or avoided.</p>
      <p>Events outside reasonable control may include severe weather, natural disaster, epidemic, civil disturbance, industrial action, government restriction, border closure, transport disruption and failure of public infrastructure. In such circumstances, we will provide reasonable assistance, but additional accommodation, transport or other recovery costs may be payable by you or claimed through your insurer.</p>
      <p>We do not exclude liability that cannot lawfully be excluded, including applicable consumer rights. Subject to those rights, any liability connected with a booking will be assessed in light of the service affected, amounts paid for it and the terms disclosed in your booking confirmation.</p>
    </>,
  },
  {
    id: "concerns-and-law",
    title: "Concerns, governing law and contact",
    content: <>
      <p>If something is not right during your journey, please tell your guide, supplier or our team promptly so there is a fair opportunity to help. If the issue is not resolved, write to us with the relevant details and supporting documents within a reasonable time after your journey.</p>
      <p>These terms are governed by the laws of India. Subject to any rights you have to approach a consumer commission or other competent authority, disputes will be subject to the jurisdiction of the courts in Bhubaneswar, Odisha.</p>
      <p>Eastern Risen Expedition Pvt. Ltd. is based at Plot No. 2382/9794, First Floor, Elegance Villa, Lane 03, Near Puri Bypass, NH 316, Badagada Brit Colony, Bhubaneswar 751018, Odisha, India. You can contact us at <a href="mailto:info@easternrisen.com">info@easternrisen.com</a>.</p>
    </>,
  },
];

export default function TermsOfServicePage() {
  return <LegalPage eyebrow="The practical details" title="Terms of service" introduction="Clear expectations make for better journeys. These terms explain how our website, planning process and travel arrangements work." updated="12 August 2026" sections={sections} />;
}
