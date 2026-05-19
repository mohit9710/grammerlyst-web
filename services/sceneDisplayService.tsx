export interface SceneCharacter {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

export interface SceneScenario {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  thumbnail: string;
  intro: string;
  characters: SceneCharacter[];
}

export const sceneDisplayService = {
  async getScenes(): Promise<
    SceneScenario[]
  > {
    return [
      {
        id: 1,
        title: "Coffee Shop Order",
        description:
          "Order coffee and continue conversation naturally.",
        category: "Daily Life",
        difficulty: "Easy",
        thumbnail:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",

        intro:
          "Welcome! What would you like to order today?",

        characters: [
          {
            id: 1,
            name: "Emma",
            role: "Barista",
            avatar:
              "https://randomuser.me/api/portraits/women/44.jpg",
          },
        ],
      },

      {
        id: 2,
        title: "Job Interview",
        description:
          "Practice speaking confidently during interviews.",

        category: "Professional",
        difficulty: "Hard",

        thumbnail:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",

        intro:
          "Tell me about yourself and your experience.",

        characters: [
          {
            id: 2,
            name: "Michael",
            role: "HR Manager",
            avatar:
              "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },

      {
        id: 3,
        title: "Airport Conversation",
        description:
          "Handle airport check-ins and travel situations.",

        category: "Travel",
        difficulty: "Medium",

        thumbnail:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",

        intro:
          "May I see your passport and boarding pass?",

        characters: [
          {
            id: 3,
            name: "Sophia",
            role: "Airport Officer",
            avatar:
              "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ],
      },
    ];
  },

  async generateReply(
    userSpeech: string,
    characterName: string
  ) {
    const replies = [
      `Interesting response. Can you explain more?`,
      `That's great. What happened next?`,
      `I understand. How did you feel about it?`,
      `Good answer. Let's continue the conversation.`,
    ];

    return replies[
      Math.floor(
        Math.random() * replies.length
      )
    ];
  },
};