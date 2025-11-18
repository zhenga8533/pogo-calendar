/**
 * Generic data fetcher factory function
 * Creates a type-safe fetch function for a given URL
 *
 * @template T - The expected response type
 * @param url - The URL to fetch data from
 * @returns An async function that fetches and returns typed data
 */
export const createDataFetcher =
  <T>(url: string) =>
  async (): Promise<T> => {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  };
