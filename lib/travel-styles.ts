export type TravelStyleDefinition = {
  id: string;
  number: string;
  name: string;
  eyebrow: string;
  description: string;
  introduction: string;
  image: string;
  imageAlt: string;
};

export const travelStyleDefinitions: TravelStyleDefinition[] = [
  {
    id: "classic-journeys",
    number: "01",
    name: "Classic Journeys",
    eyebrow: "A thoughtful introduction",
    description: "Celebrated places, quieter encounters and enough time to understand how they connect.",
    introduction: "These routes bring together the places that define a region without reducing them to a checklist. They suit first visits, wide-ranging curiosity and travellers who value a well-paced overview.",
    image: "/images/hero-odisha-dawn-v2.webp",
    imageAlt: "A broad river winding through forested hills at dawn",
  },
  {
    id: "wildlife-nature",
    number: "02",
    name: "Wildlife & Nature",
    eyebrow: "Patient observation",
    description: "Forests, wetlands and wildlife encounters that unfold on nature’s terms.",
    introduction: "Nature-led journeys work best with time, good local knowledge and realistic expectations. Our routes connect distinctive habitats with the wider culture and geography that surround them.",
    image: "/images/assam-rhino.webp",
    imageAlt: "A greater one-horned rhinoceros moving through wet grassland",
  },
  {
    id: "culture-festivals",
    number: "03",
    name: "Culture & Festivals",
    eyebrow: "Context before spectacle",
    description: "Festivals, communities and regional traditions approached with curiosity and respect.",
    introduction: "The most rewarding cultural journeys are grounded in context. We make room for conversation, careful observation and an understanding that communities are hosts—not attractions.",
    image: "/images/sikkim-himalaya.webp",
    imageAlt: "Prayer flags framing a Himalayan cultural landscape in Sikkim",
  },
  {
    id: "textile-craft",
    number: "04",
    name: "Textile & Craft",
    eyebrow: "Made by hand",
    description: "Weaving villages, regional artistry and encounters with the people who sustain them.",
    introduction: "Craft reveals how material, place and memory come together. These journeys create time to see processes closely, meet practitioners respectfully and understand traditions in their home landscapes.",
    image: "/images/odisha-weaving.webp",
    imageAlt: "An Odisha artisan working at a traditional handloom",
  },
  {
    id: "spiritual-journeys",
    number: "05",
    name: "Spiritual Journeys",
    eyebrow: "Sacred geographies",
    description: "Ancient sites, living practice and routes shaped by layered spiritual histories.",
    introduction: "From Buddhist landscapes to pilgrimage routes, these journeys balance historical context with sensitivity to living belief. The pace leaves room for both learning and quiet reflection.",
    image: "/images/bhutan-monastery.webp",
    imageAlt: "A quiet Bhutanese monastery courtyard at first light",
  },
  {
    id: "adventure",
    number: "06",
    name: "Adventure",
    eyebrow: "Active exploration",
    description: "Trekking, mountain roads and active routes for travellers drawn to changing terrain.",
    introduction: "Adventure here is less about speed than immersion. Routes are shaped around ability, comfort and conditions, with practical support considered as carefully as the scenery.",
    image: "/images/ladakh-trekking.webp",
    imageAlt: "Hikers following a high mountain trail across Ladakh",
  },
];
