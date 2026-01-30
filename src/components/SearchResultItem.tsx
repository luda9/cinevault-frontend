import { useState } from 'react'
import { Heart, Film, Tv } from 'lucide-react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import type { MovieDetail } from '../types/movie';
import { useWatchlist } from '../hooks/useWatchlist';

interface SearchResultItemProps {
  movie: MovieDetail;
  onOpenMovie: (id: string) => void;
}

const SearchResultItem = ({ movie, onOpenMovie }: SearchResultItemProps) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.imdbID);
  const [imageError, setImageError] = useState(false);

  const TypeIcon = movie.Type === 'series' ? Tv : Film;

  return (
    <Box
      width='100%'
      display="flex"
      alignItems="center"
      justifyContent='space-between'
      gap={2}
      p={1.5}
      borderRadius={1}
      onClick={() => onOpenMovie(movie.imdbID)}
    >
      <div style={{display:'flex', gap:15}}>

        {/* Poster */}
        <Box
          width={48}
          height={64}
          flexShrink={0}
          borderRadius={1}
          overflow="hidden"
          bgcolor="background.paper"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {movie.Poster && movie.Poster !== 'N/A' && !imageError ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <Film size={20} />
          )}
        </Box>

        {/* Info */}
        <Box flex={1} minWidth={0}>
          <Typography fontSize={14} fontWeight={600} noWrap>
            {movie.Title}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Typography fontSize={12} color="text.secondary">
              {movie.Year}
            </Typography>

            <Chip
              size="small"
              icon={<TypeIcon size={14} />}
              label={movie.Type}
              sx={{ textTransform: 'capitalize', height: 20 }}
            />
          </Box>
        </Box>
      </div>

      {/* Watchlist */}
      <IconButton
        size="small"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWatchlist(movie.imdbID);
        }}
        sx={{
          color: inWatchlist ? 'primary.main' : 'text.secondary',
          '&:hover': {
            color: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <Heart
          size={16}
          style={{ fill: inWatchlist ? 'currentColor' : 'none' }}
        />
      </IconButton>
    </Box>
  );
};

export default SearchResultItem;
