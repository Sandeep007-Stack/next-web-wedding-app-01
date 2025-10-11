import { z } from 'zod';
import { SectionKind, SectionRegistry } from '@/types/site-builder';

// Hero Section
const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  backgroundImage: z.string().url().optional(),
  backgroundOverlay: z.number().min(0).max(1).default(0.3),
  textColor: z.string().default('#FFFFFF'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

const heroDefaultData = {
  title: 'Welcome to Our Wedding',
  subtitle: 'Join us as we celebrate our special day',
  backgroundImage: '',
  backgroundOverlay: 0.3,
  textColor: '#FFFFFF',
  alignment: 'center' as const,
  ctaText: 'RSVP Now',
  ctaLink: '#rsvp',
};

// Story Section
const storySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().url().optional(),
  imagePosition: z.enum(['left', 'right']).default('left'),
});

const storyDefaultData = {
  title: 'Our Story',
  content: 'We met in college and have been inseparable ever since. Our journey together has been filled with love, laughter, and countless memories.',
  image: '',
  imagePosition: 'left' as const,
};

// Events Section
const eventsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  showUpcoming: z.boolean().default(true),
  maxEvents: z.number().min(1).max(10).default(3),
  layout: z.enum(['grid', 'list']).default('grid'),
});

const eventsDefaultData = {
  title: 'Wedding Events',
  showUpcoming: true,
  maxEvents: 3,
  layout: 'grid' as const,
};

// Gallery Section
const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  images: z.array(z.string().url()).default([]),
  layout: z.enum(['grid', 'masonry', 'carousel']).default('grid'),
  columns: z.number().min(1).max(4).default(3),
});

const galleryDefaultData = {
  title: 'Photo Gallery',
  images: [],
  layout: 'grid' as const,
  columns: 3,
};

// FAQ Section
const faqSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  items: z.array(z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required'),
  })).default([]),
  layout: z.enum(['accordion', 'list']).default('accordion'),
});

const faqDefaultData = {
  title: 'Frequently Asked Questions',
  items: [
    {
      question: 'What time should I arrive?',
      answer: 'Please arrive 30 minutes before the ceremony begins.',
    },
    {
      question: 'What should I wear?',
      answer: 'Semi-formal attire is requested. Please avoid white.',
    },
  ],
  layout: 'accordion' as const,
};

// Contact Section
const contactSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  showMap: z.boolean().default(false),
  mapEmbed: z.string().optional(),
});

const contactDefaultData = {
  title: 'Get in Touch',
  email: '',
  phone: '',
  address: '',
  showMap: false,
  mapEmbed: '',
};

// Footer Section
const footerSchema = z.object({
  copyright: z.string().default('© 2024 Wedding Website. All rights reserved.'),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
  })).default([]),
  showCredits: z.boolean().default(true),
});

const footerDefaultData = {
  copyright: '© 2024 Wedding Website. All rights reserved.',
  socialLinks: [],
  showCredits: true,
};

// Registry mapping
export const sectionRegistry: Record<SectionKind, SectionRegistry> = {
  hero: {
    Editor: null as any, // Will be implemented in components
    Renderer: null as any, // Will be implemented in components
    defaultData: heroDefaultData,
    schema: heroSchema,
  },
  story: {
    Editor: null as any,
    Renderer: null as any,
    defaultData: storyDefaultData,
    schema: storySchema,
  },
  events: {
    Editor: null as any,
    Renderer: null as any,
    defaultData: eventsDefaultData,
    schema: eventsSchema,
  },
  gallery: {
    Editor: null as any,
    Renderer: null as any,
    defaultData: galleryDefaultData,
    schema: gallerySchema,
  },
  faq: {
    Editor: null as any,
    Renderer: null as any,
    defaultData: faqDefaultData,
    schema: faqSchema,
  },
  contact: {
    Editor: null as any,
    Renderer: null as any,
    defaultData: contactDefaultData,
    schema: contactSchema,
  },
  footer: {
    Editor: null as any,
    Renderer: null as any,
    defaultData: footerDefaultData,
    schema: footerSchema,
  },
};

export const sectionKinds: Array<{ value: SectionKind; label: string; description: string }> = [
  { value: 'hero', label: 'Hero', description: 'Eye-catching banner with title and call-to-action' },
  { value: 'story', label: 'Story', description: 'Share your love story with text and images' },
  { value: 'events', label: 'Events', description: 'Display upcoming wedding events' },
  { value: 'gallery', label: 'Gallery', description: 'Showcase photos in various layouts' },
  { value: 'faq', label: 'FAQ', description: 'Answer common questions' },
  { value: 'contact', label: 'Contact', description: 'Provide contact information and location' },
  { value: 'footer', label: 'Footer', description: 'Footer with links and copyright' },
];