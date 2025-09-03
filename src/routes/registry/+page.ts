import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch("/api/registry/amazon");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to load registry data");
    }

    return {
      amazonProducts: data.products || [],
      cached: data.cached || false,
      timestamp: data.timestamp || Date.now(),
    };
  } catch (error) {
    console.error("Failed to load registry:", error);
    return {
      amazonProducts: [],
      cached: false,
      timestamp: Date.now(),
      error: "Failed to load registry items",
    };
  }
};
