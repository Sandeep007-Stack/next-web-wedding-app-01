"use client";

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

import { EventDialog } from '@/components/events/EventDialog';
import { EventsTable } from '@/components/events/EventsTable';
import { useEventsStore } from '@/store/eventsStore';
import { AmoraEvent } from '@/types/events';
import { generateId } from '@/lib/id';

export default function EventsPage() {
  const events = useEventsStore((s) => s.events);
  const addEvent = useEventsStore((s) => s.addEvent);
  const updateEvent = useEventsStore((s) => s.updateEvent);
  const deleteEvent = useEventsStore((s) => s.deleteEvent);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AmoraEvent | null>(null);
  const toastRef = useRef<Toast>(null);

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleSubmit = (e: AmoraEvent) => {
    if (editing) {
      updateEvent(e);
      toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: 'Event updated' });
    } else {
      addEvent({ ...e, id: generateId() });
      toastRef.current?.show({ severity: 'success', summary: 'Created', detail: 'Event added' });
    }
  };

  const handleEdit = (e: AmoraEvent) => {
    setEditing(e);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    toastRef.current?.show({ severity: 'info', summary: 'Deleted', detail: 'Event removed' });
  };

  return (
    <Container maxWidth="lg">
      <Toast ref={toastRef} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Events
          </Typography>
          <Typography color="text.secondary">Create and manage your wedding events.</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate}>
          New Event
        </Button>
      </Stack>

      {events.length === 0 ? (
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
          <Typography variant="h6">No events yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Start by creating your first event.
          </Typography>
          <Button variant="contained" onClick={handleCreate}>
            Create Event
          </Button>
        </Box>
      ) : (
        <EventsTable events={events} onEdit={handleEdit} onDelete={handleDelete} />)
      }

      <EventDialog open={open} onClose={() => setOpen(false)} onSubmitEvent={handleSubmit} initial={editing} />
    </Container>
  );
}
