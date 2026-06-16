import {
  activity,
  brand,
  contact,
  happyClients,
  hero,
  homeFeaturedWorks,
  homePortfolioCollections,
  logos,
  navigation,
  portfolioCollections,
  portfolioPage,
  process as workflowSteps,
  results,
  reviews,
  serviceOverviews,
  showreel,
  socials,
  testimonials,
  trustCertificates
} from '../data/siteConfig.ts';

export type MediaKind = 'image' | 'video';

export interface BrandContent {
  name: string;
  tagline: string;
  logo: string;
  location: string;
  reach: string;
}

export interface NavigationItem {
  name: string;
  href: string;
}

export interface HeroContent {
  heading: string;
  headingHighlights: string[];
  subheading: string;
  video: string;
  placeholder: string;
}

export interface ShowreelContent {
  title: string;
  youtubeId: string;
  caption: string;
}

export interface CertificateContent {
  title: string;
  status: string;
  description: string;
  pdfUrl: string;
}

export interface ServiceOverviewContent {
  id: string;
  title: string;
  icon: string;
  description: string;
  previewImage: string;
  portfolioCategory: string;
}

export interface ResultMetricContent {
  label: string;
  value: string;
  suffix?: string;
}

export interface ContactContent {
  phone: string;
  email: string;
  whatsapp: string;
}

export interface SocialLinkContent {
  name: string;
  href: string;
}

export interface MediaItemContent {
  type: MediaKind;
  title: string;
  category: string;
  src: string;
  poster?: string;
  link?: string;
  ratio?: 'landscape' | 'square';
}

export type PortfolioCollectionContent = Record<'video-editing' | 'graphic-design' | 'branding', MediaItemContent[]>;

export interface PortfolioPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
}

export interface HappyClientContent {
  name: string;
  role: string;
  quote: string;
  image: string;
  instagram: string;
  youtube?: string;
}

export interface TestimonialContent {
  name: string;
  role: string;
  rating: number;
  review: string;
}

export interface WorkflowStepContent {
  step: string;
  name: string;
  description: string;
  previewImage: string;
}

export interface ReviewContent {
  name: string;
  type: string;
  text: string;
  time: string;
}

export interface FooterContent {
  brandMessage: string;
  privacyLabel: string;
  termsLabel: string;
  registeredBusinessName: string;
  gstLabel: string;
  udyamLabel: string;
}

export interface SeoPageContent {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  robots: string;
}

export interface TeamMemberContent {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  socialLinks: Array<{ name: string; href: string }>;
  status: 'published' | 'draft';
}

export interface SiteContent {
  brand: BrandContent;
  navigation: NavigationItem[];
  hero: HeroContent;
  showreel: ShowreelContent;
  trustCertificates: CertificateContent[];
  serviceOverviews: ServiceOverviewContent[];
  results: ResultMetricContent[];
  contact: ContactContent;
  socials: SocialLinkContent[];
  homeFeaturedWorks: MediaItemContent[];
  homePortfolioCollections: PortfolioCollectionContent;
  portfolioCollections: PortfolioCollectionContent;
  portfolioPage: PortfolioPageContent;
  logos: MediaItemContent[];
  happyClients: HappyClientContent[];
  testimonials: TestimonialContent[];
  process: WorkflowStepContent[];
  reviews: ReviewContent[];
  activity: string[];
  footer: FooterContent;
  seo: {
    home: SeoPageContent;
    portfolio: SeoPageContent;
  };
  teamMembers: TeamMemberContent[];
}

export const defaultSiteContent = {
  brand,
  navigation,
  hero,
  showreel,
  trustCertificates,
  serviceOverviews,
  results,
  contact,
  socials,
  homeFeaturedWorks,
  homePortfolioCollections,
  portfolioCollections,
  portfolioPage,
  logos,
  happyClients,
  testimonials,
  process: workflowSteps,
  reviews,
  activity,
  footer: {
    brandMessage:
      'Transforming your content into a client-acquisition machine with sharper branding, cleaner edits, and premium visual systems built to convert.',
    privacyLabel: 'Privacy Policy',
    termsLabel: 'Terms',
    registeredBusinessName: 'Graphinex Enterprises',
    gstLabel: 'GSTIN: 09FOXPA7667R1ZI',
    udyamLabel: 'Udyam: UDYAM-UP-04-0049600'
  },
  seo: {
    home: {
      title: 'Graphinex Creative | Video Editing, Graphic Design & Branding Agency',
      description:
        'Graphinex Creative is a results-driven creative agency specializing in video editing, graphic design, and branding. We turn your content into clients.',
      canonical: 'https://graphinex.in/',
      ogImage: 'https://graphinex.in/Graphinex%20logo/logo.png',
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    },
    portfolio: {
      title: 'Graphinex Portfolio | Premium Creative Work',
      description:
        'Explore selected video editing, graphic design, and branding work created by Graphinex.',
      canonical: 'https://graphinex.in/portfolio',
      ogImage: 'https://graphinex.in/Graphinex%20logo/logo.png',
      robots: 'index, follow'
    }
  },
  teamMembers: []
} as unknown as SiteContent;

export interface SiteContentEnvelope {
  content: SiteContent;
  version: string;
  updatedAt: string | null;
  source: 'database' | 'fallback' | 'preview';
  preview: boolean;
}

export function cloneSiteContent(content: SiteContent): SiteContent {
  return structuredClone(content);
}

function replaceArray(target: any, source: any) {
  const mutableTarget = target as any[];
  mutableTarget.splice(0, mutableTarget.length, ...structuredClone(source));
}

function replaceObject(target: Record<string, any>, source: Record<string, any>) {
  Object.assign(target, structuredClone(source));
}

export function syncStaticSiteContent(content: SiteContent) {
  replaceObject(brand, content.brand);
  replaceArray(navigation, content.navigation);
  replaceObject(hero, content.hero);
  replaceObject(showreel, content.showreel);
  replaceArray(trustCertificates, content.trustCertificates);
  replaceArray(serviceOverviews, content.serviceOverviews);
  replaceArray(results, content.results);
  replaceObject(contact, content.contact);
  replaceArray(socials, content.socials);
  replaceArray(homeFeaturedWorks, content.homeFeaturedWorks);
  replaceObject(homePortfolioCollections, content.homePortfolioCollections);
  replaceObject(portfolioCollections, content.portfolioCollections);
  replaceObject(portfolioPage, content.portfolioPage);
  replaceArray(logos, content.logos);
  replaceArray(happyClients, content.happyClients);
  replaceArray(testimonials, content.testimonials);
  replaceArray(workflowSteps, content.process);
  replaceArray(reviews, content.reviews);
  replaceArray(activity, content.activity);
}
