import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  GridLegacy as Grid,
} from '@mui/material';
import { ChevronRight, Film, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useWatchlist } from '../hooks/useWatchlist'
import MovieDetailModal from './MovieDetailModal'

const WachtlistPreview = () => {
  const { watchlist } = useWatchlist();
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie: string) => {
    setSelectedMovieId(movie);
    setIsModalOpen(true);
  };

  const stats = {
    total: watchlist.length,
    unwatched: watchlist.filter(m => !m.watched).length,
  };

  const previewWatchlist = watchlist.slice(0, 4);

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              My Watchlist
            </Typography>
            <Typography color="text.secondary" mt={1}>
              {stats.total} movies • {stats.unwatched} unwatched
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/watchlist"
            variant="contained"
            color="primary"
            endIcon={<ChevronRight size={18} />}
            sx={{
              borderRadius: 999,
              px: { xs: 2.5, md: 3.5 },
              py: { xs: 1, md: 1.5 },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View All
          </Button>
        </Box>

        {/* Grid */}
        {watchlist.length > 0 ? (
          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            {previewWatchlist.map((movie) => (
              <Grid
                item
                key={movie.imdbId}
                xs={6}
                sm={4}
                md={4}
                lg={2}
              >
                <Card
                  onClick={() => handleMovieClick(movie.imdbId)}
                  sx={{
                    position: 'relative',
                    aspectRatio: '2 / 3',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 2,
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Poster */}
                  {movie.poster ? (
                    <CardMedia
                      component="img"
                      image={movie.poster}
                      alt={movie.title}
                      sx={{ height: '100%' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.paper',
                      }}
                    >
                      <Film size={48} />
                    </Box>
                  )}

                  {/* Hover Overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      background:
                        'linear-gradient(to top, rgba(11,11,13,0.95), rgba(11,11,13,0.6), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <Box sx={{ p: 1.5 }}>
                      <Typography
                        fontSize={13}
                        fontWeight={600}
                        noWrap
                      >
                        {movie.title}
                      </Typography>
                      <Box
                        sx={{
                          mt: 0.5,
                          display: 'flex',
                          gap: 1,
                          fontSize: 12,
                          color: 'text.secondary',
                        }}
                      >
                        <span>{movie.year}</span>
                        {movie.watched && (
                          <span style={{ color: '#E50914' }}>
                            ✓ Watched
                          </span>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Watchlist badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(11,11,13,0.8)',
                      backdropFilter: 'blur(6px)',
                      color: 'primary.main',
                    }}
                  >
                    <Heart size={14} style={{ fill: 'currentColor' }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty state */
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              backgroundColor: 'background.paper',
              borderRadius: 3,
            }}
          >
            <Film size={48} />
            <Typography fontWeight={600} mt={2}>
              Your watchlist is empty
            </Typography>
            <Typography color="text.secondary" fontSize={14} mt={1}>
              Search for movies and add them to your watchlist
            </Typography>
          </Box>
        )}
      </Box>
      <MovieDetailModal
        movieId={selectedMovieId}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMovieId('');
        }}
      />
    </Box>
  );
};

export default WachtlistPreview;
