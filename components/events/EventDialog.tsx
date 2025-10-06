"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { generateId } from '@/lib/id';
import { eventSchema, EventFormValues } from '@/lib/validation';
import { AmoraEvent } from '@/types/events';

export type EventDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmitEvent: (event: AmoraEvent) => void;
  initial?: AmoraEvent | null;
};

export function EventDialog({ open, onClose, onSubmitEvent, initial }: EventDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: '',
      name: '',
      kind: 'Ceremony',
      startAt: null,
      venue: '',
      mapUrl: '',
      dressCode: '',
      notes: '',
      rsvpRequired: true,
      capacity: null,
    },
  });

  useEffect(() => {
    if (initial) {
      reset({ ...initial });
    } else {
      reset({
        id: generateId(),
        name: '',
        kind: 'Ceremony',
        startAt: null,
        venue: '',
        mapUrl: '',
        dressCode: '',
        notes: '',
        rsvpRequired: true,
        capacity: null,
      });
    }
  }, [initial, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const event: AmoraEvent = {
      ...values,
    };
    onSubmitEvent(event);
    onClose();
  });

  const footer = (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', p: 1 }}>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button type="submit" form="event-form" variant="contained" disabled={isSubmitting}>
        {initial ? 'Save' : 'Create'}
      </Button>
    </Box>
  );

  return (
    <Dialog header={initial ? 'Edit Event' : 'Create Event'} visible={open} style={{ width: '40rem' }} onHide={onClose} footer={footer}>
      <Box component="form" id="event-form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} fullWidth />

        <FormControl fullWidth>
          <InputLabel id="kind-label">Kind</InputLabel>
          <Select labelId="kind-label" label="Kind" defaultValue="Ceremony" {...register('kind')}>
            <MenuItem value="Ceremony">Ceremony</MenuItem>
            <MenuItem value="Reception">Reception</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <FormHelperText>{errors.kind?.message}</FormHelperText>
        </FormControl>

        <Controller
          control={control}
          name="startAt"
          render={({ field }) => (
            <Box>
              <Calendar
                id="startAt"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                showTime
                hourFormat="24"
                dateFormat="yy-mm-dd"
                showIcon
                placeholder="Select date and time"
              />
              <FormHelperText error>{errors.startAt?.message}</FormHelperText>
            </Box>
          )}
        />

        <TextField label="Venue" {...register('venue')} error={!!errors.venue} helperText={errors.venue?.message} fullWidth />
        <TextField label="Map URL" {...register('mapUrl')} error={!!errors.mapUrl} helperText={errors.mapUrl?.message} fullWidth />
        <TextField label="Dress Code" {...register('dressCode')} fullWidth />
        <TextField label="Notes" {...register('notes')} multiline minRows={3} fullWidth />

        <Stack direction="row" spacing={2} alignItems="center">
          <Controller
            control={control}
            name="rsvpRequired"
            render={({ field }) => (
              <Stack direction="row" spacing={1} alignItems="center">
                <InputSwitch checked={field.value} onChange={(e) => field.onChange(e.value)} />
                <span>RSVP Required</span>
              </Stack>
            )}
          />

          <Controller
            control={control}
            name="capacity"
            render={({ field }) => (
              <TextField
                label="Capacity"
                type="number"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                inputProps={{ min: 1 }}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
                sx={{ width: 160 }}
              />
            )}
          />
        </Stack>
      </Box>
    </Dialog>
  );
}
