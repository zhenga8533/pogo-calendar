import { useEffect, useState } from "react";

const GITHUB_API_URL =
  "https://api.github.com/repos/zhenga8533/leak-duck/commits?sha=data&path=events.json&page=1&per_page=1";

/**
 * Custom hook to fetch the last updated time of the events data from GitHub.
 *
 * @returns Last updated time as a formatted string, loading state, and error state.
 */
export function useLastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the last updated time from GitHub API on component mount
  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch update time");
        }
        const data = await response.json();
        if (data && data.length > 0) {
          const lastCommitDate = new Date(data[0].commit.committer.date);
          const formattedDate = lastCommitDate.toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
          setLastUpdated(formattedDate);
        } else {
          setLastUpdated("N/A");
        }
      } catch (err) {
        setError("Could not load update time.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastUpdated();
  }, []);

  return { lastUpdated, loading, error };
}
