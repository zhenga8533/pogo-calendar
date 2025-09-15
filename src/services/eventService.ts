import { GITHUB_EVENTS_API_URL } from "../config/api";
import type { ApiResponse } from "../types/events";

/**
 * Fetches the raw event data from the GitHub Events API.
 *
 * @returns A promise that resolves to the raw API response.
 */
export const fetchEvents = async (): Promise<ApiResponse> => {
  const response = await fetch(GITHUB_EVENTS_API_URL);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  return data;
};
