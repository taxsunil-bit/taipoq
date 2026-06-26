export const EXCEL_BASICS_HREF = "/study-corner/computer-basics/excel-basic-knowledge" as const;

export const EXCEL_BASICS_MODULE = {
  title: "Excel / Spreadsheet Basic Knowledge",
  titleHindi: "Excel / Spreadsheet मूल ज्ञान",
  description:
    "Workbook, Worksheet, Cell, Formula, Function, Sort, Filter, Chart और PDF Export सीखें।",
  href: EXCEL_BASICS_HREF,
  buttonLabel: "आरम्भ करें",
} as const;

export const EXCEL_BASICS_META = {
  title: "Excel / Spreadsheet Basic Knowledge",
  subtitle: "सरकारी नौकरी और कार्यालय कार्य के लिए मूलभूत ज्ञान",
  chips: ["Beginner Friendly", "Computer Knowledge", "Exam + Office Use"] as const,
} as const;

export type ExcelChapterCard = {
  id: string;
  anchor: string;
  title: string;
  description: string;
  tags: string[];
};

export const EXCEL_CHAPTER_CARDS: ExcelChapterCard[] = [
  {
    id: "1",
    anchor: "chapter-1",
    title: "Spreadsheet क्या है?",
    description: "Workbook, Worksheet, Row, Column और Cell को सरल उदाहरण से समझें।",
    tags: ["Workbook", "Cell", "Basics"],
  },
  {
    id: "2",
    anchor: "chapter-2",
    title: "Excel Screen और Data Entry",
    description: "Ribbon, Formula Bar, Sheet Tabs, Save और AutoFill सीखें।",
    tags: ["Ribbon", "Data Entry", "Save"],
  },
  {
    id: "3",
    anchor: "chapter-3",
    title: "Formatting और Table बनाना",
    description: "Font, Border, Alignment, Wrap Text और सही Table layout सीखें।",
    tags: ["Formatting", "Table", "Wrap Text"],
  },
  {
    id: "4",
    anchor: "chapter-4",
    title: "Basic Formulas and Functions",
    description: "Formula, SUM, AVERAGE, IF, COUNTIF और SUMIF का मूल ज्ञान।",
    tags: ["Formula", "Function", "IF"],
  },
  {
    id: "5",
    anchor: "chapter-5",
    title: "Sort, Filter और Chart",
    description: "Data को क्रम में लगाना, छाँटना और Chart में दिखाना सीखें।",
    tags: ["Sort", "Filter", "Chart"],
  },
  {
    id: "6",
    anchor: "chapter-6",
    title: "Print, PDF और MCQ Practice",
    description: "Print Preview, Page Setup, PDF Export, Shortcuts और MCQ अभ्यास।",
    tags: ["Print", "PDF", "MCQ"],
  },
];

export type ExcelTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type ExcelChapterContent = {
  anchor: string;
  badge: string;
  title: string;
  intro: string;
  quickLearn: string[];
  body: { heading?: string; paragraphs?: string[]; list?: string[] }[];
  table?: ExcelTable;
  formulas?: string[];
  practice: string[];
  revision?: string[];
};

export const EXCEL_CHAPTERS: ExcelChapterContent[] = [
  {
    anchor: "chapter-1",
    badge: "अध्याय 1",
    title: "Spreadsheet क्या है?",
    intro:
      "Spreadsheet एक डिजिटल Register की तरह है। इसमें Row और Column के माध्यम से जानकारी व्यवस्थित रूप से लिखी जाती है। Excel, LibreOffice Calc और Google Sheets Spreadsheet Software के उदाहरण हैं।",
    quickLearn: [
      "Workbook = पूरी Excel File",
      "Worksheet = Workbook के अंदर की एक Sheet / Page",
      "Cell = Row और Column का मिलन बिन्दु",
      "Cell Address = A1, B2, C10 जैसा स्थान",
    ],
    body: [
      {
        heading: "Spreadsheet का सरल अर्थ",
        paragraphs: [
          "Spreadsheet का अर्थ है — पंक्ति (Row) और स्तम्भ (Column) वाला डिजिटल पत्र। पहले Office में Register रखा जाता था; अब वही कार्य Excel या Calc में तेजी से होता है।",
          "नौकरी परीक्षा और Office दोनों में Spreadsheet का मूलभूत ज्ञान पूछा जाता है।",
        ],
      },
      {
        heading: "मुख्य शब्द",
        list: [
          "Workbook — Excel की पूरी File; जैसे StudentRecord.xlsx",
          "Worksheet — Workbook के अंदर की एक Sheet; नीचे Sheet Tabs से बदलते हैं",
          "Row — क्षैतिज पंक्ति; 1, 2, 3…",
          "Column — ऊर्ध्वाधर स्तम्भ; A, B, C…",
          "Cell — Row और Column का intersection",
          "Cell Address — A1 = Column A, Row 1",
        ],
      },
      {
        heading: "File Formats",
        list: [
          ".xlsx — आधुनिक Excel Format",
          ".xls — पुराना Excel Format",
          ".ods — LibreOffice Calc Format",
          ".csv — Comma से अलग किया गया साधारण Text Data",
        ],
      },
      {
        heading: "उपयोग के उदाहरण",
        list: [
          "Marksheet / अंक सूची",
          "Attendance / उपस्थिति Register",
          "Expense / खर्च की सूची",
          "Typing Speed Record",
          "Job Application Tracker",
          "Bill / Invoice",
          "Salary Calculation",
          "Result Analysis",
        ],
      },
    ],
    table: {
      caption: "उदाहरण — छात्र Marksheet (Sample Data)",
      headers: ["Roll No.", "Name", "Hindi", "English", "Computer"],
      rows: [
        ["101", "राम", "72", "68", "85"],
        ["102", "सीता", "88", "91", "79"],
        ["103", "अमित", "65", "70", "74"],
      ],
    },
    practice: [
      "नया Workbook बनाएँ।",
      "Sheet 1 का नाम Marksheet रखें।",
      "Heading Row में Roll No., Name, Hindi, English, Computer लिखें।",
      "कम से कम 5 छात्रों का Sample Data भरें।",
      "File को StudentMarksheet.xlsx नाम से Save करें (Ctrl + S)।",
    ],
    revision: [
      "Workbook = File, Worksheet = Sheet",
      "Cell Address हमेशा Column + Row होता है — जैसे B2",
      "Spreadsheet = डिजिटल Register",
    ],
  },
  {
    anchor: "chapter-2",
    badge: "अध्याय 2",
    title: "Excel Screen और Data Entry",
    intro:
      "Excel Screen को समझने से Data Entry आसान हो जाती है। Title Bar, Ribbon, Formula Bar, Worksheet Area और Sheet Tabs — ये सभी मिलकर Excel का मुख्य Interface बनाते हैं।",
    quickLearn: [
      "Ribbon = Commands का मुख्य Toolbar",
      "Formula Bar = Cell में लिखा Formula या Text दिखाता है",
      "Name Box = चुने गए Cell का Address दिखाता है",
      "Ctrl + S = File Save",
    ],
    body: [
      {
        heading: "Screen के मुख्य भाग",
        list: [
          "Title Bar — File का नाम और Window controls",
          "Ribbon — Home, Insert, Page Layout जैसे Tabs और Commands",
          "Formula Bar — Cell Content देखने और Edit करने के लिए",
          "Name Box — Active Cell Address (जैसे C5)",
          "Worksheet Area — Row-Column वाला मुख्य कार्य क्षेत्र",
          "Sheet Tabs — Workbook की अलग-अलग Worksheets",
          "Status Bar — Sum, Average, Count जैसी जानकारी",
        ],
      },
      {
        heading: "Cell और Range चुनना",
        paragraphs: [
          "एक Cell चुनने के लिए उस पर click करें। Range चुनने के लिए Mouse drag करें — जैसे A1 से D1 तक।",
        ],
      },
      {
        heading: "Data के प्रकार",
        list: [
          "Text — Name, Address",
          "Number — Marks, Amount",
          "Date — 25/06/2026",
          "Time — 10:30 AM",
          "Formula — =SUM(B2:D2) जैसा Calculation",
        ],
      },
      {
        heading: "AutoFill और Row/Column",
        paragraphs: [
          "AutoFill — Cell के कोने पर छोटा Square (Fill Handle) drag करके Serial Number या Pattern भरें।",
          "Row Insert/Delete — Right-click → Insert / Delete",
          "Column Insert/Delete — Column Header पर Right-click",
        ],
      },
      {
        heading: "Save और Save As",
        paragraphs: [
          "Save — वही File नाम और स्थान पर अपडेट करता है। Save As — नया नाम या नया Folder चुनने के लिए।",
          "काम करते समय बार-बार Ctrl + S दबाएँ।",
        ],
      },
    ],
    table: {
      caption: "उदाहरण — Candidate List",
      headers: ["S.No.", "Name", "Mobile", "District", "Exam"],
      rows: [
        ["1", "राम कुमार", "9876543210", "Kanpur", "UP Police"],
        ["2", "सीता देवी", "9123456780", "Lucknow", "SSC CHSL"],
        ["3", "अमित यादव", "9988776655", "Prayagraj", "Railway"],
      ],
    },
    practice: [
      "Candidate List Table बनाएँ — S.No., Name, Mobile, District, Exam।",
      "S.No. Column में AutoFill से 1 से 10 तक Number भरें।",
      "Date Column में आज की Date लिखें।",
      "File Save करें — Ctrl + S।",
    ],
    revision: ["Formula Bar = Cell Content", "Sheet Tab = Worksheet बदलना", "Ctrl + S = Save"],
  },
  {
    anchor: "chapter-3",
    badge: "अध्याय 3",
    title: "Formatting और Table बनाना",
    intro:
      "Formatting से Sheet पढ़ने में आसान और Professional दिखती है। Font, Border, Alignment और Wrap Text — ये Office और Exam दोनों में उपयोगी हैं।",
    quickLearn: [
      "Bold / Italic / Underline — Text Formatting",
      "Alignment — Left, Center, Right",
      "Wrap Text — लम्बा Text Cell के अंदर दिखाएँ",
      "Merge Cells — केवल Heading के लिए; Table Data में अधिक उपयोग न करें",
    ],
    body: [
      {
        heading: "Font Formatting",
        list: [
          "Font Size बढ़ाना-घटाना",
          "Bold (Ctrl + B), Italic, Underline",
          "Font Color और Fill Color",
        ],
      },
      {
        heading: "Alignment और Border",
        list: [
          "Horizontal Alignment — Left, Center, Right",
          "Vertical Alignment — Top, Middle, Bottom",
          "Border — All Borders, Outside Border",
          "Column Width और Row Height Adjust करें",
        ],
      },
      {
        heading: "Wrap Text और Merge Cells",
        paragraphs: [
          "Wrap Text — लम्बा Text अगली Line में दिखाता है; Column Width बढ़ाने की आवश्यकता कम होती है।",
          "Merge Cells — Cells को मिलाकर बड़ा Heading बनाता है। सावधानी: Table के Data Rows में Merge न करें — Sort और Formula में समस्या हो सकती है।",
        ],
      },
      {
        heading: "Number और Date Formatting",
        list: [
          "Number — Decimal places नियंत्रित करें",
          "Currency — ₹ Symbol",
          "Date — DD/MM/YYYY Format",
          "Percentage — % Format",
        ],
      },
      {
        heading: "अच्छी Table के नियम",
        list: [
          "Heading Row Bold और Center रखें",
          "Border लगाएँ — Data अलग दिखे",
          "Column Width समान और पढ़ने योग्य रखें",
          "Empty Row/Column कम रखें",
          "Total Column अलग Highlight करें",
        ],
      },
    ],
    table: {
      caption: "Formatting के बाद Marksheet (Sample)",
      headers: ["Roll No.", "Name", "Hindi", "English", "Computer", "Total"],
      rows: [
        ["101", "राम", "72", "68", "85", "225"],
        ["102", "सीता", "88", "91", "79", "258"],
        ["103", "अमित", "65", "70", "74", "209"],
      ],
    },
    practice: [
      "Marksheet Table बनाएँ।",
      "Heading Row Bold + Center + Border लगाएँ।",
      "Total Column जोड़ें (अभी Manual Number भी चलेगा)।",
      "Column Width Adjust करें; Wrap Text जहाँ जरूरी हो लगाएँ।",
    ],
    revision: [
      "Merge Cells — केवल Heading",
      "Wrap Text — लम्बे Text के लिए",
      "Border — Table स्पष्ट दिखती है",
    ],
  },
  {
    anchor: "chapter-4",
    badge: "अध्याय 4",
    title: "Basic Formulas and Functions",
    intro:
      "Formula Excel की शक्ति है। हर Formula = से आरम्भ होता है। Cell Reference, SUM, AVERAGE, IF, COUNTIF और SUMIF — Exam में बार-बार पूछे जाते हैं।",
    quickLearn: [
      "Formula हमेशा = से आरम्भ",
      "Relative Reference — Copy करने पर बदलता है (B2 → B3)",
      "Absolute Reference — $A$1 जैसा; Copy पर स्थिर",
      "Function = तैयार Formula — जैसे SUM, AVERAGE",
    ],
    body: [
      {
        heading: "Operators",
        list: ["+ जोड़", "− घटाव", "* गुणा", "/ भाग"],
      },
      {
        heading: "मुख्य Functions",
        list: [
          "SUM — योग",
          "AVERAGE — औसत",
          "MIN — न्यूनतम",
          "MAX — अधिकतम",
          "COUNT — Number Cells गिनती",
          "COUNTA — खाली न हो ऐसी Cells गिनती",
          "IF — Condition के अनुसार Result",
          "COUNTIF — Condition वाली Cells गिनती",
          "SUMIF — Condition वाले Cells का योग",
        ],
      },
      {
        heading: "सामान्य Errors",
        list: [
          "#DIV/0! — शून्य से भाग",
          "#VALUE! — गलत Data Type",
          "#NAME? — Function का नाम गलत",
          "#REF! — Cell Reference हट गया",
          "##### — Column बहुत संकीर्ण",
        ],
      },
    ],
    formulas: [
      "=SUM(B2:D2)",
      "=AVERAGE(B2:D2)",
      '=IF(E2>=120,"Pass","Fail")',
      '=COUNTIF(C2:C20,"Pass")',
      '=SUMIF(A2:A10,"Kanpur",B2:B10)',
    ],
    table: {
      caption: "5 छात्र Marksheet — Formula अभ्यास",
      headers: ["Name", "Hindi", "English", "Computer", "Total", "Average", "Result"],
      rows: [
        ["राम", "72", "68", "85", "=SUM(B2:D2)", "=AVERAGE(B2:D2)", '=IF(E2>=120,"Pass","Fail")'],
        ["सीता", "88", "91", "79", "258", "86", "Pass"],
        ["अमित", "65", "70", "74", "209", "69.67", "Fail"],
        ["प्रिया", "90", "85", "92", "267", "89", "Pass"],
        ["विकास", "55", "60", "58", "173", "57.67", "Fail"],
      ],
    },
    practice: [
      "5 छात्रों की Marksheet बनाएँ।",
      "Total = SUM, Average = AVERAGE Formula लगाएँ।",
      "Highest = MAX, Lowest = MIN Formula से निकालें।",
      "Result Column में IF Formula — Pass/Fail (120 अंक मानदण्ड)।",
    ],
    revision: ["Formula = से आरम्भ", "SUM = योग, AVERAGE = औसत", "IF = Condition"],
  },
  {
    anchor: "chapter-5",
    badge: "अध्याय 5",
    title: "Sort, Filter और Chart",
    intro:
      "Sort Data को क्रम में लगाता है। Filter चुनी हुई जानकारी दिखाता है। Chart Data को चित्र के रूप में समझाता है — Presentation और Exam दोनों में उपयोगी।",
    quickLearn: [
      "Sort A→Z या छोटे→बड़े क्रम में",
      "Filter — केवल चुना Data दिखाएँ",
      "Find (Ctrl + F) और Replace (Ctrl + H)",
      "Column Chart — तुलना के लिए सर्वोत्तम",
    ],
    body: [
      {
        heading: "Sort के प्रकार",
        list: [
          "Text Sort — A to Z / Z to A",
          "Number Sort — Smallest to Largest",
          "Date Sort — पुराना से नया या नया से पुराना",
        ],
      },
      {
        heading: "Filter और Find",
        paragraphs: [
          "Filter — Heading Row पर AutoFilter लगाकर Condition चुनें। Duplicate Values Highlight करके Duplicate हटा सकते हैं।",
          "Find and Replace — Ctrl + F (Find), Ctrl + H (Replace)।",
        ],
      },
      {
        heading: "Chart के प्रकार",
        list: [
          "Column Chart — Category की तुलना",
          "Bar Chart — लम्बी Category Names के लिए",
          "Line Chart — समय के साथ बदलाव",
          "Pie Chart — Whole का हिस्सा (Percentage)",
        ],
      },
      {
        heading: "अच्छे Chart के नियम",
        list: [
          "Title स्पष्ट रखें",
          "Axis Labels जोड़ें",
          "अत्यधिक Colors न लगाएँ",
          "गलत Chart Type न चुनें",
        ],
      },
    ],
    table: {
      caption: "District-wise Students (Chart के लिए)",
      headers: ["District", "Students"],
      rows: [
        ["Kanpur", "45"],
        ["Lucknow", "62"],
        ["Prayagraj", "38"],
        ["Varanasi", "51"],
      ],
    },
    practice: [
      "District-wise Students Table बनाएँ।",
      "Students Column पर Number Sort करें।",
      "Filter से एक District चुनकर देखें।",
      "Column Chart Insert करें — District vs Students।",
    ],
    revision: ["Sort = क्रम", "Filter = छँटाई", "Chart = दृश्य प्रस्तुति"],
  },
  {
    anchor: "chapter-6",
    badge: "अध्याय 6",
    title: "Print, PDF और MCQ Practice",
    intro:
      "Print Preview से Print से पहले Page देखें। Page Setup, Margins और Print Area — Professional Output के लिए आवश्यक हैं। PDF Export से File साझा करना आसान होता है।",
    quickLearn: [
      "Ctrl + P = Print",
      "Print Preview — Print से पहले Layout देखें",
      "Portrait = ऊर्ध्वाधर, Landscape = क्षैतिज",
      "Print Area — केवल चुना हिस्सा Print हो",
    ],
    body: [
      {
        heading: "Print Settings",
        list: [
          "Print Preview — Final Look देखें",
          "Portrait / Landscape Orientation",
          "Paper Size — A4, Legal, Letter",
          "Margins — Top, Bottom, Left, Right",
          "Print Area — Selected Range Set करें",
          "Fit to One Page — छोटा Data एक Page पर",
          "Header / Footer — Page Number, Date",
          "Gridlines Print — Table Lines Print में दिखें",
        ],
      },
      {
        heading: "PDF Export",
        paragraphs: [
          "File → Save As → PDF या Print → PDF Printer से PDF बनाएँ। PDF Mobile और Email पर भेजने में सुविधाजनक है।",
        ],
      },
      {
        heading: "Print-ready Sheet के नियम",
        list: [
          "Heading Row Repeat करें (यदि Option उपलब्ध हो)",
          "अनावश्यक Columns Hide करें",
          "Page Break Preview देखें",
          "Margin और Scale Adjust करें",
        ],
      },
    ],
    practice: [
      "Marksheet पर Print Preview देखें।",
      "Portrait और Landscape दोनों Compare करें।",
      "Print Area Set करके PDF Export करें।",
      "नीचे MCQ अभ्यास करें।",
    ],
    revision: ["Ctrl + P = Print", "Print Area = चुना क्षेत्र", "PDF = Share करने योग्य Format"],
  },
];

export const EXCEL_SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "Ctrl + S", action: "Save" },
  { keys: "Ctrl + C", action: "Copy" },
  { keys: "Ctrl + V", action: "Paste" },
  { keys: "Ctrl + X", action: "Cut" },
  { keys: "Ctrl + Z", action: "Undo" },
  { keys: "Ctrl + Y", action: "Redo" },
  { keys: "Ctrl + F", action: "Find" },
  { keys: "Ctrl + H", action: "Replace" },
  { keys: "Ctrl + P", action: "Print" },
  { keys: "Ctrl + A", action: "Select All" },
  { keys: "Ctrl + B", action: "Bold" },
  { keys: "F2", action: "Edit Cell" },
  { keys: "Alt + Enter", action: "New Line inside Cell" },
];

export const EXCEL_MCQS: { question: string; answer: string }[] = [
  { question: "Excel file को क्या कहते हैं?", answer: "Workbook" },
  { question: "Workbook के अंदर की pages को क्या कहते हैं?", answer: "Worksheets" },
  { question: "Row और Column के मिलन बिन्दु को क्या कहते हैं?", answer: "Cell" },
  { question: "Formula किस अक्षर से आरम्भ होता है?", answer: "=" },
  { question: "A1 क्या है?", answer: "Cell Address" },
  { question: "SUM Function क्या करता है?", answer: "Numbers को जोड़ता है" },
  { question: "AVERAGE Function क्या करता है?", answer: "औसत निकालता है" },
  { question: "Sort का काम क्या है?", answer: "Data को क्रम में लगाना" },
  { question: "Filter का काम क्या है?", answer: "चुना हुआ Data दिखाना" },
  { question: "Chart का उपयोग क्यों होता है?", answer: "Data को दृश्य रूप में दिखाने के लिए" },
  { question: "Ctrl + P किसके लिए है?", answer: "Print" },
  { question: "Ctrl + B किसके लिए है?", answer: "Bold" },
  { question: "25/06/2026 किस Format का उदाहरण है?", answer: "Date Format" },
  { question: ".xlsx क्या है?", answer: "आधुनिक Excel File Extension" },
  { question: "LibreOffice Spreadsheet Software का नाम क्या है?", answer: "Calc" },
];

export const EXCEL_FINAL_PROJECT = {
  title: "Final Practice Project — Student Result Sheet",
  description:
    "S.No., Roll No., Name, Hindi, English, Computer, Total, Average, Result — पूर्ण Project।",
  steps: [
    "Table बनाएँ — S.No., Roll No., Name, Hindi, English, Computer, Total, Average, Result",
    "Total = SUM Formula",
    "Average = AVERAGE Formula",
    "Result = IF Formula (Pass/Fail)",
    "Border और Bold Heading लगाएँ",
    "Name Column पर Sort करें",
    "Result = Pass पर Filter लगाएँ",
    "District या Subject पर Column Chart बनाएँ",
    "Print Preview देखकर PDF Export करें",
  ],
};

export const EXCEL_NEXT_PRACTICE = [
  { label: "Excel MCQ Practice", anchor: "chapter-6" },
  { label: "Formula Practice", anchor: "chapter-4" },
  { label: "Student Result Sheet Project", anchor: "chapter-6" },
] as const;
