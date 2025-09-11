import { format } from "date-fns";
import { useEffect, useState } from "react";
import { GITHUB_LAST_UPDATED_API_URL } from "../config/api";

/**
 * Custom hook to fetch and manage the last updated time of a resource from GitHub.
 *
 * @returns A custom hook to fetch and manage the last updated time of a resource from GitHub.
 */
export function useLastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch the last updated time when the component mounts.
  useEffect(() => {
    const controller = new AbortController();

    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(GITHUB_LAST_UPDATED_API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const lastCommitDate = new Date(data[0].commit.committer.date);
          const formattedDate = format(lastCommitDate, "MMM d, h:mm a");
          setLastUpdated(formattedDate);
        } else {
          // This case occurs if the file has no commit history.
          setLastUpdated("N/A");
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted for useLastUpdated.");
          return;
        }
        setError("Could not load update time.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastUpdated();

    return () => {
      controller.abort();
    };
  }, []);

  return { lastUpdated, loading, error };
}
