import { slugify } from './crypto';

export type ResourceName =
  | 'homepage_content'
  | 'hero_sections'
  | 'services'
  | 'portfolio_projects'
  | 'testimonials'
  | 'team_members'
  | 'media_assets'
  | 'seo_settings'
  | 'contact_details'
  | 'footer_content';

export interface ResourceConfig {
  name: ResourceName;
  table: string;
  singleton: boolean;
  resourceKey?: string;
}

const RESOURCE_CONFIG: Record<ResourceName, ResourceConfig> = {
  homepage_content: {
    name: 'homepage_content',
    table: 'homepage_content',
    singleton: true,
    resourceKey: 'site-home'
  },
  hero_sections: {
    name: 'hero_sections',
    table: 'hero_sections',
    singleton: true,
    resourceKey: 'home'
  },
  services: {
    name: 'services',
    table: 'services',
    singleton: false
  },
  portfolio_projects: {
    name: 'portfolio_projects',
    table: 'portfolio_projects',
    singleton: false
  },
  testimonials: {
    name: 'testimonials',
    table: 'testimonials',
    singleton: false
  },
  team_members: {
    name: 'team_members',
    table: 'team_members',
    singleton: false
  },
  media_assets: {
    name: 'media_assets',
    table: 'media_assets',
    singleton: false
  },
  seo_settings: {
    name: 'seo_settings',
    table: 'seo_settings',
    singleton: false
  },
  contact_details: {
    name: 'contact_details',
    table: 'contact_details',
    singleton: true,
    resourceKey: 'site-contact'
  },
  footer_content: {
    name: 'footer_content',
    table: 'footer_content',
    singleton: true,
    resourceKey: 'site-footer'
  }
};

export function resolveResource(resource: string): ResourceConfig | null {
  return (resource in RESOURCE_CONFIG ? RESOURCE_CONFIG[resource as ResourceName] : null) ?? null;
}

export function makeSlug(name: string, fallbackPrefix = 'item') {
  const slug = slugify(name);
  return slug || `${fallbackPrefix}-${Math.random().toString(36).slice(2, 8)}`;
}
