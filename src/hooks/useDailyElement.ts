import { ChemicalElement } from "@/types/element";
import { getElementById } from "@/data/elements";

interface DailyElementResponse {
  success: boolean;
  data: {
    elementId: number;
    date: string;
  };
  error?: string;
}

interface DailyElementCache {
  elementId: number;
  date: string;
  element: ChemicalElement;
}

const CACHE_KEY = "daily-element-cache";

// Get cached daily element if it exists and is from today
function getCachedDailyElement(): DailyElementCache | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached) as DailyElementCache;
    const today = new Date().toISOString().split("T")[0];

    // Check if cached data is from today
    if (data.date === today) {
      return data;
    }

    // Remove outdated cache
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error("Error reading cached daily element:", error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

// Cache the daily element
function cacheDailyElement(cache: DailyElementCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching daily element:", error);
  }
}

// Fetch daily element from API
async function fetchDailyElementFromAPI(): Promise<DailyElementResponse> {
  const response = await fetch("/api/daily-element", {
    method: "GET",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_DAILY_ELEMENT_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch daily element: ${response.status}`);
  }

  return response.json();
}

// Main function to get today's daily element
export async function useDailyElement(): Promise<ChemicalElement | null> {
  try {
    // Check cache first
    const cached = getCachedDailyElement();
    if (cached) {
      console.log("Using cached daily element:", cached.element.name);
      return cached.element;
    }

    // Fetch from API
    console.log("Fetching daily element from API...");
    const response = await fetchDailyElementFromAPI();

    if (!response.success) {
      console.error("API returned error:", response.error);
      return null;
    }

    // Get element data from local constant
    const element = getElementById(response.data.elementId);
    if (!element) {
      console.error(
        `Element with ID ${response.data.elementId} not found in local data`
      );
      return null;
    }

    // Cache the result
    const cacheData: DailyElementCache = {
      elementId: response.data.elementId,
      date: response.data.date,
      element,
    };

    cacheDailyElement(cacheData);
    console.log("Daily element fetched and cached:", element.name);

    return element;
  } catch (error) {
    console.error("Error getting daily element:", error);
    return null;
  }
}
