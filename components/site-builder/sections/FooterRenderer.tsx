"use client";

import {
  Box,
  Typography,
  Container,
  Link,
  Stack,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';

interface FooterRendererProps {
  section: SiteSection;
}

export function FooterRenderer({ section }: FooterRendererProps) {
  const { copyright, links, socialLinks } = section.data;

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        bgcolor: 'grey.900', 
        color: 'white',
        mt: 'auto'
      }} 
      data-testid={`footer-section-${section.id}`}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          {links && links.length > 0 && (
            <Stack direction="row" spacing={3}>
              {links.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  color="inherit"
                  underline="hover"
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          )}
          
          <Typography variant="body2" color="grey.400">
            {copyright || '© 2024 Your Site'}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}