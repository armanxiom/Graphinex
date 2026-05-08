/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const videoEditingMedia = [
  {
    type: "video",
    title: "Edit Reel 01",
    category: "Reel Edit",
    src: new URL("../../Videos/Video 1.mp4", import.meta.url).href,
    poster: new URL("../../Videos/Video cover 1.png", import.meta.url).href,
    link: "#"
  },
  {
    type: "video",
    title: "Edit Reel 02",
    category: "Reel Edit",
    src: new URL("../../Videos/Video 2.mp4", import.meta.url).href,
    poster: new URL("../../Videos/Video cover 2.png", import.meta.url).href,
    link: "#"
  },
  {
    type: "video",
    title: "Edit Reel 03",
    category: "Reel Edit",
    src: new URL("../../Videos/Video 3.mp4", import.meta.url).href,
    poster: new URL("../../Videos/Video cover 3.png", import.meta.url).href,
    link: "#"
  },
  {
    type: "video",
    title: "Edit Reel 04",
    category: "Reel Edit",
    src: new URL("../../Videos/Video 4.mp4", import.meta.url).href,
    poster: new URL("../../Videos/Video cover 4.png", import.meta.url).href,
    link: "#"
  }
];

export const siteConfig = {
  brand: {
    name: "GRAPHINEX",
    tagline: "Design. Create. Grow.",
    logo: "/Graphinex%20logo/logo.png",
    location: "Lucknow, India",
    reach: "Serving across India and UAE"
  },

  navigation: [
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" }
  ],

  hero: {
    heading: "BUILT FOR GROWTH",
    headingHighlights: ["GROWTH"],
    subheading: "Premium branding, content, and motion systems built to attract attention and convert it into revenue.",
    video: "/Hero background video/Video.mp4",
    placeholder: "/hero.jpeg"
  },

  showreel: {
    title: "Our Showreel",
    youtubeId: "41bEV6Coy3U",
    caption: "Watch how Graphinex turns raw content into premium visual systems."
  },

  trustCertificates: [
    {
      title: "GST Certificate",
      status: "GST Registered",
      description: "Verified business document",
      pdfUrl: "/assets/certificates/gst-certificate.pdf"
    },
    {
      title: "MSME Certificate",
      status: "MSME Registered",
      description: "Verified business document",
      pdfUrl: "/assets/certificates/msme-certificate.pdf"
    }
  ],

  serviceOverviews: [
    {
      id: "videoEditing",
      title: "Video Editing",
      icon: "VE",
      description: "High-impact storytelling through cinematic video and professional post-production.",
      previewImage: "/assets/services-hover/video-editing.png",
      portfolioCategory: "video-editing"
    },
    {
      id: "graphicDesign",
      title: "Graphic Design",
      icon: "GD",
      description: "Crafting iconic visual identities that resonate with your audience and define your market presence.",
      previewImage: "/assets/services-hover/graphic-design.png",
      portfolioCategory: "graphic-design"
    },
    {
      id: "branding",
      title: "Branding",
      icon: "BR",
      description: "Bespoke digital content strategies built with engagement and aesthetics in mind.",
      previewImage: "/assets/services-hover/branding.png",
      portfolioCategory: "branding"
    }
  ],

  homeFeaturedWorks: [
    {
      type: "video",
      title: "Short Hook 01",
      category: "Featured Work",
      src: "/Short videos/short 1.mp4",
      poster: "/Short videos/cover 1.png",
      link: "#"
    },
    {
      type: "video",
      title: "Short Hook 02",
      category: "Featured Work",
      src: "/Short videos/short 2.mp4",
      poster: "/Short videos/cover 2.png",
      link: "#"
    },
    {
      type: "video",
      title: "Short Hook 03",
      category: "Featured Work",
      src: "/Short videos/short 3.mp4",
      poster: "/Short videos/cover 3.png",
      link: "#"
    },
    {
      type: "video",
      title: "Short Hook 04",
      category: "Featured Work",
      src: "/Short videos/short 4.mp4",
      poster: "/Short videos/cover 4.png",
      link: "#"
    }
  ],

  featuredWorks: [
    {
      type: "video",
      title: "Showreel Frame 01",
      category: "Portfolio",
      src: "/assets/video-editing/video-1.mp4",
      poster: "/assets/video-editing/video-1.png",
      link: "#"
    },
    {
      type: "video",
      title: "Behind the Scene 04",
      category: "Portfolio",
      src: "/behind scene/behind scene 4.mp4",
      link: "#"
    },
    {
      type: "video",
      title: "Behind the Scene 05",
      category: "Portfolio",
      src: "/behind scene/behind scene 5.mp4",
      link: "#"
    },
    {
      type: "video",
      title: "Behind the Scene 06",
      category: "Portfolio",
      src: "/behind scene/behind scene 6.mp4",
      link: "#"
    }
  ],

  homePortfolioCollections: {
    "video-editing": videoEditingMedia,
    "graphic-design": [
      {
        type: "image",
        title: "Graphic Design 01",
        category: "Visual Design",
        src: "/assets/graphic-design/g1.jpeg"
      },
      {
        type: "image",
        title: "Graphic Design 02",
        category: "Visual Design",
        src: "/assets/graphic-design/g2.jpeg"
      },
      {
        type: "image",
        title: "Graphic Design 03",
        category: "Visual Design",
        src: "/assets/graphic-design/g3.jpeg"
      },
      {
        type: "image",
        title: "Graphic Design 04",
        category: "Visual Design",
        src: "/assets/graphic-design/g4.jpeg"
      }
    ],
    branding: [
      {
        type: "image",
        title: "Brand Film 01",
        category: "Branding",
        src: "/assets/branding/b1.jpeg"
      },
      {
        type: "image",
        title: "Brand Film 02",
        category: "Branding",
        src: "/assets/branding/b2.jpeg"
      },
      {
        type: "image",
        title: "Brand Film 03",
        category: "Branding",
        src: "/assets/branding/b3.jpeg"
      },
      {
        type: "image",
        title: "Brand Film 04",
        category: "Branding",
        src: "/assets/branding/b4.jpeg"
      }
    ]
  },

  portfolioPage: {
    hero: {
      title: "Our Work Speaks",
      subtitle: "Real results, sharper visuals, and proof-led creative execution across every category."
    }
  },

  portfolioCollections: {
    "video-editing": videoEditingMedia,
    "graphic-design": [
      {
        type: "image",
        title: "Graphic Design 01",
        src: "/assets/graphic-design/g1.jpeg"
      },
      {
        type: "image",
        title: "Graphic Design 02",
        src: "/assets/graphic-design/g2.jpeg"
      },
      {
        type: "image",
        title: "Graphic Design 03",
        src: "/assets/graphic-design/g3.jpeg"
      },
      {
        type: "image",
        title: "Graphic Design 04",
        src: "/assets/graphic-design/g4.jpeg"
      }
    ],
    branding: [
      {
        type: "image",
        title: "Branding 01",
        src: "/assets/branding/b1.jpeg"
      },
      {
        type: "image",
        title: "Branding 02",
        src: "/assets/branding/b2.jpeg"
      },
      {
        type: "image",
        title: "Branding 03",
        src: "/assets/branding/b3.jpeg"
      },
      {
        type: "image",
        title: "Branding 04",
        src: "/assets/branding/b4.jpeg"
      }
    ]
  },

  logos: [
    {
      type: "image",
      title: "Client Logo 1",
      category: "Logos",
      src: "/assets/logos/logo-1.jpeg",
      link: "#"
    },
    {
      type: "image",
      title: "Client Logo 2",
      category: "Logos",
      src: "/assets/logos/logo-2.jpeg",
      link: "#"
    },
    {
      type: "image",
      title: "Client Logo 3",
      category: "Logos",
      src: "/assets/logos/logo-3.jpeg",
      link: "#"
    },
    {
      type: "image",
      title: "Client Logo 4",
      category: "Logos",
      src: "/assets/logos/logo-4.jpeg",
      link: "#"
    },
  ],
  results: [
    { label: "Views Generated", value: "50M+", suffix: "" },
    { label: "Engagement Growth", value: "3X", suffix: "" },
    { label: "Projects Delivered", value: "999+", suffix: "" },
    { label: "Active Clients", value: "450+", suffix: "" }
  ],

  happyClients: [
    {
      name: "Elvish Yadav",
      role: "Creator",
      quote: "Graphinex is innovative, reliable, and always exceeds expectations! A fantastic team to work with!",
      image: "/assets/clients/elvish.png",
      instagram: "https://www.instagram.com/elvish_yadav/",
      youtube: "https://www.youtube.com/@TheSocialFactory"
    },
    {
      name: "Amir Trt",
      role: "Creator",
      quote: "Graphinex excels in video production and design, creating content that truly connects.",
      image: "/assets/clients/amir.png",
      instagram: "https://www.instagram.com/aamir.trt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
      name: "Dharmendra Bilotia",
      role: "Creator",
      quote: "Graphinex is creative, professional, and delivers amazing results! Highly recommended!",
      image: "/assets/clients/dharmendra.png",
      instagram: "https://www.instagram.com/dharmendra_bilotia_/"
    },
    {
      name: "Alisha Rajput",
      role: "Creator",
      quote: "Top quality, smooth execution, and impressive results!",
      image: "/assets/clients/alisha.png",
      instagram: "https://www.instagram.com/alisharajput_22/"
    }
  ],

  testimonials: [
    {
      name: "Kabir Ahuja",
      role: "Founder • Elevan Media",
      rating: 5,
      review: "Graphinex honestly understood the exact vibe I wanted without me over-explaining everything. The edits felt premium from the very first draft 🔥"
    },
    {
      name: "Luca Moretti",
      role: "Creative Strategist • Milan",
      rating: 5,
      review: "The motion quality and visual pacing were seriously impressive. Everything felt clean, modern, and highly intentional."
    },
    {
      name: "Zavian Reed",
      role: "Personal Brand Creator",
      rating: 5,
      review: "I’ve worked with multiple editing teams before, but Graphinex delivered the smoothest workflow till now. Fast replies, great quality, no confusion."
    },
    {
      name: "Harshil Vora",
      role: "E-commerce Brand Owner",
      rating: 5,
      review: "Graphinex ne meri ads creatives ka overall feel hi upgrade kar diya. Videos ab zyada premium aur engaging lagti hain."
    },
    {
      name: "Amélie Laurent",
      role: "Fashion Content Consultant",
      rating: 5,
      review: "The visuals felt elegant and cinematic at the same time. You can clearly tell Graphinex focuses heavily on presentation quality."
    },
    {
      name: "Abeer Malhotra",
      role: "Fitness Creator",
      rating: 5,
      review: "Maine mainly reels editing ke liye contact kiya tha but overall branding output bhi kaafi strong nikla 💯"
    },
    {
      name: "Nathan Elric",
      role: "Startup Operator",
      rating: 5,
      review: "The attention to detail was the biggest difference for me. Nothing felt rushed and the final result looked very polished."
    },
    {
      name: "Reyansh Kohli",
      role: "Music Artist",
      rating: 5,
      review: "Graphinex ka editing style modern hai but overdone nahi lagta. Smooth transitions and proper pacing 👌"
    },
    {
      name: "Elena Voss",
      role: "Social Campaign Manager",
      rating: 5,
      review: "The website visuals and animations felt surprisingly premium on mobile too. Everything stayed smooth and responsive."
    },
    {
      name: "Yuvraj Sethi",
      role: "Luxury Brand Consultant",
      rating: 5,
      review: "Honestly expected good edits, but the overall creative direction from Graphinex was even better than expected."
    },
    {
      name: "Carter Vale",
      role: "Digital Creator",
      rating: 5,
      review: "Graphinex made the entire content look more high-end without making it feel too flashy. That balance is hard to find."
    },
    {
      name: "Vihaan Arora",
      role: "Agency Partner",
      rating: 5,
      review: "Communication clear thi, delivery smooth thi, aur revisions bhi properly handled hue. Overall experience kaafi professional tha."
    },
    {
      name: "Sienna Blake",
      role: "Lifestyle Brand Manager",
      rating: 5,
      review: "The visuals immediately felt premium and audience-ready. Really loved the clean cinematic approach."
    },
    {
      name: "Aryaveer Khanna",
      role: "Real Estate Creator",
      rating: 5,
      review: "Graphinex ne jo reels pacing aur hooks use kiye usse videos ka retention kaafi better hua."
    },
    {
      name: "Kai Emerson",
      role: "Creative Director",
      rating: 5,
      review: "Everything from the transitions to the motion flow felt intentional. The final presentation looked extremely refined."
    }
  ],

  process: [
    {
      step: "01",
      name: "Inquiry",
      description: "We align on goals, audience, and the exact outcome the project needs to create.",
      previewImage: "/assets/videos/work-3.png"
    },
    {
      step: "02",
      name: "Concept",
      description: "We shape the direction, narrative, and visual system before any execution begins.",
      previewImage: "/assets/videos/work-4.png"
    },
    {
      step: "03",
      name: "Creation",
      description: "We build, refine, and polish the work into a premium final asset with control.",
      previewImage: "/assets/graphic-design/g3.jpeg"
    },
    {
      step: "04",
      name: "Launch",
      description: "We deliver the final output ready to ship, perform, and convert in market.",
      previewImage: "/assets/branding/b2.jpeg"
    }
  ],

  contact: {
    phone: "+91 77050 90700",
    email: "graphinex@gmail.com",
    whatsapp: "https://wa.me/917705090700?text=Hi%20Graphinex,%20I%20came%20across%20your%20work%20and%20I%27m%20interested%20in%20your%20services.%20I%27d%20like%20to%20discuss%20a%20project.%20Please%20share%20your%20pricing%20and%20best%20work."
  },

  socials: [
    {
      name: "Instagram",
      href: "https://www.instagram.com/graphinex.in?igsh=Z3cxYjZ0MDd3NmFq"
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@graphinexagency"
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/graphinex-undefined-45a269407?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Twitter / X",
      href: "https://x.com/Graphinex_in"
    }
  ],

  reviews: [
    { name: "Aman Verma", type: "YouTuber", text: "Engagement literally 3x ho gaya.", time: "2 min ago" },
    { name: "Ravi Singh", type: "Real Estate", text: "Leads double ho gaye within 10 days.", time: "5 min ago" },
    { name: "Muskan B.", type: "Brand Owner", text: "Design quality next level hai.", time: "8 min ago" },
    { name: "Imran K.", type: "Coach", text: "Reels viral hone lage consistently.", time: "10 min ago" },
    { name: "Sahil Arora", type: "Fitness Creator", text: "Content finally looks premium.", time: "12 min ago" },
    { name: "Neha Jain", type: "Influencer", text: "My reach improved instantly.", time: "15 min ago" },
    { name: "Vikas Sharma", type: "Startup Founder", text: "Branding ne pura game change kar diya.", time: "18 min ago" },
    { name: "Faizan Ali", type: "Agency Owner", text: "Clients impressed with quality.", time: "22 min ago" },
    { name: "Karan Mehta", type: "YouTuber", text: "CTR boost hua thumbnails se.", time: "25 min ago" },
    { name: "Palak V.", type: "Skincare Brand", text: "Visual storytelling at its best.", time: "30 min ago" },
    { name: "Arjun S.", type: "Fitness Coach", text: "High retention edits actually work.", time: "35 min ago" },
    { name: "Divya M.", type: "E-comm Owner", text: "Ad creatives are converting like crazy.", time: "40 min ago" },
    { name: "Rahul G.", type: "Tech Reviewer", text: "Minimalistic yet impactful designs.", time: "45 min ago" },
    { name: "Sanya P.", type: "Lifestyle Blogger", text: "Consistency manage karna easy ho gaya.", time: "50 min ago" },
    { name: "Kabir D.", type: "FinTech Startup", text: "Professionalism reflects in every frame.", time: "1 hour ago" },
    { name: "Anish T.", type: "Gamer", text: "Montages are insane, editing is top-notch.", time: "1 hour ago" },
    { name: "Isha W.", type: "Fashion Designer", text: "Aesthetics exactly match my brand vibe.", time: "2 hours ago" },
    { name: "Mayank L.", type: "Crypto Analyst", text: "Detailed motion graphics explain complex stuff.", time: "2 hours ago" },
    { name: "Tanmay B.", type: "Motivational Speaker", text: "Short-form content is gold now.", time: "3 hours ago" },
    { name: "Priya R.", type: "Yoga Instructor", text: "Calm and peaceful visual style achieved.", time: "3 hours ago" },
    { name: "Zaid H.", type: "Chef", text: "Food videos look delicious, high engagement.", time: "4 hours ago" },
    { name: "Megha S.", type: "Beauty Expert", text: "Product showcase reels are stunning.", time: "4 hours ago" },
    { name: "Rishabh K.", type: "Stock Trader", text: "Clean UI for my financial courses.", time: "5 hours ago" },
    { name: "Aditi B.", type: "Travel Vlogger", text: "Cinematic transitions are breathtaking.", time: "5 hours ago" },
    { name: "Siddharth V.", type: "Educationist", text: "Visual teaching aids simplified learning.", time: "6 hours ago" },
    { name: "Nisha D.", type: "Interior Designer", text: "Portfolio presentation is much better now.", time: "7 hours ago" },
    { name: "Varun P.", type: "D2C Brand", text: "Scaling became easier with right creative partner.", time: "8 hours ago" },
    { name: "Kritika S.", type: "Artist", text: "My work looks professional in these edits.", time: "9 hours ago" },
    { name: "Aryan T.", type: "App Developer", text: "App demo video increased signups.", time: "10 hours ago" },
    { name: "Deepak R.", type: "Car Enthusiast", text: "Automotive cinematography is elite.", time: "11 hours ago" },
    { name: "Sonal M.", type: "Wedding Planner", text: "Emotional storytelling at its peak.", time: "12 hours ago" },
    { name: "Harshil B.", type: "Real Estate Agent", text: "Property tours are getting more inquiries.", time: "13 hours ago" },
    { name: "Simran G.", type: "Makeup Artist", text: "Tutorials are crisp and clear.", time: "14 hours ago" },
    { name: "Manish J.", type: "E-learning Platform", text: "Course production quality upgraded.", time: "15 hours ago" },
    { name: "Ashish P.", type: "Journalist", text: "News snippets are very professional.", time: "16 hours ago" },
    { name: "Swati L.", type: "Home Decor", text: "Product reels are visually appealing.", time: "17 hours ago" },
    { name: "Prateek S.", type: "Music Producer", text: "Music video edits are vibe.", time: "18 hours ago" },
    { name: "Kiara N.", type: "Dancer", text: "Movement tracking is perfect on beats.", time: "19 hours ago" },
    { name: "Rohit A.", type: "Productivity Guru", text: "Fast-paced editing keeps viewer hooked.", time: "20 hours ago" },
    { name: "Tushar D.", type: "Software Engineer", text: "Clean animations for my tech demos.", time: "21 hours ago" }
  ],

  activity: [
    "Ravi (Mumbai) just started a project",
    "Client from Dubai booked branding agency",
    "YouTuber gained 2.1x reach with our edits",
    "New reel project started for Real Estate brand"
  ]
};
