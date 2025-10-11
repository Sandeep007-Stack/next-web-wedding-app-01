"use client";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Box, Chip, IconButton, MenuItem, Select, Stack, TextField, Tooltip, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import React from 'react';

import { useRsvpsStore } from '@/store/rsvpsStore';
import { useEventsStore } from '@/store/eventsStore';
import type { RSVP, RSVPStatus } from '@/types/rsvp';
import { RSVP_STATUSES } from '@/types/rsvp';

export type RsvpsTableProps = {
  onEdit: (r: RSVP) => void;
};

function toCsv(rows: any[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    if (val === null || val === undefined) return '';
    const s = String(val).replaceAll('"', '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))];
  return lines.join('\n');
}

export function RsvpsTable({ onEdit }: RsvpsTableProps) {
  const rsvps = useRsvpsStore((s) => s.rsvps);
  const filter = useRsvpsStore((s) => s.filter);
  const setFilter = useRsvpsStore((s) => s.setFilter);
  const updateRsvp = useRsvpsStore((s) => s.updateRsvp);
  const deleteRsvp = useRsvpsStore((s) => s.deleteRsvp);

  const events = useEventsStore((s) => s.events);

  const [query, setQuery] = React.useState(filter.query);
  const [eventId, setEventId] = React.useState<string>(filter.eventId);
  const [status, setStatus] = React.useState<string>(filter.status);

  const filtered = React.useMemo(() => {
    return rsvps
      .filter((r) => (eventId === 'All' ? true : r.eventId === eventId))
      .filter((r) => (status === 'All' ? true : r.status === status))
      .filter((r) =>
        [r.guestName, r.notes ?? '', r.mealChoice ?? '']
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
  }, [rsvps, eventId, status, query]);

  const eventNameById = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of events) map[e.id] = e.name;
    return map;
  }, [events]);

  const handleInlineStatusChange = (row: RSVP, newStatus: RSVPStatus) => {
    updateRsvp({ ...row, status: newStatus });
  };

  const actionsBody = (row: RSVP) => (
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
              accept: () => deleteRsvp(row.id),
            })
          }
          aria-label={`Delete RSVP for ${row.guestName}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const statusBody = (row: RSVP) => (
    <Select
      size="small"
      value={row.status}
      onChange={(e) => handleInlineStatusChange(row, e.target.value as RSVPStatus)}
      sx={{ minWidth: 140 }}
    >
      {RSVP_STATUSES.map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      ))}
    </Select>
  );

  const plusOneBody = (row: RSVP) => <Chip label={row.plusOne ? 'Yes' : 'No'} size="small" />;

  const eventBody = (row: RSVP) => eventNameById[row.eventId] ?? '—';

  const exportCsv = () => {
    const rows = filtered.map((r) => ({
      guestName: r.guestName,
      event: eventNameById[r.eventId] ?? '',
      status: r.status,
      mealChoice: r.mealChoice ?? '',
      plusOne: r.plusOne ? 'Yes' : 'No',
      notes: r.notes ?? '',
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ConfirmDialog />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }}>
        <TextField label="Search" size="small" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ maxWidth: 320 }} />

        <TextField label="Event" size="small" value={eventId} onChange={(e) => setEventId(e.target.value)} select sx={{ width: 240 }}>
          <MenuItem value="All">All</MenuItem>
          {events.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Status" size="small" value={status} onChange={(e) => setStatus(e.target.value)} select sx={{ width: 200 }}>
          <MenuItem value="All">All</MenuItem>
          {RSVP_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ flex: 1 }} />
        <Button startIcon={<DownloadIcon />} onClick={exportCsv} variant="outlined">
          Export CSV
        </Button>
      </Stack>

      <DataTable value={filtered} paginator rows={5} emptyMessage="No RSVPs yet. Add your first guest!" dataKey="id" responsiveLayout="scroll">
        <Column field="guestName" header="Guest name" sortable></Column>
        <Column header="Event" body={eventBody}></Column>
        <Column header="Status" body={statusBody}></Column>
        <Column field="mealChoice" header="Meal choice" sortable></Column>
        <Column header="Plus-one" body={plusOneBody}></Column>
        <Column field="notes" header="Notes"></Column>
        <Column header="Actions" body={actionsBody}></Column>
      </DataTable>
    </>
  );
}
