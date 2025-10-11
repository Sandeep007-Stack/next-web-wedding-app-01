"use client";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import {
  Tune as SectionIcon,
  Palette as ThemeIcon,
  ArrowBack as ArrowIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { SectionEditor } from './sections/SectionEditor';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testId?: string;
}

function ColorField({ label, value, onChange, testId }: ColorFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Simple contrast check (simplified version)
  const getContrastRatio = (color: string) => {
    // This is a simplified contrast check
    // In a real implementation, you'd use a proper color contrast library
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'light' : 'dark';
  };

  const contrastLevel = getContrastRatio(value);
  const hasGoodContrast = contrastLevel === 'dark' || contrastLevel === 'light';

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel shrink>{label}</InputLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: value,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              cursor: 'pointer',
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = value;
              input.onchange = (e) => handleChange((e.target as HTMLInputElement).value);
              input.click();
            }}
            data-testid={testId}
          />
          <TextField
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ pattern: '^#[0-9A-Fa-f]{6}$' }}
          />
          {hasGoodContrast && (
            <Chip
              label="AA"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </FormControl>
    </Box>
  );
}

function ThemeEditor() {
  const { theme, updateThemeColors, updateThemeTypography } = useSiteBuilderStore();

  const typographyTokens = [
    { key: 'display' as const, label: 'Display' },
    { key: 'h1' as const, label: 'Heading 1' },
    { key: 'h2' as const, label: 'Heading 2' },
    { key: 'h3' as const, label: 'Heading 3' },
    { key: 'h4' as const, label: 'Heading 4' },
    { key: 'h5' as const, label: 'Heading 5' },
    { key: 'h6' as const, label: 'Heading 6' },
    { key: 'body' as const, label: 'Body Text' },
    { key: 'label' as const, label: 'Label' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Theme Settings
      </Typography>

      <Stack spacing={3}>
        {/* Colors */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Colors
          </Typography>
          <Stack spacing={2}>
            <ColorField
              label="Primary Color"
              value={theme.colors.primary}
              onChange={(value) => updateThemeColors({ primary: value })}
              testId="primary-color-picker"
            />
            <ColorField
              label="Secondary Color"
              value={theme.colors.secondary}
              onChange={(value) => updateThemeColors({ secondary: value })}
              testId="secondary-color-picker"
            />
            <ColorField
              label="Background Color"
              value={theme.colors.background}
              onChange={(value) => updateThemeColors({ background: value })}
              testId="background-color-picker"
            />
            <ColorField
              label="Surface Color"
              value={theme.colors.surface}
              onChange={(value) => updateThemeColors({ surface: value })}
              testId="surface-color-picker"
            />
          </Stack>
        </Box>

        {/* Typography */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Typography Scale
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Adjust the size multipliers for different text elements
          </Typography>
          <Stack spacing={2}>
            {typographyTokens.map((token) => (
              <Box key={token.key}>
                <Typography variant="body2" gutterBottom>
                  {token.label}: {theme.typography[token.key].toFixed(2)}x
                </Typography>
                <Slider
                  value={theme.typography[token.key]}
                  onChange={(_, value) =>
                    updateThemeTypography({ [token.key]: value as number })
                  }
                  min={0.75}
                  max={1.5}
                  step={0.05}
                  size="small"
                  data-testid={`typography-${token.key}-slider`}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function SectionEditorTab() {
  const { sections, selectedSectionId, selectSection } = useSiteBuilderStore();
  const selectedSection = sections.find(s => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Card>
          <CardContent sx={{ py: 6 }}>
            <ArrowIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Select a section to edit
            </Typography>
            <Typography color="text.secondary">
              Choose a section from the sidebar to customize its content and appearance.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit {selectedSection.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {selectedSection.kind} Section
      </Typography>
      
      <SectionEditor section={selectedSection} />
    </Box>
  );
}

export function SiteBuilderEditor() {
  const [activeTab, setActiveTab] = useState<'section' | 'theme'>('section');

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="fullWidth"
          data-testid="editor-tabs"
        >
          <Tab
            icon={<SectionIcon />}
            label="Section"
            value="section"
            data-testid="section-tab"
          />
          <Tab
            icon={<ThemeIcon />}
            label="Theme"
            value="theme"
            data-testid="theme-tab"
          />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'section' && <SectionEditorTab />}
        {activeTab === 'theme' && <ThemeEditor />}
      </Box>
    </Box>
  );
}