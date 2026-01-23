export interface SpellingWord {
  id: number;
  wrong_version: string;
  right_version: string;
  difficulty: string;
}

export interface ScrambleWord {
  id: number;
  original_word: string;
  scrambled_word: string;
  hint: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/games";

export const gameService = {
  /**
   * Fetches random spelling challenges from the FastAPI backend
   */
  async getSpellingChallenges(limit: number = 1): Promise<SpellingWord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/spelling`);
      if (!response.ok) {
        throw new Error("Failed to fetch spelling challenges");
      }
      return await response.json();
    } catch (error) {
      console.error("GameService Error:", error);
      return [];
    }
  },

  /**
   * Fetches sentences for the Sentence Sprinter game
   */
  async getSentences(limit: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sentences?limit=${limit}`);
      const data = await response.json();
      return data.map((s: any) => s.content);
    } catch (error) {
      console.error("GameService Error:", error);
      return [];
    }
  },

  // Inside gameService...
    async getScrambleChallenges(limit: number = 5): Promise<ScrambleWord[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/scramble`);
        return await response.json();
    } catch (error) {
        console.error("Scramble fetch error:", error);
        return [];
    }
    }
};