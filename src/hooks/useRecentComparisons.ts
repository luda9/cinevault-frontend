import { useEffect, useState } from "react";

export const useRecentComparisons = () => {
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}api/comparisons/recent`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch recent comparisons");
        }

        const data = await res.json();

        setComparisons(data.comparisons ?? []);
      } catch (err) {
        console.error(err);
        setComparisons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return { comparisons, loading };
};
