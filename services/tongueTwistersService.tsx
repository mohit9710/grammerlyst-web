// ======================================================
// TYPES
// ======================================================

export type TwisterDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TongueTwister {
  id: number;
  text: string;
  difficulty: TwisterDifficulty;
  targetSound: string;
  tip: string;
}

// ======================================================
// STATIC DATA — TONGUE TWISTERS
// ======================================================

const TONGUE_TWISTERS: TongueTwister[] = [
  {
    id: 1,
    text: "She sells sea shells by the seashore.",
    difficulty: "Beginner",
    targetSound: "S / SH",
    tip: "Keep your tongue tip low for 's' and pull it back slightly for 'sh' — don't let the two sounds blur together.",
  },
  {
    id: 2,
    text: "Peter Piper picked a peck of pickled peppers.",
    difficulty: "Beginner",
    targetSound: "P",
    tip: "Let each 'p' pop with a small burst of air — this is a classic warm-up for crisp consonants.",
  },
  {
    id: 3,
    text: "Betty bought a bit of butter, but the butter was bitter.",
    difficulty: "Beginner",
    targetSound: "B / T",
    tip: "Focus on the difference between the soft 'b' and the sharp 't' — don't let them sound the same.",
  },
  {
    id: 4,
    text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
    difficulty: "Beginner",
    targetSound: "F / W / Z",
    tip: "Slow down on 'Fuzzy Wuzzy' first — speed only once the F/W switch feels natural.",
  },
  {
    id: 5,
    text: "Red lorry, yellow lorry, red lorry, yellow lorry.",
    difficulty: "Beginner",
    targetSound: "L / R",
    tip: "This pair is famously hard for L/R confusion — curl your tongue tip up for 'r' and touch the ridge behind your teeth for 'l'.",
  },
  {
    id: 6,
    text: "I scream, you scream, we all scream for ice cream.",
    difficulty: "Beginner",
    targetSound: "S / CR",
    tip: "Notice how 'I scream' and 'ice cream' sound almost identical — enunciate the word boundary clearly.",
  },
  {
    id: 7,
    text: "A proper copper coffee pot.",
    difficulty: "Intermediate",
    targetSound: "P / C",
    tip: "Keep a steady rhythm — the repeated hard 'p' and 'c' sounds are what make this one trip people up.",
  },
  {
    id: 8,
    text: "Fred fed Ted bread, and Ted fed Fred bread.",
    difficulty: "Intermediate",
    targetSound: "F / T / D",
    tip: "Practice slowly first, swapping who 'fed' whom is the hard part — accuracy before speed.",
  },
  {
    id: 9,
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    difficulty: "Intermediate",
    targetSound: "W / CH",
    tip: "Round your lips fully for every 'w' and keep the 'ch' sharp — don't let it soften into 'sh'.",
  },
  {
    id: 10,
    text: "Six slippery snails slid slowly seaward.",
    difficulty: "Intermediate",
    targetSound: "S / SL",
    tip: "The repeated 'sl' cluster is the challenge — keep airflow continuous rather than stopping between words.",
  },
  {
    id: 11,
    text: "Greek grapes, Greek grapes, Greek grapes.",
    difficulty: "Intermediate",
    targetSound: "GR",
    tip: "Say it slowly three times before attempting speed — the 'gr' cluster tires the tongue quickly.",
  },
  {
    id: 12,
    text: "Which wristwatches are Swiss wristwatches?",
    difficulty: "Advanced",
    targetSound: "W / S / TW",
    tip: "This is one of the hardest W/S combinations in English — isolate 'wrist' and 'watches' before joining them.",
  },
  {
    id: 13,
    text: "The sixth sick sheikh's sixth sheep's sick.",
    difficulty: "Advanced",
    targetSound: "S / SH / TH",
    tip: "Widely considered one of the toughest English tongue twisters — master it slowly, word by word, before adding speed.",
  },
  {
    id: 14,
    text: "Lesser leather never weathered wetter weather better.",
    difficulty: "Advanced",
    targetSound: "L / W / TH",
    tip: "The 'th' and 'w' sounds alternate rapidly here — keep your jaw relaxed to avoid tensing up mid-sentence.",
  },
  {
    id: 15,
    text: "Can you can a can as a canner can can a can?",
    difficulty: "Advanced",
    targetSound: "C / N",
    tip: "The repeated word 'can' with different meanings tests both pronunciation and pacing — pause briefly between clauses.",
  },
  {
    id: 16,
    text: "Toy boat, toy boat, toy boat.",
    difficulty: "Advanced",
    targetSound: "T / OY / B",
    tip: "Deceptively short — the vowel-consonant swap between 'toy' and 'boat' becomes very hard at speed.",
  },
  {
    id: 17,
    text: "Unique New York, unique New York, unique New York.",
    difficulty: "Advanced",
    targetSound: "N / Y / U",
    tip: "A favorite among voice actors — focus on keeping 'New York' crisp instead of slurring into 'Nu-York'.",
  },
];

// ======================================================
// SERVICE FUNCTIONS
// ======================================================

export async function fetchTongueTwisters(): Promise<TongueTwister[]> {
  return TONGUE_TWISTERS;
}
