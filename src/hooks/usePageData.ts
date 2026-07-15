import { useCallback, useEffect, useState } from 'react';

interface UsePageDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching and managing page data with loading and error states
 * @param fetchFn - Async function that fetches the data
 * @param errorMessage - Optional custom error message
 * @returns Object containing data, loading, error states and refetch function
 */
export function usePageData<T>(
  fetchFn: () => Promise<T>,
  errorMessage: string = 'Failed to load data. Please try again later.'
): UsePageDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (!cancelled) setData(result);
      } catch (err) {
        console.error('Error loading data:', err);
        if (!cancelled) setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [errorMessage, fetchFn, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}
