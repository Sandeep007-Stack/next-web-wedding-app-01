import { RsvpItem } from '@/types/rsvp';

export function rsvpsToCsv(rows: RsvpItem[]): string {
  const headers = ['Guest Name', 'Event', 'Status', 'Meal Choice', 'Plus One', 'Notes'];
  const lines = rows.map((r) => [
    escapeCsv(r.guestName),
    escapeCsv(r.eventName),
    escapeCsv(r.status),
    escapeCsv(r.mealChoice ?? ''),
    escapeCsv(r.plusOne ? 'Yes' : 'No'),
    escapeCsv(r.notes ?? ''),
  ].join(','));
  return [headers.join(','), ...lines].join('\n');
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
