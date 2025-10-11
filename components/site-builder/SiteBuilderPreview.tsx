"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Computer as DesktopIcon,
  Tablet as TabletIcon,
  PhoneAndroid as MobileIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { SiteSection } from '@/types/site-builder';
import { HeroSection } from './sections/HeroSection';
import { StorySection } from './sections/StorySection';
import { EventsSection } from './sections/EventsSection';

interface SiteBuilderPreviewProps {
  mobile?: boolean;
}

const devicePresets = [
  { value: 'desktop', label: 'Desktop', icon: <DesktopIcon />, width: 1200 },
  { value: 'tablet', label: 'Tablet', icon: <TabletIcon />, width: 768 },
  { value: 'mobile', label: 'Mobile', icon: <MobileIcon />, width: 375 },
];

function EmptyState() {
  const addSection = useSiteBuilderStore((s) => s.addSection);

  const quickAddTemplates = [
    { kind: 'hero', label: 'Add Hero' },
    { kind: 'story', label: 'Add Story' },
    { kind: 'events', label: 'Add Events' },
    { kind: 'gallery', label: 'Add Gallery' },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'primary.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <AddIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>
      
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        Add your first section
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        Start building your wedding website by adding sections from the sidebar or use one of these quick templates.
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
        {quickAddTemplates.map((template) => (
          <Chip
            key={template.kind}
            label={template.label}
            onClick={() => addSection(template.kind)}
            variant="outlined"
            clickable
            sx={{ mb: 1 }}
            data-testid={`quick-add-${template.kind}`}
          />
        ))}
      </Stack>
    </Box>
  );
}

function SectionRenderer({ section, theme }: { section: SiteSection; theme: any }) {
  switch (section.kind) {
    case 'hero':
      return <HeroSection section={section} theme={theme} />;
    case 'story':
      return <StorySection section={section} theme={theme} />;
    case 'events':
      return <EventsSection section={section} theme={theme} />;
    default:
      return (
        <Box
          sx={{
            p: 3,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {section.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {section.kind} section - Coming soon
          </Typography>
        </Box>
      );
  }
}

export function SiteBuilderPreview({ mobile = false }: SiteBuilderPreviewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sections = useSiteBuilderStore((s) => s.sections);
  const siteTheme = useSiteBuilderStore((s) => s.theme);
  const devicePreset = useSiteBuilderStore((s) => s.devicePreset);
  const setDevicePreset = useSiteBuilderStore((s) => s.setDevicePreset);

  // Create MUI theme from site theme
  const muiTheme = createTheme({
    palette: {
      primary: { main: siteTheme.colors.primary },
      secondary: { main: siteTheme.colors.secondary },
      background: {
        default: siteTheme.colors.background,
        paper: siteTheme.colors.surface,
      },
    },
    typography: {
      h1: { fontSize: `${2.5 * siteTheme.typography.h1}rem` },
      h2: { fontSize: `${2 * siteTheme.typography.h2}rem` },
      h3: { fontSize: `${1.75 * siteTheme.typography.h3}rem` },
      h4: { fontSize: `${1.5 * siteTheme.typography.h4}rem` },
      h5: { fontSize: `${1.25 * siteTheme.typography.h5}rem` },
      h6: { fontSize: `${1 * siteTheme.typography.h6}rem` },
      body1: { fontSize: `${1 * siteTheme.typography.body}rem` },
      body2: { fontSize: `${0.875 * siteTheme.typography.body}rem` },
      caption: { fontSize: `${0.75 * siteTheme.typography.label}rem` },
    },
  });

  const visibleSections = sections
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);

  const currentPreset = devicePresets.find((preset) => preset.value === devicePreset);
  const previewWidth = currentPreset?.width || 1200;

  const previewContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
        overflow: 'auto',
      }}
    >
      {/* Device Preset Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" fontWeight={600}>
            Live Preview
          </Typography>
          <ToggleButtonGroup
            value={devicePreset}
            exclusive
            onChange={(_, value) => value && setDevicePreset(value)}
            size="small"
            data-testid="device-presets"
            aria-label="Device preview size"
          >
            {devicePresets.map((preset) => (
              <ToggleButton
                key={preset.value}
                value={preset.value}
                aria-label={preset.label}
              >
                {preset.icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Preview Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: previewWidth,
            minHeight: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <ThemeProvider theme={muiTheme}>
            <Container maxWidth={false} sx={{ py: 0 }}>
              {visibleSections.length === 0 ? (
                <EmptyState />
              ) : (
                <Box sx={{ py: 2 }}>
                  {visibleSections.map((section) => (
                    <SectionRenderer key={section.id} section={section} theme={siteTheme} />
                  ))}
                </Box>
              )}
            </Container>
          </ThemeProvider>
        </Box>
      </Box>
    </Box>
  );

  if (mobile) {
    return previewContent;
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {previewContent}
    </Box>
  );
}