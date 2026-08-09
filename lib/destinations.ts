export type DestinationDefinition = {
  id: string;
  region: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const odishaDestination: DestinationDefinition = {
  id: "odisha",
  region: "Odisha",
  name: "Odisha",
  eyebrow: "Our home ground",
  description: "Temple cities, Buddhist hills, forest communities, craft villages and the vast wetlands of Chilika—known through years of travelling close to home.",
  image: "/images/odisha-temple.webp",
  imageAlt: "Carved Odisha temple architecture in warm evening light",
};

export const indiaDestinations: DestinationDefinition[] = [
  {
    id: "northeast-india",
    region: "Northeast India",
    name: "Northeast India & Sikkim",
    eyebrow: "Eastern Himalaya",
    description: "Mountain monasteries, wildlife-rich valleys and culturally distinct landscapes connected by memorable roads.",
    image: "/images/sikkim-himalaya.webp",
    imageAlt: "Prayer flags framing a layered Himalayan valley in Sikkim",
  },
  {
    id: "north-india",
    region: "North India",
    name: "North India",
    eyebrow: "Cities to high country",
    description: "Layered historic cities, sacred routes and the dramatic landscapes of the Himalaya and Ladakh.",
    image: "/images/ladakh-trekking.webp",
    imageAlt: "Hikers crossing the high mountain landscape of Ladakh",
  },
  {
    id: "south-india",
    region: "South India",
    name: "South India",
    eyebrow: "Coasts and living heritage",
    description: "Temple traditions, tropical landscapes and coastal cultures across India’s southern reaches.",
    image: "/images/kerala-backwaters.webp",
    imageAlt: "A traditional houseboat moving through the Kerala backwaters at dawn",
  },
  {
    id: "central-india",
    region: "Central India",
    name: "Central India",
    eyebrow: "Forests at the heart",
    description: "Wildlife landscapes, old settlements and journeys shaped by the forests of India’s interior.",
    image: "/images/assam-rhino.webp",
    imageAlt: "A greater one-horned rhinoceros crossing wet grassland",
  },
  {
    id: "west-india",
    region: "West India",
    name: "West India",
    eyebrow: "Craft and colour",
    description: "Distinctive regional craft, desert-edge landscapes and routes through Gujarat and western India.",
    image: "/images/gujarat-kutch.webp",
    imageAlt: "Traditional textiles beside the pale landscape of Kutch in Gujarat",
  },
  {
    id: "across-india",
    region: "India",
    name: "Across India",
    eyebrow: "Journeys without borders",
    description: "Multi-region and special-interest routes that follow an idea rather than a single point on the map.",
    image: "/images/hero-odisha-dawn-v2.webp",
    imageAlt: "A broad river winding through the forested hills of eastern India",
  },
];

export const neighbouringDestinations: DestinationDefinition[] = [
  {
    id: "nepal",
    region: "Nepal",
    name: "Nepal",
    eyebrow: "Valley and mountain",
    description: "Kathmandu’s cultural depth, Himalayan pilgrimage routes and journeys extending through Nepal’s varied landscapes.",
    image: "/images/nepal-kathmandu.webp",
    imageAlt: "Historic temple roofs across the Kathmandu Valley in morning light",
  },
  {
    id: "bhutan",
    region: "Bhutan",
    name: "Bhutan",
    eyebrow: "The Himalayan kingdom",
    description: "Monasteries, mountain valleys and living Buddhist traditions approached at a thoughtful pace.",
    image: "/images/bhutan-monastery.webp",
    imageAlt: "A quiet Bhutanese monastery courtyard overlooking the mountains",
  },
  {
    id: "sri-lanka",
    region: "Sri Lanka",
    name: "Sri Lanka",
    eyebrow: "An island of layers",
    description: "Sacred cities, coastal landscapes and a cultural history that rewards a journey with time and context.",
    image: "/images/sri-lanka-galle.webp",
    imageAlt: "The historic walls and tropical coast of Galle at dawn",
  },
  {
    id: "tibet",
    region: "Tibet",
    name: "Tibet",
    eyebrow: "Across the plateau",
    description: "High-altitude landscapes and deeply rooted Buddhist heritage on a route that calls for careful planning.",
    image: "/images/ladakh-trekking.webp",
    imageAlt: "A broad high-altitude Himalayan landscape",
  },
  {
    id: "southeast-asia",
    region: "Southeast Asia",
    name: "Southeast Asia",
    eyebrow: "Cities and tropical horizons",
    description: "Journeys through Thailand, Malaysia and Singapore, balancing city energy with time to explore beyond it.",
    image: "/images/malaysia-penang.webp",
    imageAlt: "A historic Penang street opening toward tropical hills",
  },
];

export const destinationDefinitions = [odishaDestination, ...indiaDestinations, ...neighbouringDestinations];
