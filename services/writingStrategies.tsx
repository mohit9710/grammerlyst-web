// ======================================================
// TYPES
// ======================================================

export interface StrategyTopic {
  id: number;
  title: string;
  taskType: "Task 1" | "Task 2" | "General";
  description: string;
}

export interface StrategyItem {
  id: number;
  topic_id: number;
  title: string;
  structure: string | null;
  example: string | null;
  tips: string[];
}

// ======================================================
// STATIC DATA — IELTS WRITING STRATEGIES
// ======================================================

const STRATEGY_TOPICS: StrategyTopic[] = [
  {
    id: 1,
    title: "Task 1 (Academic): Graphs & Charts",
    taskType: "Task 1",
    description:
      "Describe line graphs, bar charts, pie charts, and tables clearly, accurately, and objectively.",
  },
  {
    id: 2,
    title: "Task 1 (Academic): Processes & Diagrams",
    taskType: "Task 1",
    description:
      "Explain how a process works or how a diagram/map changes, using clear sequencing and passive voice.",
  },
  {
    id: 3,
    title: "Task 1 (General Training): Letter Writing",
    taskType: "Task 1",
    description:
      "Choose the right tone and cover every bullet point when writing formal, semi-formal, or informal letters.",
  },
  {
    id: 4,
    title: "Task 2: Opinion Essays (Agree/Disagree)",
    taskType: "Task 2",
    description:
      "State a clear position and defend it with well-developed reasons and examples.",
  },
  {
    id: 5,
    title: "Task 2: Discussion Essays (Both Views)",
    taskType: "Task 2",
    description:
      "Present two sides of an argument fairly before giving your own opinion.",
  },
  {
    id: 6,
    title: "Task 2: Problem & Solution Essays",
    taskType: "Task 2",
    description:
      "Identify problems clearly and propose solutions that directly address them.",
  },
  {
    id: 7,
    title: "Task 2: Advantages & Disadvantages Essays",
    taskType: "Task 2",
    description:
      "Weigh up both sides of an issue and reach a clear, justified conclusion.",
  },
  {
    id: 8,
    title: "Essay Structure & Paragraphing",
    taskType: "General",
    description:
      "Build introductions, body paragraphs, and conclusions that examiners can follow easily.",
  },
  {
    id: 9,
    title: "Cohesion, Linking Words & Coherence",
    taskType: "General",
    description:
      "Connect your ideas logically without sounding repetitive or mechanical.",
  },
  {
    id: 10,
    title: "Vocabulary & Paraphrasing",
    taskType: "General",
    description:
      "Paraphrase the question naturally and use accurate, topic-specific vocabulary.",
  },
  {
    id: 11,
    title: "Grammar Range & Accuracy",
    taskType: "General",
    description:
      "Mix sentence types confidently while avoiding the errors that cost the most marks.",
  },
  {
    id: 12,
    title: "Time Management & Word Count",
    taskType: "General",
    description:
      "Plan, write, and check both tasks within the 60-minute limit without rushing.",
  },
  {
    id: 13,
    title: "Common Mistakes That Lower Your Score",
    taskType: "General",
    description:
      "Recognise and eliminate the mistakes examiners see most often across all four criteria.",
  },
  {
    id: 14,
    title: "Band Score Descriptors Overview",
    taskType: "General",
    description:
      "Understand exactly what examiners look for at each band level across all four criteria.",
  },
  {
    id: 15,
    title: "Articles: A, An & The (Basic to Advanced)",
    taskType: "General",
    description:
      "Master when to use a, an, the, or no article at all — one of the most common error sources in writing.",
  },
  {
    id: 16,
    title: "Modal Verbs: Should, Would, Could & More",
    taskType: "General",
    description:
      "Use modal verbs accurately to express obligation, possibility, ability, and hypothetical ideas.",
  },
  {
    id: 17,
    title: "Sentence Structure: Basic to Advanced",
    taskType: "General",
    description:
      "Progress from simple sentences to complex and conditional structures that show a wide grammatical range.",
  },
  {
    id: 18,
    title: "Prepositions & Common Confusions",
    taskType: "General",
    description:
      "Fix the small preposition errors that quietly cap your Grammatical Range score.",
  },
  {
    id: 19,
    title: "Punctuation Essentials",
    taskType: "General",
    description:
      "Use commas, semicolons, and colons accurately to keep long sentences under control.",
  },
  {
    id: 20,
    title: "Advanced Academic Writing Techniques",
    taskType: "General",
    description:
      "Push from Band 7 to Band 8+ with hedging language, nominalisation, and a precise formal tone.",
  },
];

const STRATEGY_ITEMS: StrategyItem[] = [
  // Topic 1 — Graphs & Charts
  {
    id: 101,
    topic_id: 1,
    title: "Overview & Structure Template",
    structure:
      "Para 1: Introduction (paraphrase the question)\nPara 2: Overview (2 key trends, no numbers)\nPara 3: Body 1 (specific data group)\nPara 4: Body 2 (specific data group)",
    example:
      "The bar chart illustrates the number of visitors to four museums in London between 2015 and 2019.",
    tips: [
      "Never give an opinion in Task 1 — it is a factual description only",
      "Always include an overview paragraph — this is essential for Band 6 and above",
      "Group similar data together rather than describing every single number",
      "Write at least 150 words",
    ],
  },
  {
    id: 102,
    topic_id: 1,
    title: "Describing Trends (Language for Change)",
    structure:
      "Verbs: increase, rise, grow, decline, fall, drop, fluctuate, remain stable\nAdverbs: sharply, dramatically, gradually, steadily, slightly\nNouns: a sharp increase, a gradual decline, a steady rise",
    example:
      "The number of tourists rose sharply from 2015 to 2017 before declining gradually until 2019.",
    tips: [
      "Mix verb and noun forms of trend language to avoid repetition",
      "Use the correct preposition: rise BY (an amount) or rise TO (a figure)",
      "Match your tense to the graph — past tense for historical data, present for undated or general data",
    ],
  },
  {
    id: 103,
    topic_id: 1,
    title: "Comparing Data Accurately",
    structure:
      "Comparatives: higher than, lower than, more/fewer than, the same as\nSuperlatives: the highest, the lowest, the most significant",
    example:
      "Museum A received almost twice as many visitors as Museum C in 2018.",
    tips: [
      "Use exact or approximate figures to support every comparison you make",
      "Don't just list numbers — explain the relationship between them",
    ],
  },

  // Topic 2 — Processes & Diagrams
  {
    id: 201,
    topic_id: 2,
    title: "Structure for Process Diagrams",
    structure:
      "Para 1: Introduction (paraphrase the title)\nPara 2: Overview (number of stages, start and end point)\nPara 3+: Body paragraphs describing each stage in sequence",
    example:
      "The diagram illustrates the process of recycling plastic bottles, from collection to reuse.",
    tips: [
      "Use passive voice since diagrams often show actions without a clear agent",
      "Use sequencing language: first, next, after this, subsequently, finally",
      "Avoid past tense unless the process has a clear historical time reference",
    ],
  },
  {
    id: 202,
    topic_id: 2,
    title: "Passive Voice for Processes",
    structure:
      "Subject + is/are + past participle (+ by agent)\ne.g. The bottles are collected → then transported → then sorted",
    example:
      "The plastic is first collected from recycling bins and then transported to a sorting facility.",
    tips: [
      "Passive voice keeps focus on the process itself, not the person doing it",
      "Vary your sentence openings — don't start every sentence with 'Then'",
    ],
  },

  // Topic 3 — Letter Writing
  {
    id: 301,
    topic_id: 3,
    title: "Choosing the Right Tone",
    structure:
      "Formal: Dear Sir/Madam ... Yours faithfully\nSemi-formal: Dear Mr Smith ... Yours sincerely\nInformal: Dear Tom ... Best wishes",
    example:
      "I am writing to complain about a faulty product I purchased from your store.",
    tips: [
      "Identify the letter type immediately: formal (unknown person), semi-formal (known professional), informal (friend or family)",
      "Match your opening and closing to the tone you choose",
      "Cover exactly the 3 bullet points given in the question",
    ],
  },
  {
    id: 302,
    topic_id: 3,
    title: "Covering All Three Bullet Points",
    structure:
      "Para 1: Purpose of the letter\nPara 2: Explain the situation / details\nPara 3: Request / solution / action needed",
    example:
      "I am requesting a full refund and would appreciate a response within seven days.",
    tips: [
      "Missing a bullet point caps your Task Achievement score",
      "Expand each point with 2-3 sentences, not just a single line",
    ],
  },

  // Topic 4 — Opinion Essays
  {
    id: 401,
    topic_id: 4,
    title: "Four-Paragraph Structure",
    structure:
      "Para 1: Introduction (paraphrase + clear thesis stating your opinion)\nPara 2: Body 1 (first reason + example)\nPara 3: Body 2 (second reason + example)\nPara 4: Conclusion (restate opinion + summary)",
    example:
      "While some believe technology isolates people, I firmly agree that it has strengthened social connections.",
    tips: [
      "State your opinion clearly in both the introduction and the conclusion",
      "Never sit on the fence unless the question explicitly asks for a balanced view",
      "Each body paragraph should develop one main idea with an example",
    ],
  },
  {
    id: 402,
    topic_id: 4,
    title: "Writing a Strong Thesis Statement",
    structure: '"I agree that [position] because [reason]."',
    example:
      "I strongly agree that governments should invest more in public transport because it reduces both congestion and pollution.",
    tips: [
      "Avoid vague thesis statements like 'there are many advantages and disadvantages'",
      "Your thesis should preview the reasons you develop in the body paragraphs",
    ],
  },

  // Topic 5 — Discussion Essays
  {
    id: 501,
    topic_id: 5,
    title: "Balanced Structure Template",
    structure:
      "Para 1: Introduction (paraphrase + state you will discuss both views)\nPara 2: Discuss View A\nPara 3: Discuss View B\nPara 4: Conclusion (give your own opinion)",
    example:
      "This essay will discuss both perspectives before presenting my own view.",
    tips: [
      "'Discuss both views and give your opinion' requires you to state a clear opinion, usually in the conclusion",
      "Give equal length and depth to both viewpoints",
      "Use reporting language such as 'Some argue that...' and 'Others believe that...'",
    ],
  },

  // Topic 6 — Problem & Solution
  {
    id: 601,
    topic_id: 6,
    title: "Structure Template",
    structure:
      "Para 1: Introduction (context + thesis)\nPara 2: Problems (2 problems, briefly explained)\nPara 3: Solutions (matching solutions)\nPara 4: Conclusion",
    example:
      "One major problem caused by urbanisation is traffic congestion, which can be addressed through improved public transport.",
    tips: [
      "Link each solution directly to the problem you raised — don't introduce unrelated solutions",
      "Use cause-effect language: 'as a result', 'this leads to', 'consequently'",
    ],
  },

  // Topic 7 — Advantages & Disadvantages
  {
    id: 701,
    topic_id: 7,
    title: "Structure Template",
    structure:
      "Para 1: Introduction (paraphrase + thesis)\nPara 2: Advantages (1-2 with examples)\nPara 3: Disadvantages (1-2 with examples)\nPara 4: Conclusion (state which outweighs the other)",
    example:
      "Although remote work offers flexibility, it can also weaken workplace collaboration.",
    tips: [
      "If the question asks whether advantages outweigh disadvantages, your conclusion must give a clear judgement",
      "Keep the two body paragraphs balanced in length",
    ],
  },

  // Topic 8 — Structure & Paragraphing
  {
    id: 801,
    topic_id: 8,
    title: "The PEEL Method",
    structure: "Point → Explain → Example → Link",
    example:
      "Point: Remote work increases productivity. Explain: employees avoid commuting stress. Example: a 2022 study found a 13% productivity increase among remote workers. Link: this shows why companies should consider hybrid models.",
    tips: [
      "Every body paragraph should follow PEEL to stay focused and fully developed",
      "Avoid one or two sentence paragraphs — aim for 4-6 sentences per body paragraph",
    ],
  },
  {
    id: 802,
    topic_id: 8,
    title: "Introductions That Work",
    structure:
      "Sentence 1: Paraphrase the question using synonyms\nSentence 2: Thesis statement (your position or essay outline)",
    example:
      "Original: 'Many people think university education should be free.' Paraphrase: 'It is often argued that tertiary education ought to be provided without charge.'",
    tips: [
      "Never copy the question word-for-word — this is penalised",
      "Keep the introduction to 2-3 sentences maximum",
    ],
  },
  {
    id: 803,
    topic_id: 8,
    title: "Conclusions That Score Well",
    structure:
      "Sentence 1: Summarise your main points\nSentence 2: Restate your opinion or final thought",
    example:
      "In conclusion, while both options offer benefits, investing in public education ultimately delivers greater long-term value to society.",
    tips: [
      "Never introduce a new idea in the conclusion",
      "Keep it short — two sentences is enough",
    ],
  },

  // Topic 9 — Cohesion & Coherence
  {
    id: 901,
    topic_id: 9,
    title: "Using Linking Words Naturally",
    structure:
      "Addition: furthermore, in addition, moreover\nContrast: however, on the other hand, whereas\nCause-effect: therefore, as a result, consequently\nExamples: for instance, for example, such as",
    example:
      "Moreover, public transport reduces carbon emissions; consequently, cities become healthier places to live.",
    tips: [
      "Overusing linking words at the start of every sentence sounds robotic — vary their placement",
      "One linking word per sentence is usually enough",
    ],
  },
  {
    id: 902,
    topic_id: 9,
    title: "Referencing to Avoid Repetition",
    structure:
      "Pronouns: it, this, these, such\nSubstitution: 'this problem', 'this issue', 'the former / the latter'",
    example:
      "Pollution is rising in urban areas. This issue requires immediate government action.",
    tips: [
      "Repeating the same noun across sentences lowers your Coherence and Cohesion score",
      "Use 'this + summary noun' to link ideas cleanly between sentences",
    ],
  },

  // Topic 10 — Vocabulary & Paraphrasing
  {
    id: 1001,
    topic_id: 10,
    title: "Paraphrasing the Question",
    structure:
      "Change the word class and use synonyms\ne.g. 'increasing' → 'a rise in' / 'growing'",
    example:
      "Question: 'Many people believe social media has a negative effect on society.' Paraphrase: 'It is widely thought that social networking platforms negatively impact communities.'",
    tips: [
      "Keep the original meaning exactly — never change the topic while paraphrasing",
      "Practise paraphrasing common IELTS topics: environment, education, technology, crime",
    ],
  },
  {
    id: 1002,
    topic_id: 10,
    title: "Topic-Specific Vocabulary",
    structure:
      "Environment: carbon footprint, renewable energy, deforestation\nEducation: curriculum, tuition fees, vocational training\nTechnology: automation, artificial intelligence, digital divide",
    example:
      "Investing in renewable energy can significantly reduce a country's carbon footprint.",
    tips: [
      "Learn 10-15 words per common topic rather than memorising generic 'big words'",
      "Only use vocabulary you fully understand — misuse lowers your score more than simple, accurate language",
    ],
  },

  // Topic 11 — Grammar Range & Accuracy
  {
    id: 1101,
    topic_id: 11,
    title: "Mixing Sentence Structures",
    structure:
      "Simple: Subject + Verb + Object\nCompound: Clause + and/but/so + Clause\nComplex: Clause + because/although/which + Clause",
    example:
      "Although social media connects people globally, it can also contribute to feelings of isolation.",
    tips: [
      "Band 7 and above requires a mix of simple, compound, and complex sentences",
      "Don't force complex grammar if it creates errors — accuracy matters more than complexity",
    ],
  },
  {
    id: 1102,
    topic_id: 11,
    title: "Common Grammar Errors to Avoid",
    structure:
      "Watch for: subject-verb agreement, article errors (a/an/the), countable vs uncountable nouns",
    example:
      "Incorrect: 'Governments should spend more money on infrastructures.' Correct: 'Governments should spend more money on infrastructure.'",
    tips: [
      "'Infrastructure', 'information', and 'research' are uncountable — never add 's'",
      "Spend your last 5 minutes proofreading specifically for articles and tense consistency",
    ],
  },

  // Topic 12 — Time Management
  {
    id: 1201,
    topic_id: 12,
    title: "The 20-Minute / 40-Minute Split",
    structure:
      "Task 1: 20 minutes total (5 min plan, 13 min write, 2 min check)\nTask 2: 40 minutes total (7 min plan, 30 min write, 3 min check)",
    example: null,
    tips: [
      "Do Task 2 first if you write essays faster than reports — it's worth twice the marks of Task 1",
      "Never spend more than 20 minutes on Task 1, even if it isn't finished",
    ],
  },
  {
    id: 1202,
    topic_id: 12,
    title: "Meeting the Word Count Without Padding",
    structure: "Task 1: minimum 150 words\nTask 2: minimum 250 words",
    example:
      "Aim for 170-190 words on Task 1 and 260-290 words on Task 2 — enough to develop ideas without rushing.",
    tips: [
      "Writing far over the word count wastes time and increases the risk of errors",
      "Writing under the word count results in an automatic Task Achievement penalty",
    ],
  },

  // Topic 13 — Common Mistakes
  {
    id: 1301,
    topic_id: 13,
    title: "Task Achievement Mistakes",
    structure: null,
    example: null,
    tips: [
      "Giving an opinion in Task 1, where none is required",
      "Not addressing every part of the Task 2 question",
      "Using memorised 'template' sentences that don't fit the specific question",
    ],
  },
  {
    id: 1302,
    topic_id: 13,
    title: "Coherence & Cohesion Mistakes",
    structure: null,
    example: null,
    tips: [
      "Starting every paragraph with the same linking word",
      "Writing overly long paragraphs with no clear main idea",
      "Jumping between ideas without a logical connection",
    ],
  },
  {
    id: 1303,
    topic_id: 13,
    title: "Lexical & Grammatical Mistakes",
    structure: null,
    example: null,
    tips: [
      "Using memorised 'big words' incorrectly to sound advanced",
      "Repeating the same vocabulary throughout the essay",
      "Spelling errors on common topic words",
    ],
  },

  // Topic 14 — Band Descriptors
  {
    id: 1401,
    topic_id: 14,
    title: "The Four Marking Criteria",
    structure:
      "Task Achievement / Response (25%)\nCoherence & Cohesion (25%)\nLexical Resource (25%)\nGrammatical Range & Accuracy (25%)",
    example: null,
    tips: [
      "All four criteria are weighted equally — don't focus only on vocabulary",
      "Your final score is the average of all four, rounded to the nearest 0.5",
    ],
  },
  {
    id: 1402,
    topic_id: 14,
    title: "What Band 7 vs Band 5 Looks Like",
    structure:
      "Band 5: basic ideas, frequent errors, limited vocabulary, simple sentences only\nBand 7: clear position, logical organisation, flexible vocabulary, a mix of accurate complex sentences",
    example: null,
    tips: [
      "Focus on clarity and accuracy over impressive-sounding words",
      "Consistent Band 7 performance across all four criteria beats being strong in only one",
    ],
  },

  // Topic 15 — Articles: A, An & The
  {
    id: 1501,
    topic_id: 15,
    title: "Level 1 (Basic): A vs An",
    structure:
      "Use 'a' before consonant SOUNDS\nUse 'an' before vowel SOUNDS (a, e, i, o, u)\nBase the choice on pronunciation, not spelling",
    example:
      "a university (sounds like 'yoo') / an hour (silent 'h') / a European trip / an MBA degree",
    tips: [
      "Judge by sound, not the letter — 'university' starts with a consonant sound so it takes 'a'",
      "'Hour', 'honest', and 'heir' start with a silent h, so they take 'an'",
      "Abbreviations follow the sound of the first letter when spoken aloud: 'an MBA', 'a NASA project'",
    ],
  },
  {
    id: 1502,
    topic_id: 15,
    title: "Level 1 (Basic): Using 'The' for Specific Things",
    structure:
      "Use 'the' when the reader knows exactly which one you mean:\n- Already mentioned: 'A man entered. The man sat down.'\n- Unique things: the sun, the internet, the government\n- Superlatives: the best, the most important\n- Ordinal numbers: the first, the second",
    example:
      "The government announced a new policy. The policy will take effect in January.",
    tips: [
      "Once a noun has been introduced with 'a/an', switch to 'the' on second mention",
      "Always use 'the' before superlatives (the highest, the most significant) in essays",
      "Use 'the' with specific groups: 'the elderly', 'the unemployed', 'the environment'",
    ],
  },
  {
    id: 1503,
    topic_id: 15,
    title: "Level 2 (Intermediate): Zero Article — When to Use No Article",
    structure:
      "No article before:\n- Plural/uncountable nouns used generally: 'Education is important.'\n- Most countries, cities, languages: 'France', 'Mandarin'\n- Meals, sports, academic subjects: 'breakfast', 'football', 'mathematics'",
    example:
      "Governments should invest more in education and healthcare.",
    tips: [
      "This is the error that costs candidates the most marks — don't add 'the' to general or uncountable nouns",
      "Compare: 'Education is important' (general) vs 'The education I received was excellent' (specific, so 'the' is correct)",
      "Countable nouns used generally in the plural also take no article: 'Children need discipline', not 'The children need discipline'",
    ],
  },
  {
    id: 1504,
    topic_id: 15,
    title: "Level 3 (Advanced): Article Exceptions",
    structure:
      "Exceptions to learn:\n- Rivers, oceans, mountain ranges: 'the Nile', 'the Alps' but 'Mount Everest' (no article)\n- Countries with plural or political names: 'the United States', 'the Netherlands', 'the UK'\n- Institutions: 'the University of Oxford' but 'Oxford University' (no article)",
    example:
      "The United Kingdom is separated from the rest of Europe by the English Channel.",
    tips: [
      "Learn these as fixed exceptions rather than trying to apply a single rule",
      "When unsure with proper nouns, no article is usually the safer default for less common names",
      "Proofread your writing specifically for article errors in your final few minutes",
    ],
  },

  // Topic 16 — Modal Verbs
  {
    id: 1601,
    topic_id: 16,
    title: "Level 1 (Basic): Can, Could, May, Might",
    structure:
      "Can = ability/possibility (present): 'Technology can solve this problem.'\nCould = past ability OR polite possibility: 'This could reduce pollution.'\nMay/Might = possibility, with 'may' slightly more certain than 'might'",
    example:
      "Renewable energy may reduce emissions, but it might not be enough on its own.",
    tips: [
      "Use 'can/could' for general possibility: 'This can lead to...' is more natural than 'This is able to lead to...'",
      "'May' and 'might' soften a claim — useful when you are not fully certain of an outcome",
      "Avoid overusing 'can' — vary with 'may', 'might', and 'could' to show grammatical range",
    ],
  },
  {
    id: 1602,
    topic_id: 16,
    title: "Level 2 (Core): Should vs Would vs Could",
    structure:
      "Should = recommendation/obligation: 'Governments should fund public transport.'\nWould = hypothetical result/politeness: 'This would reduce congestion.'\nCould = possibility/suggestion, weaker than should: 'One solution could be...'",
    example:
      "If governments invested more in cycling infrastructure, congestion would decrease significantly.",
    tips: [
      "'Should' states what you believe ought to happen — ideal for opinion and problem-solution essays",
      "'Would' is essential for conditional sentences (If X happened, Y would follow)",
      "'Could' is softer than 'should' — use it to suggest options rather than demand action",
      "Don't confuse 'would' with 'will' — 'would' is for hypothetical/conditional ideas, 'will' is for real future predictions",
    ],
  },
  {
    id: 1603,
    topic_id: 16,
    title: "Level 2 (Core): Must, Have To & Need To",
    structure:
      "Must = strong obligation/certainty: 'Governments must act now.'\nHave to = external obligation: 'Companies have to comply with regulations.'\nNeed to = necessity: 'We need to reduce emissions.'\nMustn't = prohibition; Don't have to = no obligation (a different meaning!)",
    example:
      "Companies must reduce their carbon emissions, or they will face penalties.",
    tips: [
      "'Must' sounds more forceful and written; 'have to' is more common in everyday and semi-formal contexts",
      "Remember: 'mustn't' means forbidden, but 'don't have to' means optional — these are NOT interchangeable",
      "Use 'must' sparingly, reserved for your strongest and most confident claims",
    ],
  },
  {
    id: 1604,
    topic_id: 16,
    title: "Level 3 (Advanced): Perfect Modal Forms",
    structure:
      "Modal + have + past participle, used for past hypotheticals or judgements:\nShould have + V3 = past mistake/regret\nCould have + V3 = past possibility that didn't happen\nWould have + V3 = hypothetical past result\nMight/May have + V3 = uncertain past possibility",
    example:
      "If the government had invested earlier, the crisis could have been avoided.",
    tips: [
      "Perfect modals are a higher-band grammar feature — use them in conditional (if) sentences about the past",
      "'Should have' is useful for discussing past policy failures: 'Authorities should have acted sooner.'",
      "Practise third conditional sentences (If + past perfect, ... would have + V3) for advanced essays",
    ],
  },

  // Topic 17 — Sentence Structure
  {
    id: 1701,
    topic_id: 17,
    title: "Level 1 (Basic): Simple Sentences",
    structure: "Subject + Verb + Object (one main clause, one idea)",
    example: "Pollution damages the environment.",
    tips: [
      "Master simple sentences first — clear and error-free beats complex and confusing",
      "Use simple sentences occasionally even in advanced writing, for emphasis",
    ],
  },
  {
    id: 1702,
    topic_id: 17,
    title: "Level 2 (Intermediate): Compound Sentences",
    structure:
      "Clause + coordinating conjunction (and, but, or, so, yet) + Clause",
    example:
      "Governments can raise taxes, but this may be unpopular with voters.",
    tips: [
      "Use a comma before the conjunction when joining two full clauses",
      "Don't overuse 'and' — vary with 'but', 'so', 'yet' to show different relationships between ideas",
    ],
  },
  {
    id: 1703,
    topic_id: 17,
    title: "Level 3 (Advanced): Complex Sentences",
    structure:
      "Independent clause + subordinating conjunction (because, although, since, while, if) + dependent clause",
    example:
      "Although renewable energy is expensive to install, it saves money in the long term.",
    tips: [
      "Starting a sentence with 'Although' or 'While' followed by a comma is a reliable high-scoring structure",
      "Relative clauses (who, which, that) also add complexity: 'Technology, which evolves rapidly, requires constant adaptation.'",
    ],
  },
  {
    id: 1704,
    topic_id: 17,
    title: "Level 4 (Expert): Conditional Sentences",
    structure:
      "Zero: If + present, present (general truth)\nFirst: If + present, will + V (real future)\nSecond: If + past, would + V (hypothetical present)\nThird: If + past perfect, would have + V3 (hypothetical past)",
    example:
      "If more people used public transport, air quality would improve.",
    tips: [
      "Second conditionals are extremely useful for essays discussing hypothetical solutions",
      "Mixing conditional forms incorrectly (e.g. 'If I would have known') is a common high-level error — avoid it",
      "Use third conditionals to critique past decisions or policies",
    ],
  },

  // Topic 18 — Prepositions
  {
    id: 1801,
    topic_id: 18,
    title: "Level 1 (Basic): Prepositions of Time & Place",
    structure:
      "IN: months, years, cities, countries ('in July', 'in London')\nON: days, dates ('on Monday', 'on 5 July')\nAT: precise times, specific points ('at 6pm', 'at the airport')",
    example: "The meeting is on Monday at 9am in the main office.",
    tips: [
      "Learn these as fixed collocations rather than translating from your first language",
      "'At night' but 'in the morning/afternoon/evening' — a common exception worth memorising",
    ],
  },
  {
    id: 1802,
    topic_id: 18,
    title: "Level 2 (Advanced): Dependent Prepositions",
    structure:
      "Common pairs: depend ON, result IN, contribute TO, consist OF, responsible FOR, interested IN, aware OF",
    example:
      "Rising temperatures contribute to the melting of polar ice caps.",
    tips: [
      "These pairings don't follow logical rules — learn them as fixed phrases through reading and practice",
      "Confusing 'affect' (verb) with 'effect' (noun) often creates preposition errors too — 'have an effect ON', 'this affects...'",
    ],
  },

  // Topic 19 — Punctuation
  {
    id: 1901,
    topic_id: 19,
    title: "Level 1 (Basic): Commas in Complex Sentences",
    structure:
      "Use a comma:\n- After an introductory clause: 'Although costs are high, benefits outweigh them.'\n- Before a coordinating conjunction joining two full clauses\n- To separate items in a list",
    example:
      "Because prices have risen, consumers are spending less, saving more, and avoiding debt.",
    tips: [
      "Don't use a comma to join two full sentences without a conjunction (comma splice) — use a semicolon or full stop instead",
      "No comma is needed when the subordinate clause comes after the main clause: 'Benefits outweigh costs although prices are high.'",
    ],
  },
  {
    id: 1902,
    topic_id: 19,
    title: "Level 2 (Advanced): Semicolons & Colons",
    structure:
      "Semicolon (;) joins two related independent clauses without a conjunction\nColon (:) introduces a list, explanation, or example",
    example:
      "The results were clear; pollution levels had doubled in a decade.",
    tips: [
      "Using a semicolon correctly signals strong control of punctuation — but only use it when both sides are full sentences",
      "A colon should be preceded by a complete sentence, not a sentence fragment",
    ],
  },

  // Topic 20 — Advanced Academic Writing Techniques
  {
    id: 2001,
    topic_id: 20,
    title: "Hedging Language (Avoiding Overgeneralisation)",
    structure:
      "Soften claims with: tend to, may, could, it is likely that, arguably, to some extent",
    example:
      "Excessive screen time may, to some extent, contribute to reduced attention spans in young people.",
    tips: [
      "Absolute claims ('always', 'never', 'everyone') are rarely true and weaken your argument — hedge instead",
      "Hedging shows academic maturity and is expected in higher-scoring writing",
    ],
  },
  {
    id: 2002,
    topic_id: 20,
    title: "Nominalisation (Turning Verbs into Nouns)",
    structure:
      "Verb → Noun: decide → decision, reduce → reduction, fail → failure, analyse → analysis",
    example:
      "Instead of: 'They failed to reduce emissions.' Write: 'Their failure to achieve emission reduction...'",
    tips: [
      "Nominalisation creates a more formal, academic tone typical of higher-band essays",
      "Don't overuse it — a mix of verb and noun forms keeps writing readable",
    ],
  },
  {
    id: 2003,
    topic_id: 20,
    title: "Formal Tone: Words to Avoid",
    structure:
      "Avoid in formal writing: contractions (don't → do not), phrasal verbs (find out → discover), vague words (a lot of → numerous/considerable), 'I think' (use 'It is often argued that')",
    example:
      "Instead of: 'A lot of people think it's a big problem.' Write: 'Numerous individuals consider it a significant issue.'",
    tips: [
      "Never use contractions in formal or academic writing",
      "Replace informal phrasal verbs with single-word academic equivalents where possible",
      "Avoid starting sentences with 'I think' repeatedly — use impersonal structures like 'It could be argued that...'",
    ],
  },
];

// ======================================================
// SERVICE FUNCTIONS
// ======================================================

export async function fetchStrategyTopics(): Promise<StrategyTopic[]> {
  return STRATEGY_TOPICS;
}

export async function fetchStrategiesByTopic(
  topicId: number
): Promise<StrategyItem[]> {
  return STRATEGY_ITEMS.filter((item) => item.topic_id === topicId);
}
