"use client";

import { Box } from '@mui/material';
import { SiteBuilderLayout } from '@/components/site-builder/SiteBuilderLayout';

export default function SiteBuilderPage() {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <SiteBuilderLayout />
    </Box>
  );
}