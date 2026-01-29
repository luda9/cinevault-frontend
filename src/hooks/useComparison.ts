import { useState } from 'react';
import axios from 'axios';

type ComparisonResult = {
  movies: any[];
  comparison: any;
  movieCount: number;
  comparedAt: string;
};

export const useComparison = (initial: string[] = []) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedIds, setSelectedIds] = useState<string[]>(initial);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMovie = (imdbId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(imdbId)) return prev;
      if (prev.length >= 5) return prev;
      return [...prev, imdbId];
    });
  };

  const removeMovie = (imdbId: string) => {
    setSelectedIds(prev => prev.filter(id => id !== imdbId));
  };

  const clear = () => {
    setSelectedIds([]);
    setResult(null);
    setError(null);
  };

  const compare = async () => {
    if (selectedIds.length < 2) {
      setError('Select at least 2 movies to compare');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.post(`${apiUrl}api/compare`, {
        imdbIds: selectedIds,
      });

      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Comparison failed');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedIds([]);
    setResult(null);
    setError(null);
  };

  return {
    selectedIds,
    addMovie,
    removeMovie,
    clear,
    compare,
    result,
    isLoading,
    error,
    reset
  };
};
