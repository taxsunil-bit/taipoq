export const englishLessons = [
  { id: "home-row", title: "Home Row", level: "Beginner", time: "5 min", desc: "asdf jkl; foundational keys.", target: "asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj asdf jkl;" },
  { id: "top-row", title: "Top Row", level: "Beginner", time: "5 min", desc: "qwerty uiop keys practice.", target: "qwer tyui opqw erty uiop qwer tyui opqw erty uiop" },
  { id: "bottom-row", title: "Bottom Row", level: "Beginner", time: "5 min", desc: "zxcvbnm,. keys practice.", target: "zxcv bnm, .zxc vbnm ,.zx cvbn m,.z xcvb nm,." },
  { id: "capital", title: "Capital Letters", level: "Intermediate", time: "7 min", desc: "Shift + letters.", target: "The Quick Brown Fox Jumps Over The Lazy Dog." },
  { id: "numbers", title: "Numbers", level: "Intermediate", time: "7 min", desc: "Top row number keys.", target: "1234567890 1029 3847 5601 7283 9405 1122 3344" },
  { id: "punctuation", title: "Punctuation", level: "Intermediate", time: "5 min", desc: "Common punctuation marks.", target: "Hello, world! How are you? I'm fine; thanks." },
  { id: "words", title: "Words Practice", level: "Intermediate", time: "10 min", desc: "Common English words.", target: "time people year work day man new way thing life hand part child eye woman place week case point" },
  { id: "sentences", title: "Sentence Practice", level: "Intermediate", time: "10 min", desc: "Simple full sentences.", target: "Practice typing every day to build speed and accuracy. Sit straight and place fingers on the home row." },
  { id: "paragraph", title: "Paragraph Practice", level: "Advanced", time: "15 min", desc: "Long-form paragraph typing.", target: "The art of typing is built on consistent daily practice. Focus on accuracy first and speed will follow naturally as your muscle memory develops over weeks and months of focused effort." },
  { id: "legal", title: "Legal English Practice", level: "Advanced", time: "15 min", desc: "Legal drafting paragraphs.", target: "The plaintiff, by way of this petition, humbly submits before this Honourable Court that the cause of action arose within the territorial jurisdiction of this Court." },
];

// KrutiDev / Remington Hindi lessons.
// Title is in Unicode Hindi for readability, but `target` is the KrutiDev keyboard-encoded
// ASCII string — when rendered in the KrutiDev 010 font it appears as Devanagari.
// The user types these exact ASCII keys on a standard English keyboard.
export const hindiLessons = [
  { id: "svar", title: "स्वर अभ्यास", level: "Beginner", time: "5 min", desc: "Vowels: अ आ इ ई उ ऊ ए ऐ ओ औ", target: "v vk b bZ m Å , ,s vks vkS va v%" },
  { id: "vyanjan", title: "व्यंजन अभ्यास", level: "Beginner", time: "7 min", desc: "Consonants: क ख ग घ ...", target: "d [k x ?k p N t > V B M < r Fk n /k u i Q c Hk e" },
  { id: "matra", title: "मात्राएँ", level: "Intermediate", time: "10 min", desc: "Matras with क", target: "dk fd dh dq dw ds dS dks dkS da d%" },
  { id: "halant", title: "हलन्त अभ्यास", level: "Intermediate", time: "5 min", desc: "Halant joining", target: "fo|k lR; /keZ deZ izse LoIu" },
  { id: "sanyukt", title: "संयुक्ताक्षर", level: "Advanced", time: "10 min", desc: "Conjuncts", target: "{k = K J} n~o iz Ø Vª" },
  { id: "anuswar", title: "अनुस्वार और चंद्रबिंदु", level: "Intermediate", time: "5 min", desc: "Anuswar / Chandrabindu", target: "gal xaxk jax pk¡n ek¡ gk¡" },
  { id: "sankhya", title: "संख्या", level: "Beginner", time: "5 min", desc: "Hindi numerals are same digits", target: "1 2 3 4 5 6 7 8 9 0 11 22 33" },
  { id: "viram", title: "विराम चिह्न", level: "Beginner", time: "5 min", desc: "Punctuation", target: "ueLrsA vki dSls gSa\\? cgqr vPNk! /kU;oknA" },
  { id: "shabd", title: "शब्द अभ्यास", level: "Intermediate", time: "10 min", desc: "Common words", target: "?kj ikuh fdrkc fo|ky; v/;kid Nk= fe= ifjokj le; dk;Z" },
  { id: "vakya", title: "वाक्य अभ्यास", level: "Intermediate", time: "10 min", desc: "Simple sentences", target: ";g ,d fgUnh VkbZfiax vH;kl gSA dey ?kj tkrk gSA cPps fo|ky; tkrs gSaA" },
  { id: "anuched", title: "अनुच्छेद अभ्यास", level: "Advanced", time: "15 min", desc: "Paragraph", target: 'fgUnh gekjh jk"VªHkk"kk gSA ;g nsoukxjh fyfi esa fy[kh tkrh gSA fgUnh VkbZfiax lh[kuk vkt ds le; esa cgqr vko\';d gSA' },
  { id: "legal-hi", title: "कानूनी हिंदी अभ्यास", level: "Advanced", time: "15 min", desc: "Legal drafting", target: "izkFkhZ lEekuiwoZd U;k;ky; ds le{k fuosnu djrk gS fd okn dk dkj.k bl U;k;ky; dh {ks=h; vf/kdkfjrk esa mRiUu gqvk gSA" },
];

export const recentEnglishTests = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  date: `2026-06-${String(20 - i).padStart(2, "0")}`,
  grossWpm: 45 + i,
  netWpm: 40 + i,
  accuracy: 92 + (i % 6),
  mistakes: 5 + (i % 4),
}));

export const recentHindiTests = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  date: `2026-06-${String(20 - i).padStart(2, "0")}`,
  grossWpm: 22 + i,
  netWpm: 19 + i,
  accuracy: 88 + (i % 8),
  mistakes: 7 + (i % 5),
}));

export const adminResults = [
  { user: "Aman Sharma", lang: "English", mode: "QWERTY", duration: "5 min", gross: 58, net: 54, acc: 96, mistakes: 6, date: "2026-06-19" },
  { user: "प्रिया वर्मा", lang: "Hindi", mode: "Unicode", duration: "3 min", gross: 32, net: 28, acc: 93, mistakes: 8, date: "2026-06-18" },
  { user: "Rahul Singh", lang: "English", mode: "QWERTY", duration: "10 min", gross: 65, net: 62, acc: 97, mistakes: 4, date: "2026-06-18" },
  { user: "सीमा गुप्ता", lang: "Hindi", mode: "Remington", duration: "5 min", gross: 28, net: 25, acc: 91, mistakes: 9, date: "2026-06-17" },
];
