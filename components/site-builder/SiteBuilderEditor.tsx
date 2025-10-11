"use client";

import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { SectionEditor } from './SectionEditor';
import { ThemeEditor } from './ThemeEditor';

interface SiteBuilderEditorProps {
  mobile?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function SiteBuilderEditor({ mobile = false }: SiteBuilderEditorProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  
  const selectedSectionId = useSiteBuilderStore((s) => s.selectedSectionId);
  const sections = useSiteBuilderStore((s) => s.sections);
  
  const selectedSection = selectedSectionId 
    ? sections.find((s) => s.id === selectedSectionId)
    : null;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const editorContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="editor tabs"
          variant="fullWidth"
        >
          <Tab label="Section" id="editor-tab-0" aria-controls="editor-tabpanel-0" />
          <Tab label="Theme" id="editor-tab-1" aria-controls="editor-tabpanel-1" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          {selectedSection ? (
            <SectionEditor section={selectedSection} />
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 3,
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Select a section to edit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a section from the sidebar to start editing its content and settings.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ThemeEditor />
        </TabPanel>
      </Box>
    </Box>
  );

  if (mobile) {
    return editorContent;
  }

  return (
    <Box
      sx={{
        width: 400,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {editorContent}
    </Box>
  );
}