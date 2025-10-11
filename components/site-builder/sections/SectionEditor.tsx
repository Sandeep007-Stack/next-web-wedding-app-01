"use client";

import { SiteSection } from '@/types/site-builder';
import { HeroEditor } from './HeroEditor';
import { StoryEditor } from './StoryEditor';
import { EventsEditor } from './EventsEditor';
import { GalleryEditor } from './GalleryEditor';
import { FAQEditor } from './FAQEditor';
import { ContactEditor } from './ContactEditor';
import { FooterEditor } from './FooterEditor';

interface SectionEditorProps {
  section: SiteSection;
}

export function SectionEditor({ section }: SectionEditorProps) {
  switch (section.kind) {
    case 'Hero':
      return <HeroEditor section={section} />;
    case 'Story':
      return <StoryEditor section={section} />;
    case 'Events':
      return <EventsEditor section={section} />;
    case 'Gallery':
      return <GalleryEditor section={section} />;
    case 'FAQ':
      return <FAQEditor section={section} />;
    case 'Contact':
      return <ContactEditor section={section} />;
    case 'Footer':
      return <FooterEditor section={section} />;
    default:
      return null;
  }
}