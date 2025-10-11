"use client";

import {
  Box,
  TextField,
  Slider,
  Typography,
  Stack,
  Button,
} from '@mui/material';
import { PhotoLibrary as ImageIcon } from '@mui/icons-material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface HeroEditorProps {
  section: SiteSection;
}

export function HeroEditor({ section }: HeroEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { title, subtitle, backgroundImage, overlay, ctaText, ctaLink } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={title || ''}
        onChange={(e) => handleUpdate('title', e.target.value)}
        fullWidth
        data-testid="hero-title-input"
      />

      <TextField
        label="Subtitle"
        value={subtitle || ''}
        onChange={(e) => handleUpdate('subtitle', e.target.value)}
        fullWidth
        multiline
        rows={2}
        data-testid="hero-subtitle-input"
      />

      <Box>
        <Typography variant="body2" gutterBottom>
          Background Image URL
        </Typography>
        <TextField
          value={backgroundImage || ''}
          onChange={(e) => handleUpdate('backgroundImage', e.target.value)}
          fullWidth
          placeholder="https://example.com/image.jpg"
          data-testid="hero-background-input"
        />
        <Button
          startIcon={<ImageIcon />}
          size="small"
          sx={{ mt: 1 }}
          onClick={() => {
            // In a real implementation, this would open a file picker or image library
            const url = prompt('Enter image URL:');
            if (url) handleUpdate('backgroundImage', url);
          }}
        >
          Choose Image
        </Button>
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Overlay Opacity: {(overlay * 100).toFixed(0)}%
        </Typography>
        <Slider
          value={overlay || 0.3}
          onChange={(_, value) => handleUpdate('overlay', value)}
          min={0}
          max={0.8}
          step={0.1}
          data-testid="hero-overlay-slider"
        />
      </Box>

      <TextField
        label="Call to Action Text"
        value={ctaText || ''}
        onChange={(e) => handleUpdate('ctaText', e.target.value)}
        fullWidth
        data-testid="hero-cta-text-input"
      />

      <TextField
        label="Call to Action Link"
        value={ctaLink || ''}
        onChange={(e) => handleUpdate('ctaLink', e.target.value)}
        fullWidth
        placeholder="#"
        data-testid="hero-cta-link-input"
      />
    </Stack>
  );
}