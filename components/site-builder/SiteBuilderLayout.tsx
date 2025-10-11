"use client";

import { Box, useMediaQuery, useTheme, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { SiteBuilderToolbar } from './SiteBuilderToolbar';
import { SiteBuilderSidebar } from './SiteBuilderSidebar';
import { SiteBuilderPreview } from './SiteBuilderPreview';
import { SiteBuilderEditor } from './SiteBuilderEditor';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { AccessibilityAnnouncer } from './AccessibilityAnnouncer';

type MobileTab = 'sections' | 'preview' | 'editor';

export function SiteBuilderLayout() {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileTab, setMobileTab] = useState<MobileTab>('preview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Large screens: 3-pane permanent layout
  if (isLarge) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <KeyboardShortcuts />
        <AccessibilityAnnouncer />
        <SiteBuilderToolbar />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box
            sx={{
              width: 320,
              borderRight: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
            data-testid="site-builder-sidebar-container"
          >
            <SiteBuilderSidebar />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <SiteBuilderPreview />
          </Box>
          <Box
            sx={{
              width: 360,
              borderLeft: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
            data-testid="site-builder-editor-container"
          >
            <SiteBuilderEditor />
          </Box>
        </Box>
      </Box>
    );
  }

  // Medium screens: collapsible sidebar
  if (isMedium) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <KeyboardShortcuts />
        <AccessibilityAnnouncer />
        <SiteBuilderToolbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {sidebarOpen && (
            <Box
              sx={{
                width: 320,
                borderRight: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
              data-testid="site-builder-sidebar-container"
            >
              <SiteBuilderSidebar />
            </Box>
          )}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <SiteBuilderPreview />
          </Box>
          <Box
            sx={{
              width: 360,
              borderLeft: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
            data-testid="site-builder-editor-container"
          >
            <SiteBuilderEditor />
          </Box>
        </Box>
      </Box>
    );
  }

  // Small screens: tab switcher
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <KeyboardShortcuts />
      <AccessibilityAnnouncer />
      <SiteBuilderToolbar />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={mobileTab}
          onChange={(_, value) => setMobileTab(value)}
          variant="fullWidth"
          data-testid="site-builder-mobile-tabs"
        >
          <Tab label="Sections" value="sections" />
          <Tab label="Preview" value="preview" />
          <Tab label="Editor" value="editor" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {mobileTab === 'sections' && (
          <Box sx={{ height: '100%' }} data-testid="site-builder-sidebar-container">
            <SiteBuilderSidebar />
          </Box>
        )}
        {mobileTab === 'preview' && (
          <Box sx={{ height: '100%' }}>
            <SiteBuilderPreview />
          </Box>
        )}
        {mobileTab === 'editor' && (
          <Box sx={{ height: '100%' }} data-testid="site-builder-editor-container">
            <SiteBuilderEditor />
          </Box>
        )}
      </Box>
    </Box>
  );
}