"use client";

import { Box, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';

import { SiteBuilderToolbar } from '@/components/site-builder/SiteBuilderToolbar';
import { SiteBuilderSidebar } from '@/components/site-builder/SiteBuilderSidebar';
import { SiteBuilderPreview } from '@/components/site-builder/SiteBuilderPreview';
import { SiteBuilderEditor } from '@/components/site-builder/SiteBuilderEditor';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

export default function SiteBuilderPage() {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'preview' | 'editor'>('sections');
  
  const sections = useSiteBuilderStore((s) => s.sections);
  const reorderSections = useSiteBuilderStore((s) => s.reorderSections);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(oldIndex, newIndex);
      }
    }
    
    setActiveId(null);
  };

  const getActiveSection = () => {
    if (!activeId) return null;
    return sections.find((section) => section.id === activeId);
  };

  if (isLg) {
    // Desktop: 3-pane layout
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteBuilderToolbar />
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SiteBuilderSidebar />
            <SiteBuilderPreview />
            <SiteBuilderEditor />
            <DragOverlay>
              {activeId ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    transform: 'rotate(5deg)',
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {getActiveSection()?.name}
                  </Typography>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>
      </Box>
    );
  }

  if (isMd) {
    // Tablet: Collapsible sidebar
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteBuilderToolbar />
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SiteBuilderSidebar collapsible />
            <Box sx={{ flex: 1, display: 'flex' }}>
              <SiteBuilderPreview />
              <SiteBuilderEditor />
            </Box>
            <DragOverlay>
              {activeId ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    transform: 'rotate(5deg)',
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {getActiveSection()?.name}
                  </Typography>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>
      </Box>
    );
  }

  // Mobile: Tab-based layout
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteBuilderToolbar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {activeTab === 'sections' && <SiteBuilderSidebar mobile />}
          {activeTab === 'preview' && <SiteBuilderPreview mobile />}
          {activeTab === 'editor' && <SiteBuilderEditor mobile />}
          <DragOverlay>
            {activeId ? (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 3,
                  transform: 'rotate(5deg)',
                  opacity: 0.9,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {getActiveSection()?.name}
                </Typography>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </Box>
  );
}