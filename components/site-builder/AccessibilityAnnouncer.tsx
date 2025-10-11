"use client";

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

export function AccessibilityAnnouncer() {
  const [announcement, setAnnouncement] = useState('');
  const { sections } = useSiteBuilderStore();

  useEffect(() => {
    // Listen for section changes and announce them
    const prevSectionsRef = { current: sections };
    
    if (prevSectionsRef.current.length !== sections.length) {
      if (sections.length > prevSectionsRef.current.length) {
        const newSection = sections[sections.length - 1];
        setAnnouncement(`Added ${newSection.kind} section: ${newSection.name}`);
      } else {
        setAnnouncement('Section removed');
      }
    }

    prevSectionsRef.current = sections;
  }, [sections]);

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