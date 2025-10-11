"use client";

import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';

interface GalleryRendererProps {
  section: SiteSection;
}

export function GalleryRenderer({ section }: GalleryRendererProps) {
  const { title, images, columns } = section.data;

  const mockImages = images?.length > 0 ? images : [
    'https://via.placeholder.com/400x300?text=Photo+1',
    'https://via.placeholder.com/400x300?text=Photo+2',
    'https://via.placeholder.com/400x300?text=Photo+3',
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }} data-testid={`gallery-section-${section.id}`}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          {title || 'Gallery'}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {mockImages.map((image: string, index: number) => (
            <Grid item xs={12} sm={6} md={12 / (columns || 3)} key={index}>
              <Card>
                <Box
                  component="img"
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}