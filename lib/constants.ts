/**
 * Every word, image and number on this page lives here.
 * Components never reach for content — the page hands it to them.
 */

export const HERO = {
  name: "Devyani",
  fullName: "Devyani Rawat",
  openingLines: ["You turn toward the sun.", "So I built you one."],
  dateLabel: "13 September",
  ageLabel: "Twenty-three",
} as const;

export const TURNING = {
  heading: "The turning",
  paragraphs: [
    "It follows the sun all day. Turns back east overnight. Faces the morning before the morning arrives.",
    "I have never had to wonder which way you are facing.",
  ],
  aside: "Heliotropism — to turn toward the light.",
} as const;

/** Six names, six different people doing the calling. */
export const NAMES = {
  heading: "Depends who's asking",
  intro: "Six of them, at last count.",
  entries: [
    { name: "Devyani", who: "On paper, and by anyone being careful with her." },
    { name: "Dev", who: "Everyone, eventually. It takes about a week." },
    { name: "Devi", who: "Usually said by someone who wants something." },
    { name: "Rawat", who: "The drill square, and anyone who met her in uniform first." },
    {
      name: "My therapist",
      who: "Me. At hours no actual therapist would agree to.",
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
    "Not the polite version people say at weddings. The literal one. You explained the same thing four times and never once made me feel slow for needing the fourth.",
    "There is a version of this where you were busy that year. I don't like the look of it.",
  ],
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
    width: 3000,
    height: 4000,
    alt: "Devyani at the beach at sunset in a yellow shirt, hand in her hair.",
    caption: "Sunset, and still the brightest thing on that beach.",
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
    alt: "Devyani sitting on a low wall in the sun, wearing a pink headband.",
    caption: "The headband was not a costume. She simply wanted it.",
  },
  {
    src: "/photos/05.jpeg",
    width: 900,
    height: 1600,
    alt: "Devyani on a stone staircase beside a white balustrade and flowering vines.",
    caption: "Somewhere between the stairs and the next plan.",
  },
  {
    src: "/photos/08.jpeg",
    width: 1424,
    height: 2199,
    alt: "Devyani smiling straight at the camera indoors, warm lights behind her.",
    caption: "No occasion. Just this.",
  },
] as const;

export const GALLERY_SECTION = {
  heading: "Evidence",
  intro: "Only the ones I could get my hands on.",
} as const;

export const LETTER = {
  salutation: "Devyani,",
  paragraphs: [
    "I have called you my therapist for so long that I think you have stopped hearing it as a compliment. It is the largest one I have got.",
    "You do this thing — I have watched you do it in rooms full of strangers — where you find the one person who has gone quiet, and you fold them back in. You call yourself a social butterfly like it is a joke about being loud. It is not that. It is that nobody standing anywhere near you has ever felt like an extra.",
    "You are up and running before the rest of us have argued with the alarm. You will walk for three hours and describe it as getting some air. You will travel further for Punjabi food than most people travel for a holiday, and put a mountain in front of you and you simply start climbing it.",
    "And the specs. You have complained about them for years. They make you look like the smartest person in the room, which is inconvenient, because you already were.",
  ],
  closing:
    "So — twenty-three. You have already sat the exam. Whatever the letter says, keep your eyes up. You have never once needed telling which way the light is.",
  farewell: "Happy birthday, Dev.",
  signature: "Harsh",
} as const;

export const WISH = {
  heading: "Make a wish",
  /** One line of direction per stage. The button says what happens next. */
  stages: {
    unlit: {
      note: "Twenty-three of them, set in a sunflower's own spiral.",
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
  granted: [
    "Whatever you just asked for — I hope it is already on its way to you.",
    "And if it isn't, I hope you go and get it anyway. You always do.",
  ],
} as const;

export const CLOSING = {
  greeting: "Happy birthday, Devyani.",
  nudge: "Go on. Do the smile.",
  date: "13 September 2026",
  signature: "— Harsh",
} as const;

/** How long the breath takes to travel across all twenty-three candles. */
export const WISH_BLOW_OUT_MS = 1_500;

/** How long each of her names holds the stage. */
export const NAME_CYCLE_MS = 2_600;
