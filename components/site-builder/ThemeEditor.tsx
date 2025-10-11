"use client";

import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { SiteTheme } from '@/types/site-builder';

interface ThemeFormData {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
  typography: {
    display: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    body: number;
    label: number;
  };
}

function ColorField({ 
  name, 
  label, 
  value, 
  onChange 
}: { 
  name: string; 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [contrastWarning, setContastWarning] = useState<string | null>(null);

  const checkContrast = (color: string) => {
    // Simple contrast check - in a real app, you'd use a proper contrast calculation
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (brightness < 128) {
      setContastWarning('Dark color - ensure good contrast');
    } else {
      setContastWarning(null);
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    checkContrast(newValue);
  };

  return (
    <Box>
      <FormLabel>{label}</FormLabel>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
        <TextField
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          size="small"
          placeholder="#000000"
          sx={{ flex: 1 }}
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: value,
            border: 1,
            borderColor: 'divider',
          }}
        />
        {contrastWarning && (
          <Chip
            label="AA"
            size="small"
            color="warning"
            variant="outlined"
            title={contrastWarning}
          />
        )}
      </Stack>
    </Box>
  );
}

function TypographySlider({ 
  name, 
  label, 
  value, 
  onChange 
}: { 
  name: string; 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
}) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {value.toFixed(2)}x
        </Typography>
      </Stack>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={0.5}
        max={2}
        step={0.1}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value.toFixed(1)}x`}
      />
    </Box>
  );
}

export function ThemeEditor() {
  const theme = useSiteBuilderStore((s) => s.theme);
  const updateTheme = useSiteBuilderStore((s) => s.updateTheme);

  const { control, watch } = useForm<ThemeFormData>({
    defaultValues: theme,
  });

  const watchedData = watch();

  // Update theme when form changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateTheme(watchedData);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [watchedData, updateTheme]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Theme Settings
      </Typography>

      <Stack spacing={4}>
        {/* Colors Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Colors
          </Typography>
          <Stack spacing={3}>
            <Controller
              name="colors.primary"
              control={control}
              render={({ field }) => (
                <ColorField
                  name={field.name}
                  label="Primary Color"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="colors.secondary"
              control={control}
              render={({ field }) => (
                <ColorField
                  name={field.name}
                  label="Secondary Color"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="colors.background"
              control={control}
              render={({ field }) => (
                <ColorField
                  name={field.name}
                  label="Background Color"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="colors.surface"
              control={control}
              render={({ field }) => (
                <ColorField
                  name={field.name}
                  label="Surface Color"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Stack>
        </Box>

        {/* Typography Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Typography Scale
          </Typography>
          <Stack spacing={3}>
            <Controller
              name="typography.display"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Display"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.h1"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Heading 1"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.h2"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Heading 2"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.h3"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Heading 3"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.h4"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Heading 4"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.h5"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Heading 5"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.h6"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Heading 6"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.body"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Body Text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="typography.label"
              control={control}
              render={({ field }) => (
                <TypographySlider
                  name={field.name}
                  label="Label Text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Stack>
        </Box>

        {/* Preview Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Preview
          </Typography>
          <Box
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h1" sx={{ mb: 1 }}>
              Heading 1
            </Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Heading 2
            </Typography>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Heading 3
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              This is body text that shows how your typography scale looks.
            </Typography>
            <Typography variant="caption">
              This is caption text for labels and small details.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}