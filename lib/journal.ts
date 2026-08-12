export type JournalSection = {
  heading?: string;
  paragraphs: string[];
  pullQuote?: string;
};

export type JournalEntry = {
  slug: string;
  label: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  season: string;
  published: string;
  introduction: string;
  sections: JournalSection[];
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
    published: "12 February 2026",
    introduction: "The Odisha coast is never truly still. Fishing boats cross pale water before sunrise, temple streets gather their daily rhythm, and the great lagoon at Chilika changes character with the wind. Yet there is a particular stretch of the year when the coast seems to open itself most generously to a traveller.",
    sections: [
      {
        heading: "The clear months",
        paragraphs: [
          "From October, the heavy monsoon air begins to lift. The mornings grow clearer and the road between Bhubaneswar, Puri and Chilika feels newly washed. By November, the days are warm without being tiring and evenings invite an unhurried walk. This is the season we most often recommend for a first journey along the coast.",
          "Winter here does not mean cold in the northern sense. It means gentler sun, fresh produce in the markets and light that stays soft for longer. At Konark, the stone of the Sun Temple carries a honeyed colour in the late afternoon. In Puri, the beach is busy at dawn, then broad and breezy once the early walkers have gone home.",
        ],
      },
      {
        heading: "Chilika in motion",
        paragraphs: [
          "Chilika is often described as a lake, but that simple word cannot hold its scale or its moods. It is a brackish lagoon connected to the Bay of Bengal, dotted with islands and edged by fishing villages, reed beds and open sky. Its water can look silver, blue or almost white depending on the hour.",
          "Migratory birds begin arriving as the weather cools. At Mangalajodi, local boatmen guide small wooden boats through shallow channels where stilts, jacanas, herons and ducks feed at close range. The best outings begin quietly. Engines are avoided, voices fall naturally, and the boat moves at the pace of a pushed bamboo pole.",
          "Farther south, Satapada offers a different face of the lagoon, closer to the sea mouth and the habitat of Irrawaddy dolphins. A sighting is never something to promise. What can be promised is time on the water, attention to the horizon and an understanding that the search is part of the experience.",
        ],
        pullQuote: "On Chilika, the reward is not only what appears. It is the quality of attention the water asks from you.",
      },
      {
        heading: "Temple towns and ordinary mornings",
        paragraphs: [
          "The coast is not one long scenic drive. Its meaning lies in the places where people live and worship. Puri wakes early. Tea stalls begin serving before sunrise, flower sellers arrange marigolds, and pilgrims move towards the Jagannath Temple. Access to the main temple is restricted to practising Hindus, but the surrounding streets, smaller shrines, kitchens and craft traditions offer their own deep context.",
          "Raghurajpur, inland from Puri, is known for pattachitra painting and palm-leaf engraving. It is worth visiting slowly and with realistic expectations. This is a living village, not a showroom. Conversation matters more than collecting photographs, and buying directly from an artist is most meaningful when you also take time to understand the work.",
        ],
      },
      {
        heading: "Choosing your moment",
        paragraphs: [
          "December and January bring the coolest weather and the greatest number of visitors. February is often beautifully balanced, with bright days and fewer holiday crowds. March grows warmer, though early mornings remain rewarding. The monsoon, from roughly June to September, has its own drama, but rain and rough seas can reshape plans quickly.",
          "A good coastal journey usually needs at least five or six days. That allows the route to breathe: a dawn on the lagoon, an afternoon with craftspeople, time for temple architecture, and one unscheduled hour when the sea breeze changes the plan. Odisha’s coast feels most alive when the landscape and the people setting its daily rhythm are given equal attention.",
        ],
      },
    ],
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
    published: "28 January 2026",
    introduction: "Most itineraries begin as a list of places. The list is useful, but it can also become a trap. Once every day is measured by how many sights it contains, a journey starts to feel like a task. Travelling slowly is not about doing very little. It is about leaving enough room to notice where you are.",
    sections: [
      {
        heading: "Distance is not the same as time",
        paragraphs: [
          "A route may look modest on a map and still hold a full day. Roads bend around hills, pause at railway crossings and pass through markets that become crowded without warning. In the Himalaya, fifty kilometres can mean several hours. In rural Odisha, a village stop intended for twenty minutes can become a long conversation over tea.",
          "We plan with this in mind. Travel time is not dead time between attractions. It is part of the country revealing itself. From the window you see the land change, notice what grows in the fields and understand how one settlement relates to the next.",
        ],
      },
      {
        heading: "The unscheduled hour",
        paragraphs: [
          "Some of the strongest travel memories arrive without an appointment. A roadside fruit seller cuts open a pomelo. A monastery courtyard fills with the sound of young monks finishing lessons. Rain delays a walk, so the afternoon is spent talking with the owner of a small guesthouse.",
          "These moments need space. An itinerary packed to the edge cannot accept them. A well-paced journey has a little give in it, enough to stay when something becomes interesting and enough to rest before tiredness turns curiosity into obligation.",
        ],
        pullQuote: "A slower route does not contain less. It often allows a place to become more specific, more surprising and more memorable.",
      },
      {
        heading: "Fewer bases, deeper days",
        paragraphs: [
          "Changing hotels every night can create the impression of progress, but it comes with a cost. Bags are always half packed, mornings are ruled by check-out times and each place is encountered only at its most obvious hour.",
          "Two or three nights in one base changes the feeling completely. You learn the road back. A cafe owner recognises you. There is time to visit the market in the morning and return to the same neighbourhood after dusk. Familiarity, even brief familiarity, makes a destination feel less like a backdrop.",
        ],
      },
      {
        heading: "Slow does not mean passive",
        paragraphs: [
          "Travelling slowly can include long walks, wildlife drives, cooking sessions, temple visits and ambitious days. The difference is rhythm. Activity is followed by recovery. A demanding morning does not automatically lead to an equally demanding evening.",
          "The right pace is personal. Some travellers want hours to sketch or photograph. Others want to keep moving, but without rushing. Families need flexibility that a fixed group schedule rarely provides. The most useful question is not, ‘How much can we fit in?’ It is, ‘What do we want to remember clearly?’",
          "When a route is built around that answer, the journey stops being a collection of completed stops. It becomes a sequence of lived days, each with its own shape and a little room for the road to speak back.",
        ],
      },
    ],
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
    published: "9 January 2026",
    introduction: "Travel gives us access to places that are ordinary, private or sacred to someone else. That access is a privilege. Being a thoughtful guest does not require perfect knowledge of every custom. It begins with attention, humility and a willingness to ask before assuming.",
    sections: [
      {
        heading: "Arrive with context",
        paragraphs: [
          "A short conversation before a visit can change its quality. Knowing why a shrine matters, how a village council works or what a craft tradition supports helps you see beyond the surface. A good local guide does more than translate words. They help interpret what is appropriate in that particular place.",
          "Customs vary widely across India and neighbouring countries. Clothing that is fine in a city hotel may feel out of place in a monastery or village. Shoes may need to be removed. Photography may be restricted. When uncertain, follow the people who live there and ask quietly.",
        ],
      },
      {
        heading: "Let consent be clear",
        paragraphs: [
          "A person is not part of the scenery. Ask before taking a portrait, especially of children, religious practitioners and people at work. A nod towards the camera is not always meaningful consent, particularly when language or power differences are involved.",
          "Sometimes the most respectful response is to keep the camera away. Conversation can become more natural when it is not being collected. If someone declines a photograph, accept the answer warmly and move on. No image is worth making a person uncomfortable.",
        ],
        pullQuote: "Curiosity becomes respect when the person in front of us is allowed to set the boundary.",
      },
      {
        heading: "Buy with interest, not pressure",
        paragraphs: [
          "Meeting a maker can bring a textile, painting or carved object to life. Ask about the process and the time involved. If you decide to buy, remember that a very low price may hide the true labour behind the work. Bargaining is normal in some markets, but it need not become a contest.",
          "It is also acceptable not to buy. Honest interest is valuable when it does not create false expectation. Your guide can help clarify whether a visit includes a sales element and how to handle it comfortably.",
        ],
      },
      {
        heading: "In sacred and wild places",
        paragraphs: [
          "Religious sites are active places of faith. Keep voices low, follow rules about dress and restricted areas, and do not interrupt worship for a photograph. Some temples do not permit entry to all visitors. Respecting that boundary is part of understanding the place, even when it is disappointing.",
          "Wildlife habitats ask for a similar restraint. Keep distance, avoid calling to animals and never pressure a driver or naturalist to move closer than rules allow. A quiet sighting from farther away is better than changing an animal’s behaviour for a photograph.",
          "Thoughtful travel is made of small decisions. Carry your waste, use water carefully, listen to local advice and stay open when plans change. We are all imperfect guests. What matters is the habit of noticing our effect and choosing care when there is a choice.",
        ],
      },
    ],
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
    published: "18 December 2025",
    introduction: "At first light, a forest can seem strangely empty. Then the ear begins to adjust. A drongo calls from the edge of the track. Deer lift their heads towards a sound too faint for us to hear. Fresh prints cross the dust. The forest was never empty. We simply had to become quiet enough to read it.",
    sections: [
      {
        heading: "Beyond the checklist",
        paragraphs: [
          "Wildlife journeys often begin with a wish list, and there is nothing wrong with hoping to see a tiger, rhinoceros or elephant. The trouble begins when one animal becomes the only measure of a good day. Nature does not work to an itinerary, and a forest visit becomes narrow when everything else is treated as waiting.",
          "A naturalist may notice an alarm call, a broken branch or the direction of the wind. These are not delays before the main event. They are the event. Learning to follow such signs turns a drive into a story with tension, uncertainty and its own logic.",
        ],
      },
      {
        heading: "Every landscape speaks differently",
        paragraphs: [
          "Kaziranga’s tall grass and wetlands ask you to scan openings and water edges. In the sal forests of central India, sound often travels farther than sight. Around Odisha’s mangroves, the tide changes which channels are passable and where birds gather to feed.",
          "The season matters too. Dry months draw animals towards water, but dust and heat shape the day. Cooler mornings bring activity, while an afternoon can be almost completely still. After rain, tracks disappear and the forest smells newly alive. No two outings repeat themselves.",
        ],
        pullQuote: "The forest rewards patience in small instalments: a footprint, a warning call, a sudden movement in long grass.",
      },
      {
        heading: "The people who read the land",
        paragraphs: [
          "Local guides, drivers and trackers build knowledge over years. They remember where a stream held water last week, recognise an individual animal’s behaviour and understand when silence itself is a clue. Their skill is practical, patient and often understated.",
          "The best wildlife travel makes room for this expertise. Ask questions, but also allow periods of quiet. A guide concentrating on the road and the canopy may not explain every minute. Often they are collecting signs before sharing what they think is happening.",
        ],
      },
      {
        heading: "A sighting is a meeting, not a possession",
        paragraphs: [
          "When a large animal finally appears, excitement can quickly fill a vehicle. This is the moment to stay composed. Keep voices low, follow the naturalist’s directions and let the animal choose the distance. The strongest encounters are those in which wildlife continues behaving naturally.",
          "Some drives end without the animal you most hoped to see. They may still hold a hornbill crossing the track, langurs warming in the sun and a hundred details you could not have predicted. A forest is not a stage that failed to produce its star. It is a living system, and we are fortunate to enter it for a few hours.",
        ],
      },
    ],
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
    published: "2 December 2025",
    introduction: "In the Himalaya, distance is a poor predictor of a day. A town may be only sixty kilometres away, yet the road between can climb through forests, cross streams and fold around an entire valley. The map gives you a line. The mountains decide what that line means.",
    sections: [
      {
        heading: "The road sets the rhythm",
        paragraphs: [
          "Journeys through Sikkim and Bhutan are built around terrain. Roads are often narrow, weather can change quickly and construction is part of mountain life. A landslip or a convoy of trucks may add time without warning. Planning well means treating estimates as guidance, not promises.",
          "This can be frustrating if every day is crowded with fixed appointments. With a more generous plan, the same uncertainty becomes part of the experience. A pause by the roadside reveals terraces dropping into mist. A tea stop offers time to stretch and hear news of the road ahead.",
        ],
      },
      {
        heading: "Altitude changes more than the view",
        paragraphs: [
          "As the road climbs, vegetation shifts. Broad-leaved forest gives way to conifers and rhododendrons. The air cools. Bodies may need time to adjust, even at moderate heights, and a route that rises gradually is usually more comfortable than one that chases altitude too quickly.",
          "Weather also moves vertically. A valley can be warm while a high pass is wrapped in cloud or snow. Layers, water and patience are more useful than a rigid expectation of sunshine. Mountain views are gifts, not scheduled performances.",
        ],
        pullQuote: "The map measures kilometres. The road measures weather, elevation, patience and the number of times you stop to look back.",
      },
      {
        heading: "Monasteries as pauses",
        paragraphs: [
          "Many Himalayan routes are punctuated by monasteries. They are often reached by another climb, on foot or by road, and the arrival naturally slows the day. Prayer flags move in the wind, butter lamps burn in dim halls and daily work continues around visitors.",
          "It helps not to treat each monastery as a box to tick. One careful visit can be more affecting than four hurried ones. Ask about the school of Buddhism, notice the painted stories and leave time to sit in the courtyard without needing to fill the silence.",
        ],
      },
      {
        heading: "Planning for a humane day",
        paragraphs: [
          "A humane mountain itinerary keeps consecutive long drives to a minimum. It chooses comfortable bases, builds in rest and avoids making every early morning compulsory. It also accepts that a route may need to change for safety or weather.",
          "The Himalaya teaches proportion. A short distance can be immense. A delayed arrival can still be a good day. Once the road is allowed to be part of the journey, rather than an obstacle between highlights, the mountains become more legible and travel feels less like a race against them.",
        ],
      },
    ],
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
    published: "14 November 2025",
    introduction: "A textile is easy to admire for its colour. Spend time with the person who made it and another picture emerges: counted threads, prepared dyes, inherited motifs, changing markets and hours of concentrated work. Craft is not a decorative extra to a place. It is one of the ways a community carries knowledge forward.",
    sections: [
      {
        heading: "The work behind the surface",
        paragraphs: [
          "Odisha has many distinct textile traditions. Sambalpuri ikat is widely recognised, but even that name contains regional patterns, techniques and family practices. Before weaving begins, threads are carefully bound and dyed so that the design emerges on the loom. Precision is planned long before the cloth takes shape.",
          "Other traditions include Kotpad textiles coloured with natural dyes, Bomkai patterns and fine work from Nuapatna and Maniabandha. Labels can help us begin, but they should not flatten the differences between villages, workshops and individual makers.",
        ],
      },
      {
        heading: "A meeting, not a demonstration",
        paragraphs: [
          "When travellers visit a weaving home or cooperative, it is tempting to expect a neat performance. Real work is less predictable. A loom may be idle because yarn has not arrived. A weaver may be finishing another task. The most valuable visit often begins with conversation rather than a demonstration arranged for the camera.",
          "Ask how long a piece takes, who designed the pattern and where materials come from. Ask what younger members of the family want to do. These questions reveal craft as a present-day livelihood, shaped by education, migration, demand and the cost of raw materials.",
        ],
        pullQuote: "When we meet the maker, an object stops being anonymous. We begin to see the decisions held inside it.",
      },
      {
        heading: "The complicated question of price",
        paragraphs: [
          "Handmade work competes with machine production and imitation. To an unfamiliar eye, two pieces can look similar while requiring vastly different time and skill. Very low prices may be attractive, but they can also make it harder for labour-intensive traditions to remain viable.",
          "Buying directly from a maker, recognised cooperative or trusted source can create a clearer connection between payment and work. It is reasonable to ask about materials and provenance. Bargaining may be expected in some settings, though it is worth considering what a small saving means in relation to days or weeks of labour.",
        ],
      },
      {
        heading: "What we really take home",
        paragraphs: [
          "Not every meaningful craft encounter needs to end in a purchase. Listening with attention, sharing photographs only with permission and telling others accurately about the tradition also matter. If you do buy, choose something you will use, care for and remember in context.",
          "The object then carries more than a pattern. It recalls the sound of the loom, the light in the room and the person who explained why one border is woven differently from another. That memory is not a marketing story added afterwards. It is part of the value created by meeting craft where it lives.",
          "Travel can reduce handmade work to a souvenir, or it can restore the human scale behind it. The difference lies in how long we look, what we ask and whether we allow the maker to be more important than the thing we might carry away.",
        ],
      },
    ],
  },
];

export function getJournalEntry(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug);
}
