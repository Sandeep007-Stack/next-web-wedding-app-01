"use client";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Box, Chip, IconButton, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMemo, useState } from 'react';
import { RsvpItem, RsvpStatus } from '@/types/rsvp';

export type RsvpsTableProps = {
  rows: RsvpItem[];
  onEdit: (row: RsvpItem) => void;
  onDelete: (id: string) => void;
  onInlineStatus: (id: string, status: RsvpStatus) => void;
};

export function RsvpsTable({ rows, onEdit, onDelete, onInlineStatus }: RsvpsTableProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | RsvpStatus>('All');

  const filtered = useMemo(() => {
    return rows
      .filter((r) => (status === 'All' ? true : r.status === status))
      .filter((r) =>
        [r.guestName, r.eventName, r.mealChoice ?? '', r.notes ?? '']
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
  }, [rows, query, status]);

  const statusBody = (row: RsvpItem) => (
    <TextField
      select
      size="small"
      value={row.status}
      onChange={(e) => onInlineStatus(row.id, e.target.value as RsvpStatus)}
      sx={{ width: 160 }}
    >
      <MenuItem value="Pending">Pending</MenuItem>
      <MenuItem value="Accepted">Accepted</MenuItem>
      <MenuItem value="Declined">Declined</MenuItem>
      <MenuItem value="Maybe">Maybe</MenuItem>
    </TextField>
  );

  const plusOneBody = (row: RsvpItem) => <Chip label={row.plusOne ? 'Yes' : 'No'} size="small" />;

  const actionsBody = (row: RsvpItem) => (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => onEdit(row)} aria-label={`Edit ${row.guestName}`}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() =>
            confirmDialog({
              message: `Delete RSVP for “${row.guestName}”?`,
              header: 'Confirm',
              acceptLabel: 'Delete',
              rejectLabel: 'Cancel',
              acceptClassName: 'p-button-danger',
              accept: () => onDelete(row.id),
            })
          }
          aria-label={`Delete ${row.guestName}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <>
      <ConfirmDialog />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }}>
        <TextField label="Search" size="small" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ maxWidth: 320 }} />
        <TextField label="Status" size="small" value={status} onChange={(e) => setStatus(e.target.value as any)} select sx={{ width: 200 }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Accepted">Accepted</MenuItem>
          <MenuItem value="Declined">Declined</MenuItem>
          <MenuItem value="Maybe">Maybe</MenuItem>
        </TextField>
      </Stack>

      <DataTable value={filtered} paginator rows={5} emptyMessage="No RSVPs yet. Add your first RSVP." dataKey="id" responsiveLayout="scroll">
        <Column field="guestName" header="Guest" sortable></Column>
        <Column field="eventName" header="Event" sortable></Column>
        <Column field="status" header="Status" body={statusBody}></Column>
        <Column field="mealChoice" header="Meal" sortable></Column>
        <Column field="plusOne" header="Plus One" body={plusOneBody}></Column>
        <Column field="notes" header="Notes"></Column>
        <Column header="Actions" body={actionsBody}></Column>
      </DataTable>
    </>
  );
}
