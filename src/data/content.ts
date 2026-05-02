/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const siteData = {
  brand: {
    name: "GRAPHINEX",
    tagline: "Design. Create. Grow.",
    email: "graphinex@gmail.com",
    phone: "7705090700",
    whatsapp: "https://wa.me/7705090700" 
  },
  navigation: [
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" }
  ],
  hero: {
    headline: "We Turn Content Into Clients",
    subheading: "High-performing videos, thumbnails & branding that actually convert — not just look good.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-people-working-together-in-office-2284-large.mp4",
    videoPlaceholder: "https://i.ibb.co/Xrwgy0Bw/Whats-App-Image-2026-04-28-at-11-07-52-PM.jpg"
  },
  services: [
    {
      id: "01",
      title: "Graphic Design",
      description: "Crafting iconic visual identities that resonate with your audience and define your market presence.",
      size: "large"
    },
    {
      id: "02",
      title: "Video Editing",
      description: "High-impact storytelling through cinematic video and professional post-production.",
      size: "small"
    },
    {
      id: "03",
      title: "Social Media Branding",
      description: "Bespoke digital content strategies built with engagement and aesthetics in mind.",
      size: "small"
    }
  ],
  portfolio: [
    {
      id: 1,
      title: "Eclipse Mobile",
      video: '<div class="video" data-type="video" data-src="./Videos/work 1.mp4"><video preload="none" poster="./Videos/cover 1.png" src="./Videos/work 1.mp4"></video></div>',
    },
    {
      id: 2,
      title: "Vanguard Tech",
      category: "Web Design",
      video: '<div class="video" data-type="video" data-src="./Videos/work 2.mp4"><video preload="none" poster="./Videos/cover 2.png" src="./Videos/work 2.mp4"></video></div>',
      aspect: "aspect-[3/4]"
    },
    {
      id: 3,
      title: "Solaris Watch",
      category: "Product Shot",
      video: '<div class="video" data-type="video" data-src="./Videos/work 3.mp4"><video preload="none" poster="./Videos/cover 3.png" src="./Videos/work 3.mp4"></video></div>',
      aspect: "aspect-square"
    },
    {
      id: 4,
      title: "Arctic Brew",
      category: "Packaging",
      video: '<div class="video" data-type="video" data-src="./Videos/work 4.mp4"><video preload="none" poster="./Videos/cover 4.png" src="./Videos/work 4.mp4"></video></div>',
      aspect: "aspect-[4/5]"
    },
    {
      id: 5,
      title: "Nebula App",
      category: "UI/UX",
      video: '<div class="video" data-type="video" data-src="./Videos/work 5.mp4"><video preload="none" poster="./Videos/cover 5.png" src="./Videos/work 5.mp4"></video></div>',
      aspect: "aspect-square"
    },
    {
      id: 6,
      title: "Luxe Estate",
      category: "Video",
      video: '<div class="video" data-type="video" data-src="./Videos/work 1.mp4"><video preload="none" poster="./Videos/cover 1.png" src="./Videos/work 1.mp4"></video></div>',
      aspect: "aspect-[3/4]"
    },
    {
      id: 7,
      title: "Nova Fashion",
      category: "Creative Dir",
      video: '<div class="video" data-type="video" data-src="./Videos/work 2.mp4"><video preload="none" poster="./Videos/cover 2.png" src="./Videos/work 2.mp4"></video></div>',
      aspect: "aspect-square"
    },
    {
      id: 8,
      title: "Zenith Sound",
      category: "Audio",
      video: '<div class="video" data-type="video" data-src="./Videos/work 3.mp4"><video preload="none" poster="./Videos/cover 3.png" src="./Videos/work 3.mp4"></video></div>',
      aspect: "aspect-[4/5]"
    },
    {
      id: 9,
      title: "Peak Energy",
      category: "Campaign",
      video: '<div class="video" data-type="video" data-src="./Videos/work 4.mp4"><video preload="none" poster="./Videos/cover 4.png" src="./Videos/work 4.mp4"></video></div>',
      aspect: "aspect-square"
    }
  ],
  results: [
    { label: "Views Generated", value: 50000000, suffix: "+" },
    { label: "Engagement Growth", value: "3X", suffix: "" },
    { label: "Projects Delivered", value: 999, suffix: "+" },
    { label: "Active Clients", value: 450, suffix: "+" },
  ],
  process: [
    { step: "01", name: "Inquiry", description: "Analyzing your goals and market landscape." },
    { step: "02", name: "Concept", description: "Developing unique visual and strategic directions." },
    { step: "03", name: "Creation", description: "Crafting the high-fidelity output with precision." },
    { step: "04", name: "Launch", description: "Deploying and optimizing for maximum impact." }
  ],
  testimonials: [], // Removed as per request
  reviews: [
    { name: "Aman Verma", type: "YouTuber", text: "Engagement literally 3x ho gaya 🔥", time: "2 min ago" },
    { name: "Sahil Khan", type: "Real Estate", text: "Daily leads aa rahe hain ab", time: "5 min ago" },
    { name: "Rohit Sharma", type: "Coach", text: "Editing ne pura brand level change kar diya", time: "8 min ago" },
    { name: "Priya Das", type: "Fitness Enthusiast", text: "Best reels ever! Transition are so smooth.", time: "10 min ago" },
    { name: "Vikram Singh", type: "E-com Owner", text: "Product videos increased sales by 50%.", time: "12 min ago" },
    { name: "Neha Kapoor", type: "Influencer", text: "Finally an agency that understands my vibe.", time: "15 min ago" },
    { name: "Rahul Mehra", type: "Tech Reviewer", text: "The thumbnail quality is insane. Click-rate sky-high.", time: "18 min ago" },
    { name: "Sneha Goel", type: "Yoga Teacher", text: "My course sales went viral after their edit.", time: "20 min ago" },
    { name: "Arjun Iyer", type: "Startup Founder", text: "Professional branding that makes us look like a unicorn.", time: "22 min ago" },
    { name: "Karan Malhotra", type: "Gamer", text: "Best gaming edits in the industry. Period.", time: "25 min ago" },
    { name: "Ananya Roy", type: "Fashion Blogger", text: " Aesthetic on point. 10/10 recommend.", time: "28 min ago" },
    { name: "Siddharth J.", type: "Chef", text: "My recipes look delicious with their grading.", time: "30 min ago" },
    { name: "Megha S.", type: "Artist", text: "Portfolio look so premium now. Clients are impressed.", time: "35 min ago" },
    { name: "Kabir W.", type: "Vlogger", text: "Editing load off my shoulders. Full trust.", time: "40 min ago" },
    { name: "Ishaan P.", type: "Business Coach", text: "Content that actually converts. Impressive work.", time: "45 min ago" },
    { name: "Riya M.", type: "Dancer", text: "The synchronization is perfect. Love the energy.", time: "50 min ago" },
    { name: "Aditya K.", type: "App Developer", text: "UI design was clean and functional. Highly skilled.", time: "55 min ago" },
    { name: "Tanvi B.", type: "Lifestyle", text: "My followers doubled in 2 months. Great strategy.", time: "1 hour ago" },
    { name: "Zaid H.", type: "Real Estate Delhi", text: "Property tours are next level. Sold 3 units.", time: "1 hour ago" },
    { name: "Palak V.", type: "Skincare Brand", text: "Visual storytelling at its best. Pure quality.", time: "2 hours ago" },
    { name: "Manish T.", type: "Web3 Expert", text: "Explained complex tech with amazing visuals.", time: "2 hours ago" },
    { name: "Sanya L.", type: "NGO Founder", text: "Impactful videos that brought in donations.", time: "3 hours ago" },
    { name: "Aryan G.", type: "Motorsports", text: "Fast-paced editing exactly how I wanted.", time: "3 hours ago" },
    { name: "Shruti X.", type: "Writer", text: "Animated my stories beautifully. Creative genius.", time: "4 hours ago" },
    { name: "Deepak R.", type: "Finance Guru", text: "Retention rate on videos increased significantly.", time: "4 hours ago" },
    { name: "Ojas B.", type: "Musician", text: "Music video edit was stunning. Great color work.", time: "5 hours ago" },
    { name: "Kriti N.", type: "Traveler", text: "Captured the essence of my trips perfectly.", time: "5 hours ago" },
    { name: "Utsav M.", type: "Marketing Agency", text: "Reliable white-label partners for our clients.", time: "6 hours ago" },
    { name: "Vanya P.", type: "Interior Design", text: "Portfolio looks sleek and modern. Thanks Graphinex.", time: "6 hours ago" },
    { name: "Rishi C.", type: "Crypto Trader", text: "Educational content simplified and visually great.", time: "7 hours ago" },
    { name: "Sonia D.", type: "Pet Store", text: "Cute and engaging videos for my brand.", time: "7 hours ago" },
    { name: "Jatin B.", type: "Motivation Speaker", text: "Words empowered by great visuals. Powerful.", time: "8 hours ago" },
    { name: "Nikita F.", type: "Photography", text: "They respected my vision and enhanced it.", time: "8 hours ago" },
    { name: "Sameer V.", type: "Food Blogger", text: "Cinematic food shots that went viral.", time: "9 hours ago" },
    { name: "Alisha R.", type: "Beauty Brand", text: "Premium feel achieved. Sales up 40%.", time: "9 hours ago" },
    { name: "Harsh T.", type: "Podcaster", text: "Audio-visual sync and clips are perfect.", time: "10 hours ago" },
    { name: "Prerna G.", type: "Architect", text: "3D visualization and presentation is top class.", time: "10 hours ago" },
    { name: "Varun D.", type: "Corporate Trainer", text: "Professionalism throughout the project.", time: "11 hours ago" },
    { name: "Esha K.", type: "Event Planner", text: "Event highlights were edited beautifully.", time: "11 hours ago" },
    { name: "Tushar S.", type: "Auto Influencer", text: "Car reviews look like TV ads now.", time: "12 hours ago" },
    { name: "Muskan B.", type: "Calligraphy", text: "Subtle and elegant edits for my art.", time: "12 hours ago" },
    { name: "Gaurav P.", type: "E-learning", text: "Course content is much more engaging now.", time: "13 hours ago" },
    { name: "Nancy W.", type: "Fashion Designer", text: "Brand identity is strong and cohesive.", time: "13 hours ago" },
    { name: "Dhruv L.", type: "Investment", text: "Strategy was as good as the execution.", time: "14 hours ago" },
    { name: "Ayesha Q.", type: "Jewelry", text: "Detailed shots and premium editing quality.", time: "14 hours ago" },
    { name: "Yash N.", type: "Gadget Tech", text: "Review shots are crisp and professional.", time: "15 hours ago" },
    { name: "Simran T.", type: "Psychologist", text: "Empathetic storytelling in my videos.", time: "15 hours ago" },
    { name: "Omer F.", type: "Dubai Client", text: "International standards met. Great output.", time: "16 hours ago" },
    { name: "Divya Z.", type: "Author", text: "Book trailer was cinematic and intriguing.", time: "16 hours ago" },
    { name: "Akshay B.", type: "Gym Owner", text: "Transformation videos are highly motivating.", time: "17 hours ago" }
  ],
  activity: [
    "Ravi (Mumbai) just started a project",
    "Client from Dubai booked branding agency",
    "YouTuber gained 2.1x reach with our edits",
    "New reel project started for Real Estate brand",
    "Aman increased 2.3x engagement this week",
    "Thumbnail redesign completed for Tech channel",
    "New brand identity project signed from UAE",
    "Coach Rohit just received his 10th edited reel",
    "Fitness brand transformation video live now",
    "Client from Lucknow booked full package",
    "Portfolio website redesign completed",
    "Viral reel hit 1M+ views today",
    "New client from USA joined Graphinex",
    "Graphic design project delivered for Startup",
    "E-com product shoot project started",
    "Influencer collaboration project live",
    "Crypto education series first episode out",
    "Real Estate walk-through video delivered",
    "Podcast highlights edited for Spotify",
    "New logo concept approved by client"
  ]
};
