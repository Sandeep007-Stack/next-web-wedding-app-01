"use client";

import {
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface EventsEditorProps {
  section: SiteSection;
}

export function EventsEditor({ section }: EventsEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { title, showUpcoming, maxEvents } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={title || ''}
        onChange={(e) => handleUpdate('title', e.target.value)}
        fullWidth
        data-testid="events-title-input"
      />

      <FormControlLabel
        control={
          <Switch
            checked={showUpcoming || true}
            onChange={(e) => handleUpdate('showUpcoming', e.target.checked)}
          />
        }
        label="Show only upcoming events"
      />

      <div>
        <Typography gutterBottom>
          Maximum events to display: {maxEvents || 6}
        </Typography>
        <Slider
          value={maxEvents || 6}
          onChange={(_, value) => handleUpdate('maxEvents', value)}
          min={1}
          max={12}
          step={1}
          marks
          data-testid="events-max-slider"
        />
      </div>
    </Stack>
  );
}