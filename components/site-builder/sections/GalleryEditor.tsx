"use client";

import {
  TextField,
  Stack,
  Slider,
  Typography,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface GalleryEditorProps {
  section: SiteSection;
}

export function GalleryEditor({ section }: GalleryEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { title, columns } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={title || ''}
        onChange={(e) => handleUpdate('title', e.target.value)}
        fullWidth
        data-testid="gallery-title-input"
      />

      <div>
        <Typography gutterBottom>
          Columns: {columns || 3}
        </Typography>
        <Slider
          value={columns || 3}
          onChange={(_, value) => handleUpdate('columns', value)}
          min={1}
          max={6}
          step={1}
          marks
          data-testid="gallery-columns-slider"
        />
      </div>
    </Stack>
  );
}