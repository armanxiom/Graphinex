export type ServicePageKey = 'video-editing' | 'logo-design' | 'social-media-design';

export type ServicePageContent = {
  title: string;
  description: string;
  hero: string;
  intro: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  cta: {
    primaryLabel: string;
    secondaryLabel: string;
  };
};

export const servicePageContent: Record<ServicePageKey, ServicePageContent> = {
  'video-editing': {
    title: 'Video Editing Agency for Brands That Want More Leads',
    description:
      'Graphinex Creative is a video editing agency that turns raw footage into high-retention, conversion-focused content for brands, creators, and businesses.',
    hero: 'We edit content that keeps attention, builds trust, and turns viewers into leads.',
    intro: [
      'A strong video editing agency does more than cut clips together. It shapes pacing, emotion, hooks, sound design, and visual rhythm so the final piece feels like a polished sales asset instead of just another upload. At Graphinex Creative, we build edits that help brands hold attention, communicate value quickly, and move viewers toward action.',
      'Whether you need reels, short-form ads, YouTube content, founder videos, product stories, or campaign assets, we focus on the outcome behind every edit. We want the audience to watch longer, understand faster, and trust your brand more. That is why our process blends strategy, storytelling, and execution in one system.'
    ],
    sections: [
      {
        heading: 'What a modern video editing agency should deliver',
        paragraphs: [
          'A modern video editing agency must understand more than software. It needs to understand how people watch content on mobile, when they drop off, what creates curiosity, and what builds momentum toward a click or enquiry. We edit for pacing, clarity, and retention, because those are the levers that drive business results.',
          'Our editing approach works for brands that want to post consistently without losing quality. We refine hooks, trim filler, improve sound, balance colors, and structure each video so the message lands quickly. The goal is not just to make the content look good. The goal is to make it perform better across social platforms, ads, and websites.'
        ]
      },
      {
        heading: 'How we make content convert',
        paragraphs: [
          'Every project starts with intent. We look at the audience, the platform, and the action you want from the viewer. A reel designed for reach needs a different structure than an ad designed for leads. A YouTube video designed for authority needs different pacing than a testimonial video designed for trust. That is why our edits are shaped around business goals instead of generic templates.',
          'We also keep conversion in mind at the micro level. Strong on-screen text, clear transitions, visual emphasis, and brand consistency can all improve the chance that someone keeps watching and remembers your message. These details matter, because the best content does not just attract views. It creates interest that can be measured in clicks, enquiries, bookings, and sales.'
        ]
      },
      {
        heading: 'Why brands choose Graphinex Creative',
        paragraphs: [
          'Brands work with us when they want a video editing partner who thinks like a marketer as well as a creative team. We care about the final outcome: retention, response, and revenue. That means we do not stop at polished visuals. We pay attention to the structure that gets those visuals seen by the right people.',
          'We are also built for speed and consistency. Once the direction is set, our workflow makes it easier to produce content regularly without sacrificing quality. That helps creators stay visible, agencies stay on schedule, and businesses keep their marketing engine moving.'
        ]
      },
      {
        heading: 'What you get when you work with us',
        paragraphs: [
          'You get clean communication, a clear process, and edits designed to support growth. You also get a team that understands that a good edit should feel natural to the viewer while being strategically engineered behind the scenes. That balance is what turns simple footage into a lead-generation asset.',
          'If your brand needs content that looks premium and performs better, our video editing services are built for you. We can help with short-form content, ad creatives, testimonials, product explainers, and high-impact brand storytelling that supports the next stage of your growth.'
        ]
      }
    ],
    cta: {
      primaryLabel: 'Start on WhatsApp',
      secondaryLabel: 'Back to Home'
    }
  },
  'logo-design': {
    title: 'Logo Design Agency for Stronger Brand Identity',
    description:
      'Graphinex Creative is a logo design and brand identity agency that builds memorable visual systems for businesses that want to look premium and trustworthy.',
    hero: 'We create logos that look sharp, feel strategic, and support long-term brand growth.',
    intro: [
      'A logo is often the first visual impression your business makes, which means it has to do more than simply look nice. It has to communicate confidence, clarity, and relevance in a single mark. At Graphinex Creative, we approach logo design as a business asset, not just a visual decoration.',
      'As a logo design agency, we create identities that work across websites, social media, packaging, proposals, video intros, and print. Our focus is on making sure the mark is recognizable, versatile, and aligned with the market you want to attract. The result is a logo system that helps your brand feel established from day one.'
    ],
    sections: [
      {
        heading: 'Why thoughtful logo design matters',
        paragraphs: [
          'A strong logo helps people remember you, but it also helps them trust you. When your visual identity feels consistent and professional, it sends a signal that your business is serious about quality. That signal matters across every channel, from social media profiles to pitch decks and landing pages.',
          'Good logo design should also be practical. It needs to scale, read clearly on small screens, and work in light and dark environments. We design with those real-world use cases in mind so your brand does not lose impact when it leaves the mockup and starts living in the market.'
        ]
      },
      {
        heading: 'Our identity design process',
        paragraphs: [
          'We begin with discovery: what does your business stand for, who is the audience, and what feeling should the brand create? From there, we shape direction around shape language, typography, spacing, and tone. That process helps us build marks that feel intentional rather than generic.',
          'Once the logo direction is set, we refine the system so it can support a wider identity. That may include icon marks, type rules, alternate lockups, usage guidance, and a visual framework that can be applied across digital assets. This gives you a logo that works as part of a larger brand story.'
        ]
      },
      {
        heading: 'How logo design improves conversion',
        paragraphs: [
          'Brand trust plays a direct role in conversions. If a visitor lands on your site or social profile and immediately sees a clear, polished identity, they are more likely to stay, explore, and contact you. A logo will not close the sale by itself, but it supports the credibility that makes a sale easier.',
          'That is why we design identities that look premium and consistent from every angle. A stronger visual system can improve perceived value, support ad performance, and make it easier for prospects to remember your business when they are ready to buy.'
        ]
      },
      {
        heading: 'What you can expect from Graphinex Creative',
        paragraphs: [
          'You can expect a thoughtful process, professional presentation, and a final result that feels ready for business. We create logo design work that is strategic, flexible, and built to last, so you can use it across your website, socials, and marketing materials without constantly redesigning the brand.',
          'If you need a logo design agency that understands both aesthetics and business outcomes, Graphinex Creative is ready to help. We can build a cleaner identity for a new launch or refresh an existing brand so it feels sharper, more relevant, and easier to trust.'
        ]
      }
    ],
    cta: {
      primaryLabel: 'Talk on WhatsApp',
      secondaryLabel: 'View Social Media Design'
    }
  },
  'social-media-design': {
    title: 'Social Media Design Agency for High-Impact Content',
    description:
      'Graphinex Creative is a social media design agency creating posts, ad creatives, thumbnails, and branded graphics that help brands stand out and convert.',
    hero: 'We design social media content that is consistent, eye-catching, and built for engagement.',
    intro: [
      'Social media is crowded, which means design has to do heavy lifting. Your content needs to stop the scroll, communicate value fast, and fit the personality of your brand. As a social media design agency, Graphinex Creative builds visuals that help brands stand out without losing clarity.',
      'We design for consistency and performance. That includes post templates, reels covers, thumbnails, carousels, ad creatives, story graphics, launch visuals, and campaign assets. The goal is to make your brand look cohesive while improving the chance that people click, read, save, share, or enquire.'
    ],
    sections: [
      {
        heading: 'What high-performing social media design looks like',
        paragraphs: [
          'High-performing social media design starts with readability. People often see your content for only a second or two before deciding whether to stop. That means the visual hierarchy, typography, and contrast all matter. We design graphics that are easy to scan, aligned with the platform, and clear at mobile size.',
          'But strong social design is not only about visual impact. It should also reinforce your brand strategy. The same color language, layout system, and tone should carry across your content so your audience begins to recognize you faster. Familiarity is a powerful conversion tool because it builds trust over time.'
        ]
      },
      {
        heading: 'How we build design systems for social growth',
        paragraphs: [
          'Instead of creating one-off graphics that feel disconnected, we build repeatable systems. That makes it easier to publish content frequently while keeping a premium look. It also helps your team maintain quality as content volume grows, which is important for brands that need to stay active across multiple channels.',
          'The design system can support launches, campaigns, offers, thought-leadership posts, testimonials, and educational content. Because the structure is planned, your posts can move faster through production and still feel polished. That efficiency matters when content is part of your lead generation engine.'
        ]
      },
      {
        heading: 'Why social media design affects leads',
        paragraphs: [
          'The better your graphics communicate value, the easier it is to attract the right audience. Good social media design improves the quality of the first impression, which can affect engagement, profile visits, and direct inquiries. It also supports the rest of your funnel by making your content easier to remember.',
          'For brands that depend on visibility, design can be the difference between content that is ignored and content that creates momentum. We focus on helping your posts look professional, persuasive, and consistent so they support both brand awareness and conversion goals.'
        ]
      },
      {
        heading: 'What Graphinex Creative delivers',
        paragraphs: [
          'We deliver social media design that is practical for daily marketing and strong enough to make your brand look established. Whether you need marketing creatives, thumbnail systems, branded post layouts, or ad-ready visuals, we create assets that help you show up with more authority.',
          'If you want a social media design agency that understands both aesthetics and business performance, we can help. Graphinex Creative builds creative systems that are easy to maintain, visually memorable, and designed to support lead generation over time.'
        ]
      }
    ],
    cta: {
      primaryLabel: 'Message Us',
      secondaryLabel: 'See Video Editing'
    }
  }
};

export const homeSeoCopy = {
  intro: [
    'Graphinex Creative is a modern creative agency built for brands that want better visibility, stronger trust, and more qualified leads. We help businesses turn content into clients by combining strategy, storytelling, and execution across video editing, graphic design, and branding. The result is creative work that does more than look good. It supports growth.',
    'If you are looking for a video editing agency, a graphic design agency, or a branding agency that understands conversion as well as aesthetics, our process is built around those priorities. We use content systems that make it easier to publish consistently, communicate value clearly, and create a more memorable impression on the audience you want to reach.'
  ],
  services: [
    {
      title: 'Video Editing Agency',
      text: 'We edit short-form videos, ads, reels, testimonials, and branded stories for companies that need stronger retention and more action from viewers. Good editing helps your message land faster and keeps people watching long enough to understand what makes your offer worth choosing.'
    },
    {
      title: 'Graphic Design Agency',
      text: 'Our graphic design agency work covers social posts, thumbnails, campaign assets, and visual identity materials. We create designs that are clean, readable, and persuasive, so your brand looks premium and remains consistent across every touchpoint.'
    },
    {
      title: 'Branding Agency',
      text: 'As a branding agency, we help shape the visual language that makes your business recognizable and memorable. From logo systems to brand direction, we build identities that can grow with your company and support a stronger presence across digital channels.'
    }
  ],
  reasons: [
    'Conversion-first creative that is designed to support enquiries, bookings, and sales.',
    'A clear, scalable process that keeps production moving without sacrificing quality.',
    'Brand consistency across every asset so your business feels more trustworthy and premium.',
    'Flexible content systems that make it easier to grow your presence across platforms.'
  ]
};
