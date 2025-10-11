"use client";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Box, Button, Chip, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import React from 'react';

import { useGuestsStore } from '@/store/guestsStore';
import type { Guest } from '@/types/guests';
import { GUEST_TAGS } from '@/types/guests';

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

export function GuestsTable() {
  const guests = useGuestsStore((s) => s.guests);
  const updateGuest = useGuestsStore((s) => s.updateGuest);
  const deleteGuests = useGuestsStore((s) => s.deleteGuests);
  const clearAll = useGuestsStore((s) => s.clearAll);

  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Guest[] | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return guests.filter((g) => [g.name, g.email ?? '', g.phone ?? '', g.tags.join(' ')].join(' ').toLowerCase().includes(q));
  }, [guests, query]);

  const onCellEditComplete = (e: any) => {
    const { rowData, newValue, field } = e;
    updateGuest({ ...rowData, [field]: newValue });
  };

  const textEditor = (options: any) => (
    <TextField size="small" value={options.value ?? ''} onChange={(e) => options.editorCallback(e.target.value)} autoFocus />
  );

  const tagsBody = (row: Guest) => {
    const hasTag = (t: string) => row.tags.includes(t as any);
    const toggleTag = (t: string) => {
      const nextTags = hasTag(t) ? row.tags.filter((x) => x !== t) : [...row.tags, t as any];
      updateGuest({ ...row, tags: nextTags });
    };
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {GUEST_TAGS.map((t) => (
          <Chip
            key={t}
            label={t}
            color={hasTag(t) ? 'primary' : 'default'}
            variant={hasTag(t) ? 'filled' : 'outlined'}
            size="small"
            onClick={() => toggleTag(t)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>
    );
  };

  const removeSelected = () => {
    if (!selected || selected.length === 0) return;
    confirmDialog({
      message: `Delete ${selected.length} selected?`,
      header: 'Confirm',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptClassName: 'p-button-danger',
      accept: () => {
        deleteGuests(selected.map((g) => g.id));
        setSelected(null);
      },
    });
  };

  const removeAll = () => {
    if (guests.length === 0) return;
    confirmDialog({
      message: 'Clear all guests?',
      header: 'Confirm',
      acceptLabel: 'Clear',
      rejectLabel: 'Cancel',
      acceptClassName: 'p-button-danger',
      accept: () => setTimeout(() => clearAll(), 0),
    });
  };

  const exportCsv = () => {
    const rows = filtered.map((g) => ({
      name: g.name,
      email: g.email ?? '',
      phone: g.phone ?? '',
      tags: g.tags.join(';'),
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ConfirmDialog />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }} alignItems="center">
        <TextField label="Search" size="small" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ maxWidth: 320 }} />
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<DownloadIcon />} onClick={exportCsv} variant="outlined">
          Export CSV
        </Button>
        <Tooltip title={selected && selected.length > 0 ? 'Delete selected' : 'Select rows first'}>
          <span>
            <Button startIcon={<DeleteIcon />} onClick={removeSelected} color="error" disabled={!selected || selected.length === 0} variant="outlined">
              Delete Selected
            </Button>
          </span>
        </Tooltip>
        <Button onClick={removeAll} color="error" variant="text">
          Clear All
        </Button>
      </Stack>

      <DataTable
        value={filtered}
        paginator
        rows={5}
        emptyMessage="No guests yet. Upload a CSV to get started!"
        dataKey="id"
        responsiveLayout="scroll"
        editMode="cell"
        selection={selected}
        onSelectionChange={(e) => setSelected(e.value as Guest[])}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="name" header="Name" sortable editor={textEditor} onCellEditComplete={onCellEditComplete}></Column>
        <Column field="email" header="Email" sortable editor={textEditor} onCellEditComplete={onCellEditComplete}></Column>
        <Column field="phone" header="Phone" sortable editor={textEditor} onCellEditComplete={onCellEditComplete}></Column>
        <Column header="Tags" body={tagsBody}></Column>
      </DataTable>
    </>
  );
}
