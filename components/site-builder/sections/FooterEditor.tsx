"use client";

import {
  TextField,
  Stack,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface FooterEditorProps {
  section: SiteSection;
}

export function FooterEditor({ section }: FooterEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { copyright } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Copyright Text"
        value={copyright || ''}
        onChange={(e) => handleUpdate('copyright', e.target.value)}
        fullWidth
        data-testid="footer-copyright-input"
      />
      
      {/* TODO: Add dynamic links editor */}
    </Stack>
  );
}