"use client";

import { Card, CardContent, Stack, Typography, Button } from '@mui/material';

export function MinimalCard({ eventName, guestName }: { eventName: string; guestName: string }) {
  return (
    <Card variant="outlined" sx={{ maxWidth: 480 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>{eventName}</Typography>
          <Typography>Hello {guestName || 'Guest'}, you are invited!</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained">Accept</Button>
            <Button variant="outlined">Decline</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
