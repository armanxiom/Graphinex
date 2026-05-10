const videoEditingMedia = [
  {
    type: 'video',
    title: 'Edit Reel 01',
    category: 'Reel Edit',
    src: '/assets/video-editing/v1.mp4',
    poster: '/assets/video-editing/v1.png',
    link: '#'
  },
  {
    type: 'video',
    title: 'Edit Reel 02',
    category: 'Reel Edit',
    src: '/assets/video-editing/v2.mp4',
    poster: '/assets/video-editing/v2.png',
    link: '#'
  },
  {
    type: 'video',
    title: 'Edit Reel 03',
    category: 'Reel Edit',
    src: '/assets/video-editing/v3.mp4',
    poster: '/assets/video-editing/v3.png',
    link: '#'
  },
  {
    type: 'video',
    title: 'Edit Reel 04',
    category: 'Reel Edit',
    src: '/assets/video-editing/v4.mp4',
    poster: '/assets/video-editing/v4.png',
    link: '#'
  }
] as const;

export { videoEditingMedia };

export const homeFeaturedWorks = [
  {
    type: 'video',
    title: 'Short Hook 01',
    category: 'Featured Work',
    src: '/Short videos/short 1.mp4',
    poster: '/Short videos/cover 1.png',
    link: '#'
  },
  {
    type: 'video',
    title: 'Short Hook 02',
    category: 'Featured Work',
    src: '/Short videos/short 2.mp4',
    poster: '/Short videos/cover 2.png',
    link: '#'
  },
  {
    type: 'video',
    title: 'Short Hook 03',
    category: 'Featured Work',
    src: '/Short videos/short 3.mp4',
    poster: '/Short videos/cover 3.png',
    link: '#'
  },
  {
    type: 'video',
    title: 'Short Hook 04',
    category: 'Featured Work',
    src: '/Short videos/short 4.mp4',
    poster: '/Short videos/cover 4.png',
    link: '#'
  }
] as const;

export const homePortfolioCollections = {
  'video-editing': videoEditingMedia,
  'graphic-design': [
    {
      type: 'image',
      title: 'Graphic Design 01',
      category: 'Visual Design',
      src: '/assets/graphic-design/g1.jpeg'
    },
    {
      type: 'image',
      title: 'Graphic Design 02',
      category: 'Visual Design',
      src: '/assets/graphic-design/g2.jpeg'
    },
    {
      type: 'image',
      title: 'Graphic Design 03',
      category: 'Visual Design',
      src: '/assets/graphic-design/g3.jpeg'
    },
    {
      type: 'image',
      title: 'Graphic Design 04',
      category: 'Visual Design',
      src: '/assets/graphic-design/g4.jpeg'
    }
  ],
  branding: [
    {
      type: 'image',
      title: 'Brand Film 01',
      category: 'Branding',
      src: '/assets/branding/b1.jpeg'
    },
    {
      type: 'image',
      title: 'Brand Film 02',
      category: 'Branding',
      src: '/assets/branding/b2.jpeg'
    },
    {
      type: 'image',
      title: 'Brand Film 03',
      category: 'Branding',
      src: '/assets/branding/b3.jpeg'
    },
    {
      type: 'image',
      title: 'Brand Film 04',
      category: 'Branding',
      src: '/assets/branding/b4.jpeg'
    }
  ]
} as const;
