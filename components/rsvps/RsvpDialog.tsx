"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from 'primereact/dialog';
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { rsvpSchema, RsvpFormValues } from '@/lib/validation';
import { RSVP, MEAL_CHOICES, RSVP_STATUSES } from '@/types/rsvp';
import { useEventsStore } from '@/store/eventsStore';

export type RsvpDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmitRsvp: (r: RSVP) => void;
  initial?: RSVP | null;
};

export function RsvpDialog({ open, onClose, onSubmitRsvp, initial }: RsvpDialogProps) {
  const events = useEventsStore((s) => s.events);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: initial ?? {
      id: '',
      guestName: '',
      eventId: '',
      status: 'Pending',
      mealChoice: 'None',
      plusOne: false,
      notes: '',
    },
  });

  // Reset when initial changes
  // Using explicit fields ensures correct default selections
  useEffect(() => {
    if (initial) {
      reset({ ...initial });
    } else {
      reset({ id: '', guestName: '', eventId: '', status: 'Pending', mealChoice: 'None', plusOne: false, notes: '' });
    }
  }, [initial, reset]);

  const onSubmit = handleSubmit((values) => {
    onSubmitRsvp({ ...values });
    onClose();
  });

  const footer = (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', p: 1 }}>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button type="submit" form="rsvp-form" variant="contained" disabled={isSubmitting}>
        {initial ? 'Save' : 'Add'}
      </Button>
    </Box>
  );

  return (
    <Dialog header={initial ? 'Edit RSVP' : 'Add RSVP'} visible={open} style={{ width: '40rem' }} onHide={onClose} footer={footer}>
      <Box component="form" id="rsvp-form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Guest name" {...register('guestName')} error={!!errors.guestName} helperText={errors.guestName?.message} fullWidth />

        <FormControl fullWidth error={!!errors.eventId}>
          <InputLabel id="event-label">Event</InputLabel>
          <Select labelId="event-label" label="Event" defaultValue="" {...register('eventId')}>
            <MenuItem value=""><em>Select an event</em></MenuItem>
            {events.map((e) => (
              <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.eventId?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!errors.status}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select labelId="status-label" label="Status" defaultValue="Pending" {...register('status')}>
            {RSVP_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.status?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="meal-label">Meal choice</InputLabel>
          <Select labelId="meal-label" label="Meal choice" defaultValue="None" {...register('mealChoice')}>
            {MEAL_CHOICES.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} alignItems="center">
          <Controller
            control={control}
            name="plusOne"
            render={({ field }) => (
              <Stack direction="row" spacing={1} alignItems="center">
                <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                <span>Plus-one</span>
              </Stack>
            )}
          />
        </Stack>

        <TextField label="Notes" {...register('notes')} multiline minRows={3} fullWidth />
      </Box>
    </Dialog>
  );
}
