"use client";

import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Paper,
} from '@mui/material';
import {
  DesktopMac as DesktopIcon,
  Tablet as TabletIcon,
  PhoneIphone as MobileIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { DevicePreset } from '@/types/site-builder';
import { SectionRenderer } from './sections/SectionRenderer';

const devicePresets = {
  Desktop: { width: 1200, icon: <DesktopIcon /> },
  Tablet: { width: 768, icon: <TabletIcon /> },
  Mobile: { width: 375, icon: <MobileIcon /> },
};

function ThemeScope({ children }: { children: React.ReactNode }) {
  const { theme } = useSiteBuilderStore();

  const muiTheme = createTheme({
    palette: {
      primary: {
        main: theme.colors.primary,
      },
      secondary: {
        main: theme.colors.secondary,
      },
      background: {
        default: theme.colors.background,
        paper: theme.colors.surface,
      },
    },
    typography: {
      h1: {
        fontSize: `${2.5 * theme.typography.h1}rem`,
      },
      h2: {
        fontSize: `${2.0 * theme.typography.h2}rem`,
      },
      h3: {
        fontSize: `${1.75 * theme.typography.h3}rem`,
      },
      h4: {
        fontSize: `${1.5 * theme.typography.h4}rem`,
      },
      h5: {
        fontSize: `${1.25 * theme.typography.h5}rem`,
      },
      h6: {
        fontSize: `${1.125 * theme.typography.h6}rem`,
      },
      body1: {
        fontSize: `${1.0 * theme.typography.body}rem`,
      },
      body2: {
        fontSize: `${0.875 * theme.typography.body}rem`,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          },
        },
      },
    },
  });

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

function EmptyPreview() {
  const { addSection } = useSiteBuilderStore();

  const quickAddSections = [
    { kind: 'Hero' as const, label: 'Add Hero' },
    { kind: 'Events' as const, label: 'Add Events' },
    { kind: 'Gallery' as const, label: 'Add Gallery' },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent sx={{ py: 6 }}>
          <Typography variant="h5" gutterBottom>
            Your site preview will appear here
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Add sections to start building your site. Here are some popular options to get you started:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {quickAddSections.map((section) => (
              <Chip
                key={section.kind}
                label={section.label}
                clickable
                variant="outlined"
                onClick={() => addSection(section.kind)}
                data-testid={`quick-add-${section.kind.toLowerCase()}`}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export function SiteBuilderPreview() {
  const { sections, devicePreset, setDevicePreset } = useSiteBuilderStore();
  
  const visibleSections = sections.filter(section => section.visible);
  const currentDevice = devicePresets[devicePreset];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Device Preset Toolbar */}
      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 0, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        elevation={0}
      >
        <ButtonGroup variant="outlined" size="small" data-testid="device-presets">
          {(Object.entries(devicePresets) as [DevicePreset, typeof devicePresets[DevicePreset]][]).map(([preset, config]) => (
            <Button
              key={preset}
              onClick={() => setDevicePreset(preset)}
              variant={devicePreset === preset ? 'contained' : 'outlined'}
              startIcon={config.icon}
              data-testid={`device-preset-${preset.toLowerCase()}`}
            >
              {preset}
            </Button>
          ))}
        </ButtonGroup>
      </Paper>

      {/* Preview Container */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          bgcolor: 'grey.100',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: currentDevice.width,
            maxWidth: '100%',
            minHeight: '100%',
            bgcolor: 'background.paper',
            boxShadow: 2,
            borderRadius: 1,
            overflow: 'hidden',
            transition: 'width 0.3s ease',
          }}
          data-testid="preview-container"
        >
          <ThemeScope>
            {visibleSections.length === 0 ? (
              <EmptyPreview />
            ) : (
              <Box>
                {visibleSections.map((section) => (
                  <SectionRenderer key={section.id} section={section} />
                ))}
              </Box>
            )}
          </ThemeScope>
        </Box>
      </Box>
    </Box>
  );
}