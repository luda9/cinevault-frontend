import { useEffect, useState } from 'react';
import axios from 'axios';

export const useMoviePreviews = (ids: string[]) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) {
      setMovies([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const res = await Promise.all(
          ids.map(id => axios.get(`${apiUrl}api/movie/${id}`))
        );
        setMovies(res.map(r => r.data));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ids.join(',')]);

  return { movies, loading };
};
