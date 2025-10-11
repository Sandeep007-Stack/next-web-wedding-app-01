"use client";

import {
  Box,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';

interface StoryRendererProps {
  section: SiteSection;
}

export function StoryRenderer({ section }: StoryRendererProps) {
  const { title, content, images } = section.data;

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }} data-testid={`story-section-${section.id}`}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          {title || 'Our Story'}
        </Typography>
        
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              {content || 'Tell your story here...'}
            </Typography>
          </Grid>
          
          {images && images.length > 0 && (
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={images[0]}
                alt="Story"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}