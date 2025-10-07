"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from 'primereact/dialog';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { rsvpSchema, RsvpFormValues } from '@/lib/rsvpValidation';
import { useEffect } from 'react';
import { RsvpItem } from '@/types/rsvp';

export type RsvpDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmitRsvp: (r: RsvpItem) => void;
  initial?: RsvpItem | null;
};

export function RsvpDialog({ open, onClose, onSubmitRsvp, initial }: RsvpDialogProps) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      id: '',
      guestName: '',
      eventName: '',
      status: 'Pending',
      mealChoice: '',
      plusOne: false,
      notes: '',
    },
  });

  useEffect(() => {
    if (initial) {
      reset({ ...initial });
    } else {
      reset({ id: '', guestName: '', eventName: '', status: 'Pending', mealChoice: '', plusOne: false, notes: '' });
    }
  }, [initial, reset]);

  const onSubmit = handleSubmit((values) => {
    onSubmitRsvp(values as RsvpItem);
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
    <Dialog header={initial ? 'Edit RSVP' : 'Add RSVP'} visible={open} style={{ width: '36rem' }} onHide={onClose} footer={footer}>
      <Box component="form" id="rsvp-form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Guest Name" {...register('guestName')} error={!!errors.guestName} helperText={errors.guestName?.message} fullWidth />
        <TextField label="Event" {...register('eventName')} error={!!errors.eventName} helperText={errors.eventName?.message} fullWidth />

        <TextField label="Status" select defaultValue="Pending" {...register('status')} error={!!errors.status} fullWidth>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Accepted">Accepted</MenuItem>
          <MenuItem value="Declined">Declined</MenuItem>
          <MenuItem value="Maybe">Maybe</MenuItem>
        </TextField>

        <TextField label="Meal Choice" {...register('mealChoice')} fullWidth />

        <Controller
          control={control}
          name="plusOne"
          render={({ field }) => (
            <Stack direction="row" alignItems="center" spacing={1}>
              <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
              <span>Plus One</span>
            </Stack>
          )}
        />

        <TextField label="Notes" {...register('notes')} multiline minRows={3} fullWidth />
      </Box>
    </Dialog>
  );
}
