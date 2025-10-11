export type SectionKind = 'hero' | 'story' | 'events' | 'gallery' | 'faq' | 'contact' | 'footer';

export interface SiteSection {
  id: string;
  kind: SectionKind;
  name: string;
  visible: boolean;
  data: Record<string, any>;
  order: number;
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
  devicePreset: 'desktop' | 'tablet' | 'mobile';
  lastSaved: string | null;
}

export interface HistoryState {
  past: SiteBuilderState[];
  future: SiteBuilderState[];
  present: SiteBuilderState;
}

export interface SectionRegistry {
  Editor: React.ComponentType<{
    section: SiteSection;
    onChange: (data: Record<string, any>) => void;
  }>;
  Renderer: React.ComponentType<{
    section: SiteSection;
    theme: SiteTheme;
  }>;
  defaultData: Record<string, any>;
  schema: any; // Zod schema
}

export interface DevicePreset {
  name: string;
  width: number;
  icon: React.ReactNode;
}

export interface ContrastCheck {
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'fail';
}