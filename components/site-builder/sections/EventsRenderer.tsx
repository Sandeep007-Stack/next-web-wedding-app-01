"use client";

import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';

interface EventsRendererProps {
  section: SiteSection;
}

export function EventsRenderer({ section }: EventsRendererProps) {
  const { title } = section.data;

  // Mock events data - in real implementation, this would come from the events store
  const mockEvents = [
    { id: '1', name: 'Ceremony', venue: 'St. Mary\'s Church', startAt: '2024-06-15T14:00' },
    { id: '2', name: 'Reception', venue: 'Grand Ballroom', startAt: '2024-06-15T18:00' },
  ];

  return (
    <Box sx={{ py: 8 }} data-testid={`events-section-${section.id}`}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          {title || 'Events'}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {mockEvents.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {event.venue}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(event.startAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}