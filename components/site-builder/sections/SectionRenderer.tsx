"use client";

import { SiteSection } from '@/types/site-builder';
import { HeroRenderer } from './HeroRenderer';
import { StoryRenderer } from './StoryRenderer';
import { EventsRenderer } from './EventsRenderer';
import { GalleryRenderer } from './GalleryRenderer';
import { FAQRenderer } from './FAQRenderer';
import { ContactRenderer } from './ContactRenderer';
import { FooterRenderer } from './FooterRenderer';

interface SectionRendererProps {
  section: SiteSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.kind) {
    case 'Hero':
      return <HeroRenderer section={section} />;
    case 'Story':
      return <StoryRenderer section={section} />;
    case 'Events':
      return <EventsRenderer section={section} />;
    case 'Gallery':
      return <GalleryRenderer section={section} />;
    case 'FAQ':
      return <FAQRenderer section={section} />;
    case 'Contact':
      return <ContactRenderer section={section} />;
    case 'Footer':
      return <FooterRenderer section={section} />;
    default:
      return null;
  }
}