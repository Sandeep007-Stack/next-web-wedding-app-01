"use client";

import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';

interface HeroRendererProps {
  section: SiteSection;
}

export function HeroRenderer({ section }: HeroRendererProps) {
  const { title, subtitle, backgroundImage, overlay, ctaText, ctaLink } = section.data;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, primary.main, secondary.main)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        '&::before': overlay > 0 ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlay})`,
          zIndex: 1,
        } : {},
      }}
      data-testid={`hero-section-${section.id}`}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {title || 'Welcome to Our Site'}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              opacity: 0.9,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {ctaText && (
          <Button
            variant="contained"
            size="large"
            href={ctaLink || '#'}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {ctaText}
          </Button>
        )}
      </Container>
    </Box>
  );
}