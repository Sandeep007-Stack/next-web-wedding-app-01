"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { sectionRegistry } from '@/lib/section-registry';
import { SiteSection } from '@/types/site-builder';

interface SectionEditorProps {
  section: SiteSection;
}

export function SectionEditor({ section }: SectionEditorProps) {
  const updateSection = useSiteBuilderStore((s) => s.updateSection);
  
  const sectionConfig = sectionRegistry[section.kind];
  const { control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(sectionConfig.schema),
    defaultValues: section.data,
  });

  const watchedData = watch();

  // Update section data when form changes
  useEffect(() => {
    updateSection(section.id, { data: watchedData });
  }, [watchedData, section.id, updateSection]);

  const renderField = (fieldName: string, fieldType: string, fieldConfig: any) => {
    switch (fieldType) {
      case 'string':
        return (
          <Controller
            key={fieldName}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={fieldConfig.label || fieldName}
                fullWidth
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message as string}
                multiline={fieldConfig.multiline}
                rows={fieldConfig.rows}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            key={fieldName}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Box>
                <Typography gutterBottom>
                  {fieldConfig.label || fieldName}
                </Typography>
                <Slider
                  {...field}
                  min={fieldConfig.min || 0}
                  max={fieldConfig.max || 100}
                  step={fieldConfig.step || 1}
                  valueLabelDisplay="auto"
                />
              </Box>
            )}
          />
        );

      case 'boolean':
        return (
          <Controller
            key={fieldName}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Radio {...field} checked={field.value} />}
                label={fieldConfig.label || fieldName}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            key={fieldName}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <FormLabel>{fieldConfig.label || fieldName}</FormLabel>
                <RadioGroup {...field}>
                  {fieldConfig.options?.map((option: any) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        );

      default:
        return (
          <TextField
            key={fieldName}
            label={fieldName}
            fullWidth
            disabled
            value="Unsupported field type"
          />
        );
    }
  };

  // For now, render a simple form based on the section kind
  // This will be replaced with specific editors for each section type
  const renderSectionForm = () => {
    switch (section.kind) {
      case 'hero':
        return (
          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message as string}
                />
              )}
            />
            <Controller
              name="subtitle"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subtitle"
                  fullWidth
                  multiline
                  rows={2}
                />
              )}
            />
            <Controller
              name="backgroundImage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Background Image URL"
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                />
              )}
            />
            <Controller
              name="alignment"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <FormLabel>Text Alignment</FormLabel>
                  <RadioGroup {...field}>
                    <FormControlLabel value="left" control={<Radio />} label="Left" />
                    <FormControlLabel value="center" control={<Radio />} label="Center" />
                    <FormControlLabel value="right" control={<Radio />} label="Right" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Stack>
        );

      case 'story':
        return (
          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message as string}
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Content"
                  fullWidth
                  multiline
                  rows={6}
                  error={!!errors.content}
                  helperText={errors.content?.message as string}
                />
              )}
            />
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Image URL"
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                />
              )}
            />
          </Stack>
        );

      case 'events':
        return (
          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message as string}
                />
              )}
            />
            <Controller
              name="maxEvents"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography gutterBottom>Maximum Events to Show</Typography>
                  <Slider
                    {...field}
                    min={1}
                    max={10}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Box>
              )}
            />
            <Controller
              name="layout"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <FormLabel>Layout</FormLabel>
                  <RadioGroup {...field}>
                    <FormControlLabel value="grid" control={<Radio />} label="Grid" />
                    <FormControlLabel value="list" control={<Radio />} label="List" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Stack>
        );

      default:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {section.kind.charAt(0).toUpperCase() + section.kind.slice(1)} Section
            </Typography>
            <Typography color="text.secondary">
              Editor for {section.kind} sections coming soon.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Edit {section.name}
      </Typography>
      {renderSectionForm()}
    </Box>
  );
}