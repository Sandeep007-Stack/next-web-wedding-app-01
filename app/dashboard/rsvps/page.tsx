"use client";

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

import { RsvpDialog } from '@/components/rsvps/RsvpDialog';
import { RsvpsTable } from '@/components/rsvps/RsvpsTable';
import { useRsvpsStore } from '@/store/rsvpsStore';
import { RsvpItem, RsvpStatus } from '@/types/rsvp';
import { rsvpsToCsv, downloadCsv } from '@/lib/csv';
import { generateId } from '@/lib/id';

export default function RsvpsPage() {
  const rows = useRsvpsStore((s) => s.rsvps);
  const add = useRsvpsStore((s) => s.add);
  const update = useRsvpsStore((s) => s.update);
  const remove = useRsvpsStore((s) => s.remove);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RsvpItem | null>(null);
  const toastRef = useRef<Toast>(null);

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleSubmit = (r: RsvpItem) => {
    if (editing) {
      update({ ...editing, ...r });
      toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: 'RSVP updated' });
    } else {
      add({ ...r, id: generateId() });
      toastRef.current?.show({ severity: 'success', summary: 'Added', detail: 'RSVP added' });
    }
  };

  const handleEdit = (r: RsvpItem) => {
    setEditing(r);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    remove(id);
    toastRef.current?.show({ severity: 'info', summary: 'Deleted', detail: 'RSVP removed' });
  };

  const handleInlineStatus = (id: string, status: RsvpStatus) => {
    const row = rows.find((x) => x.id === id);
    if (row) update({ ...row, status });
  };

  const handleExport = () => {
    if (rows.length === 0) return;
    const csv = rsvpsToCsv(rows);
    downloadCsv('rsvps.csv', csv);
  };

  return (
    <Container maxWidth="lg">
      <Toast ref={toastRef} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>RSVP Management</Typography>
          <Typography color="text.secondary">Track responses per guest and event.</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button startIcon={<FileDownloadIcon />} onClick={handleExport} disabled={rows.length === 0}>
            Export CSV
          </Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate}>
            Add RSVP
          </Button>
        </Stack>
      </Stack>

      {rows.length === 0 ? (
        <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 6, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="h6">No RSVPs yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Start by adding your first RSVP.</Typography>
          <Button variant="contained" onClick={handleCreate}>Add RSVP</Button>
        </Box>
      ) : (
        <RsvpsTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} onInlineStatus={handleInlineStatus} />
      )}

      <RsvpDialog open={open} onClose={() => setOpen(false)} onSubmitRsvp={handleSubmit} initial={editing} />
    </Container>
  );
}
