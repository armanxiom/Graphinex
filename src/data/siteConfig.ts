/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const siteConfig = {
  // 🎯 BRANDING & IDENTITY
  brand: {
    name: "GRAPHINEX",
    tagline: "Design. Create. Grow.",
    logo: "/logo/logo.png",
    location: "Lucknow, India",
    reach: "Serving across India & UAE"
  },

  // 🎯 NAVIGATION
  navigation: [
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" }
  ],

  // 🎯 HERO SECTION
  hero: {
    heading: "We Turn Content Into Clients",
    headingHighlights: ["Content", "Clients"],
    subheading: "High-performing videos, thumbnails & branding that actually convert — not just look good.",
    video: "/Videos/showreel.mp4", // Note: Hero video needs a direct file path, not a YouTube link.
    placeholder: "https://i.ibb.co/Xrwgy0Bw/Whats-App-Image-2026-04-28-at-11-07-52-PM.jpg"
  },

  // 🎯 SHOWREEL
  showreel: {
    title: "Our Showreel",
    youtubeId: "KdSOa66eXrA",
    caption: "Watch how we turn content into clients"
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

  // 🎯 SERVICE OVERVIEWS (For Home Page Icons/Descriptions)
  serviceOverviews: [
    { 
      id: "videoEditing",
      title: "Video Editing", 
      icon: "🎬",
      description: "High-impact storytelling through cinematic video and professional post-production.",
    },
    { 
      id: "graphicDesign",
      title: "Graphic Design", 
      icon: "🎨",
      description: "Crafting iconic visual identities that resonate with your audience and define your market presence.",
    },
    { 
      id: "branding",
      title: "Branding", 
      icon: "🚀",
      description: "Bespoke digital content strategies built with engagement and aesthetics in mind.",
    }
  ],

  // 🎯 FEATURED WORKS (Home Page Grid)
  featuredWorks: [
    {
      type: "video",
      title: "Eclipse Mobile",
      category: "Video Editing",
      src: "/assets/videos/work-1.mp4",
      poster: "/assets/videos/work-1.png",
      link: "#"
    },
    {
      type: "video",
      title: "Vanguard Tech",
      category: "Web Design",
      src: "/assets/videos/work-2.mp4",
      poster: "/assets/videos/work-2.png",
      link: "#"
    },
    {
      type: "video",
      title: "Solaris Watch",
      category: "Product Shot",
      src: "/assets/videos/work-3.mp4",
      poster: "/assets/videos/work-3.png",
      link: "#"
    },
    {
      type: "video",
      title: "Arctic Brew",
      category: "Packaging",
      src: "/assets/videos/work-4.mp4",
      poster: "/assets/videos/work-4.png",
      link: "#"
    },
    {
      type: "video",
      title: "Nebula App",
      category: "UI/UX",
      src: "/assets/videos/work-5.mp4",
      poster: "/assets/videos/work-5.png",
      link: "#"
    },
    {
      type: "video",
      title: "Luxe Estate",
      category: "Video",
      src: "/assets/videos/work-6.mp4",
      poster: "/assets/videos/work-6.png",
      link: "#"
    }
  ],

  services: {
    videoEditing: [
      {
        title: "Short Hook 01",
        category: "Reel Edit",
        src: "/assets/videos/work-1.mp4",
        poster: "/assets/videos/work-1.png",
        link: "#"
      },
      {
        title: "Short Hook 02",
        category: "Reel Edit",
        src: "/assets/videos/work-2.mp4",
        poster: "/assets/videos/work-2.png",
        link: "#"
      },
      {
        title: "Short Hook 03",
        category: "Reel Edit",
        src: "/assets/videos/work-3.mp4",
        poster: "/assets/videos/work-3.png",
        link: "#"
      },
      {
        title: "Short Hook 04",
        category: "Reel Edit",
        src: "/assets/videos/work-4.mp4",
        poster: "/assets/videos/work-4.png",
        link: "#"
      },
      {
        title: "Short Hook 05",
        category: "Reel Edit",
        src: "/assets/videos/work-5.mp4",
        poster: "/assets/videos/work-5.png",
        link: "#"
      },
      {
        title: "Short Hook 06",
        category: "Reel Edit",
        src: "/assets/videos/work-6.mp4",
        poster: "/assets/videos/work-6.png",
        link: "#"
      }
    ],
    graphicDesign: [
      {
        title: "Featured Work 01",
        category: "Visual Design",
        src: "/assets/videos/work-1.png",
        link: "#"
      },
      {
        title: "Featured Work 02",
        category: "Visual Design",
        src: "/assets/videos/work-2.png",
        link: "#"
      },
      {
        title: "Featured Work 03",
        category: "Visual Design",
        src: "/assets/videos/work-3.png",
        link: "#"
      }
    ],
    branding: [
      {
        title: "Brand Film 01",
        category: "Branding",
        src: "/assets/videos/work-4.mp4",
        poster: "/assets/videos/work-4.png",
        link: "#"
      },
      {
        title: "Brand Film 02",
        category: "Branding",
        src: "/assets/videos/work-5.mp4",
        poster: "/assets/videos/work-5.png",
        link: "#"
      },
      {
        title: "Brand Film 03",
        category: "Branding",
        src: "/assets/videos/work-6.mp4",
        poster: "/assets/videos/work-6.png",
        link: "#"
      }
    ]
  },

  portfolioPage: {
    hero: {
      title: "Our Work Speaks",
      subtitle: "Real Results. Real Creators. Real Growth."
    }
  },

  portfolioCollections: {
    "video-editing": [
      {
        type: "video",
        title: "Video Edit 01",
        src: "/assets/video-editing/video-1.mp4",
        poster: "/assets/video-editing/video-1.png"
      }
    ],
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

  // 🎯 LOGOS SECTION
  // ZAROORI: Neeche diye gaye 'src' paths ko apne asli logo file naamo se badal dein jo 'public/Logos/' folder mein hain.
  // Jaise, agar aapke logo ka naam 'brand-logo.png' hai, to src: "/Logos/brand-logo.png" likhein.
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
    {
      type: "image",
      title: "Client Logo 5",
      category: "Logos",
      src: "/assets/logos/logo-5.jpeg",
      link: "#"
    },
    {
      type: "image",
      title: "Client Logo 6",
      category: "Logos",
      src: "/assets/logos/logo-6.jpeg",
      link: "#"
    }
  ],

  // 🎯 RESULTS
  results: [
    { label: "Views Generated", value: "2.1M+", suffix: "" },
    { label: "Engagement Growth", value: "3X", suffix: "" },
    { label: "Projects Delivered", value: "250+", suffix: "" },
    { label: "Active Clients", value: "45+", suffix: "" }
  ],

  // 🎯 PROCESS
  process: [
    { step: "01", name: "Inquiry", description: "Analyzing your goals and market landscape." },
    { step: "02", name: "Concept", description: "Developing unique visual and strategic directions." },
    { step: "03", name: "Creation", description: "Crafting the high-fidelity output with precision." },
    { step: "04", name: "Launch", description: "Deploying and optimizing for impact." }
  ],

  // 🎯 CONTACT
  contact: {
    phone: "+91 77050 90700",
    email: "graphinex@gmail.com",
    whatsapp: "https://wa.me/917705090700?text=Hi%20Graphinex,%20I%20came%20across%20your%20work%20and%20I%27m%20interested%20in%20your%20services.%20I%27d%20like%20to%20discuss%20a%20project.%20Please%20share%20your%20pricing%20and%20best%20work."
  },

  // 🎯 SOCIAL PROOF
  reviews: [
    { name: "Aman Verma", type: "YouTuber", text: "Engagement literally 3x ho gaya 🔥", time: "2 min ago" },
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
