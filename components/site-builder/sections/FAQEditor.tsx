"use client";

import {
  TextField,
  Stack,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface FAQEditorProps {
  section: SiteSection;
}

export function FAQEditor({ section }: FAQEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { title } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={title || ''}
        onChange={(e) => handleUpdate('title', e.target.value)}
        fullWidth
        data-testid="faq-title-input"
      />
      
      {/* TODO: Add dynamic FAQ items editor */}
    </Stack>
  );
}