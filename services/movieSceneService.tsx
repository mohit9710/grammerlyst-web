export interface MovieScene {
  id: number;
  movie: string;
  dialogue: string;
  thumbnail: string;
  duration: number;
  level: "Easy" | "Medium" | "Hard";
}

export const movieSceneService = {
  async getScenes(): Promise<MovieScene[]> {
    return [
      {
        id: 1,
        movie: "The Social Network",
        dialogue:
          "If you guys were the inventors of Facebook, you'd have invented Facebook.",
        thumbnail:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
        duration: 12,
        level: "Medium",
      },

      {
        id: 2,
        movie: "Interstellar",
        dialogue:
          "Do not go gentle into that good night.",
        thumbnail:
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
        duration: 9,
        level: "Easy",
      },

      {
        id: 3,
        movie: "The Dark Knight",
        dialogue:
          "Why so serious?",
        thumbnail:
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
        duration: 4,
        level: "Easy",
      },

      {
        id: 4,
        movie: "Whiplash",
        dialogue:
          "There are no two words in the English language more harmful than good job.",
        thumbnail:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
        duration: 13,
        level: "Hard",
      },
    ];
  },
};