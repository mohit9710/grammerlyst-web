// ======================================================
// TYPES
// ======================================================

export interface WordPair {
  id: number;
  word: string;
  meaning: string;
}

export interface MemoryCard {
  cardId: string;
  pairId: number;
  label: string;
  type: "word" | "meaning";
}

// ======================================================
// STATIC DATA — VOCABULARY PAIRS
// ======================================================

const WORD_PAIRS: WordPair[] = [
  { id: 1, word: "Ambiguous", meaning: "Having more than one possible meaning" },
  { id: 2, word: "Benevolent", meaning: "Kind and generous" },
  { id: 3, word: "Candid", meaning: "Truthful and straightforward" },
  { id: 4, word: "Diligent", meaning: "Showing care in one's work" },
  { id: 5, word: "Eloquent", meaning: "Fluent and persuasive in speech" },
  { id: 6, word: "Frugal", meaning: "Sparing with money or resources" },
  { id: 7, word: "Gregarious", meaning: "Fond of company; sociable" },
  { id: 8, word: "Humble", meaning: "Not proud or arrogant" },
  { id: 9, word: "Immense", meaning: "Extremely large" },
  { id: 10, word: "Jovial", meaning: "Cheerful and friendly" },
  { id: 11, word: "Keen", meaning: "Eager or enthusiastic" },
  { id: 12, word: "Lucid", meaning: "Clear and easy to understand" },
  { id: 13, word: "Meticulous", meaning: "Very careful and precise" },
  { id: 14, word: "Novice", meaning: "A beginner" },
  { id: 15, word: "Optimistic", meaning: "Hopeful about the future" },
  { id: 16, word: "Pragmatic", meaning: "Dealing with things sensibly" },
  { id: 17, word: "Quaint", meaning: "Attractively unusual or old-fashioned" },
  { id: 18, word: "Resilient", meaning: "Able to recover quickly" },
  { id: 19, word: "Sincere", meaning: "Free from pretense; genuine" },
  { id: 20, word: "Tedious", meaning: "Too long and dull" },
  { id: 21, word: "Unanimous", meaning: "Fully in agreement" },
  { id: 22, word: "Vivid", meaning: "Producing powerful images in the mind" },
  { id: 23, word: "Witty", meaning: "Showing clever humor" },
  { id: 24, word: "Zealous", meaning: "Showing great energy for a cause" },
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

export async function fetchMemoryDeck(
  pairCount: number = 8
): Promise<MemoryCard[]> {
  const pairs = shuffle(WORD_PAIRS).slice(0, pairCount);

  const cards: MemoryCard[] = pairs.flatMap((pair) => [
    {
      cardId: `${pair.id}-word`,
      pairId: pair.id,
      label: pair.word,
      type: "word" as const,
    },
    {
      cardId: `${pair.id}-meaning`,
      pairId: pair.id,
      label: pair.meaning,
      type: "meaning" as const,
    },
  ]);

  return shuffle(cards);
}
