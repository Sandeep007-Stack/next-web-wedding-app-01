"use client";

import {
  TextField,
  Stack,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface StoryEditorProps {
  section: SiteSection;
}

export function StoryEditor({ section }: StoryEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { title, content } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={title || ''}
        onChange={(e) => handleUpdate('title', e.target.value)}
        fullWidth
        data-testid="story-title-input"
      />

      <TextField
        label="Content"
        value={content || ''}
        onChange={(e) => handleUpdate('content', e.target.value)}
        fullWidth
        multiline
        rows={6}
        data-testid="story-content-input"
      />
    </Stack>
  );
}