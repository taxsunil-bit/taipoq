export const WORD_BASICS_HREF = "/study-corner/computer-basics/word-basic-knowledge" as const;

export const WORD_BASICS_MODULE = {
  title: "MS Word Basic Knowledge",
  titleHindi: "एम.एस. वर्ड मूलभूत ज्ञान",
  description:
    "Document typing, formatting, page setup, tables, print और file handling की मूलभूत जानकारी।",
  href: WORD_BASICS_HREF,
  buttonLabel: "पढ़ना आरम्भ करें",
} as const;

export const WORD_BASICS_META = {
  title: "MS Word Basic Knowledge",
  subtitle: "सरकारी नौकरी और कार्यालय Document कार्य के लिए मूलभूत ज्ञान",
  chips: ["Beginner Friendly", "Computer Knowledge", "Exam + Office Use"] as const,
} as const;

export type WordChapterCard = {
  id: string;
  anchor: string;
  title: string;
  description: string;
  tags: string[];
};

export const WORD_CHAPTER_CARDS: WordChapterCard[] = [
  {
    id: "1",
    anchor: "chapter-1",
    title: "MS Word का परिचय",
    description: "Word Processor, Document, Ribbon और MS Word Screen की मूलभूत जानकारी।",
    tags: ["MS Word", "Document", "Ribbon"],
  },
  {
    id: "2",
    anchor: "chapter-2",
    title: "Document बनाना और Save करना",
    description: "New Document, Open, Save, Save As और File Extension सीखें।",
    tags: ["New", "Save", ".docx"],
  },
  {
    id: "3",
    anchor: "chapter-3",
    title: "Text Formatting",
    description: "Font, Size, Bold, Italic, Underline, Color और Highlight।",
    tags: ["Font", "Bold", "Format"],
  },
  {
    id: "4",
    anchor: "chapter-4",
    title: "Paragraph और Alignment",
    description: "Line Spacing, Indent, Bullets, Numbering और Text Alignment।",
    tags: ["Paragraph", "Alignment", "List"],
  },
  {
    id: "5",
    anchor: "chapter-5",
    title: "Page Setup और Margins",
    description: "Orientation, Paper Size, Margins और Section Break की जानकारी।",
    tags: ["Page Setup", "Margin", "Orientation"],
  },
  {
    id: "6",
    anchor: "chapter-6",
    title: "Tables",
    description: "Table Insert, Row/Column, Merge, Border और Table Layout।",
    tags: ["Table", "Row", "Column"],
  },
  {
    id: "7",
    anchor: "chapter-7",
    title: "Header, Footer और Page Number",
    description: "Header/Footer Insert, Page Number और Different First Page।",
    tags: ["Header", "Footer", "Page Number"],
  },
  {
    id: "8",
    anchor: "chapter-8",
    title: "Print और PDF Export",
    description: "Print Preview, Print Settings, PDF Save और MCQ अभ्यास।",
    tags: ["Print", "PDF", "MCQ"],
  },
];

export type WordTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type WordChapterContent = {
  anchor: string;
  badge: string;
  title: string;
  intro: string;
  quickLearn: string[];
  body: { heading?: string; paragraphs?: string[]; list?: string[] }[];
  table?: WordTable;
  practice: string[];
  revision?: string[];
};

export const WORD_CHAPTERS: WordChapterContent[] = [
  {
    anchor: "chapter-1",
    badge: "अध्याय 1",
    title: "MS Word का परिचय",
    intro:
      "MS Word Microsoft का Word Processor Software है। इसमें पत्र, प्रतिवेदन, नोटिस, आवेदन और अन्य Document तैयार किए जाते हैं। Office, सरकारी कार्यालय और परीक्षा दोनों में Word का मूल ज्ञान उपयोगी है।",
    quickLearn: [
      "Word Processor = Text लिखने और Format करने का Software",
      "Document = Word की File; जैसे Application.docx",
      "Ribbon = ऊपर के Tab और Command का समूह",
      "Status Bar = नीचे Page Number, Word Count आदि दिखाता है",
    ],
    body: [
      {
        heading: "MS Word क्या है?",
        paragraphs: [
          "MS Word में हम Typed Text को Format करके Professional Document बना सकते हैं। Typing Test के बाद Office में अक्सर Word पर ही कार्य होता है।",
          "LibreOffice Writer और Google Docs भी Word Processor हैं, पर MS Word सबसे अधिक प्रचलित है।",
        ],
      },
      {
        heading: "मुख्य Screen भाग",
        list: [
          "Title Bar — File का नाम और Window Control",
          "Ribbon — Home, Insert, Layout, Review जैसे Tab",
          "Quick Access Toolbar — Save, Undo, Redo",
          "Document Area — मुख्य लेखन क्षेत्र",
          "Ruler — Margin और Indent देखने के लिए",
          "Status Bar — Page, Words, Language",
        ],
      },
    ],
    practice: [
      "MS Word खोलकर Blank Document देखें।",
      "Ribbon के Home और Insert Tab के नाम लिखें।",
      "Status Bar में Page Number और Word Count देखें।",
    ],
    revision: ["Word Processor = Text Document Software", "Ribbon = Commands का समूह"],
  },
  {
    anchor: "chapter-2",
    badge: "अध्याय 2",
    title: "Document बनाना और Save करना",
    intro:
      "नया Document File → New से बनता है। Save से परिवर्तन सुरक्षित रहते हैं। Save As से नया नाम या स्थान चुन सकते हैं।",
    quickLearn: [
      "Ctrl + N = New Document",
      "Ctrl + S = Save",
      "Ctrl + O = Open",
      "F12 = Save As",
      ".docx = आधुनिक Word File Extension",
    ],
    body: [
      {
        heading: "New, Open, Save",
        list: [
          "New — नई Blank File या Template",
          "Open — पुरानी File खोलना",
          "Save — वही File में परिवर्तन सुरक्षित करना",
          "Save As — नया नाम, स्थान या Format",
          "AutoSave — Office 365 में स्वतः Save (यदि उपलब्ध हो)",
        ],
      },
      {
        heading: "File Extension",
        list: [
          ".docx — आधुनिक MS Word Format",
          ".doc — पुराना Word Format",
          ".pdf — Print/Share के लिए; Word से Export",
          ".txt — Plain Text; Formatting नहीं रहती",
        ],
      },
    ],
    practice: [
      "नया Document बनाकर अपना नाम Type करें।",
      "Ctrl + S से Desktop पर Save करें।",
      "Save As से Copy बनाकर नया नाम दें।",
    ],
    revision: ["Ctrl + S = Save", ".docx = Word File"],
  },
  {
    anchor: "chapter-3",
    badge: "अध्याय 3",
    title: "Text Formatting",
    intro:
      "Formatting से Text सुंदर, स्पष्ट और पढ़ने योग्य बनता है। Home Tab में Font Group सबसे अधिक उपयोग होता है।",
    quickLearn: [
      "Ctrl + B = Bold",
      "Ctrl + I = Italic",
      "Ctrl + U = Underline",
      "Font Size बढ़ाने/घटाने — Home Tab",
      "Font Color और Highlight Text",
    ],
    body: [
      {
        heading: "Font Formatting",
        list: [
          "Font Name — Arial, Times New Roman, Mangal (Hindi)",
          "Font Size — 12, 14, 16 Points",
          "Bold, Italic, Underline",
          "Font Color — Text का रंग",
          "Text Highlight — पीले रंग जैसा Mark",
          "Strikethrough, Subscript, Superscript",
        ],
      },
      {
        heading: "Format Painter",
        paragraphs: [
          "Format Painter से एक Text की Style दूसरे Text पर लगा सकते हैं। पहले Source Text चुनें, Format Painter Click करें, फिर Target Text चुनें।",
        ],
      },
    ],
    practice: [
      "Heading को Bold और Size 16 करें।",
      "Body Text Size 12 रखें।",
      "एक Important शब्द Highlight करें।",
      "Format Painter से Style Copy करें।",
    ],
    revision: ["Bold = मोटा Text", "Format Painter = Style Copy"],
  },
  {
    anchor: "chapter-4",
    badge: "अध्याय 4",
    title: "Paragraph और Alignment",
    intro:
      "Paragraph Formatting से Line Spacing, Indent और List व्यवस्थित होते हैं। Alignment से Text Left, Center, Right या Justify होता है।",
    quickLearn: [
      "Left Align — बायाँ (Default Hindi/English)",
      "Center Align — मध्य",
      "Right Align — दायाँ",
      "Justify — दोनों किनारों से समान",
      "Line Spacing — 1.0, 1.5, 2.0",
    ],
    body: [
      {
        heading: "Alignment",
        list: [
          "Left — सामान्य पत्र और नोटिस",
          "Center — Title और Heading",
          "Right — Date या Signature Line",
          "Justify — Formal Report",
        ],
      },
      {
        heading: "Paragraph Tools",
        list: [
          "Bullets — • चिह्न वाली सूची",
          "Numbering — 1, 2, 3 क्रम सूची",
          "Increase/Decrease Indent",
          "Line and Paragraph Spacing",
          "Sort — Selected Paragraph Sort (Text)",
        ],
      },
    ],
    practice: [
      "Title Center Align करें।",
      "तीन Points की Bullet List बनाएँ।",
      "Paragraph Line Spacing 1.5 Set करें।",
    ],
    revision: ["Justify = दोनों किनारे समतल", "Bullet = बिन्दु सूची"],
  },
  {
    anchor: "chapter-5",
    badge: "अध्याय 5",
    title: "Page Setup और Margins",
    intro:
      "Layout Tab में Page Setup से Paper Size, Orientation और Margins नियंत्रित होते हैं। Official Letter में Margin सही होना आवश्यक है।",
    quickLearn: [
      "Portrait = ऊर्ध्वाधर Page",
      "Landscape = क्षैतिज Page",
      "A4 = सामान्य Paper Size (India)",
      "Margin = Page के चारों ओर खाली स्थान",
      "Section Break — अलग Section Format",
    ],
    body: [
      {
        heading: "Page Setup Options",
        list: [
          "Orientation — Portrait / Landscape",
          "Size — A4, Letter, Legal",
          "Margins — Normal, Narrow, Wide, Custom",
          "Columns — एक Page पर Column विभाजन",
          "Breaks — Page Break, Section Break",
        ],
      },
      {
        heading: "Margin का महत्व",
        paragraphs: [
          "Binding के लिए Left Margin थोड़ा बड़ा रखा जाता है। Print से पहले Margin और Orientation जाँचें।",
        ],
      },
    ],
    practice: [
      "A4 Portrait Set करें।",
      "Normal Margin Apply करें।",
      "Page Break Insert करके दूसरा Page देखें।",
    ],
    revision: ["Portrait = लम्बा Page", "Margin = किनारे की खाली जगह"],
  },
  {
    anchor: "chapter-6",
    badge: "अध्याय 6",
    title: "Tables",
    intro:
      "Table से Row और Column में Data व्यवस्थित लिखा जाता है। Marksheet, Fee List, Attendance Register Table में आसान होते हैं।",
    quickLearn: [
      "Insert → Table",
      "Row = क्षैतिज पंक्ति",
      "Column = ऊर्ध्वाधर स्तम्भ",
      "Merge Cells — Cells मिलाना",
      "Table Design — Border और Style",
    ],
    body: [
      {
        heading: "Table बनाना",
        list: [
          "Insert Tab → Table → Grid Size चुनें",
          "Tab Key — अगले Cell में जाना",
          "Enter — Cell में नई Line (Settings पर निर्भर)",
          "Add Row Above/Below, Delete Row",
          "Add Column Left/Right, Delete Column",
        ],
      },
      {
        heading: "Table Formatting",
        list: [
          "Merge Cells — कई Cells एक करना",
          "Split Cells — Cell विभाजन",
          "Borders — Line Style और Color",
          "Shading — Cell Background Color",
          "AutoFit — Content के अनुसार Width",
        ],
      },
    ],
    table: {
      caption: "Student Attendance (Table उदाहरण)",
      headers: ["Roll No.", "Name", "Present"],
      rows: [
        ["101", "Ravi", "Yes"],
        ["102", "Sita", "Yes"],
        ["103", "Amit", "No"],
      ],
    },
    practice: [
      "3 Column × 4 Row Table Insert करें।",
      "Header Row Bold करें।",
      "Border All Apply करें।",
      "दो Cells Merge करके Title लिखें।",
    ],
    revision: ["Merge = Cells मिलाना", "Tab = अगला Cell"],
  },
  {
    anchor: "chapter-7",
    badge: "अध्याय 7",
    title: "Header, Footer और Page Number",
    intro:
      "Header Page के ऊपर, Footer नीचे हर Page पर दोहराया जाता है। Page Number, Date और File Name अक्सर Footer में होते हैं।",
    quickLearn: [
      "Insert → Header / Footer",
      "Page Number — Top, Bottom, Margin",
      "Different First Page — पहला Page अलग",
      "Double-click Header/Footer — Edit Mode",
      "Close Header and Footer — Edit समाप्त",
    ],
    body: [
      {
        heading: "Header और Footer",
        list: [
          "Header — Office Name, Logo, Title",
          "Footer — Page Number, Date, Signature Note",
          "Link to Previous — Section में Same Header",
          "Different Odd & Even Pages — Book Style",
        ],
      },
      {
        heading: "Page Number",
        paragraphs: [
          "Insert → Page Number → Position चुनें। Format में 1, 2, 3 या i, ii, iii Style हो सकता है। Official Letter में कभी Page Number नहीं, Report में अक्सर Footer में।",
        ],
      },
    ],
    practice: [
      "Header में Office Name लिखें।",
      "Footer में Page Number Bottom Center लगाएँ।",
      "Print Preview में Header/Footer देखें।",
    ],
    revision: ["Header = ऊपर दोहराया भाग", "Footer = नीचे दोहराया भाग"],
  },
  {
    anchor: "chapter-8",
    badge: "अध्याय 8",
    title: "Print और PDF Export",
    intro:
      "Print Preview से Print से पहले Layout देखें। PDF Export से File Mobile और Email पर भेजना आसान होता है। File Handling में Backup और सही Folder भी महत्वपूर्ण है।",
    quickLearn: [
      "Ctrl + P = Print",
      "Print Preview — Final Look",
      "Save As → PDF — PDF Export",
      "Copies — कितनी Print",
      "Print Selection — केवल चुना Text",
    ],
    body: [
      {
        heading: "Print Settings",
        list: [
          "Print Preview — Page Layout जाँच",
          "Printer Selection — Device चुनें",
          "Pages — All, Current, Range (1-3)",
          "Print One Sided / Two Sided",
          "Collated — Set क्रम में Print",
        ],
      },
      {
        heading: "PDF Export और File Handling",
        paragraphs: [
          "File → Save As → PDF से Document PDF बनाएँ। PDF Formatting सुरक्षित रखता है और Share करना सरल है।",
        ],
        list: [
          "Save — नियमित Backup की आदत",
          "Folder — Subject/Date के अनुसार व्यवस्था",
          "Rename — स्पष्ट File Name",
          "Do not open unknown Email Attachment",
        ],
      },
    ],
    practice: [
      "Print Preview खोलकर Margin जाँचें।",
      "PDF Save करके Desktop पर रखें।",
      "नीचे MCQ अभ्यास करें।",
    ],
    revision: ["Ctrl + P = Print", "PDF = Share Format"],
  },
];

export const WORD_SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "Ctrl + N", action: "New Document" },
  { keys: "Ctrl + O", action: "Open" },
  { keys: "Ctrl + S", action: "Save" },
  { keys: "F12", action: "Save As" },
  { keys: "Ctrl + P", action: "Print" },
  { keys: "Ctrl + B", action: "Bold" },
  { keys: "Ctrl + I", action: "Italic" },
  { keys: "Ctrl + U", action: "Underline" },
  { keys: "Ctrl + C", action: "Copy" },
  { keys: "Ctrl + V", action: "Paste" },
  { keys: "Ctrl + Z", action: "Undo" },
  { keys: "Ctrl + Y", action: "Redo" },
  { keys: "Ctrl + F", action: "Find" },
  { keys: "Ctrl + H", action: "Replace" },
  { keys: "Ctrl + A", action: "Select All" },
];

export const WORD_MCQS: { question: string; answer: string }[] = [
  { question: "MS Word किस प्रकार का Software है?", answer: "Word Processor" },
  { question: "Word Document की आधुनिक File Extension क्या है?", answer: ".docx" },
  { question: "Ctrl + S किसके लिए है?", answer: "Save" },
  { question: "Ctrl + B किसके लिए है?", answer: "Bold" },
  { question: "Ribbon क्या है?", answer: "Tab और Command का समूह" },
  { question: "Portrait Orientation का अर्थ?", answer: "ऊर्ध्वाधर Page" },
  { question: "Landscape Orientation का अर्थ?", answer: "क्षैतिज Page" },
  { question: "Table Insert किस Tab से होता है?", answer: "Insert" },
  { question: "Merge Cells का काम?", answer: "Cells को एक करना" },
  { question: "Header कहाँ दिखता है?", answer: "Page के ऊपर" },
  { question: "Footer कहाँ दिखता है?", answer: "Page के नीचे" },
  { question: "Ctrl + P किसके लिए है?", answer: "Print" },
  { question: "PDF Save क्यों उपयोगी है?", answer: "Share और Formatting सुरक्षित रखने के लिए" },
  { question: "Justify Alignment का अर्थ?", answer: "दोनों किनारों से समान पंक्ति" },
  { question: "Format Painter का काम?", answer: "Formatting Copy करना" },
];

export const WORD_FINAL_PROJECT = {
  title: "Final Practice Project — Office Notice",
  description: "Office Notice Document — Heading, Body, Table, Header/Footer और PDF Export।",
  steps: [
    "New Document बनाएँ — Title Center Bold",
    "Body Paragraph Left Align, Line Spacing 1.5",
    "3 Column Table — Name, Designation, Contact",
    "Header में Office Name, Footer में Page Number",
    "Print Preview देखें",
    "PDF Export करें",
  ],
};

export const WORD_NEXT_PRACTICE = [
  { label: "Word MCQ Practice", anchor: "chapter-8" },
  { label: "Table Practice", anchor: "chapter-6" },
  { label: "Office Notice Project", anchor: "chapter-8" },
] as const;
