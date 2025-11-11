import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { GITHUB_LAST_UPDATED_API_URL } from '../config/api';

/**
 * Custom hook to fetch and manage the last updated time of a resource from GitHub.
 *
 * @returns A custom hook to fetch and manage the last updated time of a resource from GitHub.
 */
export function useLastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GITHUB_LAST_UPDATED_API_URL, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const lastCommitDate = new Date(data[0].commit.committer.date);
        const formattedDate = format(lastCommitDate, 'MMM d, h:mm a');
        setLastUpdated(formattedDate);
      } else {
        setLastUpdated('N/A');
      }
    } catch (err: any) {
      setError('Could not load update time.');
      console.error(err);
      throw err; // Re-throw error for the caller to handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { lastUpdated, loading, error, refetch };
}
