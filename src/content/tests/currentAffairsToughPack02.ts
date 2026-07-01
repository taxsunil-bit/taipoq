export type ToughPack02Topic =
  | "budget"
  | "international"
  | "space"
  | "schemes"
  | "economy"
  | "polity"
  | "sports"
  | "science"
  | "appointments"
  | "environment";

export type ToughPack02Question = {
  id: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  answer: string;
  explanation: string;
  topic: ToughPack02Topic;
  difficulty: "tough";
};

export type CurrentAffairsToughPack02 = {
  paperId: string;
  title: string;
  titleHindi: string;
  subject: string;
  level: string;
  totalQuestions: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarks: number;
  createdBy: string;
  disclaimer: string;
  questions: ToughPack02Question[];
};

export const TOUGH_PACK_02_TOPIC_LABELS: Record<ToughPack02Topic, string> = {
  budget: "Budget",
  international: "International",
  space: "Space / ISRO",
  schemes: "Schemes",
  economy: "Economy",
  polity: "Polity",
  sports: "Sports",
  science: "Science",
  appointments: "Appointments",
  environment: "Environment",
};

const questions: ToughPack02Question[] = [
  {
    id: "ca-tough-2026-p02-q001",
    topic: "international",
    difficulty: "tough",
    question:
      "जनवरी 2025 में भारत ने किस देश की BRICS पूर्ण सदस्यता (full membership) का औपचारिक स्वागत किया?",
    options: ["थाईलैंड", "इंडोनेशिया", "वियतनाम", "मलेशिया"],
    answerIndex: 1,
    answer: "इंडोनेशिया",
    explanation:
      "2025 की शुरुआत में भारत ने इंडोनेशिया को BRICS का पूर्ण सदस्य मानकर स्वागत किया। BRICS विस्तार से जुड़े प्रश्नों में सदस्य बनाम partner country में अंतर पूछा जा सकता है।",
  },
  {
    id: "ca-tough-2026-p02-q002",
    topic: "international",
    difficulty: "tough",
    question: "BRICS Summit 2025 किस शहर में आयोजित हुआ?",
    options: ["नई दिल्ली", "जोहान्सबर्ग", "रियो डी जनेरो", "मास्को"],
    answerIndex: 2,
    answer: "रियो डी जनेरो",
    explanation:
      "BRICS Summit 2025 ब्राज़ील के रियो डी जनेरो में हुआ। Summit स्थान और host country याद रखना परीक्षा में उपयोगी है।",
  },
  {
    id: "ca-tough-2026-p02-q003",
    topic: "budget",
    difficulty: "tough",
    question: "Union Budget 2026-27 के आधिकारिक दस्तावेज़ किस portal पर उपलब्ध होते हैं?",
    options: ["rbi.org.in", "indiabudget.gov.in", "ssc.gov.in", "pib.gov.in"],
    answerIndex: 1,
    answer: "indiabudget.gov.in",
    explanation:
      "केंद्रीय बजट के सभी आधिकारिक दस्तावेज़ India Budget portal (indiabudget.gov.in) पर प्रकाशित होते हैं।",
  },
  {
    id: "ca-tough-2026-p02-q004",
    topic: "budget",
    difficulty: "tough",
    question:
      "Budget 2026-27 के ‘Budget at a Glance’ के अनुसार कुल व्यय (Total Expenditure) लगभग कितना है?",
    options: ["₹25.43 लाख करोड़", "₹53.47 लाख करोड़", "₹12.21 लाख करोड़", "₹5.34 लाख करोड़"],
    answerIndex: 1,
    answer: "₹53.47 लाख करोड़",
    explanation:
      "Budget at a Glance 2026-27 में कुल व्यय लगभग ₹53.47 लाख करोड़ दर्शाया गया है। बजट में BE/RE और लाख करोड़ रूपांतरण ध्यान से पढ़ें।",
  },
  {
    id: "ca-tough-2026-p02-q005",
    topic: "space",
    difficulty: "tough",
    question: "ISRO का SpaDeX (Space Docking Experiment) मिशन मुख्यतः किस तकनीक का परीक्षण करता है?",
    options: ["Mars landing", "In-space docking", "Solar sail propulsion", "Lunar soil sampling"],
    answerIndex: 1,
    answer: "In-space docking",
    explanation:
      "SpaDeX मिशन अंतरिक्ष में दो यानों के docking की तकनीक का परीक्षण करता है, जो भविष्य के complex space missions के लिए महत्वपूर्ण है।",
  },
  {
    id: "ca-tough-2026-p02-q006",
    topic: "space",
    difficulty: "tough",
    question: "भारत का पहला सौर अनुसंधान मिशन Aditya-L1 किस लग्रांज बिंदु (Lagrange point) पर स्थित है?",
    options: ["L1", "L2", "L3", "L5"],
    answerIndex: 0,
    answer: "L1",
    explanation:
      "Aditya-L1 सूर्य का निरंतर अवलोकन करने के लिए Sun-Earth L1 Lagrange point के पास स्थित है। L1 पर गुरुत्वाकर्षण संतुलन से स्थिर अवलोकन संभव होता है।",
  },
  {
    id: "ca-tough-2026-p02-q007",
    topic: "space",
    difficulty: "tough",
    question: "Chandrayaan-3 मिशन का Vikram lander चंद्रमा के किस क्षेत्र में उतरा था?",
    options: ["दक्षिण ध्रुवीय क्षेत्र", "मारे इम्ब्रियम", "ओशनस प्रोसेलारम", "उत्तरी ध्रुव"],
    answerIndex: 0,
    answer: "दक्षिण ध्रुवीय क्षेत्र",
    explanation:
      "Chandrayaan-3 का Vikram lander चंद्रमा के दक्षिण ध्रुव के निकट उतरा, जिससे भारत चंद्र दक्षिण ध्रुव पर soft landing करने वाला पहला देश बना।",
  },
  {
    id: "ca-tough-2026-p02-q008",
    topic: "schemes",
    difficulty: "tough",
    question: "PM-KISAN योजना के तहत पात्र किसान परिवारों को प्रति वर्ष कितनी सहायता दी जाती है?",
    options: ["₹2,000", "₹4,000", "₹6,000", "₹8,000"],
    answerIndex: 2,
    answer: "₹6,000",
    explanation:
      "PM-KISAN के अंतर्गत ₹6,000 प्रति वर्ष तीन किस्तों में (₹2,000 × 3) सीधे लाभ हस्तांतरण (DBT) के माध्यम से दिया जाता है।",
  },
  {
    id: "ca-tough-2026-p02-q009",
    topic: "schemes",
    difficulty: "tough",
    question: "PM Garib Kalyan Anna Yojana (PM-GKAY) मुख्यतः किस वस्तु का मुफ्त वितरण सुनिश्चित करती है?",
    options: ["LPG cylinder", "खाद्यान्न (अनाज)", "कपड़ा किट", "बिजली सब्सिडी"],
    answerIndex: 1,
    answer: "खाद्यान्न (अनाज)",
    explanation:
      "PM-GKAY NFSA लाभार्थियों को अतिरिक्त खाद्यान्न उपलब्ध कराने वाली योजना है। COVID और उसके बाद की अवधि में कई चरणों में बढ़ाई गई।",
  },
  {
    id: "ca-tough-2026-p02-q010",
    topic: "economy",
    difficulty: "tough",
    question: "भारत में UPI लेनदेन का नियामन और प्रचालन मुख्यतः किस संस्था के माध्यम से होता है?",
    options: ["SEBI", "RBI / NPCI", "IRDAI", "NITI Aayog"],
    answerIndex: 1,
    answer: "RBI / NPCI",
    explanation:
      "UPI का operational backbone NPCI है, जबकि भुगतान प्रणाली का समग्र नियामकीय ढांचा RBI के अंतर्गत आता है।",
  },
  {
    id: "ca-tough-2026-p02-q011",
    topic: "economy",
    difficulty: "tough",
    question: "भारत की मुद्रा ‘रुपया’ का प्रबंधन और मौद्रिक नीति का निर्धारण किसके द्वारा किया जाता है?",
    options: ["वित्त मंत्रालय", "भारतीय रिज़र्व बैंक (RBI)", "SEBI", "वाणिज्य मंत्रालय"],
    answerIndex: 1,
    answer: "भारतीय रिज़र्व बैंक (RBI)",
    explanation:
      "RBI भारत का केंद्रीय बैंक है और repo rate, CRR, SLR जैसे मौद्रिक उपकरणों के माध्यम से मुद्रास्फीति व विकास को संतुलित करता है।",
  },
  {
    id: "ca-tough-2026-p02-q012",
    topic: "polity",
    difficulty: "tough",
    question: "भारत के Chief Justice of India (CJI) की नियुक्ति कौन करता है?",
    options: ["राष्ट्रपति", "प्रधानमंत्री", "संसद", "राज्यपाल"],
    answerIndex: 0,
    answer: "राष्ट्रपति",
    explanation:
      "CJI और अन्य Supreme Court न्यायाधीशों की नियुक्ति राष्ट्रपति द्वारा की जाती है। Collegium सिफारिश प्रक्रिया में महत्वपूर्ण भूमिका निभाता है।",
  },
  {
    id: "ca-tough-2026-p02-q013",
    topic: "polity",
    difficulty: "tough",
    question: "भारत में लोकसभा और विधानसभा चुनावों का संचालन किस संवैधानिक निकाय के अधीन होता है?",
    options: ["UPSC", "Election Commission of India", "Finance Commission", "NITI Aayog"],
    answerIndex: 1,
    answer: "Election Commission of India",
    explanation:
      "भारत निर्वाचन आयोग (ECI) संविधान के अनुच्छेद 324 के तहत चुनावी प्रक्रिया का संचालन करता है।",
  },
  {
    id: "ca-tough-2026-p02-q014",
    topic: "polity",
    difficulty: "tough",
    question: "भारतीय संविधान में मौलिक कर्तव्य (Fundamental Duties) किस संशोधन से जोड़े गए थे?",
    options: ["42वें संशोधन", "44वें संशोधन", "73वें संशोधन", "86वें संशोधन"],
    answerIndex: 0,
    answer: "42वें संशोधन",
    explanation:
      "42वें संविधान संशोधन (1976) में भाग IV-A के रूप में मौलिक कर्तव्य जोड़े गए, जो मूल रूप से स्वर्णकाक्षर समिति की सिफारिश पर आधारित थे।",
  },
  {
    id: "ca-tough-2026-p02-q015",
    topic: "sports",
    difficulty: "tough",
    question: "Paris Olympics 2024 में भारत ने कुल कितने पदक (Gold + Silver + Bronze) जीते?",
    options: ["4", "6", "7", "9"],
    answerIndex: 1,
    answer: "6",
    explanation:
      "Paris 2024 में भारत ने 1 स्वर्ण, 1 रजत और 4 कांस्य — कुल 6 पदक जीते। Shooting, wrestling और hockey में प्रमुख सफलता मिली।",
  },
  {
    id: "ca-tough-2026-p02-q016",
    topic: "sports",
    difficulty: "tough",
    question: "ICC Men’s Cricket World Cup 2023 का विजेता कौन-सा देश था?",
    options: ["भारत", "ऑस्ट्रेलिया", "इंग्लैंड", "दक्षिण अफ्रीका"],
    answerIndex: 1,
    answer: "ऑस्ट्रेलिया",
    explanation:
      "2023 Cricket World Cup का फाइनल अहमदाबाद में हुआ और ऑस्ट्रेलिया ने भारत को हराकर खिताब जीता।",
  },
  {
    id: "ca-tough-2026-p02-q017",
    topic: "international",
    difficulty: "tough",
    question: "G20 Summit 2023 की मेज़बानी किस देश ने की थी?",
    options: ["ब्राज़ील", "भारत", "इंडोनेशिया", "जापान"],
    answerIndex: 1,
    answer: "भारत",
    explanation:
      "भारत ने 2023 में G20 Presidency की और नई दिल्ली में Leaders’ Summit आयोजित किया, जिसमें African Union को स्थायी सदस्यता मिली।",
  },
  {
    id: "ca-tough-2026-p02-q018",
    topic: "international",
    difficulty: "tough",
    question: "2024 में Nobel Peace Prize किस व्यक्ति/संस्था को प्रदान किया गया?",
    options: ["UNHCR", "Nihon Hidankyo", "WHO", "Greta Thunberg"],
    answerIndex: 1,
    answer: "Nihon Hidankyo",
    explanation:
      "2024 Nobel Peace Prize जापानी Hibakusha संगठन Nihon Hidankyo को परमाणु हथियारों के खात्मे के संघर्ष के लिए दिया गया।",
  },
  {
    id: "ca-tough-2026-p02-q019",
    topic: "environment",
    difficulty: "tough",
    question: "Paris Agreement का मुख्य लक्ष्य वैश्विक तापमान वृद्धि को किस सीमा के भीतर रखना है?",
    options: ["1°C से नीचे", "1.5°C–2°C के आसपास", "3°C–4°C", "5°C तक"],
    answerIndex: 1,
    answer: "1.5°C–2°C के आसपास",
    explanation:
      "Paris Agreement का उद्देश्य औद्योगिक क्रांति पूर्व स्तर की तुलना में वृद्धि को 2°C से नीचे रखना और 1.5°C तक प्रयास करना है।",
  },
  {
    id: "ca-tough-2026-p02-q020",
    topic: "environment",
    difficulty: "tough",
    question: "COP (Conference of Parties) किस अंतर्राष्ट्रीय समझौते से जुड़ा वार्षिक सम्मेलन है?",
    options: ["Kyoto Protocol only", "UNFCCC", "Montreal Protocol", "Basel Convention"],
    answerIndex: 1,
    answer: "UNFCCC",
    explanation:
      "COP UN Framework Convention on Climate Change (UNFCCC) का सर्वोच्च निर्णय लेने वाला निकाय है। हाल के COP में climate finance पर चर्चा प्रमुख रही।",
  },
  {
    id: "ca-tough-2026-p02-q021",
    topic: "science",
    difficulty: "tough",
    question: "COVID-19 के लिए भारत में पहली स्वदेशी टीका Covaxin किस संस्था ने विकसित की?",
    options: ["Serum Institute", "Bharat Biotech", "Zydus Cadila", "Biological E"],
    answerIndex: 1,
    answer: "Bharat Biotech",
    explanation:
      "Covaxin Bharat Biotech और ICMR के सहयोग से विकसित inactivated virus vaccine है। Serum Institute ने Covishield (AstraZeneca) का उत्पादन किया।",
  },
  {
    id: "ca-tough-2026-p02-q022",
    topic: "science",
    difficulty: "tough",
    question: "India’s first dedicated solar mission Aditya-L1 किस संगठन द्वारा लॉन्च किया गया?",
    options: ["DRDO", "ISRO", "BARC", "CSIR"],
    answerIndex: 1,
    answer: "ISRO",
    explanation:
      "Aditya-L1 ISRO का सौर मिशन है, जो PSLV रॉकेट से लॉन्च हुआ और सूर्य के कोरोना व सौर हवाओं का अध्ययन करता है।",
  },
  {
    id: "ca-tough-2026-p02-q023",
    topic: "appointments",
    difficulty: "tough",
    question: "भारत के पहले Chief of Defence Staff (CDS) के रूप में किसे नियुक्त किया गया था?",
    options: ["Bipin Rawat", "Manoj Pande", "Karambir Singh", "Anil Chauhan"],
    answerIndex: 0,
    answer: "Bipin Rawat",
    explanation:
      "जनरल Bipin Rawat 2020 में भारत के पहले CDS बने। CDS तीनों सशस्त्र सेवाओं के बीच समन्वय और सैन्य सुधारों के लिए जिम्मेदार होते हैं।",
  },
  {
    id: "ca-tough-2026-p02-q024",
    topic: "appointments",
    difficulty: "tough",
    question: "NITI Aayog के वर्तमान अध्यक्ष (Chairperson) के रूप में कौन कार्यरत हैं?",
    options: ["वित्त मंत्री", "प्रधानमंत्री", "गृह मंत्री", "RBI Governor"],
    answerIndex: 1,
    answer: "प्रधानमंत्री",
    explanation:
      "NITI Aayog के Chairperson पद पर प्रधानमंत्री होते हैं। योजना आयोग के स्थान पर 2015 में NITI Aayog की स्थापना हुई।",
  },
  {
    id: "ca-tough-2026-p02-q025",
    topic: "schemes",
    difficulty: "tough",
    question: "Ayushman Bharat योजना के अंतर्गत PM-JAY मुख्यतः किस सुविधा पर केंद्रित है?",
    options: ["कृषि ऋण माफी", "मुफ्त स्वास्थ्य बीमा कवर", "मकान सब्सिडी", "छात्रवृत्ति"],
    answerIndex: 1,
    answer: "मुफ्त स्वास्थ्य बीमा कवर",
    explanation:
      "PM-JAY पात्र परिवारों को अस्पताल में इलाज के लिए वित्तीय सुरक्षा (cashless cover) प्रदान करता है। यह Ayushman Bharat की प्रमुख धारा है।",
  },
  {
    id: "ca-tough-2026-p02-q026",
    topic: "economy",
    difficulty: "tough",
    question: "GST Council की बैठकों की अध्यक्षता कौन करता है?",
    options: ["प्रधानमंत्री", "वित्त मंत्री", "RBI Governor", "NITI Aayog CEO"],
    answerIndex: 1,
    answer: "वित्त मंत्री",
    explanation:
      "GST Council में केंद्रीय वित्त मंत्री अध्यक्ष होते हैं और राज्य वित्त मंत्री सदस्य होते हैं। दरें और नियम सामूहिक निर्णय से तय होते हैं।",
  },
  {
    id: "ca-tough-2026-p02-q027",
    topic: "international",
    difficulty: "tough",
    question: "India-Middle East-Europe Economic Corridor (IMEC) की घोषणा किस शिखर सम्मेलन में हुई?",
    options: ["G7 Hiroshima", "G20 New Delhi", "BRICS Johannesburg", "ASEAN Jakarta"],
    answerIndex: 1,
    answer: "G20 New Delhi",
    explanation:
      "IMEC की अवधारणा G20 New Delhi Summit 2023 के दौरान प्रस्तुत की गई, जो भारत से मध्य पूर्व और यूरोप तक connectivity बढ़ाने का प्रस्ताव है।",
  },
  {
    id: "ca-tough-2026-p02-q028",
    topic: "polity",
    difficulty: "tough",
    question: "National Education Policy (NEP) 2020 किस मंत्रालय द्वारा लागू की गई नीति है?",
    options: ["विज्ञान मंत्रालय", "शिक्षा मंत्रालय", "युवा मामले मंत्रालय", "सूचना प्रौद्योगिकी मंत्रालय"],
    answerIndex: 1,
    answer: "शिक्षा मंत्रालय",
    explanation:
      "NEP 2020 शिक्षा मंत्रालय की नीति है, जो 5+3+3+4 संरचना, बहुभाषी शिक्षा और skill integration पर जोर देती है।",
  },
  {
    id: "ca-tough-2026-p02-q029",
    topic: "budget",
    difficulty: "tough",
    question: "Union Budget संसद में कौन-से दो Houses में पेश किया जाता है?",
    options: ["केवल लोकसभा", "लोकसभा और राज्यसभा दोनों", "केवल राज्यसभा", "केवल राज्य विधानसभाएँ"],
    answerIndex: 1,
    answer: "लोकसभा और राज्यसभा दोनों",
    explanation:
      "वित्त मंत्री बजट लोकसभा में पेश करते हैं; राज्यसभा में भी चर्चा होती है। Money Bill से संबंधित प्रावधान लोकसभा को प्रधानता देते हैं।",
  },
  {
    id: "ca-tough-2026-p02-q030",
    topic: "space",
    difficulty: "tough",
    question: "Gaganyaan मिशन का उद्देश्य क्या है?",
    options: [
      "चंद्रमा पर मानव अभियान",
      "भारतीय अंतरिक्ष यात्रियों को कक्षा में ले जाना",
      "मंगल पर रोबोटिक lander",
      "सूर्य के निकट probe भेजना",
    ],
    answerIndex: 1,
    answer: "भारतीय अंतरिक्ष यात्रियों को कक्षा में ले जाना",
    explanation:
      "Gaganyaan भारत का मानव अंतरिक्ष कार्यक्रम है, जिसका लक्ष्य भारतीय astronauts (Gagannauts) को Low Earth Orbit तक ले जाना है।",
  },
];

export const CURRENT_AFFAIRS_TOUGH_PACK_02: CurrentAffairsToughPack02 = {
  paperId: "current-affairs-tough-pack-02",
  title: "Current Affairs Tough Practice Pack 02",
  titleHindi: "समसामयिक कठिन अभ्यास-पत्र Pack 02",
  subject: "Current Affairs",
  level: "Tough",
  totalQuestions: 30,
  durationMinutes: 30,
  marksPerQuestion: 1,
  negativeMarks: 0,
  createdBy: "TAIPOQ",
  disclaimer:
    "यह अभ्यास-पत्र TAIPOQ द्वारा परीक्षा-पद्धति के अध्ययन और सार्वजनिक रूप से उपलब्ध समसामयिक जानकारी के आधार पर तैयार किया गया मौलिक अभ्यास-संग्रह है।",
  questions,
};
