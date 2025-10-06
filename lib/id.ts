export function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // @ts-ignore - runtime check ensures existence
      return (crypto as any).randomUUID();
    }
  } catch {
    // ignore and fallback
  }
  const randomPart = Math.random().toString(36).slice(2, 10);
  const timePart = Date.now().toString(36);
  return `id_${timePart}_${randomPart}`;
}
