"use client";

import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useThemeStore } from '@/store/themeStore';

export default function SettingsPage() {
  const color = useThemeStore((s) => s.primaryColor);
  const setColor = useThemeStore((s) => s.setPrimaryColor);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Settings
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">Theme</Typography>
          <Typography color="text.secondary">Set brand color (in-memory only)</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Primary Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{ width: 220 }}
            />
            <Button variant="outlined" onClick={() => setColor('#7C3AED')}>
              Reset
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
