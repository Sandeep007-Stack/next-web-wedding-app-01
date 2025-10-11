"use client";

import { Box, Container, Stack, Typography } from '@mui/material';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import React from 'react';
import Papa from 'papaparse';

import { useGuestsStore } from '@/store/guestsStore';
import { GuestsTable } from '@/components/guests/GuestsTable';
import type { Guest, GuestTag } from '@/types/guests';
import { GUEST_TAGS } from '@/types/guests';
import { generateId } from '@/lib/id';

function parseTags(input: unknown): GuestTag[] {
  if (!input) return [];
  const raw = String(input);
  const items = raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  const allowed = new Set(GUEST_TAGS);
  return items.filter((x) => allowed.has(x as GuestTag)) as GuestTag[];
}

function normalizeRow(row: Record<string, any>): Guest | null {
  // case-insensitive header access
  const get = (key: string) => {
    const foundKey = Object.keys(row).find((k) => k.toLowerCase() === key.toLowerCase());
    return foundKey ? row[foundKey] : undefined;
  };
  const name = (get('name') ?? get('guest') ?? '').toString().trim();
  if (!name) return null;
  const email = (get('email') ?? '').toString().trim() || undefined;
  const phone = (get('phone') ?? '').toString().trim() || undefined;
  const tags = parseTags(get('tags'));
  return { id: generateId(), name, email, phone, tags };
}

export default function GuestsPage() {
  const guests = useGuestsStore((s) => s.guests);
  const addGuests = useGuestsStore((s) => s.addGuests);
  const toastRef = React.useRef<Toast>(null);

  const handleUpload = async (e: FileUploadHandlerEvent) => {
    const files = e.files as File[];
    if (!files || files.length === 0) return;

    const allRows: Guest[] = [];

    await Promise.all(
      files.map(
        (file) =>
          new Promise<void>((resolve) => {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: 'greedy',
              complete: (results) => {
                const mapped = (results.data as Record<string, any>[])
                  .map(normalizeRow)
                  .filter((x): x is Guest => !!x);
                allRows.push(...mapped);
                resolve();
              },
            });
          }),
      ),
    );

    if (allRows.length === 0) {
      toastRef.current?.show({ severity: 'warn', summary: 'No rows', detail: 'Could not find any valid rows' });
      return;
    }

    addGuests(allRows);
    toastRef.current?.show({ severity: 'success', summary: 'Imported', detail: `${allRows.length} guests added` });
  };

  return (
    <Container maxWidth="lg">
      <Toast ref={toastRef} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Guests
          </Typography>
          <Typography color="text.secondary">Upload a CSV to manage your guest list.</Typography>
        </Box>
      </Stack>

      {guests.length === 0 ? (
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            No guests yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Start by uploading a CSV file with columns like name, email, phone, tags.
          </Typography>
          <FileUpload
            name="guests"
            mode="basic"
            accept=".csv"
            chooseLabel="Upload CSV"
            customUpload
            uploadHandler={handleUpload}
          />
        </Box>
      ) : (
        <Stack spacing={2}>
          <FileUpload name="guests" mode="basic" accept=".csv" chooseLabel="Upload CSV" customUpload uploadHandler={handleUpload} />
          <GuestsTable />
        </Stack>
      )}
    </Container>
  );
}
