import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Autocomplete,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts";
import {
  Plus,
  X,
  Film,
  Star,
  Search,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useComparison } from "../hooks/useComparison";
import { useMoviePreviews } from "../hooks/useMoviePreviews";
import SearchResultItem from "../components/SearchResultItem";

const radarColors = ["#1976d2", "#9c27b0", "#2e7d32", "#ed6c02", "#6d4c41"];

const ComparePage = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const idsFromUrl = searchParams.get("ids");

  const initialIds: string[] = idsFromUrl
    ? idsFromUrl.split(",")
    : (location.state?.initialIds ?? []);
  const hasIdsInUrl = searchParams.has("ids");

  const isViewMode = searchParams.get("mode") === "view";

  const {
    selectedIds,
    addMovie,
    removeMovie,
    compare,
    result,
    isLoading,
    error,
    reset,
  } = useComparison(initialIds);

  useEffect(() => {
    if (!hasIdsInUrl && !isViewMode && initialIds.length === 0) {
      reset();
    }
  }, [location.key]);

  const { movies: previewMovies } = useMoviePreviews(selectedIds);

  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const searchMovies = async (query: string) => {
    if (!query) return;
    try {
      setSearching(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/search?s=${query}`,
      );
      const data = await res.json();
      setOptions(data.Search ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length >= 2 && !isLoading) {
      compare();
    }
  }, [selectedIds]);

  const ratingChartData = (result?.movies ?? []).map((movie: any) => ({
    name:
      movie.Title.length > 14 ? movie.Title.slice(0, 14) + "…" : movie.Title,
    fullName: movie.Title,
    rating: Number(movie.imdbRating),
  }));

  const metascoreChartData = (result?.movies ?? []).map((movie: any) => ({
    name:
      movie.Title.length > 14 ? movie.Title.slice(0, 14) + "…" : movie.Title,
    fullName: movie.Title,
    metascore:
      movie.Metascore && movie.Metascore !== "N/A"
        ? Number(movie.Metascore)
        : 0,
  }));

  const boxOfficeChartData = (result?.movies ?? []).map((movie: any) => ({
    name:
      movie.Title.length > 14 ? movie.Title.slice(0, 14) + "…" : movie.Title,
    fullName: movie.Title,
    boxOffice: movie.BoxOffice
      ? Number(movie.BoxOffice.replace(/[^0-9]/g, "")) / 1000000
      : 0,
  }));

  const runtimeChartData = (result?.movies ?? []).map((movie: any) => ({
    name:
      movie.Title.length > 14 ? movie.Title.slice(0, 14) + "…" : movie.Title,
    fullName: movie.Title,
    runtime: parseInt(movie.Runtime?.replace(" min", "") || "0"),
  }));

  const highestRatingId = result?.comparison?.ratings?.highest?.imdbID;

  const radarData = result
    ? [
        {
          metric: "IMDb Rating",
          ...Object.fromEntries(
            result.movies.map((m: any) => [m.imdbID, Number(m.imdbRating)]),
          ),
        },
        {
          metric: "Metascore",
          ...Object.fromEntries(
            result.movies.map((m: any) => [
              m.imdbID,
              m.Metascore && m.Metascore !== "N/A"
                ? Number(m.Metascore) / 10
                : 0,
            ]),
          ),
        },
        {
          metric: "Runtime (scaled)",
          ...Object.fromEntries(
            result.movies.map((m: any) => [
              m.imdbID,
              parseInt(m.Runtime?.replace(" min", "") || "0") / 20,
            ]),
          ),
        },
      ]
    : [];

  // Helper function to format currency
  const formatCurrency = (value: string) => {
    if (!value || value === "N/A") return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(value.replace(/[^0-9]/g, "")));
  };

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Navbar />

      <Box
        component="main"
        sx={{ pt: 12, pb: 6, maxWidth: 1400, mx: "auto", px: 2 }}
      >
        <Box px={4}>
          {/* HEADER */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "flex-end" }}
            spacing={{ xs: 2, sm: 0 }}
            mb={6}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ fontSize: { xs: 22, sm: 32 } }}
              >
                Compare Movies
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: 13, sm: 14 } }}
              >
                Comprehensive comparison of ratings, runtime, box office and
                more
              </Typography>
            </Box>

            {!isViewMode && selectedIds.length < 5 && (
              <Button
                size="small"
                variant="contained"
                onClick={() => setOpenAdd(true)}
                sx={{
                  borderRadius: 999,
                  px: { xs: 2.5, md: 3.5 },
                  py: { xs: 1, md: 1.5 },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                <Plus size={16} style={{ marginRight: 6 }} />
                Add Movie
              </Button>
            )}

            {isViewMode && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                component={Link}
                to="/compare"
                sx={{
                  borderRadius: 999,
                  px: { xs: 2.5, md: 3.5 },
                  py: { xs: 1, md: 1.5 },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                <Plus size={16} style={{ marginRight: 6 }} />
                Create new comparison
              </Button>
            )}
          </Stack>

          {/* SELECTED MOVIES */}
          <Typography fontWeight={600} mb={2}>
            Selected Movies ({selectedIds.length})
          </Typography>

          <Box display="flex" gap={2} overflow="auto" pb={2} mb={6}>
            {previewMovies.map((movie) => (
              <Box
                key={movie.imdbID}
                width={128}
                flexShrink={0}
                position="relative"
                mt={1}
              >
                <Paper sx={{ aspectRatio: "2 / 3", overflow: "hidden" }}>
                  {movie.Poster && movie.Poster !== "N/A" ? (
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
                      <Film />
                    </Box>
                  )}
                </Paper>

                <IconButton
                  size="small"
                  disabled={isViewMode}
                  onClick={() => removeMovie(movie.imdbID)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "error.main",
                    color: "#fff",
                  }}
                >
                  <X size={14} />
                </IconButton>

                <Typography fontSize={13} mt={1} noWrap>
                  {movie.Title}
                </Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography fontSize={12}>{movie.Year}</Typography>
                  <Star size={12} />
                  <Typography fontSize={12}>{movie.imdbRating}</Typography>
                </Stack>

                {movie.imdbID === highestRatingId && (
                  <Chip
                    label="Best IMDb"
                    color="success"
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* SUMMARY METRICS */}
          {result && (
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
              gap={2}
              mb={4}
            >
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Star size={16} color="#E50914" fill="#E50914" />
                  <Typography
                    fontSize={24}
                    fontWeight={700}
                    color="primary.contrastText"
                  >
                    {result.comparison?.ratings?.average || "N/A"}
                  </Typography>
                </Stack>
                <Typography fontSize={13} color="text.secondary">
                  Average Rating
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  Range: {result.comparison?.ratings?.range || "N/A"}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Clock size={16} color="#E50914" />
                  <Typography
                    fontSize={24}
                    fontWeight={700}
                    color="primary.contrastText"
                  >
                    {result.comparison?.runtime?.average || "N/A"}
                  </Typography>
                </Stack>
                <Typography fontSize={13} color="text.secondary">
                  Average Runtime
                </Typography>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Calendar size={16} color="#E50914" />
                  <Typography
                    fontSize={24}
                    fontWeight={700}
                    color="primary.contrastText"
                  >
                    {result.comparison?.releaseYears?.span || "N/A"}
                  </Typography>
                </Stack>
                <Typography fontSize={13} color="text.secondary">
                  Release Years
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  {result.comparison?.releaseYears?.oldest} -{" "}
                  {result.comparison?.releaseYears?.newest}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Film size={16} color="#E50914" />
                  <Typography
                    fontSize={24}
                    fontWeight={700}
                    color="primary.contrastText"
                  >
                    {result.movieCount || 0}
                  </Typography>
                </Stack>
                <Typography fontSize={13} color="text.secondary">
                  Movies Compared
                </Typography>
              </Paper>
            </Box>
          )}

          {/* HIGHEST & LOWEST RATED */}
          {result && result.comparison?.ratings && (
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                md: "repeat(2, 1fr)",
              }}
              gap={2}
              mb={4}
            >
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <TrendingUp size={20} color="#E50914" />
                  <Typography variant="h6" fontWeight={600}>
                    Highest Rated
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} mb={1}>
                  {result.comparison.ratings.highest?.Title}
                </Typography>

                {/* Ratings from multiple sources */}
                {result.comparison.ratings.highest?.Ratings && (
                  <Box mb={2}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mb={1}
                    >
                      Ratings from Multiple Sources
                    </Typography>
                    <Stack spacing={1}>
                      {result.comparison.ratings.highest.Ratings.map(
                        (rating: any, idx: number) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              bgcolor: "action.hover",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {rating.Source}
                            </Typography>
                            <Chip
                              label={rating.Value}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                        ),
                      )}
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  <Box>
                    <Typography fontSize={13} color="text.secondary">
                      Box Office
                    </Typography>
                    <Typography fontSize={15} fontWeight={600}>
                      {formatCurrency(
                        result.comparison.ratings.highest?.BoxOffice,
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={13} color="text.secondary">
                      Runtime
                    </Typography>
                    <Typography fontSize={15} fontWeight={600}>
                      {result.comparison.ratings.highest?.Runtime || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography fontSize={13} color="text.secondary">
                      Genre
                    </Typography>
                    <Typography fontSize={14} fontWeight={600}>
                      {result.comparison.ratings.highest?.Genre || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Star size={20} color="#E50914" />
                  <Typography variant="h6" fontWeight={600}>
                    Lowest Rated
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} mb={1}>
                  {result.comparison.ratings.lowest?.Title}
                </Typography>

                {/* Ratings from multiple sources */}
                {result.comparison.ratings.lowest?.Ratings && (
                  <Box mb={2}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mb={1}
                    >
                      Ratings from Multiple Sources
                    </Typography>
                    <Stack spacing={1}>
                      {result.comparison.ratings.lowest.Ratings.map(
                        (rating: any, idx: number) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              bgcolor: "action.hover",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {rating.Source}
                            </Typography>
                            <Chip
                              label={rating.Value}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                        ),
                      )}
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  <Box>
                    <Typography fontSize={13} color="text.secondary">
                      Box Office
                    </Typography>
                    <Typography fontSize={15} fontWeight={600}>
                      {formatCurrency(
                        result.comparison.ratings.lowest?.BoxOffice,
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={13} color="text.secondary">
                      Runtime
                    </Typography>
                    <Typography fontSize={15} fontWeight={600}>
                      {result.comparison.ratings.lowest?.Runtime || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography fontSize={13} color="text.secondary">
                      Genre
                    </Typography>
                    <Typography fontSize={14} fontWeight={600}>
                      {result.comparison.ratings.lowest?.Genre || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

          {/* CHARTS GRID */}
          {result && (
            <>
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                }}
                gap={2}
                mb={4}
              >
                {/* IMDb RATINGS BAR CHART */}
                <Paper sx={{ p: 3 }}>
                  <Typography fontWeight={600} mb={2}>
                    IMDb Ratings
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="rating"
                          fill="#1976d2"
                          name="IMDb Rating"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>

                {/* METASCORE BAR CHART */}
                <Paper sx={{ p: 3 }}>
                  <Typography fontWeight={600} mb={2}>
                    Metascore Comparison
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metascoreChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="metascore"
                          fill="#9c27b0"
                          name="Metascore"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>

                {/* RUNTIME COMPARISON */}
                <Paper sx={{ p: 3 }}>
                  <Typography fontWeight={600} mb={2}>
                    Runtime Comparison (minutes)
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={runtimeChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="runtime"
                          fill="#2e7d32"
                          name="Runtime (min)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>

                {/* BOX OFFICE COMPARISON */}
                <Paper sx={{ p: 3 }}>
                  <Typography fontWeight={600} mb={2}>
                    Box Office Revenue (Millions USD)
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={boxOfficeChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName
                          }
                          formatter={(value: number) => `$${value.toFixed(2)}M`}
                        />
                        <Legend />
                        <Bar
                          dataKey="boxOffice"
                          fill="#ed6c02"
                          name="Box Office"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Box>

              {/* RADAR CHART */}
              {result.movieCount >= 2 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography fontWeight={600} mb={2}>
                    Multi-Metric Radar Comparison
                  </Typography>
                  <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis domain={[0, 10]} />
                        {result.movies.map((movie: any, index: number) => (
                          <Radar
                            key={movie.imdbID}
                            name={movie.Title}
                            dataKey={movie.imdbID}
                            stroke={radarColors[index]}
                            fill={radarColors[index]}
                            fillOpacity={0.35}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              )}
            </>
          )}

          {error && (
            <Typography color="error.main" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ADD MOVIE DIALOG */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Movie</DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            options={options}
            loading={searching}
            getOptionLabel={(option) => option.Title}
            filterOptions={(x) => x}
            getOptionDisabled={(option) =>
              selectedIds.includes(option.imdbID) || selectedIds.length >= 5
            }
            onChange={(_, value) => {
              if (!value) return;
              addMovie(value.imdbID);
              setSearch("");
              setOptions([]);
              setOpenAdd(false);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search movies..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchMovies(e.target.value);
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Search size={18} style={{ marginRight: 8 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {searching && <CircularProgress size={18} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.imdbID}>
                <SearchResultItem movie={option} />
              </Box>
            )}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ComparePage;
