import { videoEditingMedia } from './homePortfolioContent.ts';

export const portfolioPage = {
  hero: {
    title: 'Our Work Speaks',
    subtitle: 'Real results, sharper visuals, and proof-led creative execution across every category.'
  }
} as const;

export const portfolioCollections = {
  'video-editing': videoEditingMedia,
  'graphic-design': [
    {
      type: 'image',
      title: 'Graphic Design 01',
      src: '/assets/graphic-design/g1.jpeg'
    },
    {
      type: 'image',
      title: 'Graphic Design 02',
      src: '/assets/graphic-design/g2.jpeg'
    },
    {
      type: 'image',
      title: 'Graphic Design 03',
      src: '/assets/graphic-design/g3.jpeg'
    },
    {
      type: 'image',
      title: 'Graphic Design 04',
      src: '/assets/graphic-design/g4.jpeg'
    }
  ],
  branding: [
    {
      type: 'image',
      title: 'Branding 01',
      src: '/assets/branding/b1.jpeg'
    },
    {
      type: 'image',
      title: 'Branding 02',
      src: '/assets/branding/b2.jpeg'
    },
    {
      type: 'image',
      title: 'Branding 03',
      src: '/assets/branding/b3.jpeg'
    },
    {
      type: 'image',
      title: 'Branding 04',
      src: '/assets/branding/b4.jpeg'
    }
  ]
} as const;

export const logos = [
  {
    type: 'image',
    title: 'Client Logo 1',
    category: 'Logos',
    src: '/assets/logos/logo-1.jpeg',
    link: '#'
  },
  {
    type: 'image',
    title: 'Client Logo 2',
    category: 'Logos',
    src: '/assets/logos/logo-2.jpeg',
    link: '#'
  },
  {
    type: 'image',
    title: 'Client Logo 3',
    category: 'Logos',
    src: '/assets/logos/logo-3.jpeg',
    link: '#'
  },
  {
    type: 'image',
    title: 'Client Logo 4',
    category: 'Logos',
    src: '/assets/logos/logo-4.jpeg',
    link: '#'
  }
] as const;
