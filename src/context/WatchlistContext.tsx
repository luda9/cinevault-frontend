import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import type { WatchlistItem, WatchlistQuery } from '../types/movie';

type WatchlistContextType = {
  watchlist: WatchlistItem[];
  isLoading: boolean;

  loadWatchlist: (params?: WatchlistQuery) => Promise<void>;
  isInWatchlist: (imdbId: string) => boolean;
  isWatched: (imdbId: string) => boolean;
  toggleWatchlist: (imdbId: string) => Promise<void>;
  updateWatchlistItem: (
    imdbId: string,
    data: { watched?: boolean; myRating?: number | null }
  ) => Promise<void>;
};

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWatchlist = async (params?: WatchlistQuery) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}api/watchlist`, { params });
      setWatchlist(res.data);
    } catch (err) {
      console.error('Failed to load watchlist', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadWatchlist();
  }, []);

  const isInWatchlist = (imdbId: string) =>
    watchlist.some(m => m.imdbId === imdbId);

  const isWatched = (imdbId: string) =>
    watchlist.find(m => m.imdbId === imdbId)?.watched ?? false;

  const toggleWatchlist = async (imdbId: string) => {
    const exists = isInWatchlist(imdbId);

    try {
      if (exists) {
        await axios.delete(`${apiUrl}api/watchlist/${imdbId}`);
        setWatchlist(prev => prev.filter(m => m.imdbId !== imdbId));
      } else {
        await axios.post(`${apiUrl}api/watchlist`, [{ imdbId }]);
        await loadWatchlist();
      }
    } catch (err) {
      console.error('Failed to toggle watchlist', err);
    }
  };

  const updateWatchlistItem = async (
    imdbId: string,
    data: { watched?: boolean; myRating?: number | null }
  ) => {
    try {
      const res = await axios.patch(
        `${apiUrl}api/watchlist/${imdbId}`,
        data
      );

      setWatchlist(prev =>
        prev.map(item =>
          item.imdbId === imdbId
            ? { ...item, ...res.data }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update watchlist item', err);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isLoading,
        loadWatchlist,
        isInWatchlist,
        isWatched,
        toggleWatchlist,
        updateWatchlistItem,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlistContext = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlistContext must be used inside WatchlistProvider');
  }
  return ctx;
};
