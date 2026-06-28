export type GeneralScienceStudyChapter = {
  id: string;
  courseTitle: string;
  title: string;
  chapterLabel: string;
  intro: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
    list?: string[];
  }>;
  questions: Array<{
    question: string;
    answer: string;
  }>;
  backTo: "/study-corner/general-science";
  backLabel: string;
};

export const GS_COURSE = {
  title: "सामान्य विज्ञान / General Science",
  subtitle: "Physics · Chemistry · Biology · Environment",
  intro:
    "सामान्य विज्ञान की तैयारी सरल, स्पष्ट और अभ्यास-आधारित तरीके से की जाएगी। इस模块 में जीव विज्ञान, भौतिकी, रसायन विज्ञान और पर्यावरण से जुड़े मूलभूत विषय शामिल हैं।",
  chapters: [
    {
      id: "chapter-1",
      title: "Biology Basics",
      description: "Human body, vitamins, diseases, nutrition, cells, plants",
      href: "/study-corner/general-science/chapter-1" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-2",
      title: "Physics Basics",
      description: "Motion, force, work, energy, heat, light, sound, electricity",
      href: "/study-corner/general-science/chapter-2" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-3",
      title: "Chemistry Basics",
      description: "Matter, acids, bases, salts, metals, non-metals, common compounds",
      href: "/study-corner/general-science/chapter-3" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
    {
      id: "chapter-4",
      title: "Everyday Science & Environment",
      description: "Pollution, ozone layer, greenhouse effect, instruments, inventions, space, technology",
      href: "/study-corner/general-science/chapter-4" as const,
      available: true,
      buttonLabel: "अध्याय पढ़ें",
    },
  ],
} as const;

export const GS_MODEL_TEST = {
  titleHi: "सामान्य विज्ञान टेस्ट",
  titleEn: "General Science Test",
  meta: "25 प्रश्न • 25 अंक • Class 6–10 level",
  href: "/study-corner/general-science/model-test-01" as const,
  buttonLabel: "टेस्ट शुरू करें",
  sourceNote: "यह टेस्ट सरल स्तर पर तैयार किया गया है और कोई ऋणात्मक अंकन नहीं है।",
} as const;

export const GS_CHAPTER_1: GeneralScienceStudyChapter = {
  id: "gs-chapter-1",
  courseTitle: "सामान्य विज्ञान / General Science",
  title: "Biology Basics",
  chapterLabel: "अध्याय 1",
  intro:
    "जीव विज्ञान की मूलभूत जानकारी, मानव शरीर, पोषण, विटामिन, रोग और पौधों की महत्वपूर्ण बातें।",
  sections: [
    {
      title: "मानव शरीर और जीवन",
      paragraphs: [
        "मानव शरीर में विभिन्न अंगों का अपना कार्य होता है। हृदय, फेफड़े, मस्तिष्क, यकृत और गुर्दा जैसे अंग शरीर के विभिन्न कार्यों में मदद करते हैं।",
        "शरीर को स्वस्थ रखने के लिए संतुलित आहार, नींद और नियमित व्यायाम जरूरी हैं।",
      ],
    },
    {
      title: "पोषण और विटामिन",
      paragraphs: [
        "प्रोटीन, कार्बोहाइड्रेट, वसा, विटामिन और खनिज पदार्थ शरीर के लिए आवश्यक हैं।",
        "विटामिन A, C, D और B-complex शरीर के विभिन्न कार्यों में सहायक होते हैं।",
      ],
    },
    {
      title: "रोग और पौधे",
      paragraphs: [
        "कुछ रोग बैक्टीरिया, वायरस या संक्रमण के कारण होते हैं।",
        "पौधे अपना भोजन प्रकाश संश्लेषण द्वारा बनाते हैं और ऑक्सीजन छोड़ते हैं।",
      ],
      list: ["पोषण", "विटामिन", "रोग", "पौधों की वृद्धि"],
    },
  ],
  questions: [
    { question: "मानव शरीर में रक्त का पंपिंग कौन करता है?", answer: "हृदय" },
    { question: "विटामिन C किससे जुड़ा है?", answer: "आम, नींबू और मौसमी फल" },
  ],
  backTo: "/study-corner/general-science",
  backLabel: "सामान्य विज्ञान पर वापस जाएँ",
};

export const GS_CHAPTER_2: GeneralScienceStudyChapter = {
  id: "gs-chapter-2",
  courseTitle: "सामान्य विज्ञान / General Science",
  title: "Physics Basics",
  chapterLabel: "अध्याय 2",
  intro:
    "गति, बल, ऊर्जा, Heat, Light, Sound और Electricity की सरल समझ।",
  sections: [
    {
      title: "गति और बल",
      paragraphs: [
        "जब कोई वस्तु अपनी स्थिति बदलती है, तो उसे गति कहते हैं।",
        "बल वस्तु की गति या दिशा बदल सकता है।",
      ],
    },
    {
      title: "कार्य, ऊर्जा और Heat",
      paragraphs: [
        "कार्य तब होता है जब बल लगाकर वस्तु को हिलाया जाए।",
        "ऊर्जा विभिन्न रूपों में मिलती है, जैसे यांत्रिक, तापीय और प्रकाशीय।",
      ],
    },
    {
      title: "Light, Sound और Electricity",
      paragraphs: [
        "प्रकाश देखने की क्षमता देता है।",
        "ध्वनि तरंगों से बनती है और बिजली विद्युत प्रवाह से जुड़ी होती है।",
      ],
      list: ["गति", "बल", "ऊर्जा", "प्रकाश", "ध्वनि", "बिजली"],
    },
  ],
  questions: [
    { question: "गति का अर्थ क्या है?", answer: "वस्तु की स्थिति में बदलाव" },
    { question: "ऊर्जा का प्रमुख स्रोत क्या है?", answer: "सूर्य" },
  ],
  backTo: "/study-corner/general-science",
  backLabel: "सामान्य विज्ञान पर वापस जाएँ",
};

export const GS_CHAPTER_3: GeneralScienceStudyChapter = {
  id: "gs-chapter-3",
  courseTitle: "सामान्य विज्ञान / General Science",
  title: "Chemistry Basics",
  chapterLabel: "अध्याय 3",
  intro:
    "पदार्थ, अम्ल, क्षार, लवण, धातु, अधातु और सामान्य यौगिकों की सरल जानकारी।",
  sections: [
    {
      title: "पदार्थ",
      paragraphs: [
        "पदार्थ वह सब कुछ है जो जगह घेरता है और द्रव्यमान रखता है।",
        "पदार्थ ठोस, द्रव और गैस के रूप में पाए जाते हैं।",
      ],
    },
    {
      title: "अम्ल, क्षार और लवण",
      paragraphs: [
        "अम्ल खट्टे होते हैं और क्षार कड़वे होते हैं।",
        "लवण अम्ल और क्षार के मिश्रण से बनते हैं।",
      ],
    },
    {
      title: "धातु और अधातु",
      paragraphs: [
        "धातुएँ अच्छा चालक और चमकदार होती हैं।",
        "अधातुएँ आमतौर पर खराब चालक होती हैं।",
      ],
      list: ["अम्ल", "क्षार", "लवण", "धातु", "अधातु"],
    },
  ],
  questions: [
    { question: "अम्ल किस प्रकार का स्वाद होता है?", answer: "खट्टा" },
    { question: "लवण किससे बनता है?", answer: "अम्ल और क्षार" },
  ],
  backTo: "/study-corner/general-science",
  backLabel: "सामान्य विज्ञान पर वापस जाएँ",
};

export const GS_CHAPTER_4: GeneralScienceStudyChapter = {
  id: "gs-chapter-4",
  courseTitle: "सामान्य विज्ञान / General Science",
  title: "Everyday Science & Environment",
  chapterLabel: "अध्याय 4",
  intro:
    "पर्यावरण, प्रदूषण, ओज़ोन परत, ग्रीनहाउस प्रभाव, उपकरण, आविष्कार और अंतरिक्ष की मूल बातें।",
  sections: [
    {
      title: "पर्यावरण और प्रदूषण",
      paragraphs: [
        "वायु, जल और मिट्टी प्रदूषण मानव स्वास्थ्य और पारिस्थितिकी को प्रभावित करते हैं।",
        "पेड़ और वन पर्यावरण को संतुलित रखने में मदद करते हैं।",
      ],
    },
    {
      title: "ओज़ोन परत और ग्रीनहाउस प्रभाव",
      paragraphs: [
        "ओज़ोन परत सूर्य की हानिकारक किरणों से बचाती है।",
        "ग्रीनहाउस गैसें पृथ्वी को गर्म रखती हैं, लेकिन अत्यधिक वृद्धि से समस्या बढ़ सकती है।",
      ],
    },
    {
      title: "उपकरण, आविष्कार और अंतरिक्ष",
      paragraphs: [
        "कई वैज्ञानिक उपकरण हमारे दैनिक जीवन को आसान बनाते हैं।",
        "अंतरिक्ष और तकनीक की जानकारी आधुनिक विज्ञान का महत्वपूर्ण अंग है।",
      ],
      list: ["प्रदूषण", "ओज़ोन", "ग्रीनहाउस", "उपकरण", "अंतरिक्ष"],
    },
  ],
  questions: [
    { question: "ओज़ोन परत किसकी हानिकारक किरणों से बचाती है?", answer: "सूर्य की" },
    { question: "ग्रीनहाउस प्रभाव किससे जुड़ा है?", answer: "गैसों की वृद्धि" },
  ],
  backTo: "/study-corner/general-science",
  backLabel: "सामान्य विज्ञान पर वापस जाएँ",
};
