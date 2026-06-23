export type StudySection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  subsections?: { subtitle: string; paragraphs: string[] }[];
};

export type StudyQuestion = {
  question: string;
  answer: string;
};

export type StudyChapterHref =
  | "/study-corner"
  | "/study-corner/general-awareness"
  | "/study-corner/general-awareness/chapter-1"
  | "/study-corner/general-awareness/chapter-2"
  | "/study-corner/general-awareness/chapter-3"
  | "/study-corner/general-awareness/chapter-4"
  | "/study-corner/general-awareness/chapter-5"
  | "/study-corner/general-awareness/chapter-6"
  | "/study-corner/computer-basics"
  | "/study-corner/computer-basics/chapter-1"
  | "/study-corner/computer-basics/chapter-2"
  | "/study-corner/computer-basics/chapter-3"
  | "/study-corner/computer-basics/chapter-4"
  | "/study-corner/computer-basics/chapter-5";

export type StudyChapter = {
  id: string;
  courseTitle: string;
  title: string;
  chapterLabel: string;
  intro: string;
  sections: StudySection[];
  readingPlan?: { day: string; topic: string }[];
  motivationalNote?: string;
  questions: StudyQuestion[];
  chapterNav?: {
    prev?: { label: string; href: StudyChapterHref };
    next?: { label: string; href: StudyChapterHref };
  };
  nextStep?: {
    title: string;
    text: string;
    buttonLabel: string;
    href: StudyChapterHref;
  };
  backTo: "/study-corner" | "/study-corner/general-awareness" | "/study-corner/computer-basics";
  backLabel: string;
};

export const STUDY_CORNER_LANDING = {
  title: "पुस्तकालय / Library",
  subtitle:
    "यहाँ टाइपिंग के साथ सामान्य जागरूकता / General Awareness, कम्प्यूटर ज्ञान और नौकरी परीक्षा से जुड़ी मूलभूत तैयारी मिलेगी।",
  heroText:
    "TAIPOQ में अब केवल typing practice ही नहीं, बल्कि परीक्षा की तैयारी के छोटे-छोटे अध्याय भी मिलेंगे। यह section उन छात्रों के लिए है जो सरल भाषा में पढ़ना चाहते हैं और धीरे-धीरे अपनी तैयारी मजबूत करना चाहते हैं।",
  howToRead: {
    title: "कैसे पढ़ें?",
    text: "प्रतिदिन 20 से 30 मिनट पढ़ें। पहले छोटा अध्याय पढ़ें, फिर 5 प्रश्न हल करें, फिर अगले दिन दोबारा revision करें। लगातार पढ़ाई ही परीक्षा में मदद करती है।",
  },
  homeCard: {
    title: "पुस्तकालय / Library",
    subtitle: "टाइपिंग के साथ परीक्षा की तैयारी भी करें।",
    helper: "सामान्य जागरूकता / General Awareness और कम्प्यूटर ज्ञान की आसान आरम्भिक सामग्री।",
    button: "अभी पढ़ना आरम्भ करें",
  },
} as const;

export const STUDY_COURSES = [
  {
    id: "general-awareness",
    title: "सामान्य जागरूकता / General Awareness",
    description:
      "देश, समाज, संविधान, इतिहास, भूगोल, विज्ञान, खेल और Current Affairs की मूलभूत तैयारी।",
    href: "/study-corner/general-awareness" as const,
    available: true,
    startLabel: "आरम्भ करें",
  },
  {
    id: "computer-basics",
    title: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
    description:
      "कम्प्यूटर, Hardware, Software, Input-Output और परीक्षा में पूछे जाने वाले सामान्य प्रश्न।",
    href: "/study-corner/computer-basics" as const,
    available: true,
    startLabel: "आरम्भ करें",
  },
  {
    id: "coming-soon",
    title: "आने वाले अध्याय",
    description:
      "संविधान, इतिहास, भूगोल, विज्ञान और Current Affairs के नए अध्याय धीरे-धीरे जोड़े जाएंगे।",
    href: null,
    available: false,
    startLabel: "जल्द आ रहा है",
  },
] as const;

export const GA_COURSE = {
  title: "सामान्य जागरूकता / General Awareness",
  subtitle:
    "नौकरी परीक्षाओं के लिए आवश्यक सामान्य ज्ञान और Current Affairs की आसान तैयारी।",
  intro:
    "सामान्य जागरूकता का अर्थ है देश, समाज, सरकार, इतिहास, भूगोल, विज्ञान, खेल और समसामयिक घटनाओं की आवश्यक जानकारी रखना। नौकरी परीक्षाओं में इससे अनेक प्रश्न पूछे जाते हैं। इसलिए इसका नियमित अभ्यास अत्यधिक आवश्यक है।",
  chapters: [
    {
      id: "chapter-1",
      title: "सामान्य जागरूकता क्या है? / What is General Awareness?",
      description:
        "इस अध्याय में आप समझेंगे कि सामान्य जागरूकता क्या होती है, नौकरी परीक्षाओं में इसका महत्व क्या है और इसे प्रतिदिन कैसे पढ़ना चाहिए।",
      href: "/study-corner/general-awareness/chapter-1" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-2",
      title: "भारत का संविधान - मूलभूत सिद्धांत",
      description:
        "संविधान क्या है, कब लागू हुआ, संविधान सभा, मौलिक अधिकार और मौलिक कर्तव्य की सरल जानकारी।",
      href: "/study-corner/general-awareness/chapter-2" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-3",
      title: "भारत का इतिहास - मूलभूत विचार",
      description:
        "प्राचीन, मध्यकालीन और आधुनिक भारत की प्रमुख घटनाएँ और परीक्षा में इतिहास पढ़ने का तरीका।",
      href: "/study-corner/general-awareness/chapter-3" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-4",
      title: "भारत का भूगोल - मूलभूत विषय",
      description:
        "भारत की स्थिति, प्रमुख नदियाँ, पर्वत, मैदान और परीक्षा में भूगोल पढ़ने की विधि।",
      href: "/study-corner/general-awareness/chapter-4" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-5",
      title: "समसामयिक घटनाएँ / Current Affairs",
      description:
        "समसामयिक घटनाओं का अर्थ, परीक्षा में महत्व, क्या पढ़ें और नियमित अध्ययन की सरल विधि।",
      href: "/study-corner/general-awareness/chapter-5" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-6",
      title: "सामान्य विज्ञान - मूलभूत ज्ञान",
      description:
        "Physics, Chemistry, Biology का मूलभूत ज्ञान और परीक्षा में विज्ञान पढ़ने का तरीका।",
      href: "/study-corner/general-awareness/chapter-6" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
  ],
} as const;

export const CB_COURSE = {
  title: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
  subtitle: "नौकरी परीक्षाओं और दैनिक कार्यों के लिए कम्प्यूटर ज्ञान की आसान तैयारी।",
  intro:
    "कम्प्यूटर का मूलभूत ज्ञान नौकरी परीक्षाओं और दैनिक कार्यों के लिए अत्यधिक उपयोगी है। इस पाठ्यक्रम में कम्प्यूटर, Hardware, Software, Input, Output, Memory, Storage, Internet और Email की जानकारी सरल रूप में मिलेगी।",
  firstChapterHref: "/study-corner/computer-basics/chapter-1" as const,
  firstChapterButtonLabel: "पहला अध्याय पढ़ें",
  chapters: [
    {
      id: "chapter-1",
      title: "कम्प्यूटर क्या है? / What is a Computer?",
      href: "/study-corner/computer-basics/chapter-1" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-2",
      title: "Hardware",
      href: "/study-corner/computer-basics/chapter-2" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-3",
      title: "Software",
      href: "/study-corner/computer-basics/chapter-3" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-4",
      title: "Memory और Storage",
      href: "/study-corner/computer-basics/chapter-4" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-5",
      title: "Internet और Email",
      href: "/study-corner/computer-basics/chapter-5" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
  ],
} as const;

export const GA_CHAPTER_1: StudyChapter = {
  id: "ga-chapter-1",
  courseTitle: "सामान्य जागरूकता / General Awareness",
  title: "सामान्य जागरूकता क्या है? / What is General Awareness?",
  chapterLabel: "अध्याय 1",
  intro:
    "सामान्य जागरूकता / General Awareness नौकरी परीक्षाओं का एक मुख्य भाग है। इसमें ऐसे प्रश्न पूछे जाते हैं जो हमारे देश, समाज, सरकार चलाने का तरीका, इतिहास, भूगोल, विज्ञान, खेल और हाल की घटनाओं से जुड़े होते हैं। इस विषय का उद्देश्य यह देखना होता है कि छात्र अपने आसपास की दुनिया को कितना समझता है।",
  sections: [
    {
      title: "सामान्य जागरूकता का अर्थ",
      paragraphs: [
        "सामान्य जागरूकता / General Awareness का अर्थ है देश, समाज और हाल की घटनाओं की आवश्यक जानकारी रखना। इसमें भारत की राजधानी, राज्य, संविधान, आजादी का आंदोलन, मुख्य नदियाँ, पर्वत, वैज्ञानिक खोज, खेल, पुरस्कार / Awards और हाल की घटनाएँ शामिल हो सकती हैं।",
        "यह विषय केवल किताबों से याद करने का विषय नहीं है। इसका प्रतिदिन थोड़ा अभ्यास, समाचारों पर ध्यान और पुराने प्रश्नों का अभ्यास अत्यधिक आवश्यक है।",
      ],
    },
    {
      title: "नौकरी परीक्षाओं में इसकी उपयोगिता",
      paragraphs: [
        "रेलवे, पुलिस, एसएससी, बैंक, लेखपाल, क्लर्क, ग्राम पंचायत, न्यायालय और अन्य सरकारी नौकरियों की परीक्षाओं में सामान्य जागरूकता से प्रश्न पूछे जाते हैं। कई बार यह भाग कम समय में अच्छे अंक दिला सकता है, क्योंकि इसमें लंबी गणना नहीं करनी पड़ती।",
        "अगर छात्र प्रतिदिन सामान्य जागरूकता पढ़ता है, तो उसका आत्मविश्वास बढ़ता है और परीक्षा में समय भी बचता है।",
      ],
    },
    {
      title: "इसमें कौन-कौन से विषय आते हैं?",
      paragraphs: [],
      list: [
        "भारत का संविधान",
        "भारत का इतिहास",
        "भारत का भूगोल",
        "सामान्य विज्ञान",
        "कम्प्यूटर की जानकारी",
        "खेलकूद",
        "पुरस्कार और सम्मान",
        "प्रमुख दिवस",
        "सरकारी योजनाएँ",
        "समसामयिक घटनाएँ / Current Affairs",
      ],
    },
    {
      title: "इसे कैसे पढ़ें?",
      paragraphs: [
        "सामान्य जागरूकता को एक ही दिन में पूरा नहीं किया जा सकता। इसे प्रतिदिन थोड़ा-थोड़ा पढ़ना चाहिए। पहले आसान अध्याय पढ़ें, फिर छोटे नोट बनाएं, फिर प्रश्नों का अभ्यास करें।",
      ],
    },
    {
      title: "प्रतिदिन पढ़ाई की छोटी योजना",
      paragraphs: [
        "प्रतिदिन 20 से 30 मिनट सामान्य जागरूकता को दें। एक छोटा विषय चुनें। उसे ध्यान से पढ़ें। फिर 5 प्रश्न हल करें। सप्ताह के अंत में पूरे सप्ताह का revision करें।",
      ],
    },
  ],
  readingPlan: [
    { day: "Day 1", topic: "संविधान के मूलभूत सिद्धांत" },
    { day: "Day 2", topic: "इतिहास की छोटी जानकारी" },
    { day: "Day 3", topic: "भूगोल के मूलभूत विषय" },
    { day: "Day 4", topic: "विज्ञान और कम्प्यूटर" },
    { day: "Day 5", topic: "Current Affairs और revision" },
  ],
  motivationalNote:
    "याद रखिए, सामान्य जागरूकता में सफलता लगातार पढ़ाई से मिलती है। प्रतिदिन थोड़ा पढ़ना, कभी-कभी अत्यधिक पढ़ने से बेहतर है।",
  questions: [
    { question: "भारत की राजधानी क्या है?", answer: "नई दिल्ली।" },
    { question: "भारत का संविधान कब लागू हुआ?", answer: "26/01/1950।" },
    { question: "लोकसभा के सदस्यों का चुनाव कौन करता है?", answer: "जनता।" },
    { question: "भारत का राष्ट्रीय पशु कौन सा है?", answer: "बाघ।" },
    {
      question: "सामान्य जागरूकता क्यों आवश्यक है?",
      answer:
        "क्योंकि नौकरी परीक्षाओं में इससे कई प्रश्न पूछे जाते हैं और यह अच्छे अंक दिलाने में मदद कर सकता है।",
    },
  ],
  chapterNav: {
    next: {
      label: "अध्याय 2 - भारत का संविधान - मूलभूत सिद्धांत",
      href: "/study-corner/general-awareness/chapter-2",
    },
  },
  backTo: "/study-corner/general-awareness",
  backLabel: "← सामान्य जागरूकता course पर वापस जाएँ",
};

export const GA_CHAPTER_2: StudyChapter = {
  id: "ga-chapter-2",
  courseTitle: "सामान्य जागरूकता / General Awareness",
  title: "भारत का संविधान - मूलभूत सिद्धांत",
  chapterLabel: "सामान्य जागरूकता - अध्याय 2",
  intro:
    "संविधान देश चलाने के नियमों की सर्वोच्च पुस्तक है। इसमें सरकार कैसे चलेगी, नागरिकों को कौन से अधिकार मिलेंगे और देश के प्रति हमारी क्या जिम्मेदारी होगी, यह लिखा होता है।",
  sections: [
    {
      title: "संविधान क्या है?",
      paragraphs: [
        "संविधान किसी देश के लिए सर्वोच्च नियम-पुस्तक होता है। भारत में सरकार, न्यायालय, संसद, राज्य, चुनाव और नागरिकों के अधिकार संविधान के आधार पर चलते हैं।",
      ],
    },
    {
      title: "संविधान कब लागू हुआ?",
      paragraphs: [
        "भारत का संविधान 26/01/1950 को लागू हुआ। इसलिए 26 जनवरी को गणतंत्र दिवस मनाया जाता है।",
      ],
    },
    {
      title: "संविधान सभा",
      paragraphs: [
        "भारत का संविधान संविधान सभा ने बनाया। डॉ. भीमराव अम्बेडकर की संविधान निर्माण में प्रमुख भूमिका थी। इसलिए उन्हें संविधान निर्माता कहा जाता है।",
      ],
    },
    {
      title: "मौलिक अधिकार",
      paragraphs: [
        "मौलिक अधिकार वे अधिकार हैं जो संविधान नागरिकों को देता है। समानता का अधिकार, स्वतंत्रता का अधिकार, शोषण के विरुद्ध अधिकार और धार्मिक स्वतंत्रता का अधिकार इसके प्रमुख उदाहरण हैं।",
      ],
    },
    {
      title: "मौलिक कर्तव्य",
      paragraphs: [
        "मौलिक कर्तव्य हमें बताते हैं कि संविधान, राष्ट्रीय ध्वज, राष्ट्रीय एकता, सार्वजनिक संपत्ति और देश का सम्मान करना हमारी जिम्मेदारी है।",
      ],
    },
  ],
  questions: [
    { question: "भारत का संविधान कब लागू हुआ?", answer: "26/01/1950।" },
    { question: "26 जनवरी को कौन सा दिवस मनाया जाता है?", answer: "गणतंत्र दिवस।" },
    {
      question: "डॉ. भीमराव अम्बेडकर को किस रूप में जाना जाता है?",
      answer: "संविधान निर्माता के रूप में।",
    },
    {
      question: "संविधान में नागरिकों को मिले अधिकार क्या कहलाते हैं?",
      answer: "मौलिक अधिकार।",
    },
    {
      question: "संविधान देश के लिए क्यों आवश्यक है?",
      answer: "संविधान देश चलाने के नियम और नागरिकों के अधिकार निर्धारित करता है।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 1 - सामान्य जागरूकता क्या है?",
      href: "/study-corner/general-awareness/chapter-1",
    },
    next: {
      label: "अध्याय 3 - भारत का इतिहास - मूलभूत विचार",
      href: "/study-corner/general-awareness/chapter-3",
    },
  },
  backTo: "/study-corner/general-awareness",
  backLabel: "← सामान्य जागरूकता course पर वापस जाएँ",
};

export const GA_CHAPTER_3: StudyChapter = {
  id: "ga-chapter-3",
  courseTitle: "सामान्य जागरूकता / General Awareness",
  title: "भारत का इतिहास - मूलभूत विचार",
  chapterLabel: "सामान्य जागरूकता - अध्याय 3",
  intro:
    "इतिहास हमें पुराने समय की घटनाओं, राजाओं, समाज, स्वतंत्रता आंदोलन और भारत के विकास की जानकारी देता है।",
  sections: [
    {
      title: "इतिहास क्या है?",
      paragraphs: [
        "इतिहास में पुराने समय की घटनाओं को क्रम से पढ़ा जाता है। इससे हमें पता चलता है कि समाज, शासन, संस्कृति और देश का विकास कैसे हुआ।",
      ],
    },
    {
      title: "प्राचीन भारत",
      paragraphs: [
        "सिंधु घाटी सभ्यता, वैदिक काल, मौर्य साम्राज्य और गुप्त काल प्राचीन भारत के प्रमुख विषय हैं।",
      ],
    },
    {
      title: "मध्यकालीन भारत",
      paragraphs: [
        "दिल्ली सल्तनत, मुगल काल, क्षेत्रीय राज्य और उस समय की कला तथा संस्कृति मध्यकालीन भारत के प्रमुख विषय हैं।",
      ],
    },
    {
      title: "आधुनिक भारत",
      paragraphs: [
        "ब्रिटिश शासन, 1857 का विद्रोह, भारतीय राष्ट्रीय कांग्रेस, गांधी जी के आंदोलन और 15/08/1947 को मिली स्वतंत्रता आधुनिक भारत के प्रमुख विषय हैं।",
      ],
    },
    {
      title: "इतिहास कैसे पढ़ें?",
      paragraphs: [
        "पहले समय-क्रम समझें। फिर घटना, वर्ष, व्यक्ति और स्थान याद करें। पुराने परीक्षा-पत्रों से अभ्यास करें।",
      ],
    },
  ],
  questions: [
    {
      question: "1857 का विद्रोह इतिहास के किस भाग से जुड़ा है?",
      answer: "आधुनिक भारत से।",
    },
    {
      question: "महात्मा गांधी किस आंदोलन से जुड़े थे?",
      answer: "भारत के स्वतंत्रता आंदोलन से।",
    },
    {
      question: "सिंधु घाटी सभ्यता इतिहास के किस भाग में आती है?",
      answer: "प्राचीन भारत में।",
    },
    { question: "भारत को स्वतंत्रता कब मिली?", answer: "15/08/1947।" },
    {
      question: "इतिहास पढ़ते समय क्या ध्यान रखना चाहिए?",
      answer: "घटना, वर्ष, प्रमुख व्यक्ति, स्थान और समय-क्रम।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 2 - भारत का संविधान - मूलभूत सिद्धांत",
      href: "/study-corner/general-awareness/chapter-2",
    },
    next: {
      label: "अध्याय 4 - भारत का भूगोल - मूलभूत विषय",
      href: "/study-corner/general-awareness/chapter-4",
    },
  },
  backTo: "/study-corner/general-awareness",
  backLabel: "← सामान्य जागरूकता course पर वापस जाएँ",
};

export const GA_CHAPTER_4: StudyChapter = {
  id: "ga-chapter-4",
  courseTitle: "सामान्य जागरूकता / General Awareness",
  title: "भारत का भूगोल - मूलभूत विषय",
  chapterLabel: "सामान्य जागरूकता - अध्याय 4",
  intro:
    "भूगोल में पृथ्वी, भूमि, जल, पर्वत, नदियाँ, मौसम, राज्य, राजधानी और प्राकृतिक संसाधनों की जानकारी पढ़ी जाती है।",
  sections: [
    {
      title: "भूगोल क्या है?",
      paragraphs: [
        "भूगोल पृथ्वी और उस पर स्थित प्राकृतिक तथा मानवीय वस्तुओं का अध्ययन है। इसमें भूमि, जल, पर्वत, नदी, मौसम, जनसंख्या और संसाधन पढ़े जाते हैं।",
      ],
    },
    {
      title: "भारत की स्थिति",
      paragraphs: [
        "भारत एशिया महाद्वीप में स्थित है। भारत के उत्तर में हिमालय और दक्षिण में हिन्द महासागर है।",
      ],
    },
    {
      title: "भारत की नदियाँ",
      paragraphs: [
        "गंगा, यमुना, ब्रह्मपुत्र, नर्मदा, गोदावरी, कृष्णा और कावेरी भारत की प्रमुख नदियाँ हैं।",
      ],
    },
    {
      title: "पर्वत और मैदान",
      paragraphs: [
        "हिमालय भारत की प्रमुख पर्वत श्रृंखला है। गंगा का मैदान खेती और जनसंख्या की दृष्टि से अत्यधिक उपयोगी है।",
      ],
    },
    {
      title: "भूगोल कैसे पढ़ें?",
      paragraphs: [
        "भारत का नक्शा देखकर राज्य, राजधानी, नदियाँ, पर्वत, समुद्र और पड़ोसी देश याद करें। नक्शा भूगोल समझने में अत्यधिक उपयोगी है।",
      ],
    },
  ],
  questions: [
    { question: "भारत किस महाद्वीप में स्थित है?", answer: "एशिया महाद्वीप में।" },
    { question: "भारत के उत्तर में कौन सी पर्वत श्रृंखला है?", answer: "हिमालय।" },
    { question: "गंगा क्या है?", answer: "नदी।" },
    { question: "भारत के दक्षिण में कौन सा महासागर है?", answer: "हिन्द महासागर।" },
    {
      question: "भूगोल पढ़ने में नक्शा क्यों उपयोगी है?",
      answer: "नक्शे से स्थान, राज्य, नदी, पर्वत और सीमा समझने में सहायता मिलती है।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 3 - भारत का इतिहास - मूलभूत विचार",
      href: "/study-corner/general-awareness/chapter-3",
    },
    next: {
      label: "अध्याय 5 - समसामयिक घटनाएँ / Current Affairs",
      href: "/study-corner/general-awareness/chapter-5",
    },
  },
  backTo: "/study-corner/general-awareness",
  backLabel: "← सामान्य जागरूकता course पर वापस जाएँ",
};

export const GA_CHAPTER_5: StudyChapter = {
  id: "ga-chapter-5",
  courseTitle: "सामान्य जागरूकता / General Awareness",
  title: "समसामयिक घटनाएँ / Current Affairs",
  chapterLabel: "सामान्य जागरूकता - अध्याय 5",
  intro:
    "समसामयिक घटनाओं का अर्थ है देश और अंतरराष्ट्रीय स्तर पर घट रही प्रमुख घटनाओं की जानकारी रखना।",
  sections: [
    {
      title: "समसामयिक घटनाएँ क्या हैं?",
      paragraphs: [
        "देश, अंतरराष्ट्रीय जगत, सरकार, खेल, विज्ञान, पुरस्कार, योजनाएँ और नियुक्तियों से जुड़ी नई घटनाओं को समसामयिक घटनाएँ कहा जाता है।",
      ],
    },
    {
      title: "नौकरी परीक्षाओं में महत्व",
      paragraphs: [
        "कई नौकरी परीक्षाओं में पिछले कुछ महीनों की घटनाओं से प्रश्न पूछे जाते हैं। इसलिए समसामयिक घटनाओं का नियमित अध्ययन महत्वपूर्ण है।",
      ],
    },
    {
      title: "क्या पढ़ें?",
      paragraphs: [],
      list: [
        "सरकारी योजनाएँ",
        "प्रमुख नियुक्तियाँ",
        "पुरस्कार और सम्मान",
        "खेल समाचार",
        "विज्ञान और तकनीक",
        "राष्ट्रीय और अंतरराष्ट्रीय घटनाएँ",
        "प्रमुख दिवस",
      ],
    },
    {
      title: "कैसे पढ़ें?",
      paragraphs: [
        "प्रतिदिन 10 से 15 मिनट समसामयिक घटनाएँ पढ़ें। एक विश्वसनीय स्रोत चुनें। संक्षिप्त notes बनाएं और सप्ताह में एक बार पुनरावृत्ति करें।",
      ],
    },
    {
      title: "कौन सी त्रुटि न करें?",
      paragraphs: [
        "केवल शीर्षक याद न करें। घटना का कारण, व्यक्ति, स्थान और तिथि भी समझें।",
      ],
    },
  ],
  questions: [
    {
      question: "समसामयिक घटनाओं का अर्थ क्या है?",
      answer: "देश और अंतरराष्ट्रीय स्तर पर घट रही प्रमुख घटनाओं की जानकारी।",
    },
    {
      question: "समसामयिक घटनाएँ नियमित क्यों पढ़नी चाहिए?",
      answer: "क्योंकि नौकरी परीक्षाओं में समसामयिक घटनाओं से प्रश्न पूछे जाते हैं।",
    },
    {
      question: "पुरस्कार और सम्मान किस विषय में आते हैं?",
      answer: "समसामयिक घटनाओं में।",
    },
    {
      question: "समसामयिक घटनाएँ पढ़ते समय क्या बनाना चाहिए?",
      answer: "संक्षिप्त notes।",
    },
    {
      question: "केवल शीर्षक याद करना पर्याप्त है?",
      answer: "नहीं। घटना का कारण, व्यक्ति, स्थान और तिथि भी समझनी चाहिए।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 4 - भारत का भूगोल - मूलभूत विषय",
      href: "/study-corner/general-awareness/chapter-4",
    },
    next: {
      label: "अध्याय 6 - सामान्य विज्ञान - मूलभूत ज्ञान",
      href: "/study-corner/general-awareness/chapter-6",
    },
  },
  backTo: "/study-corner/general-awareness",
  backLabel: "← सामान्य जागरूकता course पर वापस जाएँ",
};

export const GA_CHAPTER_6: StudyChapter = {
  id: "ga-chapter-6",
  courseTitle: "सामान्य जागरूकता / General Awareness",
  title: "सामान्य विज्ञान - मूलभूत ज्ञान",
  chapterLabel: "सामान्य जागरूकता - अध्याय 6",
  intro:
    "सामान्य विज्ञान में शरीर, पौधे, जानवर, पानी, हवा, प्रकाश, ध्वनि, बिजली और दैनिक जीवन से जुड़ी वैज्ञानिक जानकारी पढ़ी जाती है।",
  sections: [
    {
      title: "सामान्य विज्ञान क्या है?",
      paragraphs: [
        "सामान्य विज्ञान में दैनिक जीवन से जुड़ी वैज्ञानिक जानकारी आती है। इसमें शरीर, भोजन, ऊर्जा, प्रकाश, ध्वनि, पौधे, जानवर, पानी और हवा से जुड़े विषय पढ़े जाते हैं।",
      ],
    },
    {
      title: "Physics",
      paragraphs: [
        "Physics में बल, ऊर्जा, प्रकाश, ध्वनि, गति, बिजली और चुंबक जैसे विषय आते हैं।",
      ],
    },
    {
      title: "Chemistry",
      paragraphs: [
        "Chemistry में पदार्थ, धातु, अधातु, अम्ल, क्षार, पानी, गैस और दैनिक जीवन में उपयोग होने वाले रसायन आते हैं।",
      ],
    },
    {
      title: "Biology",
      paragraphs: [
        "Biology में मानव शरीर, पौधे, जानवर, भोजन, रोग, स्वास्थ्य और पर्यावरण से जुड़े विषय आते हैं।",
      ],
    },
    {
      title: "विज्ञान कैसे पढ़ें?",
      paragraphs: [
        "विज्ञान को केवल रटने के स्थान पर दैनिक जीवन से जोड़कर पढ़ें। जैसे पानी क्यों उबलता है, पौधे भोजन कैसे बनाते हैं, शरीर ऑक्सीजन क्यों ग्रहण करता है।",
      ],
    },
  ],
  questions: [
    {
      question: "पौधे अपना भोजन किस प्रक्रिया से बनाते हैं?",
      answer: "प्रकाश संश्लेषण से।",
    },
    {
      question: "मनुष्य सांस लेने में कौन सी गैस ग्रहण करता है?",
      answer: "ऑक्सीजन।",
    },
    { question: "ध्वनि किस विषय से जुड़ी है?", answer: "Physics से।" },
    {
      question: "अम्ल और क्षार किस विषय से जुड़े हैं?",
      answer: "Chemistry से।",
    },
    {
      question: "मानव शरीर का अध्ययन किस विषय में होता है?",
      answer: "Biology में।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 5 - समसामयिक घटनाएँ / Current Affairs",
      href: "/study-corner/general-awareness/chapter-5",
    },
    next: {
      label: "सामान्य जागरूकता पाठ्यक्रम पृष्ठ",
      href: "/study-corner/general-awareness",
    },
  },
  backTo: "/study-corner/general-awareness",
  backLabel: "← सामान्य जागरूकता course पर वापस जाएँ",
};

export const COMPUTER_CHAPTER_1: StudyChapter = {
  id: "computer-chapter-1",
  courseTitle: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
  title: "कम्प्यूटर क्या है? / What is a Computer?",
  chapterLabel: "Computer Basics - अध्याय 1",
  intro:
    "कम्प्यूटर एक इलेक्ट्रॉनिक मशीन है। यह Input लेता है, उस पर कार्य करता है और Output दिखाता है। Keyboard और Mouse Input device हैं। Monitor और Printer Output device हैं। कम्प्यूटर का मूलभूत ज्ञान नौकरी परीक्षाओं के लिए आवश्यक है।",
  sections: [
    {
      title: "कम्प्यूटर का सरल अर्थ",
      paragraphs: [
        "कम्प्यूटर ऐसी मशीन है जो अत्यधिक तेजी से calculation कर सकती है, जानकारी store कर सकती है और आवश्यकता पड़ने पर result दिखा सकती है। कम्प्यूटर अपने आप नहीं सोचता, बल्कि यूजर द्वारा दिए गए निर्देशों के अनुसार कार्य करता है।",
      ],
    },
    {
      title: "Input, Process और Output",
      paragraphs: ["कम्प्यूटर का कार्य तीन मुख्य भागों में समझा जा सकता है।"],
      subsections: [
        {
          subtitle: "Input",
          paragraphs: [
            "जब हम keyboard, mouse या scanner से कम्प्यूटर को जानकारी देते हैं, उसे Input कहते हैं।",
          ],
        },
        {
          subtitle: "Process",
          paragraphs: ["कम्प्यूटर उस जानकारी पर कार्य करता है। इसे Process कहते हैं।"],
        },
        {
          subtitle: "Output",
          paragraphs: [
            "कम्प्यूटर जो result दिखाता है, उसे Output कहते हैं। जैसे monitor पर दिखने वाला result या printer से निकला page।",
          ],
        },
      ],
    },
    {
      title: "Hardware और Software",
      paragraphs: [],
      subsections: [
        {
          subtitle: "Hardware",
          paragraphs: [
            "कम्प्यूटर के वे भाग जिन्हें हम छू सकते हैं, Hardware कहलाते हैं। जैसे keyboard, mouse, monitor, CPU, printer और scanner।",
          ],
        },
        {
          subtitle: "Software",
          paragraphs: [
            "कम्प्यूटर में चलने वाले programs को Software कहते हैं। जैसे Windows, browser, typing app, calculator और office programs।",
          ],
        },
      ],
    },
    {
      title: "Input और Output Device",
      paragraphs: [],
      subsections: [
        {
          subtitle: "Input devices",
          paragraphs: ["Keyboard, Mouse, Scanner, Microphone"],
        },
        {
          subtitle: "Output devices",
          paragraphs: ["Monitor, Printer, Speaker, Projector"],
        },
      ],
    },
    {
      title: "परीक्षा में क्यों आवश्यक है?",
      paragraphs: [
        "सरकारी नौकरी परीक्षाओं में कम्प्यूटर से जुड़े सामान्य प्रश्न पूछे जाते हैं। जैसे CPU क्या है, keyboard किस प्रकार का device है, software किसे कहते हैं, internet क्या है, और memory क्या होती है। इसलिए कम्प्यूटर का मूलभूत ज्ञान हर छात्र के लिए आवश्यक है।",
      ],
    },
  ],
  questions: [
    {
      question: "कम्प्यूटर क्या है?",
      answer: "कम्प्यूटर एक इलेक्ट्रॉनिक मशीन है जो Input लेकर Process करती है और Output देती है।",
    },
    { question: "Keyboard किस प्रकार का device है?", answer: "Keyboard एक Input device है।" },
    { question: "Monitor किस प्रकार का device है?", answer: "Monitor एक Output device है।" },
    {
      question: "Hardware किसे कहते हैं?",
      answer: "कम्प्यूटर के वे भाग जिन्हें हम छू सकते हैं, Hardware कहलाते हैं।",
    },
    {
      question: "Software किसे कहते हैं?",
      answer: "कम्प्यूटर में चलने वाले programs को Software कहते हैं।",
    },
  ],
  chapterNav: {
    next: {
      label: "अध्याय 2 - Hardware",
      href: "/study-corner/computer-basics/chapter-2",
    },
  },
  backTo: "/study-corner/computer-basics",
  backLabel: "← कम्प्यूटर का मूलभूत ज्ञान / Computer Basics course पर वापस जाएँ",
};

export const COMPUTER_CHAPTER_2: StudyChapter = {
  id: "computer-chapter-2",
  courseTitle: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
  title: "Hardware",
  chapterLabel: "कम्प्यूटर का मूलभूत ज्ञान - अध्याय 2",
  intro:
    "Hardware कम्प्यूटर के वे भाग हैं जिन्हें हम देख सकते हैं और छू सकते हैं। Keyboard, Mouse, Monitor, CPU, Printer, Scanner, Speaker और Microphone Hardware के उदाहरण हैं।",
  sections: [
    {
      title: "Hardware क्या है?",
      paragraphs: [
        "Hardware कम्प्यूटर का भौतिक भाग होता है। इसका अर्थ है कम्प्यूटर के वे उपकरण जो हमारे सामने रखे होते हैं और जिनका उपयोग हम Input देने, Output देखने या data process करने के लिए करते हैं।",
      ],
    },
    {
      title: "Input Hardware",
      paragraphs: [
        "Input Hardware वे उपकरण हैं जिनसे उपयोगकर्ता कम्प्यूटर को data या command देता है। Keyboard, Mouse, Scanner और Microphone Input Hardware के उदाहरण हैं।",
      ],
    },
    {
      title: "Output Hardware",
      paragraphs: [
        "Output Hardware वे उपकरण हैं जिनसे कम्प्यूटर result दिखाता या सुनाता है। Monitor, Printer, Speaker और Projector Output Hardware के उदाहरण हैं।",
      ],
    },
    {
      title: "CPU",
      paragraphs: [
        "CPU को कम्प्यूटर का मुख्य भाग माना जाता है। यह data पर कार्य करता है और कम्प्यूटर के अनेक कार्यों को नियंत्रित करता है। परीक्षा में CPU से जुड़े प्रश्न अत्यधिक पूछे जाते हैं।",
      ],
    },
    {
      title: "Hardware का रख-रखाव",
      paragraphs: [
        "Hardware को धूल, पानी, झटके और अत्यधिक गर्मी से बचाना चाहिए। Keyboard और Mouse को स्वच्छ रखना चाहिए। तारों को ठीक से लगाना चाहिए और कम्प्यूटर को सही तरीके से बंद करना चाहिए।",
      ],
    },
  ],
  questions: [
    {
      question: "Hardware क्या है?",
      answer: "Hardware कम्प्यूटर के वे भौतिक भाग हैं जिन्हें हम देख और छू सकते हैं।",
    },
    {
      question: "Keyboard किस प्रकार का Hardware है?",
      answer: "Keyboard Input Hardware है।",
    },
    {
      question: "Monitor किस प्रकार का Hardware है?",
      answer: "Monitor Output Hardware है।",
    },
    {
      question: "CPU का मुख्य कार्य क्या है?",
      answer: "CPU data पर कार्य करता है और कम्प्यूटर के अनेक कार्यों को नियंत्रित करता है।",
    },
    {
      question: "Printer किस प्रकार का Hardware है?",
      answer: "Printer Output Hardware है।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 1 - कम्प्यूटर क्या है?",
      href: "/study-corner/computer-basics/chapter-1",
    },
    next: {
      label: "अध्याय 3 - Software",
      href: "/study-corner/computer-basics/chapter-3",
    },
  },
  backTo: "/study-corner/computer-basics",
  backLabel: "← कम्प्यूटर का मूलभूत ज्ञान / Computer Basics course पर वापस जाएँ",
};

export const COMPUTER_CHAPTER_3: StudyChapter = {
  id: "computer-chapter-3",
  courseTitle: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
  title: "Software",
  chapterLabel: "कम्प्यूटर का मूलभूत ज्ञान - अध्याय 3",
  intro:
    "Software कम्प्यूटर में चलने वाले निर्देशों और programs का समूह होता है। Hardware को कार्य कराने के लिए Software आवश्यक होता है। बिना Software के कम्प्यूटर केवल मशीन रह जाता है।",
  sections: [
    {
      title: "Software क्या है?",
      paragraphs: [
        "Software वे programs होते हैं जो कम्प्यूटर को बताते हैं कि कौन सा कार्य कैसे करना है। Typing app, calculator, browser, media player और office program Software के उदाहरण हैं।",
      ],
    },
    {
      title: "System Software",
      paragraphs: [
        "System Software कम्प्यूटर को चलाने में सहायता करता है। Operating System इसका प्रमुख उदाहरण है। Windows, Linux और Android Operating System के उदाहरण हैं।",
      ],
    },
    {
      title: "Application Software",
      paragraphs: [
        "Application Software किसी विशेष कार्य के लिए बनाया जाता है। Typing practice app, document writing app, calculator, browser, video player और image editor इसके उदाहरण हैं।",
      ],
    },
    {
      title: "Utility Software",
      paragraphs: [
        "Utility Software कम्प्यूटर की सुरक्षा, सफाई और रख-रखाव में सहायता करता है। Antivirus, backup tool और file compression tool इसके उदाहरण हैं।",
      ],
    },
    {
      title: "Hardware और Software का सम्बन्ध",
      paragraphs: [
        "Hardware शरीर की तरह है और Software निर्देश की तरह है। दोनों मिलकर कम्प्यूटर को उपयोगी बनाते हैं। Keyboard, Mouse और Monitor जैसे Hardware को सही ढंग से उपयोग करने के लिए Software आवश्यक होता है।",
      ],
    },
  ],
  questions: [
    {
      question: "Software क्या है?",
      answer: "Software programs का समूह है जो कम्प्यूटर को कार्य करने के निर्देश देता है।",
    },
    {
      question: "Operating System किस प्रकार का Software है?",
      answer: "Operating System, System Software है।",
    },
    {
      question: "Typing app किस प्रकार का Software है?",
      answer: "Typing app, Application Software है।",
    },
    {
      question: "Antivirus किस प्रकार का Software है?",
      answer: "Antivirus, Utility Software है।",
    },
    {
      question: "Hardware और Software दोनों क्यों आवश्यक हैं?",
      answer: "Hardware और Software दोनों मिलकर कम्प्यूटर को उपयोगी बनाते हैं।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 2 - Hardware",
      href: "/study-corner/computer-basics/chapter-2",
    },
    next: {
      label: "अध्याय 4 - Memory और Storage",
      href: "/study-corner/computer-basics/chapter-4",
    },
  },
  backTo: "/study-corner/computer-basics",
  backLabel: "← कम्प्यूटर का मूलभूत ज्ञान / Computer Basics course पर वापस जाएँ",
};

export const COMPUTER_CHAPTER_4: StudyChapter = {
  id: "computer-chapter-4",
  courseTitle: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
  title: "Memory और Storage",
  chapterLabel: "कम्प्यूटर का मूलभूत ज्ञान - अध्याय 4",
  intro:
    "Memory और Storage कम्प्यूटर में data रखने के लिए उपयोग होते हैं। Memory कम्प्यूटर को तत्काल कार्य करने में सहायता करती है, जबकि Storage data को लंबे समय तक सुरक्षित रखता है।",
  sections: [
    {
      title: "Memory क्या है?",
      paragraphs: [
        "Memory कम्प्यूटर का वह भाग है जहाँ data और निर्देश कार्य करते समय रखे जाते हैं। Memory के बिना कम्प्यूटर programs को ठीक से नहीं चला सकता।",
      ],
    },
    {
      title: "RAM",
      paragraphs: [
        "RAM अस्थायी Memory होती है। कम्प्यूटर बंद होने पर RAM में रखा data मिट जाता है। जितनी अधिक RAM होगी, कम्प्यूटर उतनी गति से अनेक कार्य कर सकता है।",
      ],
    },
    {
      title: "ROM",
      paragraphs: [
        "ROM स्थायी Memory होती है। इसमें कम्प्यूटर आरम्भ करने के लिए आवश्यक निर्देश रखे जाते हैं। ROM का data सामान्य रूप से मिटता नहीं है।",
      ],
    },
    {
      title: "Storage क्या है?",
      paragraphs: [
        "Storage data को लंबे समय तक सुरक्षित रखने का साधन है। Hard Disk, SSD, Pen Drive, Memory Card, CD और DVD Storage के उदाहरण हैं।",
      ],
    },
    {
      title: "Memory और Storage में अंतर",
      paragraphs: [
        "Memory तत्काल कार्य में सहायता करती है। Storage data को लंबे समय तक सुरक्षित रखता है। RAM Memory है, जबकि Hard Disk और SSD Storage हैं।",
      ],
    },
  ],
  questions: [
    {
      question: "RAM किस प्रकार की Memory है?",
      answer: "RAM अस्थायी Memory है।",
    },
    {
      question: "ROM का data सामान्य रूप से मिटता है या नहीं?",
      answer: "ROM का data सामान्य रूप से नहीं मिटता।",
    },
    {
      question: "Hard Disk किसका उदाहरण है?",
      answer: "Hard Disk, Storage का उदाहरण है।",
    },
    {
      question: "Memory और Storage में मुख्य अंतर क्या है?",
      answer:
        "Memory तत्काल कार्य में सहायता करती है, जबकि Storage data को लंबे समय तक सुरक्षित रखता है।",
    },
    {
      question: "Pen Drive किसका उदाहरण है?",
      answer: "Pen Drive, Storage का उदाहरण है।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 3 - Software",
      href: "/study-corner/computer-basics/chapter-3",
    },
    next: {
      label: "अध्याय 5 - Internet और Email",
      href: "/study-corner/computer-basics/chapter-5",
    },
  },
  backTo: "/study-corner/computer-basics",
  backLabel: "← कम्प्यूटर का मूलभूत ज्ञान / Computer Basics course पर वापस जाएँ",
};

export const COMPUTER_CHAPTER_5: StudyChapter = {
  id: "computer-chapter-5",
  courseTitle: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics",
  title: "Internet और Email",
  chapterLabel: "कम्प्यूटर का मूलभूत ज्ञान - अध्याय 5",
  intro:
    "Internet कम्प्यूटर और मोबाइल को विश्व से जोड़ने वाला विशाल network है। Email का उपयोग संदेश, document और सूचना भेजने के लिए किया जाता है। नौकरी परीक्षाओं में Internet और Email से जुड़े प्रश्न पूछे जाते हैं।",
  sections: [
    {
      title: "Internet क्या है?",
      paragraphs: [
        "Internet अनेक कम्प्यूटरों और servers को जोड़ने वाला विश्वव्यापी network है। इसके माध्यम से हम Website खोलते हैं, जानकारी खोजते हैं, form भरते हैं और online सेवाओं का उपयोग करते हैं।",
      ],
    },
    {
      title: "Browser और Website",
      paragraphs: [
        "Browser वह Software है जिससे हम Website खोलते हैं। Chrome, Edge और Firefox Browser के उदाहरण हैं। Website कई web pages का समूह होती है।",
      ],
    },
    {
      title: "Search Engine",
      paragraphs: [
        "Search Engine Internet पर जानकारी खोजने में सहायता करता है। Google, Bing और Yahoo Search Engine के उदाहरण हैं। Search Engine में सही शब्द लिखने से सही जानकारी शीघ्र मिलती है।",
      ],
    },
    {
      title: "Email क्या है?",
      paragraphs: [
        "Email electronic message भेजने का साधन है। Email से message, document, photo और file भेजी जा सकती है। Email address में सामान्य रूप से username, @ symbol और domain होता है।",
      ],
    },
    {
      title: "Internet सुरक्षा",
      paragraphs: [
        "Internet उपयोग करते समय मजबूत Password रखें। अज्ञात link पर click न करें। Spam Email से सावधान रहें। अपनी निजी सूचना अज्ञात Website पर न भरें।",
      ],
    },
  ],
  questions: [
    {
      question: "Internet क्या है?",
      answer: "Internet अनेक कम्प्यूटरों और servers को जोड़ने वाला विश्वव्यापी network है।",
    },
    {
      question: "Browser का उपयोग किस लिए होता है?",
      answer: "Browser का उपयोग Website खोलने के लिए होता है।",
    },
    {
      question: "Google किसका उदाहरण है?",
      answer: "Google, Search Engine का उदाहरण है।",
    },
    {
      question: "Email से क्या भेजा जा सकता है?",
      answer: "Email से message, document, photo और file भेजी जा सकती है।",
    },
    {
      question: "Internet सुरक्षा के लिए क्या ध्यान रखना चाहिए?",
      answer: "मजबूत Password रखें, अज्ञात link पर click न करें और निजी सूचना सुरक्षित रखें।",
    },
  ],
  chapterNav: {
    prev: {
      label: "अध्याय 4 - Memory और Storage",
      href: "/study-corner/computer-basics/chapter-4",
    },
    next: {
      label: "कम्प्यूटर का मूलभूत ज्ञान course page",
      href: "/study-corner/computer-basics",
    },
  },
  backTo: "/study-corner/computer-basics",
  backLabel: "← कम्प्यूटर का मूलभूत ज्ञान / Computer Basics course पर वापस जाएँ",
};
