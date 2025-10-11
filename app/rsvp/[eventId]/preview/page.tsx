"use client";

import { useSearchParams, useParams } from 'next/navigation';
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';

import { useEventsStore } from '@/store/eventsStore';

function MinimalCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Card sx={{ maxWidth: 560, mx: 'auto', borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        <Typography>
          Please RSVP using the form below. This is a preview-only template; no submission here.
        </Typography>
      </CardContent>
    </Card>
  );
}

function FestiveCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Card sx={{ maxWidth: 680, mx: 'auto', borderRadius: 4, background: 'linear-gradient(135deg, #fff7e6, #ffe1e6)' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <CelebrationIcon color="primary" />
          <Typography variant="h4" fontWeight={800}>
            {title}
          </Typography>
        </Stack>
        {subtitle && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Typography>
          Join us in celebration! Tap RSVP on the invite you receive. This is a visual preview only.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function RsvpPreviewPage() {
  const params = useParams<{ eventId: string }>();
  const search = useSearchParams();
  const template = search.get('template') ?? '1';

  const event = useEventsStore((s) => s.events.find((e) => e.id === params.eventId));

  const title = event?.name ?? 'Your Event';
  const subtitle = event?.venue ? `at ${event.venue}` : undefined;

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="overline" color="text.secondary">RSVP Template Preview</Typography>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
        Template {template === '2' ? 'Festive Card' : 'Minimal Card'}
      </Typography>

      {template === '2' ? (
        <FestiveCard title={title} subtitle={subtitle} />
      ) : (
        <MinimalCard title={title} subtitle={subtitle} />
      )}

      <Box sx={{ mt: 4 }}>
        <Typography color="text.secondary">
          Change template via query param: ?template=1 or ?template=2
        </Typography>
      </Box>
    </Container>
  );
}
