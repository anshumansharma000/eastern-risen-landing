export type JournalEntry = {
  slug: string;
  label: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  season: string;
};

export const journalEntries: JournalEntry[] = [
  {
    slug: "odisha-coast",
    label: "Field guide",
    title: "When Odisha’s coast feels most alive",
    excerpt: "A seasonal perspective on Chilika’s lagoons, temple towns and the changing light along the Bay of Bengal.",
    image: "/images/hero-odisha-dawn-v2.webp",
    imageAlt: "A river winding through the forested landscape of Odisha at dawn",
    readTime: "6 min read",
    season: "October to March",
  },
  {
    slug: "travelling-slowly",
    label: "On the road",
    title: "The pleasure of travelling slowly",
    excerpt: "Why the memorable moments often happen between landmarks, and how a carefully paced route makes space for them.",
    image: "/images/journey-planning.webp",
    imageAlt: "Hands tracing a considered route across a map",
    readTime: "5 min read",
    season: "Travel philosophy",
  },
  {
    slug: "thoughtful-guest",
    label: "Travel well",
    title: "How to be a thoughtful guest",
    excerpt: "Simple principles for entering communities, sacred spaces and wildlife habitats with curiosity and respect.",
    image: "/images/odisha-weaving.webp",
    imageAlt: "An artisan working with Odisha's living textile traditions",
    readTime: "7 min read",
    season: "Good practice",
  },
  {
    slug: "forest-rhythms",
    label: "Wild places",
    title: "Learning the rhythms of the forest",
    excerpt: "Wildlife travel becomes richer when the checklist recedes and attention shifts to tracks, calls, weather and time.",
    image: "/images/assam-rhino.webp",
    imageAlt: "A one-horned rhinoceros in the grasslands of Assam",
    readTime: "6 min read",
    season: "November to April",
  },
  {
    slug: "himalayan-roads",
    label: "From the route",
    title: "What Himalayan roads teach you about distance",
    excerpt: "In Sikkim and Bhutan, a short line on the map can hold a full day of valleys, monasteries and changing weather.",
    image: "/images/sikkim-himalaya.webp",
    imageAlt: "A mountain road beneath the high Himalayan landscape of Sikkim",
    readTime: "5 min read",
    season: "March to May",
  },
  {
    slug: "living-craft",
    label: "People & place",
    title: "Craft is not a souvenir",
    excerpt: "A closer look at weaving as livelihood, memory and identity, and why meeting makers changes what we take home.",
    image: "/images/odisha-weaving.webp",
    imageAlt: "Textile weaving in Odisha",
    readTime: "8 min read",
    season: "Living traditions",
  },
];
