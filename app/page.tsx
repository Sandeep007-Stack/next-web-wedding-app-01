import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Container sx={{ py: 10 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" fontWeight={700}>
          Amora — Wedding Platform
        </Typography>
        <Typography color="text.secondary" align="center">
          UI-only demo. No backend, no mocks. Your data lives in-memory until refresh.
        </Typography>
        <Box>
          <Button component={Link} href="/dashboard/events" variant="contained">
            Go to Events
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
