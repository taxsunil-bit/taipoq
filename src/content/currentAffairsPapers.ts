export type CurrentAffairsQuestion = {
  id: string;
  examTags: Array<"ssc" | "railway" | "pet" | "police" | "mixed">;
  topic:
    | "awards"
    | "sports"
    | "schemes"
    | "economy"
    | "science"
    | "international"
    | "polity"
    | "up-special";
  difficulty: "easy" | "medium";
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  staticLink?: string;
  sourceLabel?: string;
};

export type CurrentAffairsPaper = {
  id: string;
  title: string;
  exam: "ssc" | "railway" | "pet" | "police" | "mixed";
  durationMinutes: number;
  questions: CurrentAffairsQuestion[];
};

export type CurrentAffairsExamFilter = "All" | "SSC" | "Railway" | "PET" | "Police" | "Mixed";

export const MIXED_PAPER_ID = "mixed-current-affairs-paper-1" as const;
export const CURRENT_AFFAIRS_TARGET_QUESTIONS = 25 as const;

export const CURRENT_AFFAIRS_EXAM_FILTERS: readonly CurrentAffairsExamFilter[] = [
  "All",
  "SSC",
  "Railway",
  "PET",
  "Police",
  "Mixed",
] as const;

const TOPIC_LABELS: Record<CurrentAffairsQuestion["topic"], string> = {
  awards: "Awards",
  sports: "Sports",
  schemes: "Schemes",
  economy: "Economy",
  science: "Science",
  international: "International",
  polity: "Polity",
  "up-special": "UP Special",
};

const mixedPaperQuestions: CurrentAffairsQuestion[] = [
  {
    id: "ca-mixed-1-q1",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "international",
    difficulty: "easy",
    question: "जनवरी 2025 में भारत ने किस देश की BRICS सदस्यता का स्वागत किया?",
    options: ["मलेशिया", "इंडोनेशिया", "थाईलैंड", "वियतनाम"],
    answerIndex: 1,
    explanation:
      "भारत ने जनवरी 2025 में इंडोनेशिया की BRICS सदस्यता का स्वागत किया। BRICS से जुड़े प्रश्नों में सदस्य देश, partner country और summit स्थान पूछे जा सकते हैं।",
    staticLink:
      "BRICS: Brazil, Russia, India, China, South Africa से आरम्भ हुआ समूह; बाद में नए सदस्य जुड़े।",
    sourceLabel: "PIB: India welcomed Indonesia’s BRICS membership, Jan 2025",
  },
  {
    id: "ca-mixed-1-q2",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "international",
    difficulty: "medium",
    question: "BRICS Rio de Janeiro Declaration 2025 में किस देश को BRICS member के रूप में welcome किया गया?",
    options: ["क्यूबा", "इंडोनेशिया", "मलेशिया", "उजबेकिस्तान"],
    answerIndex: 1,
    explanation:
      "BRICS Rio de Janeiro Declaration में इंडोनेशिया को BRICS member के रूप में welcome किया गया, जबकि कई देशों को partner countries के रूप में उल्लेखित किया गया।",
    staticLink: "Exam Link: Member country और partner country में अंतर समझना आवश्यक है।",
    sourceLabel: "PIB: BRICS Rio de Janeiro Declaration, July 2025",
  },
  {
    id: "ca-mixed-1-q3",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "international",
    difficulty: "medium",
    question: "9th BRICS Industry Ministers’ Meeting 2025 किस देश की Chairship में हुई?",
    options: ["भारत", "ब्राजील", "रूस", "दक्षिण अफ्रीका"],
    answerIndex: 1,
    explanation: "9th BRICS Industry Ministers’ Meeting Brazil की Chairship में Brasília में हुई।",
    staticLink: "Static Link: Brasília, Brazil की राजधानी है।",
    sourceLabel: "PIB: 9th BRICS Industry Ministers’ Meeting, 2025",
  },
  {
    id: "ca-mixed-1-q4",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "economy",
    difficulty: "easy",
    question: "Union Budget 2025-26 में fiscal deficit कितना अनुमानित था?",
    options: ["3.1% of GDP", "4.4% of GDP", "5.1% of GDP", "6.0% of GDP"],
    answerIndex: 1,
    explanation:
      "Union Budget 2025-26 में fiscal deficit 4.4% of GDP अनुमानित था। Budget से जुड़े प्रश्न SSC, Railway और PET में बार-बार आ सकते हैं।",
    staticLink: "Fiscal deficit = सरकार की कुल आय और कुल व्यय के बीच का अंतर।",
    sourceLabel: "PIB: Union Budget 2025-26 Highlights",
  },
  {
    id: "ca-mixed-1-q5",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "economy",
    difficulty: "easy",
    question: "Union Budget 2025-26 में capital expenditure कितना earmark किया गया था?",
    options: ["₹7.50 लाख करोड़", "₹9.00 लाख करोड़", "₹11.21 लाख करोड़", "₹15.50 लाख करोड़"],
    answerIndex: 2,
    explanation:
      "Union Budget 2025-26 में capital expenditure ₹11.21 लाख करोड़, यानी 3.1% of GDP earmark किया गया था।",
    staticLink:
      "Capital expenditure से roads, railways, infrastructure और assets निर्माण जैसे कार्य जुड़े होते हैं।",
    sourceLabel: "PIB: Union Budget 2025-26 Highlights",
  },
  {
    id: "ca-mixed-1-q6",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "economy",
    difficulty: "medium",
    question: "Union Budget 2026-27 में fiscal deficit कितना अनुमानित किया गया?",
    options: ["4.0% of GDP", "4.3% of GDP", "4.4% of GDP", "5.0% of GDP"],
    answerIndex: 1,
    explanation: "Budget Estimates 2026-27 में fiscal deficit 4.3% of GDP अनुमानित किया गया।",
    staticLink:
      "Budget प्रश्नों में BE और RE का अंतर ध्यान रखें: BE = Budget Estimate, RE = Revised Estimate.",
    sourceLabel: "PIB: Summary of Union Budget 2026-27",
  },
  {
    id: "ca-mixed-1-q7",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "schemes",
    difficulty: "medium",
    question: "Union Budget 2026-27 में Biopharma SHAKTI के लिए कितने outlay की घोषणा की गई?",
    options: ["₹1,000 करोड़", "₹5,000 करोड़", "₹10,000 करोड़", "₹25,000 करोड़"],
    answerIndex: 2,
    explanation: "Budget 2026-27 में Biopharma SHAKTI के लिए 5 वर्षों में ₹10,000 करोड़ का outlay बताया गया।",
    staticLink: "Biopharma = biotechnology और pharmaceutical क्षेत्र से जुड़ा विषय।",
    sourceLabel: "PIB: Highlights of Union Budget 2026-27",
  },
  {
    id: "ca-mixed-1-q8",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "science",
    difficulty: "medium",
    question:
      "Budget 2026-27 में India Semiconductor Mission 2.0 के लिए FY 2026-27 में कितना provision बताया गया?",
    options: ["₹500 करोड़", "₹1,000 करोड़", "₹5,000 करोड़", "₹8,000 करोड़"],
    answerIndex: 1,
    explanation:
      "Budget 2026-27 में India Semiconductor Mission 2.0 के लिए FY 2026-27 में ₹1,000 करोड़ का provision बताया गया।",
    staticLink: "Semiconductor chips electronics, AI, defence और mobile devices के लिए आवश्यक हैं।",
    sourceLabel: "PIB: India Semiconductor Mission 2.0 / Budget 2026-27",
  },
  {
    id: "ca-mixed-1-q9",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "science",
    difficulty: "easy",
    question: "NISAR satellite किसका joint mission है?",
    options: ["ISRO और ESA", "ISRO और NASA", "NASA और JAXA", "ISRO और Roscosmos"],
    answerIndex: 1,
    explanation: "NISAR यानी NASA-ISRO Synthetic Aperture Radar, ISRO और NASA का joint satellite mission है।",
    staticLink: "ISRO = Indian Space Research Organisation; NASA = USA की space agency.",
    sourceLabel: "PIB: Department of Space Year End Review / NISAR",
  },
  {
    id: "ca-mixed-1-q10",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "science",
    difficulty: "easy",
    question: "NISAR satellite किस launch vehicle से launch हुआ?",
    options: ["PSLV-C58", "LVM3-M4", "GSLV-F16", "SSLV-D3"],
    answerIndex: 2,
    explanation: "NISAR satellite ISRO के GSLV-F16 से launch हुआ।",
    staticLink: "GSLV = Geosynchronous Satellite Launch Vehicle.",
    sourceLabel: "PIB: NISAR launched onboard GSLV-F16",
  },
  {
    id: "ca-mixed-1-q11",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "science",
    difficulty: "medium",
    question: "NISAR का मुख्य उपयोग किस क्षेत्र से जुड़ा है?",
    options: [
      "केवल mobile communication",
      "Earth observation",
      "केवल television broadcasting",
      "केवल navigation",
    ],
    answerIndex: 1,
    explanation:
      "NISAR Earth observation mission है। यह land, ice, ecosystem और oceanic regions के अध्ययन में सहायक है।",
    staticLink:
      "Earth observation satellites पृथ्वी की सतह, जल, बर्फ, वन और पर्यावरण का अध्ययन करते हैं।",
    sourceLabel: "PIB: NISAR Earth observation",
  },
  {
    id: "ca-mixed-1-q12",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "sports",
    difficulty: "easy",
    question: "Khelo India Youth Games 2025 की मेजबानी किस राज्य ने की?",
    options: ["उत्तर प्रदेश", "बिहार", "राजस्थान", "मध्य प्रदेश"],
    answerIndex: 1,
    explanation: "Khelo India Youth Games 2025 की मेजबानी बिहार ने की।",
    staticLink: "Khelo India युवा खेल प्रतिभा को बढ़ावा देने का national sports programme है।",
    sourceLabel: "PIB: Khelo India Youth Games 2025",
  },
  {
    id: "ca-mixed-1-q13",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "sports",
    difficulty: "easy",
    question: "Khelo India Youth Games 2025 में पहली बार demonstration sport के रूप में क्या शामिल हुआ?",
    options: ["Chess", "Esports", "Kho-Kho", "Kabaddi"],
    answerIndex: 1,
    explanation: "KIYG 2025 में पहली बार Esports को demonstration sport के रूप में शामिल किया गया।",
    staticLink:
      "Demonstration sport medal tally का मुख्य भाग न होकर प्रदर्शन/परिचय के रूप में रखा जा सकता है।",
    sourceLabel: "PIB: KIYG 2025 esports demonstration sport",
  },
  {
    id: "ca-mixed-1-q14",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "sports",
    difficulty: "easy",
    question: "Khelo India University Games 2025 कहाँ आयोजित हुए?",
    options: ["बिहार", "राजस्थान", "दिल्ली", "गुजरात"],
    answerIndex: 1,
    explanation: "Khelo India University Games 2025 राजस्थान में आयोजित हुए।",
    staticLink: "Khelo India Youth Games और University Games अलग-अलग competitions हैं।",
    sourceLabel: "PIB: Khelo India University Games 2025 Rajasthan",
  },
  {
    id: "ca-mixed-1-q15",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "awards",
    difficulty: "easy",
    question: "Major Dhyan Chand Khel Ratna Award 2024 पाने वाले Gukesh D किस खेल से जुड़े हैं?",
    options: ["Shooting", "Chess", "Hockey", "Para-Athletics"],
    answerIndex: 1,
    explanation: "Gukesh D को Chess discipline में Major Dhyan Chand Khel Ratna Award 2024 के लिए चुना गया।",
    staticLink: "Major Dhyan Chand Khel Ratna भारत का प्रमुख खेल सम्मान है।",
    sourceLabel: "PIB: National Sports Awards 2024",
  },
  {
    id: "ca-mixed-1-q16",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "awards",
    difficulty: "easy",
    question: "Major Dhyan Chand Khel Ratna Award 2024 पाने वाली Manu Bhaker किस discipline से जुड़ी हैं?",
    options: ["Shooting", "Chess", "Badminton", "Boxing"],
    answerIndex: 0,
    explanation: "Manu Bhaker को Shooting discipline में Major Dhyan Chand Khel Ratna Award 2024 के लिए चुना गया।",
    staticLink: "Sports Awards में व्यक्ति + खेल discipline बहुत महत्वपूर्ण होता है।",
    sourceLabel: "PIB: National Sports Awards 2024",
  },
  {
    id: "ca-mixed-1-q17",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "awards",
    difficulty: "medium",
    question: "Padma Awards 2025 में कुल कितने awards approved हुए?",
    options: ["131", "132", "139", "150"],
    answerIndex: 2,
    explanation:
      "Padma Awards 2025 में कुल 139 awards approved हुए, जिनमें Padma Vibhushan, Padma Bhushan और Padma Shri शामिल हैं।",
    staticLink: "Padma Awards हर वर्ष Republic Day के अवसर पर घोषित होते हैं।",
    sourceLabel: "PIB: Padma Awards 2025 announced",
  },
  {
    id: "ca-mixed-1-q18",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "awards",
    difficulty: "medium",
    question: "Padma Awards 2026 में कुल कितने awards approved हुए?",
    options: ["128", "131", "139", "145"],
    answerIndex: 1,
    explanation: "Padma Awards 2026 में कुल 131 awards approved हुए।",
    staticLink: "Padma Vibhushan, Padma Bhushan और Padma Shri तीन प्रमुख श्रेणियाँ हैं।",
    sourceLabel: "PIB: Padma Awards 2026 announced",
  },
  {
    id: "ca-mixed-1-q19",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "schemes",
    difficulty: "easy",
    question: "One Nation One Subscription का Phase I किस तिथि से आरम्भ हुआ?",
    options: ["1 January 2025", "1 April 2025", "15 August 2025", "1 January 2026"],
    answerIndex: 0,
    explanation: "One Nation One Subscription का Phase I 1 January 2025 से आरम्भ हुआ।",
    staticLink: "ONOS का संबंध research journals और academic access से है।",
    sourceLabel: "PIB: One Nation One Subscription initiative",
  },
  {
    id: "ca-mixed-1-q20",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "schemes",
    difficulty: "medium",
    question: "ONOS Phase I में लगभग कितनी journals तक access देने की बात कही गई?",
    options: ["5,000 से अधिक", "10,000 से अधिक", "13,000 से अधिक", "25,000 से अधिक"],
    answerIndex: 2,
    explanation: "ONOS Phase I में 13,000 से अधिक journals तक access देने की बात कही गई।",
    staticLink: "Exam Link: ONOS = education + research ecosystem.",
    sourceLabel: "PIB: ONOS access to over 13,000 journals",
  },
  {
    id: "ca-mixed-1-q21",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "schemes",
    difficulty: "easy",
    question: "PM-Vidyalaxmi scheme मुख्य रूप से किससे जुड़ी है?",
    options: ["कृषि loan", "Higher education loan", "Housing subsidy", "Sports training"],
    answerIndex: 1,
    explanation:
      "PM-Vidyalaxmi scheme higher education के लिए collateral-free और guarantor-free education loans से जुड़ी है।",
    staticLink:
      "Education loan schemes में eligibility, guarantee और interest subvention जैसे points पूछे जा सकते हैं।",
    sourceLabel: "PIB: PM-Vidyalaxmi scheme",
  },
  {
    id: "ca-mixed-1-q22",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "schemes",
    difficulty: "medium",
    question:
      "PM-Vidyalaxmi में loan amounts up to ₹7.5 lakh पर Government of India कितनी credit guarantee देगी?",
    options: ["25%", "50%", "75%", "100%"],
    answerIndex: 2,
    explanation:
      "PM-Vidyalaxmi में ₹7.5 lakh तक के loan amounts पर Government of India 75% credit guarantee देगी।",
    staticLink: "Credit guarantee bank को loan coverage बढ़ाने में सहायता देती है।",
    sourceLabel: "PIB: PM-Vidyalaxmi credit guarantee",
  },
  {
    id: "ca-mixed-1-q23",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "schemes",
    difficulty: "medium",
    question:
      "Prime Minister’s Internship Scheme का लक्ष्य 5 वर्षों में top 500 companies में कितने युवाओं को internship अवसर देना है?",
    options: ["10 lakh", "25 lakh", "50 lakh", "1 crore"],
    answerIndex: 3,
    explanation:
      "PM Internship Scheme का लक्ष्य 5 वर्षों में top 500 companies में 1 crore youth को internship opportunities देना है।",
    staticLink: "PMIS employability और industry exposure से जुड़ी scheme है।",
    sourceLabel: "PIB: Prime Minister’s Internship Scheme",
  },
  {
    id: "ca-mixed-1-q24",
    examTags: ["ssc", "railway", "pet", "mixed"],
    topic: "polity",
    difficulty: "medium",
    question: "Unified Pension Scheme किस तिथि से operational हुई?",
    options: ["1 January 2025", "1 April 2025", "1 July 2025", "1 January 2026"],
    answerIndex: 1,
    explanation:
      "Unified Pension Scheme 1 April 2025 से operational हुई। यह NPS के अंतर्गत eligible Central Government employees के लिए option है।",
    staticLink: "NPS = National Pension System; UPS = Unified Pension Scheme.",
    sourceLabel: "PIB: Unified Pension Scheme came into effect from 1 April 2025",
  },
  {
    id: "ca-mixed-1-q25",
    examTags: ["ssc", "railway", "pet", "police", "mixed"],
    topic: "polity",
    difficulty: "medium",
    question: "Population Census 2027 की सामान्य reference date क्या होगी?",
    options: ["1 October 2026", "1 January 2027", "1 March 2027", "15 August 2027"],
    answerIndex: 2,
    explanation:
      "Population Census 2027 की सामान्य reference date 00:00 hours of 1 March 2027 होगी। कुछ snow-bound क्षेत्रों के लिए अलग reference date 1 October 2026 होगी।",
    staticLink: "Census 2027 दो phases में होगा और caste enumeration भी शामिल होगा।",
    sourceLabel: "PIB: Population Census 2027",
  },
];

export const currentAffairsPapers: CurrentAffairsPaper[] = [
  {
    id: MIXED_PAPER_ID,
    title: "Mixed Current Affairs Paper 1",
    exam: "mixed",
    durationMinutes: 15,
    questions: mixedPaperQuestions,
  },
];

/** @deprecated Use `currentAffairsPapers` — kept for existing imports */
export const CURRENT_AFFAIRS_PAPERS = currentAffairsPapers;

function filterExamToPaperExam(filter: CurrentAffairsExamFilter): CurrentAffairsPaper["exam"] | null {
  if (filter === "All") return null;
  return filter.toLowerCase() as CurrentAffairsPaper["exam"];
}

export function formatExamLabel(exam: CurrentAffairsPaper["exam"]): string {
  if (exam === "mixed") return "Mixed";
  return exam.toUpperCase();
}

export function formatTopicLabel(topic: CurrentAffairsQuestion["topic"]): string {
  return TOPIC_LABELS[topic];
}

export function getCurrentAffairsPaper(paperId: string): CurrentAffairsPaper | undefined {
  return currentAffairsPapers.find((p) => p.id === paperId);
}

export function getPaperTopics(paper: CurrentAffairsPaper): string[] {
  return [...new Set(paper.questions.map((q) => formatTopicLabel(q.topic)))];
}

export function filterPapersByExam(exam: CurrentAffairsExamFilter): CurrentAffairsPaper[] {
  const paperExam = filterExamToPaperExam(exam);
  if (!paperExam) return currentAffairsPapers;
  return currentAffairsPapers.filter((p) => p.exam === paperExam);
}

export function isPaperComplete(paper: CurrentAffairsPaper): boolean {
  return paper.questions.length >= CURRENT_AFFAIRS_TARGET_QUESTIONS;
}

export function getPaperAvailabilityLabel(paper: CurrentAffairsPaper): string {
  const count = paper.questions.length;
  return `${count} प्रश्न · ${paper.durationMinutes} मिनट`;
}
