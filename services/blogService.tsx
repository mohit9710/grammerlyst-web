// ======================================================
// TYPES
// ======================================================

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  author: string;
  publishedDate: string;
  readTimeMinutes: number;
  tags: string[];
}

// ======================================================
// STATIC DATA — GRAMMRLYST BLOG
// ======================================================

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "master-articles-a-an-the",
    title: "Master Articles: When to Use A, An, and The",
    category: "Grammar",
    excerpt:
      "Articles are one of the most common sources of errors for English learners. Here's a clear, practical guide to getting them right every time.",
    content: [
      "Articles — a, an, and the — are small words that carry a lot of weight in English. Get them wrong and even a well-written sentence can sound unnatural to a native speaker.",
      "The basic rule for 'a' versus 'an' is about sound, not spelling. Use 'an' before a vowel sound and 'a' before a consonant sound. That's why we say 'an hour' (silent h) but 'a university' (starts with a 'yoo' sound).",
      "'The' is used when both the writer and reader know exactly which thing is being referred to — because it was already mentioned, because it's unique (the sun, the internet), or because there's only one in context.",
      "The trickiest part for most learners is knowing when to use no article at all. General or uncountable nouns used in a general sense — 'Education is important', 'Children need discipline' — take zero article, not 'the'.",
      "A simple habit that helps: whenever you write 'the' before a plural or uncountable noun, pause and ask whether you mean something specific or something general. If it's general, drop the article.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-06-02",
    readTimeMinutes: 5,
    tags: ["articles", "grammar", "beginner"],
  },
  {
    id: 2,
    slug: "should-would-could-modal-verbs-explained",
    title: "Should, Would, Could: Modal Verbs Explained Simply",
    category: "Grammar",
    excerpt:
      "Confused about when to use should, would, or could? This guide breaks down every common modal verb with real examples.",
    content: [
      "Modal verbs like should, would, could, must, and might don't follow the same rules as regular verbs, and their meanings shift depending on context — which is exactly why they trip up so many learners.",
      "'Should' expresses recommendation or mild obligation: 'You should drink more water.' It's the modal you reach for when giving advice or stating what you believe ought to happen.",
      "'Would' is mostly used for hypothetical situations and politeness: 'If I had more time, I would travel more.' It's also the backbone of conditional sentences, so mastering it unlocks a huge range of natural expression.",
      "'Could' expresses possibility or past ability, and is softer than 'should': 'This could help reduce costs' suggests an option rather than a demand.",
      "For advanced writing, learn the perfect modal forms — should have, would have, could have — which let you talk about missed opportunities and past hypotheticals: 'We could have avoided the delay if we had planned earlier.'",
      "The fastest way to internalize these is through deliberate practice: write five sentences a day using a different modal verb, and read them aloud until the rhythm feels natural.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-06-10",
    readTimeMinutes: 6,
    tags: ["modal verbs", "grammar", "writing"],
  },
  {
    id: 3,
    slug: "5-common-grammar-mistakes-costing-you-marks",
    title: "5 Common Grammar Mistakes That Are Costing You Marks",
    category: "IELTS",
    excerpt:
      "These small, repeated errors quietly cap your writing score. Learn to spot and fix them before your next exam or email.",
    content: [
      "Most learners don't lose marks because of one big mistake — they lose marks because of small, repeated errors that show up throughout their writing.",
      "Subject-verb agreement is the first culprit. 'The number of students have increased' should be 'has increased', because 'the number' is singular even though 'students' is plural.",
      "Article errors come next. Adding 'the' before general nouns ('the pollution is a serious issue') instead of leaving it general ('pollution is a serious issue') is one of the most frequent mistakes examiners see.",
      "Confusing countable and uncountable nouns is another common trap — words like 'information', 'research', and 'advice' are uncountable and never take a plural 's'.",
      "Run-on sentences and comma splices — joining two full sentences with only a comma — also cost marks. Use a conjunction, a semicolon, or split the sentence instead.",
      "Finally, inconsistent tense usage within a paragraph confuses readers. Decide on a timeframe for each paragraph and stick to it unless you have a clear reason to shift.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-06-18",
    readTimeMinutes: 7,
    tags: ["ielts", "grammar", "common mistakes"],
  },
  {
    id: 4,
    slug: "how-to-structure-an-ielts-task-2-essay",
    title: "How to Structure an IELTS Task 2 Essay for a Higher Band",
    category: "IELTS",
    excerpt:
      "A clear, repeatable structure is one of the fastest ways to raise your Task Achievement and Coherence scores.",
    content: [
      "Examiners read hundreds of essays, and a clear structure makes yours easier to follow — which directly improves your Coherence and Cohesion score.",
      "Start with a short introduction: paraphrase the question in your own words, then state your position or outline what the essay will cover in one or two sentences.",
      "Each body paragraph should focus on a single main idea. A reliable method is PEEL — Point, Explain, Example, Link — which keeps every paragraph focused and fully developed.",
      "Aim for two body paragraphs in most essay types. Give them roughly equal length and depth so the argument feels balanced rather than lopsided.",
      "End with a short conclusion that summarizes your main points and restates your opinion. Never introduce a new idea here — the conclusion is for closing the argument, not opening a new one.",
      "Practising this structure until it becomes automatic frees up mental energy to focus on vocabulary and grammar instead of worrying about organization under time pressure.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-06-25",
    readTimeMinutes: 6,
    tags: ["ielts", "essay writing", "task 2"],
  },
  {
    id: 5,
    slug: "building-vocabulary-that-actually-sticks",
    title: "Building Vocabulary That Actually Sticks",
    category: "Vocabulary",
    excerpt:
      "Memorizing word lists rarely works long-term. Here's a more effective approach based on how memory actually forms.",
    content: [
      "Most learners try to build vocabulary by memorizing long lists of words, but this approach rarely survives contact with real conversation or writing.",
      "Words stick better when they're learned in context — as part of a phrase or sentence — rather than as isolated definitions. Instead of memorizing 'contribute: to give', learn 'contribute to a discussion' as a unit.",
      "Spaced repetition beats cramming. Reviewing a word after one day, then three days, then a week, builds much stronger long-term memory than repeating it ten times in one sitting.",
      "Active use accelerates retention dramatically. Try to use every new word in a sentence of your own within 24 hours of learning it — writing or speaking it out loud both work.",
      "Focus on high-frequency, topic-specific vocabulary rather than obscure 'impressive' words. Ten well-understood words you can use correctly are worth more than fifty you half-remember.",
      "Finally, track your own list of mistakes. Words you've misused once and corrected tend to stay in memory far longer than words you've only seen in a textbook.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-07-02",
    readTimeMinutes: 5,
    tags: ["vocabulary", "learning tips"],
  },
  {
    id: 6,
    slug: "why-pronunciation-practice-matters-more-than-you-think",
    title: "Why Pronunciation Practice Matters More Than You Think",
    category: "Speaking",
    excerpt:
      "Grammar and vocabulary get most of the attention, but pronunciation is often what determines whether you're understood.",
    content: [
      "It's possible to have excellent grammar and a wide vocabulary and still struggle to be understood in conversation — usually because of pronunciation, not word choice.",
      "Word stress is one of the biggest factors in intelligibility. English is a stress-timed language, and putting emphasis on the wrong syllable can make even a correctly pronounced word hard to recognize.",
      "Minimal pairs — words that differ by a single sound, like 'ship' and 'sheep' — are a highly efficient way to train your ear and mouth to distinguish sounds that don't exist in your first language.",
      "Recording yourself and comparing it to a native speaker is one of the fastest ways to improve, because it's often difficult to hear your own pronunciation patterns in real time.",
      "Consistency matters more than intensity. Ten focused minutes of pronunciation practice a day will outperform an occasional hour-long session, because pronunciation is a muscle-memory skill.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-07-09",
    readTimeMinutes: 5,
    tags: ["pronunciation", "speaking", "fluency"],
  },
  {
    id: 7,
    slug: "how-ai-is-changing-language-learning",
    title: "How AI Is Changing the Way We Learn Languages",
    category: "Learning Tech",
    excerpt:
      "AI-powered feedback is making personalized language coaching accessible to anyone with an internet connection.",
    content: [
      "Traditional language learning relied heavily on classroom time and human tutors, both of which are expensive and hard to scale — AI is changing that equation.",
      "Real-time grammar and pronunciation feedback means learners no longer have to wait days for a teacher to review their writing or speaking — corrections happen instantly, while the mistake is still fresh.",
      "Adaptive practice is another major shift. Instead of following a fixed curriculum, AI systems can identify a learner's specific weak points — like article usage or a particular vowel sound — and generate targeted exercises.",
      "This doesn't replace human interaction, which is still essential for building real conversational confidence, but it dramatically shortens the feedback loop for the mechanical parts of language — grammar, vocabulary, and pronunciation.",
      "The learners who benefit most combine both: AI tools for daily practice and rapid correction, plus regular real conversation to build fluency and confidence.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-07-16",
    readTimeMinutes: 4,
    tags: ["ai", "learning tech", "language learning"],
  },
  {
    id: 8,
    slug: "conditional-sentences-a-complete-guide",
    title: "Conditional Sentences: A Complete Guide (Zero to Third)",
    category: "Grammar",
    excerpt:
      "Conditionals are one of the highest-value grammar structures for advanced writing. Here's how all four types work.",
    content: [
      "Conditional sentences let you express cause and effect, hypothetical situations, and past regrets — and mastering all four types is a reliable way to boost your grammatical range.",
      "The zero conditional describes general truths: 'If you heat water to 100°C, it boils.' Both clauses use the present tense because the result is always true.",
      "The first conditional describes a real, likely future outcome: 'If it rains tomorrow, we will cancel the trip.' Use present tense in the if-clause and 'will' in the result clause.",
      "The second conditional describes a hypothetical present or future: 'If I had more free time, I would learn another language.' This is especially useful in essays discussing hypothetical solutions to problems.",
      "The third conditional describes a hypothetical past — something that didn't actually happen: 'If she had studied harder, she would have passed the exam.' This structure is excellent for critiquing past decisions or policies in formal writing.",
      "A common mistake is mixing forms incorrectly, such as 'If I would have known' instead of 'If I had known'. Keep the if-clause and result-clause tenses matched to the conditional type you're using.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-07-24",
    readTimeMinutes: 7,
    tags: ["grammar", "conditionals", "advanced"],
  },
  {
    id: 9,
    slug: "daily-habits-for-faster-english-fluency",
    title: "7 Daily Habits for Faster English Fluency",
    category: "Learning Tips",
    excerpt:
      "Fluency isn't built in occasional bursts of study — it's built through small, consistent daily habits.",
    content: [
      "Fluency is less about occasional intense study sessions and more about consistent daily exposure and practice, even if each session is short.",
      "Start your day by reading one short article or passage in English and noting any unfamiliar words — this primes your brain for the language before you even start speaking.",
      "Speak out loud daily, even alone. Describing your surroundings or narrating your plans for the day in English builds the muscle memory needed for spontaneous conversation.",
      "Keep a small notebook — physical or digital — of mistakes you make and their corrections. Reviewing this list weekly is one of the highest-leverage habits for eliminating recurring errors.",
      "Listen actively, not passively. Choose one podcast episode or video a day and try to summarize it out loud afterward in your own words.",
      "Write something every day, even a few sentences. Writing forces you to make grammar and word-choice decisions consciously, which strengthens the patterns you'll later use automatically in speech.",
      "Finally, track your progress. Revisiting something you wrote or recorded a month ago is one of the most motivating ways to see how far you've actually come.",
    ],
    author: "Grammrlyst Team",
    publishedDate: "2026-08-01",
    readTimeMinutes: 6,
    tags: ["fluency", "habits", "learning tips"],
  },
];

// ======================================================
// SERVICE FUNCTIONS
// ======================================================

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() -
      new Date(a.publishedDate).getTime()
  );
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}
