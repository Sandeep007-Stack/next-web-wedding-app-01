"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { SiteSection, SiteTheme } from '@/types/site-builder';

interface HeroSectionProps {
  section: SiteSection;
  theme: SiteTheme;
}

export function HeroSection({ section, theme }: HeroSectionProps) {
  const muiTheme = useTheme();
  const { data } = section;

  const backgroundStyle = data.backgroundImage
    ? {
        backgroundImage: `url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${data.backgroundOverlay || 0.3})`,
  };

  const textAlign = data.alignment || 'center';

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'left' ? 'flex-start' : 'flex-end',
        ...backgroundStyle,
      }}
    >
      {/* Background Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...overlayStyle,
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign,
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: data.textColor || '#FFFFFF',
            mb: 3,
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {data.title || 'Welcome to Our Wedding'}
        </Typography>

        {data.subtitle && (
          <Typography
            variant="h5"
            sx={{
              color: data.textColor || '#FFFFFF',
              mb: 4,
              fontWeight: 400,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {data.subtitle}
          </Typography>
        )}

        {data.ctaText && data.ctaLink && (
          <Button
            variant="contained"
            size="large"
            href={data.ctaLink}
            sx={{
              bgcolor: theme.colors.primary,
              color: '#FFFFFF',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: theme.colors.primary,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
              },
            }}
          >
            {data.ctaText}
          </Button>
        )}
      </Container>
    </Box>
  );
}