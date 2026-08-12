// ======================================================
// TYPES
// ======================================================

export interface OddOneOutRound {
  id: number;
  category: string;
  words: string[];
  oddIndex: number;
  explanation: string;
}

// ======================================================
// STATIC DATA — ODD ONE OUT ROUNDS
// ======================================================

const ROUNDS: OddOneOutRound[] = [
  {
    id: 1,
    category: "Fruits",
    words: ["Apple", "Mango", "Carrot", "Banana"],
    oddIndex: 2,
    explanation: "Carrot is a vegetable, not a fruit.",
  },
  {
    id: 2,
    category: "Modal Verbs",
    words: ["Should", "Would", "Quickly", "Could"],
    oddIndex: 2,
    explanation: "Quickly is an adverb, not a modal verb.",
  },
  {
    id: 3,
    category: "Prepositions",
    words: ["Under", "Happy", "Beside", "Between"],
    oddIndex: 1,
    explanation: "Happy is an adjective, not a preposition.",
  },
  {
    id: 4,
    category: "Past Tense Verbs",
    words: ["Walked", "Played", "Go", "Studied"],
    oddIndex: 2,
    explanation: "Go is present tense; the others are past tense.",
  },
  {
    id: 5,
    category: "Countable Nouns",
    words: ["Books", "Water", "Chairs", "Pens"],
    oddIndex: 1,
    explanation: "Water is uncountable; the others are countable.",
  },
  {
    id: 6,
    category: "Synonyms for 'Happy'",
    words: ["Joyful", "Content", "Furious", "Delighted"],
    oddIndex: 2,
    explanation: "Furious means angry, not happy.",
  },
  {
    id: 7,
    category: "Sea Creatures",
    words: ["Dolphin", "Whale", "Shark", "Frog"],
    oddIndex: 3,
    explanation: "A frog is an amphibian, not a sea creature.",
  },
  {
    id: 8,
    category: "Colors",
    words: ["Scarlet", "Azure", "Wooden", "Emerald"],
    oddIndex: 2,
    explanation: "Wooden describes a material, not a color.",
  },
  {
    id: 9,
    category: "Comparative Adjectives",
    words: ["Bigger", "Faster", "Beautiful", "Smaller"],
    oddIndex: 2,
    explanation: "Beautiful is the base form, not comparative.",
  },
  {
    id: 10,
    category: "Days of the Week",
    words: ["Monday", "January", "Friday", "Sunday"],
    oddIndex: 1,
    explanation: "January is a month, not a day of the week.",
  },
  {
    id: 11,
    category: "Question Words",
    words: ["What", "Where", "Then", "When"],
    oddIndex: 2,
    explanation: "Then is not a question word.",
  },
  {
    id: 12,
    category: "Irregular Plural Nouns",
    words: ["Children", "Mice", "Tables", "Feet"],
    oddIndex: 2,
    explanation: "Tables uses a regular plural; the others are irregular.",
  },
  {
    id: 13,
    category: "Conjunctions",
    words: ["And", "But", "Quickly", "Because"],
    oddIndex: 2,
    explanation: "Quickly is an adverb, not a conjunction.",
  },
  {
    id: 14,
    category: "Body Parts",
    words: ["Elbow", "Ankle", "Pillow", "Shoulder"],
    oddIndex: 2,
    explanation: "A pillow is not a body part.",
  },
  {
    id: 15,
    category: "Emotions",
    words: ["Anxious", "Excited", "Purple", "Nervous"],
    oddIndex: 2,
    explanation: "Purple is a color, not an emotion.",
  },
  {
    id: 16,
    category: "Vehicles",
    words: ["Bicycle", "Truck", "Umbrella", "Scooter"],
    oddIndex: 2,
    explanation: "An umbrella is not a vehicle.",
  },
  {
    id: 17,
    category: "Weather Words",
    words: ["Rainy", "Sunny", "Wealthy", "Windy"],
    oddIndex: 2,
    explanation: "Wealthy means rich, not a weather condition.",
  },
  {
    id: 18,
    category: "Professions",
    words: ["Teacher", "Doctor", "Honest", "Engineer"],
    oddIndex: 2,
    explanation: "Honest is an adjective, not a profession.",
  },
  {
    id: 19,
    category: "Furniture",
    words: ["Sofa", "Table", "Guitar", "Wardrobe"],
    oddIndex: 2,
    explanation: "A guitar is a musical instrument, not furniture.",
  },
  {
    id: 20,
    category: "Verbs of Movement",
    words: ["Run", "Jump", "Table", "Swim"],
    oddIndex: 2,
    explanation: "Table is a noun, not a verb of movement.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// ======================================================
// SERVICE FUNCTIONS
// ======================================================

export async function fetchOddOneOutRounds(
  count: number = 10
): Promise<OddOneOutRound[]> {
  return shuffle(ROUNDS).slice(0, count);
}
