import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeftRight,
  Star,
  Film,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { useRef } from "react";

const CARD_WIDTH = 220;
const SCROLL_AMOUNT = CARD_WIDTH * 2;

const RecentComparisons = () => {
  const { comparisons, loading } = useRecentComparisons();
  const hasComparisons = comparisons.length > 0;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 2 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Recent Comparisons
            </Typography>
            <Typography color="text.secondary" fontSize={14} mt={0.5}>
              {hasComparisons
                ? "Your latest movie comparisons"
                : "Compare movies side by side"}
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/compare"
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
            Compare
          </Button>
        </Box>

        {/* Loading */}
        {loading && (
          <Box textAlign="center" py={5}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Empty state */}
        {!loading && !hasComparisons && (
          <Paper
            sx={{
              py: 6,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <ArrowLeftRight size={40} />
            <Typography fontWeight={600} mt={2}>
              No comparisons yet
            </Typography>
            <Typography color="text.secondary" fontSize={13} mt={1}>
              Start comparing movies to see them here
            </Typography>
          </Paper>
        )}

        {/* Carousel */}
        {!loading && hasComparisons && (
          <Box sx={{ position: "relative" }}>
            {/* Left Arrow */}
            <IconButton
              onClick={scrollLeft}
              sx={{
                position: "absolute",
                left: -12,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "primary.main",
                boxShadow: 2,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>

            {/* Right Arrow */}
            <IconButton
              onClick={scrollRight}
              sx={{
                position: "absolute",
                right: -12,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "primary.main",
                boxShadow: 2,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ChevronRight size={20} />
            </IconButton>

            {/* Scroll container */}
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                scrollBehavior: "smooth",
                pb: 1,
                px: 1,
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: 3,
                },
              }}
            >
              {comparisons.slice(0, 10).map((comparison) => {
                const moviesToShow = comparison.movies.slice(0, 2);
                const extraCount =
                  comparison.movies.length - moviesToShow.length;

                return (
                  <Card
                    key={comparison.id}
                    component={Link}
                    to={`/compare?ids=${comparison.movies
                      .map((m: any) => m.imdbID)
                      .join(",")}&mode=view`}
                    sx={{
                      minWidth: CARD_WIDTH,
                      p: 1.5,
                      borderRadius: 2,
                      textDecoration: "none",
                      color: "inherit",
                      flexShrink: 0,
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {/* Movies */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {moviesToShow.map((movie: any, i: number) => (
                        <Box key={i} sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              aspectRatio: "2 / 3",
                              borderRadius: 1.5,
                              overflow: "hidden",
                              backgroundColor: "background.paper",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {movie?.Poster ? (
                              <CardMedia
                                component="img"
                                image={movie.Poster}
                                alt={movie.Title}
                              />
                            ) : (
                              <Film size={20} />
                            )}
                          </Box>

                          <Typography
                            mt={0.5}
                            fontSize={12}
                            fontWeight={600}
                            noWrap
                            textAlign="center"
                          >
                            {movie?.Title}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 0.3,
                              fontSize: 11,
                              color: "text.secondary",
                            }}
                          >
                            <Star size={11} fill="currentColor" />
                            <span>{movie?.imdbRating || "N/A"}</span>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {extraCount > 0 && (
                      <Box textAlign="center" mt={1}>
                        <Chip
                          size="small"
                          label={`+${extraCount} more`}
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RecentComparisons;
