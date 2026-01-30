import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  LinearProgress,
  FormControl,
  MenuItem,
  Select,
  Card,
  CardMedia,
  IconButton,
  Checkbox,
} from "@mui/material";
import {
  Search,
  Star,
  Clock,
  Film,
  Info,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../hooks/useWatchlist";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { WatchlistItem } from "../types/movie";
import { useNavigate } from "react-router-dom";

const WatchlistPage = () => {
  const navigate = useNavigate();
  const { watchlist, loadWatchlist, updateWatchlistItem, toggleWatchlist } =
    useWatchlist();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "movie" | "series" | "episode"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "watched" | "unwatched"
  >("all");
  const [sortBy, setSortBy] = useState("dateAdded-desc");
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [hoverRating, setHoverRating] = useState<Record<string, number | null>>(
    {},
  );

  const handleCompare = (imdbId: string) => {
    navigate("/compare", {
      state: {
        initialIds: [imdbId],
      },
    });
  };

  useEffect(() => {
    loadWatchlist({
      filter: typeFilter !== "all" ? typeFilter : undefined,
      watched: statusFilter === "all" ? undefined : statusFilter === "watched",
      sort: sortBy.split("-")[0],
      order: sortBy.split("-")[1] as "asc" | "desc",
    });
  }, [typeFilter, statusFilter, sortBy]);

  const filteredWatchlist = useMemo(() => {
    if (!debouncedSearch) return watchlist;
    const q = debouncedSearch.toLowerCase();
    return watchlist.filter(
      (m) =>
        m.title.toLowerCase().includes(q) || m.year?.toString().includes(q),
    );
  }, [watchlist, debouncedSearch]);

  const ratedMovies = useMemo(
    () => watchlist.filter((m) => m.myRating != null),
    [watchlist],
  );

  const stats = useMemo(() => {
    const total = watchlist.length;
    const watched = watchlist.filter((m) => m.watched).length;
    const unwatched = watchlist.filter((m) => !m.watched).length;
    const avgRating =
      ratedMovies.length === 0
        ? 0
        : (
            ratedMovies.reduce((sum, m) => sum + (m.myRating ?? 0), 0) /
            ratedMovies.length
          ).toFixed(1);
    const movies = watchlist.filter((m) => m.type === "movie");
    const series = watchlist.filter((m) => m.type === "series");
    const totalMinutes = movies.reduce((sum, m) => {
      const minutes = m.runtime
        ? Number(m.runtime.match(/(\d+)/)?.[1] ?? 0)
        : 0;
      return sum + minutes;
    }, 0);
    return {
      total,
      watched,
      unwatched,
      avgRating,
      movies: movies.length,
      series: series.length,
      totalHours: (totalMinutes / 60).toFixed(1),
    };
  }, [watchlist, ratedMovies]);

  const toggleFlip = (imdbId: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.has(imdbId) ? next.delete(imdbId) : next.add(imdbId);
      return next;
    });
  };

  const renderStars = (movie: WatchlistItem) => {
    const currentHover = hoverRating[movie.imdbId];
    const ratingToShow = currentHover ?? movie.myRating ?? 0;

    return (
      <Stack direction="row" spacing={0.5}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= ratingToShow;

          return (
            <Star
              key={star}
              size={18}
              style={{
                cursor: "pointer",
                transition: "color 0.15s",
                color: isActive ? "#f5c518" : "#666",
              }}
              fill={isActive ? "#f5c518" : "none"}
              onMouseEnter={() =>
                setHoverRating((prev) => ({ ...prev, [movie.imdbId]: star }))
              }
              onMouseLeave={() =>
                setHoverRating((prev) => ({ ...prev, [movie.imdbId]: null }))
              }
              onClick={() =>
                updateWatchlistItem(movie.imdbId, { myRating: star })
              }
            />
          );
        })}
      </Stack>
    );
  };

  /* ---------------- GRID VIEW ---------------- */

  const renderGridView = () => (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(3, 1fr)",
        md: "repeat(4, 1fr)",
        lg: "repeat(6, 1fr)",
      }}
      gap={2}
    >
      {filteredWatchlist.map((movie) => {
        const isFlipped = flippedCards.has(movie.imdbId);

        return (
          <Box
            key={movie.imdbId}
            sx={{
              position: "relative",
              aspectRatio: "2 / 3",
              perspective: "1000px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* ---------- FRONT ---------- */}
              <Card
                sx={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {movie.poster ? (
                  <CardMedia
                    component="img"
                    image={movie.poster}
                    alt={movie.title}
                    sx={{ height: "100%" }}
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

                {/* Front actions */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "space-around",
                    p: 1,
                    background:
                      "linear-gradient(to top, rgba(11,11,13,0.9), transparent)",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => toggleFlip(movie.imdbId)}
                  >
                    <Info size={16} />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleCompare(movie.imdbId)}
                  >
                    <ArrowLeftRight size={16} />
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!movie) return;
                      toggleWatchlist(movie.imdbId);
                    }}
                    size="small"
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Card>

              {/* ---------- BACK ---------- */}
              <Card
                sx={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography fontWeight={700} mb={0.5}>
                  {movie.title}
                </Typography>
                <Typography fontSize={13} color="text.secondary" mb={1}>
                  {movie.year} • {movie.type}
                </Typography>

                {movie.imdbRating && (
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Star size={18} fill="#f5c518" />
                    <Typography fontSize={13}>
                      {movie.imdbRating} IMDb
                    </Typography>
                  </Stack>
                )}

                <Box mb={1}>{renderStars(movie)}</Box>

                {/* Watched */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={movie.watched}
                    onChange={(e) =>
                      updateWatchlistItem(movie.imdbId, {
                        watched: e.target.checked,
                      })
                    }
                  />
                  <Typography fontSize={14}>
                    {movie.watched ? "Wached" : "Mark as Watched"}
                  </Typography>
                </Box>

                <Box mt="auto" display="flex" justifyContent="space-between">
                  <IconButton
                    size="small"
                    onClick={() => toggleFlip(movie.imdbId)}
                  >
                    <Info size={16} />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleCompare(movie.imdbId)}
                  >
                    <ArrowLeftRight size={16} />
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!movie) return;
                      toggleWatchlist(movie.imdbId);
                    }}
                    size="small"
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Card>
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  /* ---------------- LIST VIEW ---------------- */

  const renderListView = () => (
    <Stack spacing={2}>
      {filteredWatchlist.map((movie) => (
        <Paper
          key={movie.imdbId}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 2,
          }}
        >
          {/* Poster */}
          <Box
            sx={{
              width: 60,
              height: 90,
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
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
                <Film size={24} />
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box flex={1} minWidth={0}>
            <Typography fontWeight={600} noWrap>
              {movie.title}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              {movie.year} • {movie.type}
            </Typography>
          </Box>

          {/* Status */}
          <Typography fontSize={12}>
            {movie.watched ? "Watched" : "Unwatched"}
          </Typography>

          {/* Actions (always visible) */}
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              onClick={() => console.log("View info", movie.imdbId)}
            >
              <Info size={16} />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => console.log("Compare", movie.imdbId)}
            >
              <ArrowLeftRight size={16} />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => console.log("Delete", movie.imdbId)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Stack>
  );

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Navbar />

      <Box
        component="main"
        sx={{ pt: 12, pb: 6, maxWidth: 1400, mx: "auto", px: 2 }}
      >
        <Typography variant="h4" fontWeight={700} mb={3}>
          My Watchlist ({watchlist.length})
        </Typography>
        <Stack direction="row" spacing={2} mb={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search watchlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />

          {/* <ToggleButtonGroup
            exclusive
            value={viewMode}
            onChange={(_, v) => v && setViewMode(v)}
          >
            <ToggleButton value="grid">
              <GridIcon size={18} />
            </ToggleButton>
            <ToggleButton value="list">
              <ListIcon size={18} />
            </ToggleButton>
          </ToggleButtonGroup> */}
        </Stack>
        {/* Stats */}{" "}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(6, 1fr)",
          }}
          gap={2}
          mb={4}
        >
          {" "}
          <Paper sx={{ p: 2 }}>
            {" "}
            <Typography fontSize={24} fontWeight={700} color="primary.main">
              {" "}
              {stats.total}{" "}
            </Typography>{" "}
            <Typography fontSize={13} color="text.secondary">
              {" "}
              Total{" "}
            </Typography>{" "}
          </Paper>{" "}
          <Paper sx={{ p: 2 }}>
            {" "}
            <Typography fontSize={24} fontWeight={700} color="success.main">
              {" "}
              {stats.watched}{" "}
            </Typography>{" "}
            <Typography fontSize={13} color="text.secondary">
              {" "}
              Watched{" "}
            </Typography>{" "}
          </Paper>{" "}
          <Paper sx={{ p: 2 }}>
            {" "}
            <Typography fontSize={24} fontWeight={700} color="warning.main">
              {" "}
              {stats.unwatched}{" "}
            </Typography>{" "}
            <Typography fontSize={13} color="text.secondary">
              {" "}
              Unwatched{" "}
            </Typography>{" "}
          </Paper>{" "}
          <Paper sx={{ p: 2 }}>
            {" "}
            <Stack direction="row" spacing={1} alignItems="center">
              {" "}
              <Star color="#E50914" fill="#E50914" size={16} />{" "}
              <Typography fontSize={24} fontWeight={700}>
                {" "}
                {stats.avgRating}{" "}
              </Typography>{" "}
            </Stack>{" "}
            <Typography fontSize={13} color="text.secondary">
              {" "}
              Avg Rating{" "}
            </Typography>{" "}
          </Paper>{" "}
          <Paper sx={{ p: 2 }}>
            {" "}
            <Stack direction="row" spacing={1} alignItems="center">
              {" "}
              <Clock size={16} />{" "}
              <Typography fontSize={24} fontWeight={700}>
                {" "}
                {stats.totalHours}h{" "}
              </Typography>{" "}
            </Stack>{" "}
            <Typography fontSize={13} color="text.secondary">
              {" "}
              Total Time{" "}
            </Typography>{" "}
          </Paper>{" "}
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {" "}
            <Box>
              {" "}
              <Typography fontSize={13} mb={1}>
                {" "}
                Movies: {stats.movies} | Series: {stats.series}{" "}
              </Typography>{" "}
              <LinearProgress
                variant="determinate"
                value={(stats.movies / Math.max(stats.total, 1)) * 100}
              />{" "}
            </Box>{" "}
          </Paper>{" "}
        </Box>
        {/* Filters */}{" "}
        <Box display="flex" flexWrap="wrap" gap={1.5} mb={4}>
          {" "}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            {" "}
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              displayEmpty
            >
              {" "}
              <MenuItem value="all">All Types</MenuItem>{" "}
              <MenuItem value="movie">Movies</MenuItem>{" "}
              <MenuItem value="series">Series</MenuItem>{" "}
              <MenuItem value="episode">Episodes</MenuItem>{" "}
            </Select>{" "}
          </FormControl>{" "}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            {" "}
            <Select
              onChange={(e) => setStatusFilter(e.target.value as any)}
              value={statusFilter}
              displayEmpty
            >
              {" "}
              <MenuItem value="all">All Status</MenuItem>{" "}
              <MenuItem value="watched">Watched</MenuItem>{" "}
              <MenuItem value="unwatched">Unwatched</MenuItem>{" "}
            </Select>{" "}
          </FormControl>{" "}
          {/* <FormControl size="small" sx={{ minWidth: 130 }}>
            {" "}
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
            >
              {" "}
              <MenuItem value="all">All Priority</MenuItem>{" "}
              <MenuItem value="high">High</MenuItem>{" "}
              <MenuItem value="medium">Medium</MenuItem>{" "}
              <MenuItem value="low">Low</MenuItem>{" "}
            </Select>{" "}
          </FormControl>{" "} */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            {" "}
            <Select
              onChange={(e) => setSortBy(e.target.value as any)}
              value={sortBy}
              displayEmpty
            >
              {" "}
              <MenuItem value="dateAdded-desc">
                {" "}
                Date Added (Newest){" "}
              </MenuItem>{" "}
              <MenuItem value="dateAdded-asc">
                {" "}
                Date Added (Oldest){" "}
              </MenuItem>{" "}
              <MenuItem value="title-asc">Title (A-Z)</MenuItem>{" "}
              <MenuItem value="title-desc">Title (Z-A)</MenuItem>{" "}
              <MenuItem value="year-desc">Year (Newest)</MenuItem>{" "}
              <MenuItem value="year-asc">Year (Oldest)</MenuItem>{" "}
              <MenuItem value="rating-desc">Rating (Highest)</MenuItem>{" "}
              <MenuItem value="rating-asc">Rating (Lowest)</MenuItem>{" "}
            </Select>{" "}
          </FormControl>{" "}
        </Box>
        {viewMode === "grid" ? renderGridView() : renderListView()}
      </Box>
    </Box>
  );
};

export default WatchlistPage;
