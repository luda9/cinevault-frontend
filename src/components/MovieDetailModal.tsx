import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  Checkbox,
  Divider,
  IconButton,
} from "@mui/material";
import { Heart, Star, Film, ArrowLeftRight, X } from "lucide-react";
import type { MovieDetail } from "../types/movie";
import { useWatchlist } from "../hooks/useWatchlist";

interface MovieDetailModalProps {
  open: boolean;
  onClose: () => void;
  movieId: string | null;
}

const MovieDetailModal = ({
  open,
  onClose,
  movieId,
}: MovieDetailModalProps) => {
  const { toggleWatchlist, isInWatchlist, updateWatchlistItem, isWatched } = useWatchlist();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!open || !movieId) return;
    const loadMovie = async () => {
      setLoading(true);
      const res = await axios.get(`${apiUrl}api/movie/${movieId}`);
      setMovie(res.data);
      setLoading(false);
    };

    loadMovie();
  }, [apiUrl, movieId, open]);

  const inWatchlist = movie ? isInWatchlist(movie.imdbID) : false;
  const watched = movie ? isWatched(movie.imdbID) : false;

  const getRating = (movie: MovieDetail, source: string) =>
    movie.Ratings?.find((r) => r.Source === source)?.Value;

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid #343434",
          bgcolor: "#0B0B0D",
          color: "#fff",
        },
      }}
    >
      {movie && (
        <DialogContent sx={{ p: 0 }}>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
            {/* LEFT COLUMN */}
            <Box
              sx={{
                width: { md: 300 },
                p: 3,
                borderRight: { md: "1px solid rgba(255,255,255,0.08)" },
              }}
            >
              {/* Close */}
              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "grey.400",
                }}
              >
                <X size={18} />
              </IconButton>

              {/* Poster */}
              <Box
                sx={{
                  aspectRatio: "2 / 3",
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                  bgcolor: "background.paper",
                }}
              >
                {movie.Poster ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Film size={48} />
                  </Box>
                )}
              </Box>

              {/* Actions */}
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={
                    <Heart
                      style={{ fill: inWatchlist ? "currentColor" : "none" }}
                      size={16}
                      fill="currentColor"
                    />
                  }
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!movie) return;
                    toggleWatchlist(movie.imdbID);
                  }}
                >
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </Button>

                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    onChange={(e) =>
                      updateWatchlistItem(movie.imdbID, {
                      watched: e.target.checked,
                      })
                    }
                    checked={watched} />
                  <Typography fontSize={14}>Mark as Watched</Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowLeftRight size={16} />}
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  Compare
                </Button>
              </Box>
            </Box>

            {/* RIGHT COLUMN */}
            <Box flex={1} p={4}>
              {/* Title */}
              <Typography fontSize={30} fontWeight={800} mb={1}>
                {movie.Title}
              </Typography>

              {/* Meta */}
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                <Chip label={movie.Year} />
                <Chip label={movie.Rated} />
                <Chip label={movie.Runtime} />
                <Chip label={movie.Type.toUpperCase()} color="error" />
              </Box>

              {/* Genres */}
              <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                {movie.Genre?.split(", ").map((g) => (
                  <Chip key={g} label={g} variant="outlined" />
                ))}
              </Box>

              {/* Ratings */}
              <Box display="flex" gap={4} alignItems="center" mb={3}>
                {movie.imdbRating && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Star size={18} fill="#f5c518" />
                    <Typography fontWeight={700}>{movie.imdbRating}</Typography>
                    <Typography color="grey.400">IMDb</Typography>
                  </Box>
                )}

                {getRating(movie, "Rotten Tomatoes") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>🍅</Typography>
                    <Typography fontWeight={700}>
                      {getRating(movie, "Rotten Tomatoes")}
                    </Typography>
                    <Typography color="grey.400">Rotten Tomatoes</Typography>
                  </Box>
                )}

                {movie.Metascore && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "#fff",
                        px: 1,
                        borderRadius: 0.5,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      M
                    </Box>
                    <Typography fontWeight={700}>{movie.Metascore}</Typography>
                    <Typography color="grey.400">Metacritic</Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Plot */}
              <Typography fontWeight={700} mb={1}>
                Plot
              </Typography>
              <Typography color="grey.400" fontSize={14} mb={3}>
                {movie.Plot}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Info Grid */}
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                gap={3}
                fontSize={14}
              >
                <Box>
                  <Typography fontWeight={600}>Director</Typography>
                  <Typography color="grey.400">{movie.Director}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Writers</Typography>
                  <Typography color="grey.400">{movie.Writer}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Cast</Typography>
                  <Typography color="grey.400">{movie.Actors}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Language</Typography>
                  <Typography color="grey.400">{movie.Language}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Country</Typography>
                  <Typography color="grey.400">{movie.Country}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Release Date</Typography>
                  <Typography color="grey.400">{movie.Released}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Box Office</Typography>
                  <Typography color="grey.400">{movie.BoxOffice}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight={600}>Awards</Typography>
                  <Typography color="grey.400">{movie.Awards}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default MovieDetailModal;
