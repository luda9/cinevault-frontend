import { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Paper,
} from '@mui/material';
import { Search, Loader2 } from 'lucide-react';
import heroBg from '../assets/hero-bg.jpg';
import SearchResultItem from './SearchResultItem';
import MovieDetailModal from './MovieDetailModal'

import type { SearchMovie } from '../types/movie';

const HeroSection = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [ moviesTv, setMoviesTv] = useState([])
  const [ isSearching, setIsSearching] = useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');

  const searchInputHandler = async (input:string) => {
    if(input.length === 0) return

    try {
      const apiResponse = await axios.get(`${apiUrl}api/search?s=${input}`)
      if(apiResponse.data.Search){
        setMoviesTv(apiResponse.data.Search)
        setIsSearching(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        height: '70vh',
        minHeight: 500,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(11,11,13,0.4), rgba(11,11,13,0.85))',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: { xs: 36, md: 56, lg: 72 },
          }}
        >
          Discover your next
          <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
            favorite movie
          </Box>
        </Typography>

        <Typography
          sx={{
            mb: 4,
            maxWidth: 720,
            color: 'text.secondary',
            fontSize: { xs: 16, md: 20 },
          }}
        >
          Explore, compare and organize your movie collection in one place
        </Typography>

        {/* Autocomplete Search */}
        <Autocomplete<SearchMovie>
          disableCloseOnSelect
          options={moviesTv}
          isOptionEqualToValue={(option, value) =>
            option.imdbID === value.imdbID
          }
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.Title
          }
          PaperComponent={(props) => (
            <Paper
              {...props}
              sx={{
                mt: 1,
                backgroundColor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...rest } = props;

            return (
              <Box
                component="li"
                key={key}
                {...rest}
              >
                <SearchResultItem
                  movie={option}
                  onOpenMovie={(id) => setSelectedMovieId(id)}
                />
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search movies, series..."
              onChange={(e) => searchInputHandler(e.target.value)}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {isSearching ? (
                      <Loader2 style={{ marginLeft: "10px"}} size={20} className="animate-spin" />
                    ) : (
                      <Search style={{ marginLeft: "10px"}} size={20} />
                    )}
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: 999,
                  fontSize: 18,
                  pl: 1,
                },
              }}
            />
          )}
          sx={{
            width: '100%',
            maxWidth: 520,
          }}
        />
      </Box>
      <MovieDetailModal
        movieId={selectedMovieId}
        open={Boolean(selectedMovieId)}
        onClose={() => setSelectedMovieId('')}
      />
    </Box>
  );
};

export default HeroSection;
