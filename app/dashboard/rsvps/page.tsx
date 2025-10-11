"use client";

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

import { RsvpsTable } from '@/components/rsvps/RsvpsTable';
import { RsvpDialog } from '@/components/rsvps/RsvpDialog';
import { useRsvpsStore } from '@/store/rsvpsStore';
import { generateId } from '@/lib/id';
import type { RSVP } from '@/types/rsvp';

export default function RsvpsPage() {
  const rsvps = useRsvpsStore((s) => s.rsvps);
  const addRsvp = useRsvpsStore((s) => s.addRsvp);
  const updateRsvp = useRsvpsStore((s) => s.updateRsvp);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RSVP | null>(null);
  const toastRef = useRef<Toast>(null);

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleSubmit = (r: RSVP) => {
    if (editing) {
      updateRsvp(r);
      toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: 'RSVP updated' });
    } else {
      addRsvp({ ...r, id: generateId() });
      toastRef.current?.show({ severity: 'success', summary: 'Created', detail: 'RSVP added' });
    }
  };

  const handleEdit = (r: RSVP) => {
    setEditing(r);
    setOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Toast ref={toastRef} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            RSVPs
          </Typography>
          <Typography color="text.secondary">Track and manage guest responses.</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate}>
          Add RSVP
        </Button>
      </Stack>

      {rsvps.length === 0 ? (
        <Box
          sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="h6">No RSVPs yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Start by adding your first RSVP. Events are required to associate.
          </Typography>
          <Button variant="contained" onClick={handleCreate}>
            Add RSVP
          </Button>
        </Box>
      ) : (
        <RsvpsTable onEdit={handleEdit} />
      )}

      <RsvpDialog open={open} onClose={() => setOpen(false)} onSubmitRsvp={handleSubmit} initial={editing} />
    </Container>
  );
}
