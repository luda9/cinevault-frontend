import { Box, Typography, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
  component="footer"
  sx={{
    mt: 8,
    py: 3,
    px: 2,
    borderColor: "divider",
    backgroundColor: 'rgba(11,11,13,0.8)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  }}
>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={1}
    justifyContent="space-between"
    alignItems="center"
    maxWidth={1400}
    mx="auto"
  >
    <Typography fontSize={13} color="text.secondary">
      © {new Date().getFullYear()} CineVault. All rights reserved.
    </Typography>

    <Typography fontSize={13} color="text.secondary">
      Created by{" "}
      <Box
        component="a"
        href="https://luda9.com"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: "primary.main",
          textDecoration: "none",
          fontWeight: 600,
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        Luda
      </Box>
    </Typography>
  </Stack>
</Box>
  )
}

export default Footer
