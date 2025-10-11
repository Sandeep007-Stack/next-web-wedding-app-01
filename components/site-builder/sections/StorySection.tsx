"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { SiteSection, SiteTheme } from '@/types/site-builder';

interface StorySectionProps {
  section: SiteSection;
  theme: SiteTheme;
}

export function StorySection({ section, theme }: StorySectionProps) {
  const muiTheme = useTheme();
  const { data } = section;

  const imagePosition = data.imagePosition || 'left';

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {imagePosition === 'left' && data.image && (
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={data.image}
                alt="Story"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                color: theme.colors.primary,
                mb: 3,
                fontWeight: 700,
              }}
            >
              {data.title || 'Our Story'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.primary',
                whiteSpace: 'pre-line',
              }}
            >
              {data.content || 'Share your love story here...'}
            </Typography>
          </Grid>

          {imagePosition === 'right' && data.image && (
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={data.image}
                alt="Story"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}