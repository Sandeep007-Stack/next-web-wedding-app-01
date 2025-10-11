"use client";

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import { SiteSection, SiteTheme } from '@/types/site-builder';
import { useEventsStore } from '@/store/eventsStore';

interface EventsSectionProps {
  section: SiteSection;
  theme: SiteTheme;
}

export function EventsSection({ section, theme }: EventsSectionProps) {
  const { data } = section;
  const events = useEventsStore((s) => s.events);

  const displayEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, data.maxEvents || 3);

  const layout = data.layout || 'grid';

  if (displayEvents.length === 0) {
    return (
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              color: theme.colors.primary,
              mb: 3,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            {data.title || 'Wedding Events'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            No upcoming events scheduled.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            color: theme.colors.primary,
            mb: 6,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {data.title || 'Wedding Events'}
        </Typography>

        {layout === 'grid' ? (
          <Grid container spacing={4}>
            {displayEvents.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.colors.primary,
                        mb: 2,
                        fontWeight: 600,
                      }}
                    >
                      {event.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {event.time}
                    </Typography>
                    {event.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        📍 {event.location}
                      </Typography>
                    )}
                    <Chip
                      label={event.kind}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.colors.primary,
                        color: theme.colors.primary,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            {displayEvents.map((event) => (
              <Card
                key={event.id}
                sx={{
                  mb: 3,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.colors.primary,
                        fontWeight: 600,
                      }}
                    >
                      {event.name}
                    </Typography>
                    <Chip
                      label={event.kind}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.colors.primary,
                        color: theme.colors.primary,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })} at {event.time}
                  </Typography>
                  {event.location && (
                    <Typography variant="body2" color="text.secondary">
                      📍 {event.location}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}