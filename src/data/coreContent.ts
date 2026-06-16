export const brand = {
  name: 'GRAPHINEX',
  tagline: 'Design. Create. Grow.',
  logo: '/Graphinex%20logo/logo.png',
  location: 'Lucknow, India',
  reach: 'Serving across India and UAE'
} as const;

export const navigation = [
  { name: 'Services', href: '/#services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' }
] as const;

export const hero = {
  heading: 'BUILT FOR GROWTH',
  headingHighlights: ['GROWTH'],
  subheading:
    'Premium branding, content, and motion systems built to attract attention and convert it into revenue.',
  video: '/Hero background video/Video.mp4',
  placeholder: '/hero.jpeg'
} as const;

export const showreel = {
  title: 'Our Showreel',
  youtubeId: '41bEV6Coy3U',
  caption: 'Watch how Graphinex turns raw content into premium visual systems.'
} as const;

export const trustCertificates = [
  {
    title: 'GST Certificate',
    status: 'GST Registered',
    description: 'Verified business document',
    pdfUrl: '/assets/certificates/gst-certificate.pdf'
  },
  {
    title: 'MSME Certificate',
    status: 'MSME Registered',
    description: 'Verified business document',
    pdfUrl: '/assets/certificates/msme-certificate.pdf'
  }
] as const;

export const serviceOverviews = [
  {
    id: 'videoEditing',
    title: 'Video Editing',
    icon: 'VE',
    description: 'High-impact storytelling through cinematic video and professional post-production.',
    previewImage: '/assets/services-hover/video-editing.png',
    portfolioCategory: 'video-editing'
  },
  {
    id: 'graphicDesign',
    title: 'Graphic Design',
    icon: 'GD',
    description: 'Crafting iconic visual identities that resonate with your audience and define your market presence.',
    previewImage: '/assets/services-hover/graphic-design.png',
    portfolioCategory: 'graphic-design'
  },
  {
    id: 'branding',
    title: 'Branding',
    icon: 'BR',
    description: 'Bespoke digital content strategies built with engagement and aesthetics in mind.',
    previewImage: '/assets/services-hover/branding.png',
    portfolioCategory: 'branding'
  }
] as const;

export const results = [
  { label: 'Views Generated', value: '50M+', suffix: '' },
  { label: 'Engagement Growth', value: '3X', suffix: '' },
  { label: 'Projects Delivered', value: '999+', suffix: '' },
  { label: 'Active Clients', value: '450+', suffix: '' }
] as const;

export const contact = {
  phone: '+91 77050 90700',
  email: 'graphinex@gmail.com',
  whatsapp:
    'https://wa.me/917705090700?text=Hi%20Graphinex,%20I%20came%20across%20your%20work%20and%20I%27m%20interested%20in%20your%20services.%20I%27d%20like%20to%20discuss%20a%20project.%20Please%20share%20your%20pricing%20and%20best%20work.'
} as const;

export const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/graphinex.in?igsh=Z3cxYjZ0MDd3NmFq'
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@graphinexagency'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/graphinex-undefined-45a269407?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Twitter / X',
    href: 'https://x.com/Graphinex_in'
  }
] as const;
