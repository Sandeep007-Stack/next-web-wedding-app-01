"use client";

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

export function AccessibilityAnnouncer() {
  const [announcement, setAnnouncement] = useState('');
  const [prevSectionCount, setPrevSectionCount] = useState(0);
  const { sections } = useSiteBuilderStore();

  useEffect(() => {
    if (prevSectionCount !== sections.length) {
      if (sections.length > prevSectionCount && sections.length > 0) {
        const newSection = sections[sections.length - 1];
        setAnnouncement(`Added ${newSection.kind} section: ${newSection.name}`);
      } else if (sections.length < prevSectionCount) {
        setAnnouncement('Section removed');
      }
      setPrevSectionCount(sections.length);
    }
  }, [sections.length, prevSectionCount, sections]);

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  return (
    <Box
      component="div"
      aria-live="polite"
      aria-atomic="true"
      sx={{
        position: 'absolute',
        left: -10000,
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {announcement}
    </Box>
  );
}