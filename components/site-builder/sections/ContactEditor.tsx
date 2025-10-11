"use client";

import {
  TextField,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface ContactEditorProps {
  section: SiteSection;
}

export function ContactEditor({ section }: ContactEditorProps) {
  const { updateSectionData } = useSiteBuilderStore();

  const handleUpdate = (field: string, value: any) => {
    updateSectionData(section.id, { [field]: value });
  };

  const { title, email, phone, address, showForm } = section.data;

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={title || ''}
        onChange={(e) => handleUpdate('title', e.target.value)}
        fullWidth
        data-testid="contact-title-input"
      />

      <TextField
        label="Email"
        value={email || ''}
        onChange={(e) => handleUpdate('email', e.target.value)}
        fullWidth
        type="email"
        data-testid="contact-email-input"
      />

      <TextField
        label="Phone"
        value={phone || ''}
        onChange={(e) => handleUpdate('phone', e.target.value)}
        fullWidth
        data-testid="contact-phone-input"
      />

      <TextField
        label="Address"
        value={address || ''}
        onChange={(e) => handleUpdate('address', e.target.value)}
        fullWidth
        multiline
        rows={2}
        data-testid="contact-address-input"
      />

      <FormControlLabel
        control={
          <Switch
            checked={showForm || true}
            onChange={(e) => handleUpdate('showForm', e.target.checked)}
          />
        }
        label="Show contact form"
      />
    </Stack>
  );
}