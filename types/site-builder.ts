export type SectionKind = 'Hero' | 'Story' | 'Events' | 'Gallery' | 'FAQ' | 'Contact' | 'Footer';

export type DevicePreset = 'Desktop' | 'Tablet' | 'Mobile';

export interface SiteSection {
  id: string;
  kind: SectionKind;
  name: string;
  visible: boolean;
  data: Record<string, any>;
}

export interface SiteTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
  typography: {
    display: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    body: number;
    label: number;
  };
}

export interface SiteBuilderState {
  sections: SiteSection[];
  theme: SiteTheme;
  selectedSectionId: string | null;
  devicePreset: DevicePreset;
  history: {
    past: SiteBuilderSnapshot[];
    future: SiteBuilderSnapshot[];
  };
  lastSaved: Date | null;
}

export interface SiteBuilderSnapshot {
  sections: SiteSection[];
  theme: SiteTheme;
  timestamp: Date;
}

export interface SectionConfig {
  kind: SectionKind;
  defaultName: string;
  defaultData: Record<string, any>;
  schema: any; // Zod schema
  Editor: React.ComponentType<{ section: SiteSection; onUpdate: (data: Record<string, any>) => void }>;
  Renderer: React.ComponentType<{ section: SiteSection }>;
}

// Default section data
export const defaultSectionData: Record<SectionKind, Record<string, any>> = {
  Hero: {
    title: 'Welcome to Our Site',
    subtitle: 'This is a hero section',
    backgroundImage: '',
    overlay: 0.3,
    ctaText: 'Get Started',
    ctaLink: '#',
  },
  Story: {
    title: 'Our Story',
    content: 'Tell your story here...',
    images: [],
  },
  Events: {
    title: 'Events',
    showUpcoming: true,
    maxEvents: 6,
  },
  Gallery: {
    title: 'Gallery',
    images: [],
    columns: 3,
  },
  FAQ: {
    title: 'Frequently Asked Questions',
    items: [
      { question: 'Sample question?', answer: 'Sample answer.' }
    ],
  },
  Contact: {
    title: 'Contact Us',
    email: '',
    phone: '',
    address: '',
    showForm: true,
  },
  Footer: {
    copyright: '© 2024 Your Site',
    links: [],
    socialLinks: [],
  },
};

// Default theme
export const defaultTheme: SiteTheme = {
  colors: {
    primary: '#7C3AED',
    secondary: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F9FAFB',
  },
  typography: {
    display: 1.2,
    h1: 1.1,
    h2: 1.05,
    h3: 1.0,
    h4: 0.95,
    h5: 0.9,
    h6: 0.85,
    body: 1.0,
    label: 0.9,
  },
};