"use client";

import { Card, CardContent, Stack, Typography, Button } from '@mui/material';

export function FestiveCard({ eventName, guestName }: { eventName: string; guestName: string }) {
  return (
    <Card sx={{ maxWidth: 520, background: 'linear-gradient(135deg, #FDE68A, #FCA5A5)' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={800}>🎉 {eventName}</Typography>
          <Typography variant="subtitle1">Dear {guestName || 'Guest'}, celebrate with us!</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="primary">RSVP Yes</Button>
            <Button variant="outlined" color="primary">RSVP No</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
