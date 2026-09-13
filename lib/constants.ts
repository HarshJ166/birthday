
export const ENVELOPE = {
  eyebrow: "For you,",
  name: "Devyani",
  note: "23 years ago, the world got you.\nSomehow, I got lucky enough to know you.",
  action: "Open it",
} as const;

export const HERO = {
  name: "Devyani",
  fullName: "Devyani Rawat",
  openingLines: ["You turn toward the sun.", "So I built you one."],
  dateLabel: "13 September 2003",
  ageLabel: "Twenty-three",

} as const;

export const HERO_PORTRAITS = {
  day: {
    src: "/photos/03.jpeg",
    width: 1500,
    height: 2000,
    alt: "Devyani at the beach at sunset in a yellow shirt, hand in her hair.",
    object: "50% 30%",
    objectLg: "50% 0%",
  },
  night: {
    src: "/photos/02.jpeg",
    width: 960,
    height: 1280,
    alt: "Devyani sitting on a low wall at night in pink reindeer antlers, smiling at the camera.",
    /* Both arch crops are taller than 3:4, so the height binds and the crop is
       horizontal only. Her face sits at 54% across; the frame is held there. */
    object: "54% 30%",
    objectLg: "54% 30%",
  },
} as const;

/** By day a sunflower faces the sun; on the dark days it faces another one. */
export const TURNING = {
  lead: [
    "In the daylight, a sunflower turns toward the sun.",
    "On the dark days, it turns toward another sunflower.",
  ],
  /** The turn from the flowers to her, in his hand. */
  aside: "I think you've been my other sunflower.",
  closing: ["You keep being there for me.", "This one's just for you."],
} as const;

/** Six names, six different people doing the calling. */
export const NAMES = {
  heading: "Depends who's asking",
  intro: "Six of them, at last count.",
  entries: [
    { name: "Devyani", who: "On paper, and by anyone being careful with her." },
    { name: "Dev", who: "Everyone, eventually. It takes about a week." },
    { name: "Devi", who: "Mine. It is what I have called her from the start." },
    { name: "Rawat", who: "The drill square, and anyone who met her in uniform first." },
    {
      name: "My therapist",
      who: "Also mine. At hours no real therapist would agree to.",
    },
    {
      name: "Social butterfly",
      who: "Her own words. Annoyingly, also just accurate.",
    },
  ],
} as const;

export const BECAUSE_OF_YOU = {
  eyebrow: "The part I have never said properly",
  heading: "I cleared my engineering because of you.",
  paragraphs: [
    "Not the polite version people say at weddings. The literal one.",
    "You explained the same thing four times and never once made me feel slow for needing the fourth.",
    "You gave me your time when you didn't have to.",
  ],
  /** Set apart, with room around it. */
  coda: "I don't think I've ever properly thanked you for that.",
} as const;

export const GALLERY = [
  {
    src: "/photos/04.jpeg",
    width: 900,
    height: 1600,
    alt: "Devyani in her glasses on the rocks by the sea, holding a small gift box.",
    caption: "The specs. And the smile that came free with them.",
  },
  {
    src: "/photos/01.jpeg",
    width: 960,
    height: 1280,
    alt: "Devyani laughing under pink string lights with palm fronds behind her.",
    caption: "The laugh arrives before the joke lands. Every time.",
  },
  {
    src: "/photos/06.jpeg",
    width: 900,
    height: 1600,
    alt: "Devyani seated indoors with a pair of carved wings mounted on the wall behind her.",
    caption: "Wings on the wall behind her. Nobody planned that.",
  },
  {
    src: "/photos/03.jpeg",
    width: 1500,
    height: 2000,
    alt: "Devyani at the beach at sunset in a yellow shirt, hand in her hair.",
    caption: "Somehow you still made this about you.",
  },
  {
    src: "/photos/07.jpeg",
    width: 1200,
    height: 1600,
    alt: "Devyani outdoors after a college celebration, face painted, grinning at the camera.",
    caption: "Whatever happened here, she is clearly winning.",
  },
  {
    src: "/photos/02.jpeg",
    width: 960,
    height: 1280,
    alt: "Devyani sitting on a low wall at night, wearing pink reindeer antlers.",
    caption: "The headband was not a costume. She simply wanted it.",
  },
  {
    src: "/photos/05.jpeg",
    width: 900,
    height: 1600,
    alt: "Devyani on a stone staircase beside a white balustrade and flowering vines.",
    caption: "There was definitely a plan. I just don't remember what it was.",
  },
  {
    src: "/photos/08.jpeg",
    width: 1295,
    height: 2000,
    alt: "Devyani smiling straight at the camera indoors, warm lights behind her.",
    caption: "No occasion. Just this.",
  },
] as const;

export const GALLERY_SECTION = {
  heading: "Look at her",
  intro: "Only the ones I could get my hands on.",
  /* They come out of the envelope face down, the way prints actually do. */
  hint: "Face down, as they came. Turn one over.",
  outro:
    "There are many stories behind these eight photos. Unfortunately for you, I'm only putting the photos here.",
} as const;

export const LETTER = {
  date: "13 September 2026",
  salutation: "To Devyani,",
  /** A pair of double asterisks sets the words between them in bold. */
  paragraphs: [
    "Devi… Meri Teacher… Ms. PATAKA MODEL… kya kya kahu tujhe?",
    "I have called you my therapist for so long that I think you have stopped hearing it as a compliment. It is, though. Probably one of the biggest ones.",
    "From my first semester to the last, you somehow stayed there through all the ups and downs. And honestly, a lot of those downs were because of my immature behaviour. Still, you always forgave me, supported me, and somehow managed to stay.",
    "You know me in and out... my anger issues, mood swings, stupid jokes, street-style food choices, what bothers me and what calms me down. You have always given me a reality check when I needed one, supported my decisions when I was right, and properly scolded me when I was wrong.",
    "And that's something I genuinely value about you. You never just tell me what I want to hear.",
    "You are also one of those people who makes everyone comfortable. People genuinely enjoy your presence, and you just somehow jell up with everyone.",
    "You've been my Study Coach, my therapist, my reality check, and someone I know I can trust. You have even cared about my family, and I owe you a lot for that.",
    "I may not always approach you or talk to you as much as I should, but you still hold a very special place in my heart. You are one of the few people with whom I can go from my shittiest jokes to the most mature conversations without thinking twice.",
    "You've done a lot for me, Devyani. You brought Purva and Rashi into my life, your life saviours, and somehow they became a part of my life as well. You helped me understand things better and, honestly, helped shape me into a slightly better version of myself.",
    "And for all the times my behaviour may have hurt you or made things difficult, **I'm genuinely sorry.** I may not have realised it then, but I do now.",
    "So, thank you. For always being there, for putting up with me, and for being you.",
    "Here's to 23.",
    "I hope this year brings you everything you're working for and a lot of things you haven't even planned yet.",
  ],
  closing:
    "Stay in touch haan, main call karunga toh ho sake toh plans ko haa bol diya kar ek baar mein. You know me. 😅",
  farewell: "Happy Birthday, Devi.",
  signature: "— Harsh",
  /* It arrives folded. Reading it has to be something she chooses to do. */
  unfold: "Unfold it",
} as const;

export const WISH = {
  heading: "Make a wish.",
  /** One line of direction per stage. The button says what happens next. */
  stages: {
    unlit: {
      note: "23 wishes.\nOne for every year you've spent becoming you.",
      action: "Light the candles",
    },
    lit: {
      note: "Close your eyes for a second. You know how this part goes.",
      action: "Blow them out",
    },
    granted: {
      note: "",
      action: "Light them again",
    },
  },
  /** What the dark room says once the candles are out — the page's last word. */
  granted: {
    greeting: "Happy birthday, Devyani.",
    line: "Now go make 23 one of your best yet.",
  },
} as const;

export const CLOSING = {
  date: "13 September 2026",
  signature: "— Harsh",
  /* The one line on the page that has moved every time she comes back. */
  onTheDay: "And it is today. That is the entire point.",
  untilNext: "until the next one.",
} as const;

/** The date the counter in the footer is counting to. */
export const BIRTHDAY = { month: 9, day: 13 } as const;

/** How long the breath takes to travel across all twenty-three candles. */
export const WISH_BLOW_OUT_MS = 1_500;

/** How long each of her names holds the stage. */
export const NAME_CYCLE_MS = 2_600;

/**
 * The background music.
 *
 * The tune is a synthesised music box — it costs nothing to license and asks
 * nobody's permission. To use a real song instead, drop the file in `public/`
 * and change `src`. Nothing else has to move.
 */
export const MUSIC = {
  src: "/music/happy-birthday.wav",
  /** Quiet enough to read a letter over. */
  volume: 0.22,
  playLabel: "Play music",
  pauseLabel: "Pause music",
} as const;
