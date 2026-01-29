import { Box, Typography, IconButton } from '@mui/material';
import { Film, Menu, User, X, Heart, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinkStyles = (active: boolean) => ({
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: active ? 'text.primary' : 'text.secondary',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: 'primary.main',
    },
  });

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(11,11,13,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* TOP BAR */}
      <Box
        sx={{
          maxWidth: 1350,
          mx: 'auto',
          px: 3,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* LOGO */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            textDecoration: 'none',
            color: 'text.primary',
          }}
        >
          <Box
            sx={{
              height: 40,
              width: 40,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Film size={22} />
          </Box>

          <Typography fontSize={20} fontWeight={700}>
            CineVault
          </Typography>
        </Box>

        {/* DESKTOP NAV */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Box component={Link} to="/" sx={navLinkStyles(isActive('/'))}>
            Explore
          </Box>

          <Box
            component={Link}
            to="/watchlist"
            sx={navLinkStyles(isActive('/watchlist'))}
          >
            <Heart size={16} />
            My Watchlist
          </Box>

          <Box
            component={Link}
            to="/compare"
            sx={navLinkStyles(isActive('/compare'))}
          >
            <ArrowLeftRight size={16} />
            Compare
          </Box>
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            sx={{
              display: { xs: 'none', md: 'flex' },
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <User size={20} />
          </IconButton>

          <IconButton
            sx={{
              display: { xs: 'flex', md: 'none' },
              backgroundColor: 'background.paper',
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </Box>
      </Box>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <Box
          sx={{
            display: { md: 'none' },
            borderTop: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(11,11,13,0.95)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Box
            sx={{
              maxWidth: 1280,
              mx: 'auto',
              px: 3,
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{ fontSize: 18, fontWeight: 500, textDecoration: 'none', color: 'text.primary' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Box>

            <Box
              component={Link}
              to="/watchlist"
              sx={{ fontSize: 18, fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Watchlist
            </Box>

            <Box
              component={Link}
              to="/compare"
              sx={{ fontSize: 18, fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Compare
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
