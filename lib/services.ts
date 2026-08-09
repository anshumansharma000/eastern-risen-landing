export type ServiceDefinition = {
  id: string;
  number: string;
  name: string;
  shortDescription: string;
  description: string;
  includes: string[];
  image: string;
  imageAlt: string;
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    id: "tour-operations",
    number: "01",
    name: "Inbound & Domestic Tour Operations",
    shortDescription: "Complete journey planning across India, from a first route idea to the practical details on the ground.",
    description: "Eastern Risen’s core service brings together guided private and small-group travel, regional expertise and specialist interests. We can design a complete journey or support selected parts of a wider itinerary.",
    includes: ["Private and small-group itineraries", "Special-interest and regional tours", "Local guiding and on-ground coordination", "Tailor-made route planning"],
    image: "/images/journey-planning.webp",
    imageAlt: "Hands planning a private journey together over a route map",
  },
  {
    id: "ground-transport",
    number: "02",
    name: "Private Ground Transport",
    shortDescription: "Comfortable road travel coordinated around the route, group size and pace of your journey.",
    description: "The legacy service supported individual travellers, groups and corporate guests with chauffeur-driven vehicles across major Indian destinations. Current vehicle type and availability are confirmed for each request.",
    includes: ["Cars for private journeys", "Tempo travellers for small groups", "Mini coaches for larger parties", "Route and transfer coordination"],
    image: "/images/private-ground-transport.webp",
    imageAlt: "A private passenger vehicle following a quiet mountain road",
  },
  {
    id: "air-ticketing",
    number: "03",
    name: "Air Ticketing",
    shortDescription: "Domestic and international flight arrangements considered as part of the complete journey.",
    description: "Flights often determine whether an itinerary feels effortless or rushed. We can help coordinate suitable connections alongside the land route, keeping the journey’s timing and practical requirements in view.",
    includes: ["Domestic flight coordination", "International flight support", "Connections aligned with the itinerary", "Assistance when plans change"],
    image: "/images/air-ticketing-himalaya.webp",
    imageAlt: "A sunrise flight above layered Himalayan foothills",
  },
  {
    id: "travel-documentation",
    number: "04",
    name: "Travel Documentation Guidance",
    shortDescription: "Practical guidance on the documents and permits connected to an Eastern Risen itinerary.",
    description: "Requirements vary by destination, nationality and route. We help identify the documentation relevant to the proposed journey and coordinate itinerary-specific permits where applicable; official approval always remains with the issuing authority.",
    includes: ["Itinerary-specific document guidance", "Permit requirement coordination", "Information for neighbouring-country routes", "Clear next steps before departure"],
    image: "/images/journey-planning.webp",
    imageAlt: "Hands reviewing a route map and travel notes together",
  },
];
