/**
 * ============================================================
 * CENTRALIZED STORY CONFIGURATION — NISAR × LAHARI
 * "A private little world created by Nisar exclusively for Lahari."
 *
 * All text, quotes, memories, compliments, chapters, and media
 * paths are managed here. You can customize any of these
 * without altering HTML or CSS markup!
 * ============================================================
 */

window.STORY_CONFIG = {
  // Couple Identity
  couple: {
    creator: "Nisar",
    beloved: "Lahari",
    monogram: "N × L",
    title: "Nisar × Lahari — A Little World Made For You",
    relationshipSignature: "— Nisar",
  },

  // Birthday Celebration Configuration (Preview Mode: Active for testing)
  birthdayCelebration: {
    previewMode: true,        // Set to false for September 29 only
    targetMonth: 8,           // September (0-indexed: 8 = September)
    targetDay: 29,            // 29th
    delayAfterUnlockMs: 2000, // 2 seconds after Home is visible
    durationMs: 20800,        // Total sequence ~20.5 seconds
    recipientName: "LAHARI"
  },

  // Opening Screen ("The Threshold")
  opening: {
    pretitle: "A little something from",
    creatorName: "NISAR",
    subtitle: "For the girl who became my favorite person.",
    belovedName: "LAHARI",
    monogram: "N × L",
    buttonText: "OPEN MY HEART",
  },

  // Hero Sanctuary
  hero: {
    badge: "Exclusively For Lahari",
    titleLead: "To Lahari,",
    titleHighlight: "The Girl Who Makes My World Beautiful",
    subtitle: "I made this little corner of the internet just for you.",
    quote: "Because some feelings deserve their own little world.",
    signature: "— Nisar",
    scrollPrompt: "Scroll through our little story",
    image: "assets/images/hero-lahari.jpg",
    floatingTag: {
      text: "Forever my favorite view",
      subtext: "Nisar × Lahari",
    }
  },

  // Section: "First of All... You."
  intro: {
    badge: "The Heart of Everything",
    title: "First of All... You.",
    subtitle: "Before any words, before any memories, there is simply who you are to me.",
    highlight: "In a world that is always rushing, your presence is the one place where everything feels calm, gentle, and right.",
    paragraphs: [
      "There are people who walk into your life and change the temperature of the room just by being there. That is what you did. Without demanding attention, without trying to be anything other than yourself, you brought a warmth that I didn't even realize was missing.",
      "This website isn't here because of an occasion or a calendar date. It exists simply because you exist, and having you in my life is something I never want to take for granted. You deserve to be celebrated—not just quietly in my thoughts, but in a space crafted solely to honor you."
    ],
    image: "assets/images/intro-lahari.jpg",
  },

  // Cinematic Photo Story Chapters (8 Distinct Chapters)
  chapters: [
    {
      number: "Chapter I",
      title: "That Smile",
      image: "assets/images/chapter-1.jpg",
      quote: "Some smiles brighten a room; yours simply redefines what light feels like.",
      compliment: "You have that rare, effortless smile that instantly erases every heavy thought and makes the world feel infinitely lighter.",
      reverse: false
    },
    {
      number: "Chapter II",
      title: "Those Eyes",
      image: "assets/images/chapter-2.jpg",
      quote: "There is an entire universe of softness and honesty whenever you look my way.",
      compliment: "Your eyes have a depth that speaks with quiet grace. Even in silence, they tell a story that I could spend forever listening to.",
      reverse: true
    },
    {
      number: "Chapter III",
      title: "Just You",
      image: "assets/images/chapter-3.jpg",
      quote: "You never have to perform or pretend. The version of you that simply exists is already extraordinary.",
      compliment: "My favorite side of you is the unscripted one—your natural poise, your honest expressions, and the effortless way you carry yourself.",
      reverse: false
    },
    {
      number: "Chapter IV",
      title: "The Little Things",
      image: "assets/images/chapter-4.jpg",
      quote: "It's rarely the grand gestures; it is always the quiet, unnoticed moments that stay etched the deepest.",
      compliment: "The gentle way you speak, the subtle tilt of your head when you listen, and how you bring so much tenderness into everyday moments.",
      reverse: true
    },
    {
      number: "Chapter V",
      title: "Your Presence",
      image: "assets/images/chapter-5.jpg",
      quote: "Being near you feels like stepping into warmth after walking through a storm.",
      compliment: "Your presence has a grounding stillness. When everything around is chaotic, knowing you are there anchors my peace.",
      reverse: false
    },
    {
      number: "Chapter VI",
      title: "Beautiful Without Trying",
      image: "assets/images/chapter-6.jpg",
      quote: "Real beauty doesn't demand applause; it radiates quietly and touches everything around it.",
      compliment: "You are breathtaking not because you try to be, but because grace, warmth, and sincerity are woven into who you are.",
      reverse: true
    },
    {
      number: "Chapter VII",
      title: "My Favorite Person",
      image: "assets/images/chapter-7.jpg",
      quote: "Of all the conversations, all the faces, and all the moments in this lifetime, you are the one I look for first.",
      compliment: "You became the person I immediately want to share good news with, the one I confide in, and the one whose laughter makes my day complete.",
      reverse: false
    },
    {
      number: "Chapter VIII",
      title: "The Moments I Keep",
      image: "assets/images/chapter-8.jpg",
      quote: "Some memories are like polished stones kept in the deepest pocket of the heart.",
      compliment: "Every photograph of you is more than an image—it is a small sanctuary of gratitude for the gift of knowing and loving you.",
      reverse: true
    }
  ],

  // Section: "If You Could See Yourself Through My Eyes"
  eyesSpotlight: {
    badge: "A Quiet Perspective",
    title: "If You Could See Yourself Through My Eyes",
    quoteLead: "If you could see yourself the way I see you, you would never doubt your worth, your beauty, or the impact you have.",
    paragraphs: [
      "I see someone whose heart is fiercely genuine in a world full of imitations. I see someone whose kindness is not an act, but an instinct. When you look in the mirror, you might see ordinary moments, but from where I stand, every angle reflects grace, resilience, and an undeniable light.",
      "You are the girl who turns ordinary days into poetry, and loving you is the easiest, most natural choice I've ever made."
    ],
    image: "assets/images/eyes-spotlight.jpg",
  },

  // Section: "Things I Love About You" (Interactive 3D Cards)
  loveCards: [
    {
      icon: "✨",
      title: "Your Smile",
      hint: "Tap to reveal",
      backText: "The genuine warmth that lights up your entire face and immediately makes whatever day I'm having ten times better."
    },
    {
      icon: "👁️",
      title: "Your Eyes",
      hint: "Tap to reveal",
      backText: "The honesty and gentle intelligence that look straight into my soul with unwavering kindness."
    },
    {
      icon: "🌸",
      title: "Your Laugh",
      hint: "Tap to reveal",
      backText: "That spontaneous, infectious sound that turns any room into my favorite place to be."
    },
    {
      icon: "🎶",
      title: "Your Voice",
      hint: "Tap to reveal",
      backText: "The comforting rhythm and soothing tone that can bring me peace even when the world feels overwhelming."
    },
    {
      icon: "🕊️",
      title: "Your Kindness",
      hint: "Tap to reveal",
      backText: "The tender, thoughtful consideration you naturally show to those around you without ever asking for recognition."
    },
    {
      icon: "☕",
      title: "Your Little Habits",
      hint: "Tap to reveal",
      backText: "The cute quirks, unconscious gestures, and sweet mannerisms that are uniquely and unmistakably yours."
    },
    {
      icon: "💫",
      title: "Your Expressions",
      hint: "Tap to reveal",
      backText: "The way your face candidly reacts before you even say a word—playful, expressive, and impossible not to adore."
    },
    {
      icon: "💖",
      title: "Your Heart",
      hint: "Tap to reveal",
      backText: "The pure empathy, loyalty, and deep sincerity that guide everything you do."
    },
    {
      icon: "🌙",
      title: "Your Presence",
      hint: "Tap to reveal",
      backText: "How simply being in the same space as you feels like coming home after a long journey."
    },
    {
      icon: "🌿",
      title: "The Way You Care",
      hint: "Tap to reveal",
      backText: "The genuine attention you give to feelings and the quiet ways you protect what matters."
    },
    {
      icon: "🌹",
      title: "The Way You Make Me Feel",
      hint: "Tap to reveal",
      backText: "Safe, inspired, deeply understood, and grateful beyond measure for every single day we share."
    },
    {
      icon: "🤍",
      title: "Your Pure Soul",
      hint: "Tap to reveal",
      backText: "The rare innocence, glowing warmth, and authentic beauty of who you are at your core—a soul I feel endlessly blessed to cherish."
    }
  ]
};
// Appending remaining sections to window.STORY_CONFIG
Object.assign(window.STORY_CONFIG, {
  // Section: "It's The Little Things"
  littleThings: {
    badge: "The Subtleties",
    title: "It's The Little Things",
    subtitle: "The quiet details that mean everything to me.",
    items: [
      { id: "01", text: "The spontaneous little laughs you let out when something truly amuses you." },
      { id: "02", text: "The way you hold your gaze when you're speaking about something you care about." },
      { id: "03", text: "How your presence alone has the power to slow down my racing thoughts." },
      { id: "04", text: "The subtle, effortless grace that follows you in everything you do." },
      { id: "05", text: "The sweet honesty in your voice that always makes me feel completely grounded." },
      { id: "06", text: "How you make ordinary moments feel like memories I want to keep forever." },
      { id: "07", text: "The gentle warmth of your smile that never fails to brighten my day." }
    ]
  },

  // Section: "Our Little World"
  ourWorld: {
    badge: "A Private Sanctum",
    symbol: "N × L",
    names: "Nisar × Lahari",
    title: "Our Little World",
    quote: "A private corner crafted from genuine affection, honest words, and moments that belong exclusively to us.",
  },

  // Section: "You Probably Don't Know This..."
  confessions: {
    badge: "Quiet Truths",
    title: "You Probably Don't Know This...",
    subtitle: "A few tender thoughts I carry quietly in my heart.",
    items: [
      {
        title: "I think of you in quiet pauses",
        text: "Whenever the world slows down for even a second, my thoughts gravitate effortlessly back to you, like finding a safe harbor."
      },
      {
        title: "Your happiness is my priority",
        text: "Seeing you genuinely happy and at ease brings me a sense of accomplishment and calm that nothing else can match."
      },
      {
        title: "I notice how much grace you carry",
        text: "Even on days when you feel tired or stressed, the dignity, strength, and softness you exhibit are inspiring."
      },
      {
        title: "You make me want to be better",
        text: "Being loved by someone with a heart as pure as yours inspires me to grow, listen deeper, and love more unconditionally."
      }
    ]
  },

  // Section: Memory Timeline ("Moments Worth Keeping")
  timeline: {
    badge: "Chapters We Keep",
    title: "Moments Worth Keeping",
    subtitle: "Milestones in our journey that will forever hold a sacred place.",
    events: [
      {
        date: "The Spark",
        title: "When Our Worlds Crossed",
        side: "left",
        text: "The moment when a simple connection turned into the most meaningful journey of my life."
      },
      {
        date: "The Deepening",
        title: "Conversations Under Midnight Skies",
        side: "right",
        text: "Sharing thoughts we keep from the rest of the world, realizing how rare and precious our understanding is."
      },
      {
        date: "The Realization",
        title: "You Became My Favorite Person",
        side: "left",
        text: "The day I recognized that no matter what happened in life, you were the one person I always wanted by my side."
      },
      {
        date: "The Little Traditions",
        title: "Laughter in Everyday Life",
        side: "right",
        text: "Building our own language, our shared jokes, and the unspoken bond that makes us 'us'."
      },
      {
        date: "Every Tomorrow",
        title: "The Chapters Still Unwritten",
        side: "left",
        text: "Looking ahead with excitement, gratitude, and devotion for every single day that lies in our future."
      }
    ]
  },

  // Section: Video Memories ("Moments That Move")
  videos: [
    {
      id: "vid-1",
      src: "assets/videos/video-01.mp4",
      title: "Candid Grace",
      caption: "A fleeting glimpse of your natural elegance."
    },
    {
      id: "vid-2",
      src: "assets/videos/video-02.mp4",
      title: "Soft Laughter",
      caption: "The sound and motion that light up my heart."
    },
    {
      id: "vid-3",
      src: "assets/videos/video-03.mp4",
      title: "Just Being You",
      caption: "Every subtle movement holds an effortless beauty."
    },
    {
      id: "vid-4",
      src: "assets/videos/video-04.mp4",
      title: "Moments in Motion",
      caption: "Memories that move through time with quiet joy."
    },
    {
      id: "vid-5",
      src: "assets/videos/video-05.mp4",
      title: "Gleam of Light",
      caption: "Cherishing every second of your radiant presence."
    },
    {
      id: "vid-6",
      src: "assets/videos/video-06.mp4",
      title: "Forever Cherished",
      caption: "A living reminder of the happiness you bring."
    }
  ],

  // Section: Photo Memory Gallery
  gallery: [
    { src: "assets/images/gallery-01.jpg", caption: "Effortless poise and gentle confidence." },
    { src: "assets/images/gallery-02.jpg", caption: "The warmth you bring to every room." },
    { src: "assets/images/gallery-03.jpg", caption: "Quiet elegance that needs no words." },
    { src: "assets/images/gallery-04.jpg", caption: "A snapshot of pure sweetness." },
    { src: "assets/images/gallery-05.jpg", caption: "That irresistible, radiant sparkle." },
    { src: "assets/images/gallery-06.jpg", caption: "Grace woven into every candid glance." },
    { src: "assets/images/gallery-07.jpg", caption: "The girl who holds my heart." },
    { src: "assets/images/gallery-08.jpg", caption: "Timeless beauty in its truest form." },
    { src: "assets/images/gallery-09.jpg", caption: "Moments that feel like poetry." },
    { src: "assets/images/gallery-10.jpg", caption: "A smile that lingers in my mind all day." },
    { src: "assets/images/gallery-11.jpg", caption: "Unmatched warmth and gentle charm." },
    { src: "assets/images/gallery-12.jpg", caption: "Every angle is my favorite view." },
    { src: "assets/images/gallery-13.jpg", caption: "The quiet wonder of your presence." },
    { src: "assets/images/gallery-14.jpg", caption: "A memory that never loses its glow." },
    { src: "assets/images/gallery-15.jpg", caption: "Forever captivated by who you are." },
    { src: "assets/images/gallery-16.jpg", caption: "The sweet simplicity of your joy." },
    { src: "assets/images/gallery-17.jpg", caption: "Always radiant, always sincere." },
    { src: "assets/images/gallery-18.jpg", caption: "My favorite person in the whole universe." }
  ],

  // Section: "A Letter From Nisar"
  letter: {
    badge: "Personal Love Letter",
    salutation: "Lahari,",
    paragraphs: [
      "I wanted to create something that would stand still in time—a private little sanctuary where words don't rush, where memories are treasured, and where you are reminded of how deeply and sincerely you are loved.",
      "From the moment you came into my life, you brought a gentle clarity that I cherish more than words could ever convey. You have this extraordinary way of making the world feel softer, safer, and infinitely more meaningful. Whether in moments of shared laughter or quiet contemplation, knowing you are with me makes every day an absolute privilege.",
      "Thank you for being who you are—for your warmth, your compassion, your patient heart, and the effortless beauty you bring into my existence. I love you for all that you are, all that you have been, and all that you will ever be.",
      "No matter where life takes us, this little corner of our world will always belong to you."
    ],
    closingText: "Always yours,",
    signatureName: "Nisar",
    sealInitials: "N × L",
  },

  // "One More Thing..." Interaction
  oneMoreThing: {
    buttonPrompt: "One More Thing...",
    lead: "Hey Lahari...",
    messageLead: "If I had to choose my favorite person all over again...",
    messageFinal: "I'd still choose you.",
    signature: "— Nisar",
    closeBtnText: "Close with Love ❤️"
  },

  // Secret Easter Egg
  easterEgg: {
    badge: "Psst...",
    subtitle: "Just in case you forgot...",
    message: "Nisar loves you. Always and unconditionally.",
    closeText: "Keep Secret"
  },

  // Section: "Before You Leave..."
  beforeLeave: {
    quote: "Remember that somewhere in this world, there is someone who is very happy that Lahari exists.",
    signature: "— Nisar"
  },

  // Final Screen
  finalScreen: {
    lead: "Among all the beautiful things in this world...",
    mainQuote: "You are my favorite.",
    closing: "Love,",
    signature: "Nisar",
    madeFor: "Made especially for Lahari.",
    image: "assets/images/final-photo.jpg"
  },

  // Ambient Audio & Playlist Settings
  audio: {
    tracks: [
      {
        id: 1,
        title: "Seoul City",
        artist: "Jennie",
        // Place personal MP3 in assets/audio/song1.mp3 (plays ambient chime if MP3 not present)
        src: "assets/audio/song1.mp3",
        preset: "starlight"
      },
      {
        id: 2,
        title: "Souvenir",
        artist: "Selena Gomez",
        // Place personal MP3 in assets/audio/song2.mp3 (plays ambient chime if MP3 not present)
        src: "assets/audio/song2.mp3",
        preset: "warmth"
      },
      {
        id: 3,
        title: "Treat You Better",
        artist: "Shawn Mendes",
        // Place personal MP3 in assets/audio/song3.mp3 (plays ambient chime if MP3 not present)
        src: "assets/audio/song3.mp3",
        preset: "heartstrings"
      }
    ]
  }
});


// Adding Birthday, Voice Note, Open When, Reason Jar, Virtual Hug, and Same Sky configs
Object.assign(window.STORY_CONFIG, {
  // Birthday Configuration (29 September 2007)
  birthday: {
    birthYear: 2007,
    birthMonth: 8, // 0-indexed: 8 = September
    birthDay: 29,
    badge: "Annual Milestone • 29 September",
    title: "Counting Down To Your Day",
    subtitle: "Every second brings us closer to celebrating the most precious person in my world.",
    bornTribute: "29 September 2007 — The day the universe gifted you to the earth.",
    celebrationTitle: "Happy Birthday, My Beloved Lahari! 🎂✨",
    celebrationLetter: "Today is about you—the grace you carry, the warmth you give, and the happiness you bring into my life. On this day in 2007, someone truly extraordinary was born, and I thank my lucky stars every single day that I get to love you. May this year bring you all the gentle peace, boundless joy, and beautiful dreams your heart desires. Happy Birthday, my favorite person in the whole universe.",
    candlePrompt: "Tap the candle to make a wish 🕯️",
    candleWishGranted: "Your wish has been sent to the stars with all my love ❤️",
    // Dedicated yearly surprises that change automatically every single year
    yearlyWishes: {
      2024: {
        age: 17,
        badge: "Sweet Seventeen • 29 September 2024",
        title: "Happy 17th Birthday, My Beloved Lahari! 🎂✨",
        letter: "Today we celebrate 17 beautiful years of your light in this world. In a universe so vast, meeting you and loving you has been the greatest privilege of my life. May your 17th year bring you unshakeable peace, infectious smiles, and all the tender love your heart can hold. Happy Birthday to my favorite person."
      },
      2025: {
        age: 18,
        badge: "Milestone Celebration • 18th Birthday • 29 September 2025",
        title: "Happy 18th Birthday, My Cherished Lahari! 🎂✨",
        letter: "Today you officially step into 18—an incredible milestone in your life's journey. But no matter how fast the years turn, to me you will always be the girl whose gentle smile softens the whole world. I watch you grow with so much pride, respect, and deep devotion. May your 18th year be the start of your most glorious chapters yet. Always yours, Nisar."
      },
      2026: {
        age: 19,
        badge: "Annual Celebration • 19th Birthday • 29 September 2026",
        title: "Happy 19th Birthday, My One & Only Lahari! ✨",
        letter: "Nineteen years of you making the earth a warmer, kinder place. With every single day that passes, my love for who you are only deepens. You are the poetry in my quiet moments and the anchor in my busy days. Here is to 19—may every dream you quietly whisper to the stars find its way to you."
      },
      2027: {
        age: 20,
        badge: "Golden Milestone • 20th Birthday • 29 September 2027",
        title: "Happy 20th Birthday, My Beloved Lahari! 🥂",
        letter: "Two decades of grace, kindness, and effortless beauty. Stepping into your twenties is a momentous celebration of the brilliant woman you have become. Thank you for filling these years with memories that will outlive time. I will love you through every decade, every season, and every horizon."
      },
      2028: {
        age: 21,
        badge: "Milestone Celebration • 21st Birthday • 29 September 2028",
        title: "Happy 21st Birthday, My Forever Favorite! 🌟",
        letter: "Twenty-one years of radiant light. May this milestone year unfold with boundless joy, wonderful adventures, and peaceful contentment. Never forget how fiercely and purely you are loved. Happy 21st Birthday, my whole world."
      },
      2029: {
        age: 22,
        badge: "Annual Celebration • 22nd Birthday • 29 September 2029",
        title: "Happy 22nd Birthday, My Beloved Lahari! 💖",
        letter: "Another year of walking side by side with you, and my heart feels fuller than ever. You are the calm in every storm and the joy in every ordinary morning. May 22 bring you boundless laughter, good health, and all the gentle peace you deserve."
      },
      2030: {
        age: 23,
        badge: "Annual Celebration • 23rd Birthday • 29 September 2030",
        title: "Happy 23rd Birthday, My Dearest Lahari! ✨",
        letter: "Twenty-three wonderful years of your grace. Through every changing season and every milestone we reach, one thing will always remain unchanged: my wholehearted love and devotion to you. Happy Birthday, my darling."
      }
    }
  },

  // Voice Note Configuration
  voiceNote: {
    badge: "Special Audio Recording",
    title: "A Personal Voice Note",
    subtitle: "A short message recorded directly from Nisar's heart to yours.",
    audioSrc: "assets/audio/voice-note.mp3",
    notePlaceholder: "Nisar is preparing a personal voice recording for you. Once added, you'll hear his voice right here!",
    durationLabel: "Personal Audio Message"
  },

  // 1. Dynamic "Open When..." Envelopes (Multiple Letters per Envelope)
  openWhen: [
    {
      id: "miss-me",
      seal: "💌",
      tag: "When distance feels heavy",
      title: "Open when you miss me",
      letters: [
        "Hey Lahari... If you're opening this, you're missing me, and I want you to close your eyes for a second. Take a deep breath. Know that no matter how many miles or hours stand between us, you are the first thing on my mind in the morning and the last thought before I sleep. Distance is just a temporary number; what I feel for you is permanent and immovable. I'm right here with you, always.",
        "My favorite girl, distance is just geography testing how strong an unbreakable bond is. Every second my heart beats, it beats your name. Close your eyes, feel the warmth in your chest, and know that I am holding your hand across any distance right this second.",
        "Whenever you miss me, look at your phone screen right now and remember: somewhere under this exact same sky, Nisar is smiling thinking of you. You are never alone, Lahari. I carry you in my thoughts in every waking minute.",
        "I miss you just as much, if not a thousand times more. Counting down every minute until I hear your sweet laugh again. Until then, wrap yourself in this virtual hug and know that you are completely loved."
      ]
    },
    {
      id: "bad-day",
      seal: "🌿",
      tag: "When things feel overwhelming",
      title: "Open when you have a stressful day",
      letters: [
        "Pause right here, my love. Today might have been exhausting, frustrating, or heavy, but please remember: one bad day does not define your journey. You carry so much strength and dignity, even when you feel tired. Drink some water, rest your shoulders, and let today go. Tomorrow is brand new, and I am in your corner cheering for you every step of the way.",
        "Soft reminder for my hard-working girl: you don't have to carry the whole world on your shoulders today. It's okay to put everything down, close your eyes, and just breathe. Nisar is here to take care of you. Let today's stress dissolve into nothing.",
        "Let the weight of today melt away, Lahari. You did your absolute best, and that is more than enough for me and for anyone. Rest your mind, put on your favorite quiet song, and know that tomorrow is a fresh canvas with nothing but good things waiting for you.",
        "Wrap yourself in your softest blanket, take a sip of water, and let me send you peace through these words. You are safe, you are strong, and this stressful moment will pass like a cloud in the wind. I'm right beside you."
      ]
    },
    {
      id: "doubt-yourself",
      seal: "✨",
      tag: "When you need a reminder",
      title: "Open when you doubt yourself",
      letters: [
        "Look at me through these words, Lahari. If you could see yourself from where I stand, you would never spend a single second doubting your intelligence, your beauty, or your worth. You are capable of handling whatever is in front of you. You are more than enough—you are extraordinary, and I believe in you with every fiber of my being.",
        "Do you know how capable, graceful, and brilliant you are? Even when you doubt yourself, my faith in you never wavers for a second. You have solved every challenge you ever faced, and you will conquer this one too. I am so endlessly proud of you.",
        "You are the strongest, most resilient person I know. Every storm you faced, you came out even more radiant and wise. Don't let a temporary shadow make you forget how brightly your light shines. You are pure magic, Lahari.",
        "Stand tall, my queen. You have a heart of pure gold and a mind of starlight. The universe is lucky to have your gentle presence, and I am the luckiest guy alive to walk beside you. Believe in yourself the way I believe in you."
      ]
    },
    {
      id: "birthday-letter",
      seal: "🎂",
      tag: "Exclusive for 29 September",
      title: "Open on your Birthday",
      letters: [
        "Happy Birthday, Lahari! Another year older, and somehow even more radiant, thoughtful, and beloved. Celebrating your birth is celebrating everything good and sweet in my life. I promise to keep making you laugh, to stand beside you in all seasons, and to remind you every single day how deeply cherished you are. Happy 29th of September, my queen.",
        "September 29th is my favorite date on the calendar because it brought the most beautiful soul into this world. Happy Birthday to the girl who made my life meaningful, joyful, and complete. May this year bring you all the warmth, peace, and dreams your heart desires.",
        "To the girl who deserves the whole galaxy wrapped in gold: Happy Birthday, Lahari! Watching you grow more graceful, kind, and inspiring with every passing year is my life's greatest privilege. Today belongs completely to you.",
        "Another milestone year with you! I promise to spend every year celebrating your existence, making you smile when you're sleepy, and reminding you that you are my favorite person yesterday, today, and for all tomorrows. Happy Birthday, Lahari ❤️"
      ]
    }
  ],

  // 2. "The Reason Jar" (45+ Deep Personalized Compliments & Love Reasons)
  reasonJar: [
    "The spontaneous, genuine way you laugh when something really catches you off guard.",
    "The quiet kindness you show without ever expecting anything in return.",
    "The way your eyes soften when you listen to someone you care about.",
    "How safe and peaceful I feel whenever I talk to you.",
    "Your natural grace—you don't have to try to be captivating, you just are.",
    "How you turn ordinary conversations into memories I replay for days.",
    "The sweet little expressions your face makes before you even speak.",
    "Your honest heart in a world that is so often guarded.",
    "The strength you show even when things aren't easy.",
    "How you make me want to be the best version of myself every day.",
    "The subtle, comforting rhythm of your voice that instantly calms my mind.",
    "The way you look at me and make me feel completely understood.",
    "How you carry so much beauty with so much humility.",
    "The thoughtful little questions you ask when you check in on me.",
    "How my favorite place in the whole world is simply wherever you are.",
    "The way you light up when talking about something you love.",
    "Your patience and the deep empathy you carry.",
    "How you've made my life infinitely more meaningful just by being in it.",
    "Because among billions of people on this planet, you are my absolute favorite.",
    "The gentle, reassuring way you say my name.",
    "How you make quiet moments feel just as special as loud celebrations.",
    "Your sense of humor and the silly little inside jokes only we share.",
    "The way you care about the little details that most people overlook.",
    "How simply seeing your notification lights up my entire afternoon.",
    "Your honesty—I never have to guess with you, because your heart is genuine.",
    "How effortless and safe silence feels when I am with you.",
    "The cute way you react when you get shy or complimented.",
    "The resilience in your spirit—no matter what comes, you carry yourself with poise.",
    "How your presence turns any stressful day into a peaceful evening.",
    "The warm, steady light you bring into every room you enter.",
    "Because loving you is the easiest, most natural decision I've ever made.",
    "The sweet little habits you have that you don't even realize you do.",
    "How your happiness genuinely matters to me more than my own.",
    "The purity in your intentions—you wish well for everyone around you.",
    "How you listen not just to respond, but to truly understand.",
    "The sparkle in your eyes when something genuinely excites you.",
    "How proud I feel to tell the universe that you are my girl.",
    "The comforting warmth that fills my chest every time I think of you.",
    "Because you are my favorite chapter, my safest haven, and my sweetest dream.",
    "How you make ordinary days feel like poetry.",
    "The gentle forgiveness and patience you naturally possess.",
    "How you are both my biggest adventure and my most peaceful resting place.",
    "Because in a world full of noise, you are my favorite melody.",
    "How you inspire me every single day without even trying.",
    "Because you are simply Lahari—uniquely, wonderfully, and completely irreplaceable."
  ],

  // 3. "Hold For a Virtual Hug" (16 Dynamic Heart-Melting Hug Messages)
  virtualHug: {
    badge: "Touch & Feel",
    title: "Need A Hug Right Now?",
    subtitle: "Press and hold the heart below for 3 seconds to feel a warm embrace from Nisar.",
    holdingText: "Holding you close in my arms...",
    messages: [
      "Sending you the warmest, tightest hug across any distance. I am right here with you, Lahari. You are never alone. ❤️",
      "Wrapping my arms around you so tight that all the weight on your shoulders melts away. Feel my heartbeat close to yours. 🫂",
      "A gentle forehead kiss, a soft whisper in your ear, and the warmest hug just for you. Everything is going to be alright, my love. 🌸",
      "Holding your hands in mine, looking straight into your eyes, and pulling you into a warm, safe embrace. You are completely safe with me. ✨",
      "A long, quiet, 5-minute hug where neither of us has to say anything—just breathing together in pure peace. 🕊️",
      "Rest your head on my chest and let the world fade into the background. You are my favorite place in the whole universe. 🌙",
      "A cozy, warm blanket hug with our favorite song playing softly. Sending you all my warmth right this second. ☕",
      "Holding you so close you can hear how fast my heart races just thinking of you. You mean everything to me. 💖",
      "Whenever you need a safe harbor, my arms are always open, waiting only for you. Always yours, Lahari. 🌹",
      "Squeezing you tight! One of those happy, goofy hugs that make you laugh and forget every little worry. 🥰",
      "A gentle, tender embrace that whispers: I'm proud of you, I cherish you, and I'll never let you go. 💫",
      "No matter what happened today, right now in this hug, you are deeply loved, protected, and adored. ❤️",
      "Close your eyes and take a deep breath. Can you feel that? That's my love reaching across the miles to hold you tight. 🌌",
      "A soft, reassuring hug for the girl who carries so much kindness in her heart. You deserve all the peace in the world. 🤍",
      "An infinite hug with zero expiration date. Consider yourself officially held by Nisar forever! 🔒",
      "Sending you 1,000 hugs packed into this one sacred moment. You are my home, Lahari. 🏡"
    ]
  },

  // 4. "Today's Love Whisper" (Time-Based Dynamic Greeting)
  timeWhispers: {
    morning: {
      tag: "Morning Light • 5 AM – 12 PM",
      title: "Good Morning, My Sunshine ☀️",
      quote: "Wishing you a day as soft, radiant, and lovely as your smile. Nisar is already thinking of you.",
      hint: "Remember to drink your morning water and have a peaceful start today."
    },
    afternoon: {
      tag: "Gentle Pause • 12 PM – 5 PM",
      title: "Afternoon Sweetness ☕",
      quote: "Take a pause, breathe deep, and remember that you're doing wonderfully. Thinking of you always.",
      hint: "Don't work too hard—Nisar is sending you warm energy across the day."
    },
    evening: {
      tag: "Sunset Glow • 5 PM – 9 PM",
      title: "Golden Hour Serenade 🌆",
      quote: "The day is winding down. So proud of you for everything you did today. Relax your shoulders, my love.",
      hint: "Let go of the day's rush. You did great today."
    },
    night: {
      tag: "Midnight Starlight • 9 PM – 5 AM",
      title: "Under Our Midnight Sky 🌙",
      quote: "Sleep peacefully, Lahari. Breathe easy knowing Nisar is watching over your dreams under this exact same moon.",
      hint: "Close your eyes, feel my hug, and rest sweetly."
    }
  },

  // 5. Luxury Gold "Scratch to Reveal" Love Notes (6 Secret Notes)
  scratchNotes: [
    {
      title: "Secret Vow #01",
      note: "“My secret promise: I will never stop looking at you like you are the most incredible miracle that ever happened to me.”",
      sign: "— Forever Nisar"
    },
    {
      title: "Secret Vow #02",
      note: "“No matter how busy life gets, you will never have to fight for my attention. You are always my first thought and highest priority.”",
      sign: "— Always Nisar"
    },
    {
      title: "Secret Vow #03",
      note: "“You make loving you the easiest, most natural thing I have ever done in my entire life. Thank you for being you.”",
      sign: "— Truly Nisar"
    },
    {
      title: "Secret Vow #04",
      note: "“Whenever I pray, your happiness and peace of mind is always the first wish I whisper to the stars.”",
      sign: "— Devotedly Nisar"
    },
    {
      title: "Secret Vow #05",
      note: "“You don't need to change for anyone. The real, raw, candid Lahari is the only person I want for all of eternity.”",
      sign: "— Your Nisar"
    },
    {
      title: "Secret Vow #06",
      note: "“I promise to stand by you in the quiet days, the stormy days, and the brightest victories of our life.”",
      sign: "— Only Nisar"
    }
  ],

  // 6. "Our Future Dreams Bucket List" (6 Sacred Shared Promises)
  futureBucketList: [
    {
      id: "drive",
      icon: "🚗",
      title: "Midnight Drive With No Destination",
      desc: "Just the open road, our favorite songs playing softly, and nowhere we'd rather be than right beside each other."
    },
    {
      id: "sunrise",
      icon: "🌄",
      title: "Watching The Hilltop Sunrise Together",
      desc: "Sitting under a warm shared blanket in the quiet dawn, watching the golden sunlight touch your face."
    },
    {
      id: "cooking",
      icon: "🍳",
      title: "Cooking Dinner & Laughing at The Mess",
      desc: "Trying a fancy recipe together, burning something slightly, and laughing until our stomachs hurt."
    },
    {
      id: "paris",
      icon: "🗼",
      title: "Celebrating in Paris Under The Eiffel Tower",
      desc: "Holding hands on the Seine river at midnight while the Eiffel Tower sparkles just for your birthday."
    },
    {
      id: "home",
      icon: "🏡",
      title: "Building Our Little Sanctuary of Peace",
      desc: "A warm, cozy home filled with books, soft lighting, plant corners, and unconditional peace."
    },
    {
      id: "stargaze",
      icon: "🌌",
      title: "Stargazing Far Away From City Lights",
      desc: "Lying under a million crystal stars, picking out our constellation, and dreaming of our next fifty years."
    }
  ],

  // 7. "Message in a Bottle" (Ocean Drift Parchment Letters)
  messageInBottle: [
    "“Found floating on the waves of our memories: Some people search their whole lives for what I found the very day I met you.”",
    "“Drifting ashore: Even if the ocean tried to swallow every word, my devotion to you would still echo on every shore.”",
    "“A note from the deep: I love you not just for who you are, but for who I become whenever I am in your presence.”",
    "“Washed onto the sand: Distance is just sea water between two hearts that have already decided to belong together forever.”",
    "“Sealed in crystal: If I had to live a thousand lifetimes, I would search the oceans in every single one to find you again.”"
  ],

  // 8. "How Are You Feeling Right Now?" (Instant Mood Care Oracle)
  moodCare: {
    missing: {
      icon: "🥺",
      label: "Missing Nisar",
      title: "A Gentle Whisper For When You Miss Me",
      prescription: "Take three deep breaths. Put your hand over your heart. Can you feel that steady beat? That's me living in your thoughts right now. Distance cannot touch what is permanent. I am right here with you, Lahari.",
      hugType: "Warm tight hug across the miles"
    },
    exhausted: {
      icon: "😴",
      label: "Exhausted & Tired",
      title: "Permission to Rest, My Hardworking Girl",
      prescription: "You have carried so much today. Put your phone down after this, take a sip of water, and let yourself rest without guilt. You don't have to prove anything to anyone. I am so proud of your dedication.",
      hugType: "Soft blanket forehead-kiss embrace"
    },
    stressed: {
      icon: "😔",
      label: "Stressed / Overwhelmed",
      title: "A Sanctuary From The World's Noise",
      prescription: "Whatever is stressing you right now is temporary. It cannot define you, and it cannot take away your peace unless you let it. Let Nisar worry about the big things; you just take it one gentle breath at a time.",
      hugType: "Reassuring, protective bear hug"
    },
    happy: {
      icon: "🥰",
      label: "Happy & Loved",
      title: "Celebrating Your Beautiful Radiance",
      prescription: "Seeing you happy is my favorite sight in the entire universe. Keep that radiant smile on your face—it lights up my entire world from miles away. I love you so much!",
      hugType: "Joyful twirling celebration hug"
    },
    smile: {
      icon: "🌸",
      label: "Need a Smile",
      title: "Here Is A Little Reason To Smile",
      prescription: "Fun fact: Somewhere in this world, there is a guy named Nisar whose entire day gets ten times brighter the second he sees your name on his screen. You have that kind of superpower, Lahari!",
      hugType: "Tickle-laugh cozy embrace"
    }
  },

  // 9. "How Well Do You Know My Heart?" Mini-Quiz
  coupleQuiz: [
    {
      q: "What is Nisar's absolute favorite thing about you?",
      options: [
        "Your breathtaking eyes",
        "Your spontaneous, genuine laugh",
        "The gentle kindness of your heart",
        "All of the above, plus infinity more!"
      ],
      correct: 3,
      comment: "Correct! Every single detail of who you are is Nisar's absolute favorite."
    },
    {
      q: "Where is Nisar's favorite place in the entire world?",
      options: [
        "Paris under the stars",
        "A quiet beach at sunset",
        "Wherever Lahari is right that second",
        "In his car driving at night"
      ],
      correct: 2,
      comment: "Spot on! Anywhere you are is instantly home for Nisar."
    },
    {
      q: "Between Nisar and Lahari, who loves the other more?",
      options: [
        "Lahari loves Nisar more",
        "It is exactly 50-50 equal",
        "Trick question: Nisar loves Lahari to infinity and beyond!",
        "A debate for our 50th anniversary"
      ],
      correct: 2,
      comment: "Never in doubt! Nisar's love for Lahari expands to infinity every single day."
    }
  ],

  // 10. Official Star Naming Certificate Metadata
  starCertificate: {
    starName: "Star Lahari-2909",
    constellation: "Virgo (The Heavenly Maiden)",
    coordinates: "RA 13h 25m 11s | Dec -11° 09' 40\"",
    registeredBy: "Nisar Sayyad",
    proclamation: "Registered permanently in the celestial register as an eternal symbol of devotion, forever shining over Lahari."
  },

  // "Under The Same Sky"
  sameSky: {
    badge: "Shared Universe",
    title: "Under The Same Sky",
    quote: "No matter how many miles lie between us, we are always breathing the same night air and looking up at the exact same moon.",
    subtext: "Whenever you look up at the stars, know that Nisar is looking too—thinking of you."
  }
});
// Adding Passcode Gate configuration
Object.assign(window.STORY_CONFIG, {
  passcodeGate: {
    enabled: true,
    // Accept multiple convenient formats so Lahari never gets stuck
    validCodes: [
      "2909",
      "29/09",
      "29-09",
      "290907",
      "29092007",
      "29/09/2007",
      "29-09-2007",
      "29 september",
      "29th september",
      "lahari",
      "lahari sayyad",
      "nisar",
      "nisar lahari",
      "lahari nisar",
      "nl",
      "nxl"
    ],
    badge: "Confidential & Private",
    title: "A Private Sanctum",
    subtitle: "Created by Nisar exclusively for Lahari",
    promptText: "Enter our secret key to enter",
    placeholder: "Enter secret passcode...",
    errorMessage: "Only the one who holds Nisar's heart knows the key... Try again ❤️"
  },

  // 10 Prestige Luxury Themes
  themes: [
    {
      id: "velvet-wine",
      name: "Velvet Wine & Gold",
      desc: "Signature burgundy, candlelit wine & champagne gold",
      swatch: "linear-gradient(135deg, #4a1327 50%, #dfb76c 50%)"
    },
    {
      id: "midnight-celestial",
      name: "Midnight Celestial",
      desc: "Deep obsidian navy, starlight silver & lunar mist",
      swatch: "linear-gradient(135deg, #0c1228 50%, #b3c7ee 50%)"
    },
    {
      id: "royal-emerald",
      name: "Royal Emerald",
      desc: "Imperial velvet forest & 24K vintage gold leaf",
      swatch: "linear-gradient(135deg, #072115 50%, #e5be6b 50%)"
    },
    {
      id: "paris-rose",
      name: "Parisian Sunset",
      desc: "Terracotta mauve, soft blush & champagne rose",
      swatch: "linear-gradient(135deg, #52203b 50%, #e8b09b 50%)"
    },
    {
      id: "obsidian-ruby",
      name: "Obsidian & Ruby",
      desc: "Smoked charcoal velvet & crimson glowing ruby",
      swatch: "linear-gradient(135deg, #14080e 50%, #8a132e 50%)"
    },
    {
      id: "amethyst-twilight",
      name: "Imperial Amethyst",
      desc: "Midnight royal violet & glowing lavender mist",
      swatch: "linear-gradient(135deg, #170a2a 50%, #c39bf5 50%)"
    },
    {
      id: "sapphire-ocean",
      name: "Sapphire Ocean",
      desc: "Abyssal Mariana blue & diamond starlight mist",
      swatch: "linear-gradient(135deg, #07172e 50%, #71cbdf 50%)"
    },
    {
      id: "tuscan-amber",
      name: "Tuscan Espresso",
      desc: "Dark roasted cacao, amber caramel & warm gold",
      swatch: "linear-gradient(135deg, #1e1008 50%, #dca358 50%)"
    },
    {
      id: "cherry-blossom",
      name: "Cherry Blossom",
      desc: "Petal mulberry plum & delicate sakura pink",
      swatch: "linear-gradient(135deg, #220a1a 50%, #f2a7ca 50%)"
    },
    {
      id: "victorian-noir",
      name: "Victorian Bronze",
      desc: "Candlelight mahogany noir & antique gilded brass",
      swatch: "linear-gradient(135deg, #191612 50%, #cbb07c 50%)"
    }
  ],

  // Interactive Polaroid Stack Keepsakes (Real candid photos of Lahari)
  polaroids: [
    {
      image: "assets/images/polaroid-1.jpg",
      caption: "that smile stops time ✨"
    },
    {
      image: "assets/images/polaroid-2.jpg",
      caption: "my favorite person, always ❤️"
    },
    {
      image: "assets/images/polaroid-3.jpg",
      caption: "purest soul in the universe 💫"
    },
    {
      image: "assets/images/polaroid-4.jpg",
      caption: "unfiltered beauty & grace 🌸"
    },
    {
      image: "assets/images/polaroid-5.jpg",
      caption: "candid moments I cherish 🕊️"
    },
    {
      image: "assets/images/polaroid-6.jpg",
      caption: "the light of my life 🌙"
    },
    {
      image: "assets/images/polaroid-7.jpg",
      caption: "forever grateful for you 💖"
    },
    {
      image: "assets/images/polaroid-8.jpg",
      caption: "just you, being perfect 🌹"
    }
  ],

  // 10 Distinct Romantic Petal & Celestial Drift Styles
  petalStyles: [
    {
      id: "crimson-rose",
      name: "Crimson Rose Petals",
      desc: "Deep velvety ruby & red rose petals fluttering in 3D",
      icon: "🌹",
      swatch: "linear-gradient(135deg, #a81538, #59091c)",
      type: "rose",
      colors: [
        { r: 219, g: 39, b: 79 },
        { r: 168, g: 21, b: 56 },
        { r: 130, g: 14, b: 42 },
        { r: 242, g: 80, b: 115 }
      ]
    },
    {
      id: "cherry-blossom",
      name: "Sakura Cherry Blossom",
      desc: "Delicate Japanese cherry blossom petals dancing softly",
      icon: "🌸",
      swatch: "linear-gradient(135deg, #fbcfe8, #f472b6)",
      type: "sakura",
      colors: [
        { r: 251, g: 207, b: 232 },
        { r: 244, g: 114, b: 182 },
        { r: 249, g: 168, b: 212 },
        { r: 253, g: 242, b: 248 }
      ]
    },
    {
      id: "gold-flakes",
      name: "24K Gold Leaf Foil",
      desc: "Shimmering luxury 24K pure gold flakes and gilded embers",
      icon: "✨",
      swatch: "linear-gradient(135deg, #fef08a, #ca8a04)",
      type: "gold",
      colors: [
        { r: 254, g: 240, b: 138 },
        { r: 250, g: 204, b: 21 },
        { r: 234, g: 179, b: 8 },
        { r: 253, g: 224, b: 71 }
      ]
    },
    {
      id: "white-jasmine",
      name: "White Jasmine & Lily",
      desc: "Pristine fragrant white jasmine & pearl cream blossoms",
      icon: "🤍",
      swatch: "linear-gradient(135deg, #ffffff, #cbd5e1)",
      type: "jasmine",
      colors: [
        { r: 255, g: 255, b: 255 },
        { r: 248, g: 250, b: 252 },
        { r: 241, g: 245, b: 249 },
        { r: 254, g: 243, b: 199 }
      ]
    },
    {
      id: "amethyst-violet",
      name: "Royal Amethyst Orchid",
      desc: "Violet orchid petals with gentle ethereal twilight lavender glow",
      icon: "💜",
      swatch: "linear-gradient(135deg, #e9d5ff, #9333ea)",
      type: "orchid",
      colors: [
        { r: 216, g: 180, b: 254 },
        { r: 168, g: 85, b: 247 },
        { r: 192, g: 132, b: 252 },
        { r: 233, g: 213, b: 255 }
      ]
    },
    {
      id: "peach-peony",
      name: "Warm Peach & Peony",
      desc: "Soft apricot, peach nectar & sunset blush blossoms",
      icon: "🍑",
      swatch: "linear-gradient(135deg, #fed7aa, #fb923c)",
      type: "peach",
      colors: [
        { r: 254, g: 215, b: 170 },
        { r: 253, g: 186, b: 116 },
        { r: 251, g: 146, b: 60 },
        { r: 255, g: 237, b: 213 }
      ]
    },
    {
      id: "blue-lotus",
      name: "Mystic Blue Lotus",
      desc: "Abyssal indigo & starlit celestial cyan water-lily petals",
      icon: "🪷",
      swatch: "linear-gradient(135deg, #bae6fd, #0284c7)",
      type: "lotus",
      colors: [
        { r: 186, g: 230, b: 253 },
        { r: 56, g: 189, b: 248 },
        { r: 14, g: 165, b: 233 },
        { r: 125, g: 211, b: 252 }
      ]
    },
    {
      id: "autumn-maple",
      name: "Autumn Amber Maple",
      desc: "Romantic cozy golden amber & roasted chestnut falling leaves",
      icon: "🍁",
      swatch: "linear-gradient(135deg, #fdba74, #c2410c)",
      type: "leaf",
      colors: [
        { r: 251, g: 146, b: 60 },
        { r: 234, g: 88, b: 12 },
        { r: 194, g: 65, b: 12 },
        { r: 249, g: 115, b: 22 }
      ]
    },
    {
      id: "floating-hearts",
      name: "Glowing Neon Hearts",
      desc: "Romantic mini floating hearts drifting gently through air",
      icon: "💖",
      swatch: "linear-gradient(135deg, #f43f5e, #be123c)",
      type: "heart",
      colors: [
        { r: 244, g: 63, b: 94 },
        { r: 251, g: 113, b: 133 },
        { r: 225, g: 29, b: 72 },
        { r: 244, g: 114, b: 182 }
      ]
    },
    {
      id: "diamond-stardust",
      name: "Diamond Stardust",
      desc: "Glittering crystal starlight diamonds from our midnight sky",
      icon: "💎",
      swatch: "linear-gradient(135deg, #e0f2fe, #38bdf8)",
      type: "diamond",
      colors: [
        { r: 224, g: 242, b: 254 },
        { r: 186, g: 230, b: 253 },
        { r: 255, g: 255, b: 255 },
        { r: 147, g: 197, b: 253 }
      ]
    }
  ],

  // Time Capsule (2030)
  timeCapsule: {
    targetYear: 2030,
    targetMonth: 8, // September
    targetDay: 29
  },

  // Floating Song Lyrics Synced to Audio Tracks
  songLyrics: {
    1: [
      "In the glow of Seoul city, thinking only of you...",
      "A million lights, but your eyes outshine them all...",
      "Every heartbeat softly whispers your name...",
      "Distance means nothing when someone means everything..."
    ],
    2: [
      "Calling your name, the sweetest melody I know...",
      "Every quiet moment with you becomes my favorite memory...",
      "Holding on to your love like my most cherished treasure...",
      "Wherever you are is where my heart belongs..."
    ],
    3: [
      "I know I can treat you better than anyone ever could...",
      "Give you the respect, peace and gentle love you deserve...",
      "You will never have to doubt your worth with me...",
      "Here for you through every storm and sunny day..."
    ]
  },

  // 35mm Vintage Film Reel (Candid Moments Not Seen Anywhere Else)
  filmReel: [
    { src: 'assets/images/film-01.jpg', caption: 'Unfiltered elegance in the quietest moments' },
    { src: 'assets/images/film-02.jpg', caption: 'That effortless charm that stops time' },
    { src: 'assets/images/film-03.jpg', caption: 'A candid frame of pure innocence & grace' },
    { src: 'assets/images/film-04.jpg', caption: 'The way sunlight finds its favorite muse' },
    { src: 'assets/images/film-05.jpg', caption: 'Unscripted, genuine, and impossibly beautiful' },
    { src: 'assets/images/film-06.jpg', caption: 'Every candid angle reveals another reason to fall' },
    { src: 'assets/images/film-07.jpg', caption: 'A quiet laugh caught between breaths' },
    { src: 'assets/images/film-08.jpg', caption: 'Sweetest soul, timeless in 35mm grain' },
    { src: 'assets/images/film-09.jpg', caption: 'The softness in your eyes speaking volumes' },
    { src: 'assets/images/film-10.jpg', caption: 'A stolen glance worth a million verses' },
    { src: 'assets/images/film-11.jpg', caption: 'Natural, radiant, and utterly unforgettable' },
    { src: 'assets/images/film-12.jpg', caption: 'Capturing the magic in your simplest smile' },
    { src: 'assets/images/film-13.jpg', caption: 'A precious memory frozen in eternal warmth' },
    { src: 'assets/images/film-14.jpg', caption: 'The rare beauty of your authentic self' },
    { src: 'assets/images/film-15.jpg', caption: 'Every picture tells our unspoken love story' },
    { src: 'assets/images/film-16.jpg', caption: 'Forever my favorite piece of art, Lahari' }
  ]
});
