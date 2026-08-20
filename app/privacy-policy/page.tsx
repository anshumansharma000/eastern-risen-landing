import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Eastern Risen collects, uses, shares and protects personal information when planning and operating journeys.",
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Who we are and what this covers",
    content: <>
      <p>Eastern Risen Expedition Pvt. Ltd., also called “Eastern Risen”, “we”, “us” or “our” in this policy, designs and coordinates travel across India and neighbouring destinations. This policy explains how we handle personal information when you visit easternrisen.com, contact us, request an itinerary, make a booking or travel with us.</p>
      <p>If another person arranges a journey for you, they may provide information to us on your behalf. Please share this policy with everyone included in an enquiry or booking.</p>
    </>,
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: <>
      <p>We may collect your name, contact details, country of residence, travel dates, budget, interests, accommodation preferences and the names and ages of people travelling with you. When needed to arrange a confirmed journey, we may also collect passport details, visa information, emergency contacts and loyalty programme details.</p>
      <p>You may choose to tell us about dietary needs, accessibility requirements, allergies or health information relevant to your safety and comfort. We ask only for information reasonably needed to plan or operate the journey.</p>
      <p>We keep records of enquiries, proposals, bookings, payments and correspondence. Payment providers and banks process payment details. We generally receive confirmation and transaction information rather than complete card or bank credentials.</p>
      <p>When you use our website, technical information such as your device type, browser, approximate location derived from an IP address, pages viewed and referring website may be recorded by our hosting or security providers.</p>
    </>,
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    content: <>
      <p>We use personal information to respond to enquiries, design itineraries, check availability, make reservations, arrange permits and transport, provide support during travel, process payments and communicate important changes.</p>
      <p>We may also use information to keep financial and operational records, prevent fraud, maintain website security, improve our services, resolve concerns and comply with legal or regulatory duties.</p>
      <p>Where you have asked to receive travel ideas or updates, we may send them using the contact details you provided. You can ask us to stop at any time. We do not sell personal information or use it for unrelated advertising by third parties.</p>
    </>,
  },
  {
    id: "sharing",
    title: "When information is shared",
    content: <>
      <p>Travel cannot be arranged without sharing some information. Depending on your itinerary, we may provide necessary details to hotels, airlines, transport operators, guides, destination partners, permit offices, parks, insurance or assistance providers and government authorities.</p>
      <p>We may also use trusted providers for website hosting, email, document storage, payment processing, accounting and professional advice. They receive only the information needed for their role and are expected to protect it.</p>
      <p>We may disclose information when required by law, to respond to a lawful request, to protect the safety and rights of travellers or others, or in connection with a reorganisation of our business. We do not share sensitive travel or health information more widely than reasonably necessary.</p>
    </>,
  },
  {
    id: "international-travel",
    title: "International travel and transfers",
    content: <>
      <p>If your journey includes another country, information may need to be sent to suppliers or authorities there. Privacy standards can differ from those in India or your home country. We limit these transfers to what is needed to arrange and support your travel and use reasonable safeguards where available.</p>
      <p>Email, cloud storage and other service providers may also process information in more than one country. By asking us to arrange international travel, you understand that necessary booking information will follow the itinerary.</p>
    </>,
  },
  {
    id: "retention",
    title: "How long we keep information",
    content: <>
      <p>We keep personal information only for as long as it is reasonably needed for the purposes described here. Enquiry records may be retained so we can continue a planning conversation. Booking and transaction records may be kept longer to meet tax, accounting, legal, insurance and dispute-resolution requirements.</p>
      <p>Passport copies, health details and similar sensitive records are reviewed more carefully and removed or securely archived when they are no longer needed for travel operations or a legal obligation. Retention periods can vary according to the record and the destination.</p>
    </>,
  },
  {
    id: "security",
    title: "How we protect information",
    content: <>
      <p>We use reasonable administrative, technical and physical measures intended to prevent unauthorised access, loss, alteration or disclosure. These include limiting access to people who need the information, using reputable service providers and applying appropriate account and device safeguards.</p>
      <p>No method of online transmission or storage is completely secure. Please avoid sending unnecessary identity or payment documents through open channels. We may suggest a more suitable method when sensitive information is required.</p>
      <p>If a personal data incident creates a material risk, we will investigate, take practical steps to contain it and make notifications required by applicable law.</p>
    </>,
  },
  {
    id: "choices-and-rights",
    title: "Your choices and rights",
    content: <>
      <p>You may ask whether we hold personal information about you and request access, correction, updating or deletion where applicable. You may also withdraw a consent you previously gave or ask us to stop promotional messages.</p>
      <p>Some requests may be limited where information must be kept to complete your booking, protect another person’s rights, establish or respond to a legal claim, or meet a legal duty. We may need to verify your identity before acting on a request.</p>
      <p>To make a request or raise a concern, email <a href="mailto:info@easternrisen.com">info@easternrisen.com</a>. Please describe what you need and provide enough information for us to locate the relevant record. If you believe a concern has not been resolved, you may have the right to approach the competent data protection or consumer authority.</p>
    </>,
  },
  {
    id: "cookies-and-links",
    title: "Cookies, analytics and outside links",
    content: <>
      <p>Our website and hosting providers may use essential cookies or similar technologies to deliver pages, remember basic choices, protect the site and understand general traffic. If we introduce non-essential analytics or advertising cookies, we will provide any notice or choice required by applicable law.</p>
      <p>We use GoatCounter to understand general website traffic and display an aggregate visit count. GoatCounter does not use cookies or store IP addresses, full browser user-agent headers or persistent tracking identifiers.</p>
      <p>You can control cookies through your browser. Blocking some essential technologies may affect how the website works.</p>
      <p>Our website may link to airlines, hotels, tourism authorities, social platforms and other outside services. Their privacy practices are their own, and we encourage you to read the notices that apply when you use them.</p>
    </>,
  },
  {
    id: "children-and-updates",
    title: "Children and policy updates",
    content: <>
      <p>Our services may include family travel, but enquiries and bookings must be made by an adult. We collect information about a child only when supplied by a parent, guardian or authorised organiser and when reasonably needed for the journey. Please do not send more information about a child than we request.</p>
      <p>We may update this policy as our services, providers or legal obligations change. The latest version will appear on this page with a revised date. If a change materially affects how we use information already provided, we will take reasonable steps to explain it.</p>
    </>,
  },
  {
    id: "contact",
    title: "Contact us",
    content: <>
      <p>For privacy questions or requests, contact Eastern Risen Expedition Pvt. Ltd. at <a href="mailto:info@easternrisen.com">info@easternrisen.com</a>.</p>
      <p>Our head office is at Plot No. 2382/9794, First Floor, Elegance Villa, Lane 03, Near Puri Bypass, NH 316, Badagada Brit Colony, Bhubaneswar 751018, Odisha, India.</p>
    </>,
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Your information" title="Privacy policy" introduction="Travel planning is personal. This policy explains what we collect, why we need it and how we handle it with care." updated="12 August 2026" sections={sections} />;
}
