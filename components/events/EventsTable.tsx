"use client";

import { AmoraEvent } from '@/types/events';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Chip, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMemo, useState } from 'react';

export type EventsTableProps = {
  events: AmoraEvent[];
  onEdit: (event: AmoraEvent) => void;
  onDelete: (id: string) => void;
};

export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'All' | 'Ceremony' | 'Reception' | 'Other'>('All');

  const filtered = useMemo(() => {
    return events
      .filter((e) => (kind === 'All' ? true : e.kind === kind))
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.venue.toLowerCase().includes(query.toLowerCase()));
  }, [events, query, kind]);

  const actionsBody = (row: AmoraEvent) => (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => onEdit(row)} aria-label={`Edit ${row.name}`}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() =>
            confirmDialog({
              message: `Delete “${row.name}”?`,
              header: 'Confirm',
              acceptLabel: 'Delete',
              rejectLabel: 'Cancel',
              acceptClassName: 'p-button-danger',
              accept: () => onDelete(row.id),
            })
          }
          aria-label={`Delete ${row.name}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const rsvpBody = (row: AmoraEvent) => (
    <Chip label={row.rsvpRequired ? 'RSVP' : 'Open'} color={row.rsvpRequired ? 'primary' : 'default'} size="small" />
  );

  return (
    <>
      <ConfirmDialog />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }}>
        <TextField label="Search" size="small" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ maxWidth: 320 }} />
        <TextField
          label="Kind"
          size="small"
          value={kind}
          onChange={(e) => setKind(e.target.value as any)}
          select
          sx={{ width: 200 }}
        >
          <option value="All">All</option>
          <option value="Ceremony">Ceremony</option>
          <option value="Reception">Reception</option>
          <option value="Other">Other</option>
        </TextField>
      </Stack>

      <DataTable value={filtered} paginator rows={5} emptyMessage="No events yet. Create your first event!" dataKey="id" responsiveLayout="scroll">
        <Column field="name" header="Name" sortable></Column>
        <Column field="kind" header="Kind" sortable></Column>
        <Column field="startAt" header="Date/Time" body={(r) => (r.startAt ? new Date(r.startAt).toLocaleString() : '—')} sortable></Column>
        <Column field="venue" header="Venue" sortable></Column>
        <Column header="RSVP" body={rsvpBody}></Column>
        <Column header="Actions" body={actionsBody}></Column>
      </DataTable>
    </>
  );
}
