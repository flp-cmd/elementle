import { useState, useEffect } from "react";
import { ChemicalElement, GuessResult } from "@/types/element";

interface DailyGuessesCache {
  guesses: Array<{ element: ChemicalElement; results: GuessResult[] }>;
  gameWon: boolean;
  date: string;
}

const GUESSES_CACHE_KEY = "daily-guesses-cache";

// Get cached guesses if they exist and are from today
function getCachedGuesses(): DailyGuessesCache | null {
  try {
    const cached = localStorage.getItem(GUESSES_CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached) as DailyGuessesCache;
    const today = new Date().toISOString().split("T")[0];

    // Check if cached data is from today
    if (data.date === today) {
      return data;
    }

    // Remove outdated cache
    localStorage.removeItem(GUESSES_CACHE_KEY);
    return null;
  } catch (error) {
    console.error("Error reading cached guesses:", error);
    localStorage.removeItem(GUESSES_CACHE_KEY);
    return null;
  }
}

// Cache the current guesses
function cacheGuesses(
  guesses: Array<{ element: ChemicalElement; results: GuessResult[] }>,
  gameWon: boolean
): void {
  try {
    const today = new Date().toISOString().split("T")[0];
    const cacheData: DailyGuessesCache = {
      guesses,
      gameWon,
      date: today,
    };
    localStorage.setItem(GUESSES_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching guesses:", error);
  }
}

// Clear cached guesses (useful for testing)
export function clearCachedGuesses(): void {
  try {
    localStorage.removeItem(GUESSES_CACHE_KEY);
  } catch (error) {
    console.error("Error clearing cached guesses:", error);
  }
}

export function useGuessesStorage() {
  const [guesses, setGuesses] = useState<
    Array<{ element: ChemicalElement; results: GuessResult[] }>
  >([]);
  const [gameWon, setGameWon] = useState(false);

  // Load cached guesses on component mount
  useEffect(() => {
    const cachedData = getCachedGuesses();
    if (cachedData) {
      setGuesses(cachedData.guesses);
      setGameWon(cachedData.gameWon);
    }
  }, []);

  // Save guesses to localStorage whenever they change
  useEffect(() => {
    if (guesses.length > 0 || gameWon) {
      cacheGuesses(guesses, gameWon);
    }
  }, [guesses, gameWon]);

  return {
    guesses,
    setGuesses,
    gameWon,
    setGameWon,
  };
}
