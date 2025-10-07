"use client";

import { Container, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';
import { MinimalCard } from '@/components/rsvps/templates/MinimalCard';
import { FestiveCard } from '@/components/rsvps/templates/FestiveCard';

export default function RsvpPreviewPage() {
  const params = useParams();
  const search = useSearchParams();
  const [guestName, setGuestName] = useState('Alex & Jamie');
  const template = search.get('template') || '1';
  const eventName = (params?.eventId as string) || 'Our Wedding';

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>RSVP Template Preview</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField label="Template" select defaultValue={template} size="small" sx={{ width: 220 }}>
          <MenuItem value="1">Minimal Card</MenuItem>
          <MenuItem value="2">Festive Card</MenuItem>
        </TextField>
        <TextField label="Guest Name" size="small" value={guestName} onChange={(e) => setGuestName(e.target.value)} sx={{ width: 300 }} />
      </Stack>

      {template === '2' ? (
        <FestiveCard eventName={eventName} guestName={guestName} />
      ) : (
        <MinimalCard eventName={eventName} guestName={guestName} />
      )}
    </Container>
  );
}
