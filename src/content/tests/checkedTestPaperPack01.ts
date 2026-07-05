import type { TestPaperPack } from "@/lib/tests/testTypes";

/** Checked pack 01 — 14 papers, 140 questions. Source: TAIPOQ_CHECKED_TEST_PAPER_PACK_01.json */
export const CHECKED_TEST_PAPER_PACK_01: TestPaperPack = {
  "prepared": "2026-06-28",
  "papers": [
    {
      "file": "01_COMPUTER_TEST_PAPER.md",
      "title": "Computer Basic Test Paper 01",
      "subject": "Computer",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Unlimited free basic computer practice for TAIPOQ.",
      "questions": [
        {
          "id": "COMP-BASIC-001",
          "subject": "Computer",
          "chapter": "Computer Basics",
          "level": "basic",
          "language": "bilingual",
          "question": "CPU का full form क्या है?",
          "options": [
            "Central Process Unit",
            "Central Processing Unit",
            "Computer Processing Utility",
            "Control Processing Unit"
          ],
          "answerIndex": 1,
          "answer": "Central Processing Unit",
          "explanation": "CPU का अर्थ Central Processing Unit है। यह computer instructions process करता है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-002",
          "subject": "Computer",
          "chapter": "Memory",
          "level": "basic",
          "language": "bilingual",
          "question": "कौन-सी memory volatile होती है?",
          "options": [
            "ROM",
            "RAM",
            "Hard Disk",
            "DVD"
          ],
          "answerIndex": 1,
          "answer": "RAM",
          "explanation": "RAM में रखा data power बंद होने पर मिट जाता है, इसलिए यह volatile memory है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-003",
          "subject": "Computer",
          "chapter": "Input Devices",
          "level": "basic",
          "language": "bilingual",
          "question": "इनमें से input device कौन-सा है?",
          "options": [
            "Monitor",
            "Printer",
            "Keyboard",
            "Speaker"
          ],
          "answerIndex": 2,
          "answer": "Keyboard",
          "explanation": "Keyboard से data और commands computer में डाली जाती हैं।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-004",
          "subject": "Computer",
          "chapter": "Output Devices",
          "level": "basic",
          "language": "bilingual",
          "question": "इनमें से output device कौन-सा है?",
          "options": [
            "Mouse",
            "Scanner",
            "Printer",
            "Microphone"
          ],
          "answerIndex": 2,
          "answer": "Printer",
          "explanation": "Printer computer output को paper पर print करता है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-005",
          "subject": "Computer",
          "chapter": "Operating System",
          "level": "basic",
          "language": "bilingual",
          "question": "Operating system का मुख्य कार्य क्या है?",
          "options": [
            "Only games चलाना",
            "Hardware और software resources manage करना",
            "Only typing कराना",
            "Internet speed बढ़ाना"
          ],
          "answerIndex": 1,
          "answer": "Hardware और software resources manage करना",
          "explanation": "Operating system computer resources, files, memory और user interaction manage करता है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-006",
          "subject": "Computer",
          "chapter": "Internet",
          "level": "basic",
          "language": "bilingual",
          "question": "URL का संबंध किससे है?",
          "options": [
            "Web address",
            "Printer speed",
            "RAM size",
            "Keyboard layout"
          ],
          "answerIndex": 0,
          "answer": "Web address",
          "explanation": "URL किसी web page या internet resource का address होता है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-007",
          "subject": "Computer",
          "chapter": "File Types",
          "level": "basic",
          "language": "bilingual",
          "question": "PDF का common use क्या है?",
          "options": [
            "Editable spreadsheet",
            "Portable document sharing",
            "Image editing only",
            "Virus scanning only"
          ],
          "answerIndex": 1,
          "answer": "Portable document sharing",
          "explanation": "PDF documents को fixed layout में share करने के लिए commonly use होता है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-008",
          "subject": "Computer",
          "chapter": "Cyber Safety",
          "level": "basic",
          "language": "bilingual",
          "question": "Strong password में सबसे अच्छा क्या होना चाहिए?",
          "options": [
            "केवल नाम",
            "केवल जन्म वर्ष",
            "Letters, numbers और symbols का mix",
            "केवल 123456"
          ],
          "answerIndex": 2,
          "answer": "Letters, numbers और symbols का mix",
          "explanation": "Strong password में अनुमान लगाना कठिन बनाने के लिए mixed characters होने चाहिए।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-009",
          "subject": "Computer",
          "chapter": "Email",
          "level": "basic",
          "language": "bilingual",
          "question": "Email में CC का मतलब क्या होता है?",
          "options": [
            "Carbon Copy",
            "Computer Code",
            "Control Command",
            "Current Copy"
          ],
          "answerIndex": 0,
          "answer": "Carbon Copy",
          "explanation": "CC यानी Carbon Copy; इससे दूसरे recipient को email की copy भेजी जाती है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "COMP-BASIC-010",
          "subject": "Computer",
          "chapter": "Storage",
          "level": "basic",
          "language": "bilingual",
          "question": "Hard disk किस प्रकार की storage है?",
          "options": [
            "Temporary volatile storage",
            "Permanent/secondary storage",
            "Input-only device",
            "Output-only device"
          ],
          "answerIndex": 1,
          "answer": "Permanent/secondary storage",
          "explanation": "Hard disk secondary storage है, जिसमें data power off होने के बाद भी रहता है।",
          "sourceCheck": "Checked against standard computer fundamentals / ICT basics.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "computer-test-paper"
    },
    {
      "file": "02_MS_WORD_TEST_PAPER.md",
      "title": "MS Word Basic Test Paper 01",
      "subject": "MS Word",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Unlimited free MS Word practice for office/computer exams.",
      "questions": [
        {
          "id": "WORD-BASIC-001",
          "subject": "MS Word",
          "chapter": "Shortcuts",
          "level": "basic",
          "language": "bilingual",
          "question": "MS Word में selected text को bold करने का shortcut क्या है?",
          "options": [
            "Ctrl + B",
            "Ctrl + I",
            "Ctrl + U",
            "Ctrl + P"
          ],
          "answerIndex": 0,
          "answer": "Ctrl + B",
          "explanation": "Ctrl + B selected text को bold करता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-002",
          "subject": "MS Word",
          "chapter": "Shortcuts",
          "level": "basic",
          "language": "bilingual",
          "question": "Document save करने का common shortcut क्या है?",
          "options": [
            "Ctrl + S",
            "Ctrl + N",
            "Ctrl + O",
            "Ctrl + F"
          ],
          "answerIndex": 0,
          "answer": "Ctrl + S",
          "explanation": "Ctrl + S document save करने के लिए standard shortcut है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-003",
          "subject": "MS Word",
          "chapter": "File Type",
          "level": "basic",
          "language": "bilingual",
          "question": "Modern MS Word document की common file extension क्या है?",
          "options": [
            ".xlsx",
            ".pptx",
            ".docx",
            ".txtx"
          ],
          "answerIndex": 2,
          "answer": ".docx",
          "explanation": ".docx modern Word document format है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-004",
          "subject": "MS Word",
          "chapter": "Editing",
          "level": "basic",
          "language": "bilingual",
          "question": "Undo का shortcut क्या है?",
          "options": [
            "Ctrl + Z",
            "Ctrl + Y",
            "Ctrl + A",
            "Ctrl + H"
          ],
          "answerIndex": 0,
          "answer": "Ctrl + Z",
          "explanation": "Ctrl + Z पिछला action undo करता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-005",
          "subject": "MS Word",
          "chapter": "Layout",
          "level": "basic",
          "language": "bilingual",
          "question": "Header document में कहाँ दिखाई देता है?",
          "options": [
            "Page के ऊपर",
            "Page के नीचे",
            "Only margin के बाहर",
            "Only print preview में"
          ],
          "answerIndex": 0,
          "answer": "Page के ऊपर",
          "explanation": "Header सामान्यतः page के top area में होता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-006",
          "subject": "MS Word",
          "chapter": "Layout",
          "level": "basic",
          "language": "bilingual",
          "question": "Footer document में कहाँ दिखाई देता है?",
          "options": [
            "Page के ऊपर",
            "Page के नीचे",
            "Only first line में",
            "Only table में"
          ],
          "answerIndex": 1,
          "answer": "Page के नीचे",
          "explanation": "Footer सामान्यतः page के bottom area में होता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-007",
          "subject": "MS Word",
          "chapter": "Find",
          "level": "basic",
          "language": "bilingual",
          "question": "Text find करने का shortcut क्या है?",
          "options": [
            "Ctrl + F",
            "Ctrl + P",
            "Ctrl + E",
            "Ctrl + D"
          ],
          "answerIndex": 0,
          "answer": "Ctrl + F",
          "explanation": "Ctrl + F Find panel खोलता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-008",
          "subject": "MS Word",
          "chapter": "Page Setup",
          "level": "basic",
          "language": "bilingual",
          "question": "Manual page break insert करने का common shortcut क्या है?",
          "options": [
            "Ctrl + Enter",
            "Ctrl + Shift",
            "Alt + Enter",
            "Shift + Space"
          ],
          "answerIndex": 0,
          "answer": "Ctrl + Enter",
          "explanation": "Ctrl + Enter manual page break insert करता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-009",
          "subject": "MS Word",
          "chapter": "Review",
          "level": "basic",
          "language": "bilingual",
          "question": "Red wavy underline सामान्यतः किसके लिए संकेत देता है?",
          "options": [
            "Spelling issue",
            "Page break",
            "Table border",
            "Print completed"
          ],
          "answerIndex": 0,
          "answer": "Spelling issue",
          "explanation": "Word में red wavy underline spelling-related issue दिखा सकता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "WORD-BASIC-010",
          "subject": "MS Word",
          "chapter": "Mail Merge",
          "level": "basic",
          "language": "bilingual",
          "question": "Mail Merge का उपयोग किसके लिए होता है?",
          "options": [
            "एक जैसे document में अलग-अलग नाम/पता डालना",
            "Only image crop करना",
            "Only password बनाना",
            "Only page color बदलना"
          ],
          "answerIndex": 0,
          "answer": "एक जैसे document में अलग-अलग नाम/पता डालना",
          "explanation": "Mail Merge से एक template से कई personalized documents बनाए जा सकते हैं।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "ms-word-test-paper"
    },
    {
      "file": "03_EXCEL_TEST_PAPER.md",
      "title": "Excel Basic Test Paper 01",
      "subject": "Excel",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Unlimited free Excel practice with formula and office-task focus.",
      "questions": [
        {
          "id": "EXCEL-BASIC-001",
          "subject": "Excel",
          "chapter": "Basics",
          "level": "basic",
          "language": "bilingual",
          "question": "Excel में row और column के intersection को क्या कहते हैं?",
          "options": [
            "Cell",
            "Slide",
            "Page",
            "Frame"
          ],
          "answerIndex": 0,
          "answer": "Cell",
          "explanation": "Excel में row और column के मिलने की जगह cell कहलाती है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-002",
          "subject": "Excel",
          "chapter": "Formulas",
          "level": "basic",
          "language": "bilingual",
          "question": "Excel formula सामान्यतः किस sign से आरम्भ होता है?",
          "options": [
            "#",
            "=",
            "@",
            "$"
          ],
          "answerIndex": 1,
          "answer": "=",
          "explanation": "Excel formulas generally equal sign (=) से आरम्भ होते हैं।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-003",
          "subject": "Excel",
          "chapter": "Functions",
          "level": "basic",
          "language": "bilingual",
          "question": "=SUM(2,3,5) का result क्या होगा?",
          "options": [
            "8",
            "10",
            "15",
            "235"
          ],
          "answerIndex": 1,
          "answer": "10",
          "explanation": "SUM function 2 + 3 + 5 = 10 करता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-004",
          "subject": "Excel",
          "chapter": "Functions",
          "level": "basic",
          "language": "bilingual",
          "question": "=AVERAGE(10,20,30) का result क्या होगा?",
          "options": [
            "20",
            "30",
            "60",
            "10"
          ],
          "answerIndex": 0,
          "answer": "20",
          "explanation": "Average = (10+20+30)/3 = 20 है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-005",
          "subject": "Excel",
          "chapter": "Functions",
          "level": "basic",
          "language": "bilingual",
          "question": "COUNT function किसे count करता है?",
          "options": [
            "Only text values",
            "Only blank cells",
            "Numeric values",
            "Only images"
          ],
          "answerIndex": 2,
          "answer": "Numeric values",
          "explanation": "COUNT function numeric entries को count करता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-006",
          "subject": "Excel",
          "chapter": "Shortcuts",
          "level": "basic",
          "language": "bilingual",
          "question": "Excel में AutoSum का shortcut क्या है?",
          "options": [
            "Alt + =",
            "Ctrl + B",
            "Ctrl + F",
            "Shift + Tab"
          ],
          "answerIndex": 0,
          "answer": "Alt + =",
          "explanation": "Microsoft Support के अनुसार AutoSum के लिए Alt + = shortcut use होता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-007",
          "subject": "Excel",
          "chapter": "Worksheet",
          "level": "basic",
          "language": "bilingual",
          "question": "Excel workbook में कई क्या हो सकते हैं?",
          "options": [
            "Worksheets",
            "Printers",
            "Keyboards",
            "CPUs"
          ],
          "answerIndex": 0,
          "answer": "Worksheets",
          "explanation": "एक workbook में multiple worksheets हो सकती हैं।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-008",
          "subject": "Excel",
          "chapter": "Sorting",
          "level": "basic",
          "language": "bilingual",
          "question": "Sorting का उपयोग किसके लिए होता है?",
          "options": [
            "Data को order में व्यवस्थित करने के लिए",
            "Formula delete करने के लिए",
            "Screen बंद करने के लिए",
            "Mouse speed बढ़ाने के लिए"
          ],
          "answerIndex": 0,
          "answer": "Data को order में व्यवस्थित करने के लिए",
          "explanation": "Sorting data को A-Z, Z-A या numeric order में arrange करती है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-009",
          "subject": "Excel",
          "chapter": "Addressing",
          "level": "basic",
          "language": "bilingual",
          "question": "A1 किसे दर्शाता है?",
          "options": [
            "Column A और Row 1 का cell",
            "Row A और Column 1 का page",
            "Only sheet name",
            "Only file name"
          ],
          "answerIndex": 0,
          "answer": "Column A और Row 1 का cell",
          "explanation": "A1 address में A column और 1 row का cell होता है।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "EXCEL-BASIC-010",
          "subject": "Excel",
          "chapter": "Charts",
          "level": "basic",
          "language": "bilingual",
          "question": "Chart का मुख्य उपयोग क्या है?",
          "options": [
            "Data को visual रूप में दिखाना",
            "File को virus-free करना",
            "Keyboard बदलना",
            "Email भेजना"
          ],
          "answerIndex": 0,
          "answer": "Data को visual रूप में दिखाना",
          "explanation": "Charts data को graphically समझने में मदद करते हैं।",
          "sourceCheck": "Checked against Microsoft Support concepts/shortcuts/functions.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "excel-test-paper"
    },
    {
      "file": "04_TYPING_SKILL_TEST_PAPER.md",
      "title": "Typing Skill Basic Test Paper 01",
      "subject": "Typing Skill",
      "level": "basic",
      "access": "free",
      "durationMinutes": 10,
      "questionCount": 10,
      "intro": "Typing knowledge paper to connect quiz and typing practice.",
      "questions": [
        {
          "id": "TYPE-BASIC-001",
          "subject": "Typing Skill",
          "chapter": "Home Row",
          "level": "basic",
          "language": "bilingual",
          "question": "English touch typing में left hand की home row keys कौन-सी हैं?",
          "options": [
            "A S D F",
            "J K L ;",
            "Q W E R",
            "Z X C V"
          ],
          "answerIndex": 0,
          "answer": "A S D F",
          "explanation": "Standard QWERTY touch typing में left hand home keys A S D F मानी जाती हैं।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-002",
          "subject": "Typing Skill",
          "chapter": "Home Row",
          "level": "basic",
          "language": "bilingual",
          "question": "English touch typing में right hand की home row keys कौन-सी हैं?",
          "options": [
            "A S D F",
            "J K L ;",
            "Q W E R",
            "Z X C V"
          ],
          "answerIndex": 1,
          "answer": "J K L ;",
          "explanation": "Standard QWERTY touch typing में right hand home keys J K L ; होती हैं।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-003",
          "subject": "Typing Skill",
          "chapter": "Speed",
          "level": "basic",
          "language": "bilingual",
          "question": "WPM का अर्थ क्या है?",
          "options": [
            "Words Per Minute",
            "Words Per Month",
            "Write Page Method",
            "Word Print Mode"
          ],
          "answerIndex": 0,
          "answer": "Words Per Minute",
          "explanation": "Typing speed अक्सर Words Per Minute में मापी जाती है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-004",
          "subject": "Typing Skill",
          "chapter": "Accuracy",
          "level": "basic",
          "language": "bilingual",
          "question": "Typing accuracy किससे जुड़ी होती है?",
          "options": [
            "सही typed characters/words से",
            "Monitor size से",
            "Keyboard color से",
            "Mouse speed से"
          ],
          "answerIndex": 0,
          "answer": "सही typed characters/words से",
          "explanation": "Accuracy का अर्थ है typed content में कितनी entries सही हैं।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-005",
          "subject": "Typing Skill",
          "chapter": "Keys",
          "level": "basic",
          "language": "bilingual",
          "question": "Backspace key क्या करती है?",
          "options": [
            "Cursor के बाएँ character को हटाती है",
            "New page खोलती है",
            "Text bold करती है",
            "File save करती है"
          ],
          "answerIndex": 0,
          "answer": "Cursor के बाएँ character को हटाती है",
          "explanation": "Backspace सामान्यतः cursor के left side का character delete करती है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-006",
          "subject": "Typing Skill",
          "chapter": "Keys",
          "level": "basic",
          "language": "bilingual",
          "question": "Spacebar को सामान्यतः किससे press किया जाता है?",
          "options": [
            "Thumb",
            "Index finger only",
            "Little finger only",
            "Palm"
          ],
          "answerIndex": 0,
          "answer": "Thumb",
          "explanation": "Touch typing में spacebar को अंगूठे से press करना सामान्य practice है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-007",
          "subject": "Typing Skill",
          "chapter": "Technique",
          "level": "basic",
          "language": "bilingual",
          "question": "Touch typing का सही अर्थ क्या है?",
          "options": [
            "Keyboard देखे बिना typing करना",
            "Only one finger से typing करना",
            "Only capital letters लिखना",
            "Mouse से typing करना"
          ],
          "answerIndex": 0,
          "answer": "Keyboard देखे बिना typing करना",
          "explanation": "Touch typing में fingers की fixed position से keyboard देखे बिना typing की जाती है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-008",
          "subject": "Typing Skill",
          "chapter": "Keys",
          "level": "basic",
          "language": "bilingual",
          "question": "Capital letter type करने के लिए किस key का उपयोग किया जाता है?",
          "options": [
            "Shift",
            "Tab",
            "Esc",
            "Alt only"
          ],
          "answerIndex": 0,
          "answer": "Shift",
          "explanation": "Shift key के साथ letter दबाने पर capital letter आता है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-009",
          "subject": "Typing Skill",
          "chapter": "Posture",
          "level": "basic",
          "language": "bilingual",
          "question": "Typing practice में सही बैठने की स्थिति क्यों आवश्यक है?",
          "options": [
            "Speed और comfort के लिए",
            "Screen color बदलने के लिए",
            "Internet चलाने के लिए",
            "Printer connect करने के लिए"
          ],
          "answerIndex": 0,
          "answer": "Speed और comfort के लिए",
          "explanation": "सही posture लंबे अभ्यास में speed, comfort और accuracy में मदद करता है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "TYPE-BASIC-010",
          "subject": "Typing Skill",
          "chapter": "Hindi Typing",
          "level": "basic",
          "language": "bilingual",
          "question": "KrutiDev typing किससे जुड़ी है?",
          "options": [
            "Hindi typing font/layout practice",
            "Excel formula",
            "Printer driver",
            "Email server"
          ],
          "answerIndex": 0,
          "answer": "Hindi typing font/layout practice",
          "explanation": "KrutiDev Hindi typing practice में व्यापक रूप से प्रयोग किया जाता है।",
          "sourceCheck": "Checked against standard keyboard/typing practice knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "typing-skill-test-paper"
    },
    {
      "file": "05_REASONING_TEST_PAPER.md",
      "title": "Reasoning Basic Test Paper 01",
      "subject": "Reasoning",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Original basic reasoning questions for all competitive exams.",
      "questions": [
        {
          "id": "REAS-BASIC-001",
          "subject": "Reasoning",
          "chapter": "Analogy",
          "level": "basic",
          "language": "en",
          "question": "Book : Reading :: Pen : ?",
          "options": [
            "Writing",
            "Cooking",
            "Singing",
            "Driving"
          ],
          "answerIndex": 0,
          "answer": "Writing",
          "explanation": "Book का संबंध reading से है; Pen का संबंध writing से है।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-002",
          "subject": "Reasoning",
          "chapter": "Series",
          "level": "basic",
          "language": "bilingual",
          "question": "2, 4, 8, 16, ? में अगली संख्या क्या होगी?",
          "options": [
            "18",
            "24",
            "32",
            "64"
          ],
          "answerIndex": 2,
          "answer": "32",
          "explanation": "हर संख्या previous number का double है। 16 × 2 = 32।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-003",
          "subject": "Reasoning",
          "chapter": "Odd One Out",
          "level": "basic",
          "language": "bilingual",
          "question": "Odd one चुनिए:",
          "options": [
            "Apple",
            "Mango",
            "Potato",
            "Banana"
          ],
          "answerIndex": 2,
          "answer": "Potato",
          "explanation": "Apple, Mango, Banana fruits हैं; Potato vegetable है।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-004",
          "subject": "Reasoning",
          "chapter": "Coding-Decoding",
          "level": "basic",
          "language": "en",
          "question": "यदि CAT को DBU लिखा जाए, तो DOG को क्या लिखा जाएगा?",
          "options": [
            "EPH",
            "CNE",
            "EOH",
            "DPH"
          ],
          "answerIndex": 0,
          "answer": "EPH",
          "explanation": "हर letter को अगले alphabet से बदला गया है: D→E, O→P, G→H।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-005",
          "subject": "Reasoning",
          "chapter": "Direction",
          "level": "basic",
          "language": "bilingual",
          "question": "A उत्तर की ओर 5 km चलता है, फिर दाएँ मुड़ता है। अब वह किस दिशा में चल रहा है?",
          "options": [
            "East",
            "West",
            "South",
            "North"
          ],
          "answerIndex": 0,
          "answer": "East",
          "explanation": "North की ओर चलते समय right turn East होता है।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-006",
          "subject": "Reasoning",
          "chapter": "Blood Relation",
          "level": "basic",
          "language": "bilingual",
          "question": "मेरी माता की बेटी मेरी क्या होगी?",
          "options": [
            "Brother",
            "Sister",
            "Father",
            "Uncle"
          ],
          "answerIndex": 1,
          "answer": "Sister",
          "explanation": "माता की बेटी सामान्यतः मेरी sister होगी।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-007",
          "subject": "Reasoning",
          "chapter": "Ranking",
          "level": "basic",
          "language": "bilingual",
          "question": "एक पंक्ति में राम ऊपर से 5वें और नीचे से 6वें स्थान पर है। कुल कितने विद्यार्थी हैं?",
          "options": [
            "10",
            "11",
            "12",
            "9"
          ],
          "answerIndex": 0,
          "answer": "10",
          "explanation": "Total = 5 + 6 - 1 = 10।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-008",
          "subject": "Reasoning",
          "chapter": "Series",
          "level": "basic",
          "language": "en",
          "question": "A, C, E, G, ? में अगला letter कौन-सा है?",
          "options": [
            "H",
            "I",
            "J",
            "K"
          ],
          "answerIndex": 1,
          "answer": "I",
          "explanation": "Series में एक-एक letter छोड़कर आगे बढ़ रहे हैं: A, C, E, G, I।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-009",
          "subject": "Reasoning",
          "chapter": "Classification",
          "level": "basic",
          "language": "bilingual",
          "question": "इनमें से odd pair कौन-सा है?",
          "options": [
            "Doctor-Hospital",
            "Teacher-School",
            "Farmer-Field",
            "Driver-Needle"
          ],
          "answerIndex": 3,
          "answer": "Driver-Needle",
          "explanation": "पहले तीन pairs profession और workplace/tool से logically जुड़े हैं; Driver-Needle असंगत है।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "REAS-BASIC-010",
          "subject": "Reasoning",
          "chapter": "Venn Diagram",
          "level": "basic",
          "language": "bilingual",
          "question": "All roses are flowers. Some flowers are red. इससे निश्चित रूप से क्या कहा जा सकता है?",
          "options": [
            "All roses are red",
            "Some roses are red",
            "All roses are flowers",
            "No flower is rose"
          ],
          "answerIndex": 2,
          "answer": "All roses are flowers",
          "explanation": "पहला statement सीधे कहता है कि सभी roses flowers हैं। Red संबंध roses पर निश्चित नहीं है।",
          "sourceCheck": "TAIPOQ original reasoning item; answer verified by direct logical check.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "reasoning-test-paper"
    },
    {
      "file": "06_MATHS_TEST_PAPER.md",
      "title": "Maths Basic Test Paper 01",
      "subject": "Maths",
      "level": "basic",
      "access": "free",
      "durationMinutes": 15,
      "questionCount": 10,
      "intro": "Original basic quantitative aptitude questions.",
      "questions": [
        {
          "id": "MATH-BASIC-001",
          "subject": "Maths",
          "chapter": "Percentage",
          "level": "basic",
          "language": "bilingual",
          "question": "200 का 10% कितना है?",
          "options": [
            "10",
            "20",
            "30",
            "40"
          ],
          "answerIndex": 1,
          "answer": "20",
          "explanation": "10% of 200 = 200 × 10/100 = 20।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-002",
          "subject": "Maths",
          "chapter": "Average",
          "level": "basic",
          "language": "bilingual",
          "question": "10, 20 और 30 का average क्या है?",
          "options": [
            "10",
            "20",
            "30",
            "60"
          ],
          "answerIndex": 1,
          "answer": "20",
          "explanation": "Average = (10+20+30)/3 = 20।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-003",
          "subject": "Maths",
          "chapter": "Ratio",
          "level": "basic",
          "language": "bilingual",
          "question": "2:3 ratio में total 50 है। पहला हिस्सा कितना होगा?",
          "options": [
            "20",
            "25",
            "30",
            "35"
          ],
          "answerIndex": 0,
          "answer": "20",
          "explanation": "Total parts = 5. First share = 2/5 × 50 = 20।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-004",
          "subject": "Maths",
          "chapter": "Profit and Loss",
          "level": "basic",
          "language": "bilingual",
          "question": "₹100 की वस्तु ₹120 में बेची गई। profit कितना है?",
          "options": [
            "₹10",
            "₹20",
            "₹30",
            "₹40"
          ],
          "answerIndex": 1,
          "answer": "₹20",
          "explanation": "Profit = Selling Price - Cost Price = 120 - 100 = ₹20।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-005",
          "subject": "Maths",
          "chapter": "Simple Interest",
          "level": "basic",
          "language": "bilingual",
          "question": "₹1000 पर 10% वार्षिक दर से 1 वर्ष का simple interest कितना है?",
          "options": [
            "₹10",
            "₹50",
            "₹100",
            "₹1000"
          ],
          "answerIndex": 2,
          "answer": "₹100",
          "explanation": "SI = PRT/100 = 1000×10×1/100 = ₹100।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-006",
          "subject": "Maths",
          "chapter": "Time and Work",
          "level": "basic",
          "language": "bilingual",
          "question": "A कोई कार्य 10 दिन में करता है। 1 दिन में वह कितना कार्य करेगा?",
          "options": [
            "1/5",
            "1/10",
            "1/20",
            "10"
          ],
          "answerIndex": 1,
          "answer": "1/10",
          "explanation": "यदि पूरा काम 10 दिन में होता है, तो 1 दिन का काम 1/10 होगा।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-007",
          "subject": "Maths",
          "chapter": "Speed",
          "level": "basic",
          "language": "bilingual",
          "question": "Speed 60 km/h है। 2 घंटे में दूरी कितनी होगी?",
          "options": [
            "30 km",
            "60 km",
            "90 km",
            "120 km"
          ],
          "answerIndex": 3,
          "answer": "120 km",
          "explanation": "Distance = Speed × Time = 60 × 2 = 120 km।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-008",
          "subject": "Maths",
          "chapter": "Number System",
          "level": "basic",
          "language": "bilingual",
          "question": "सबसे छोटी prime number कौन-सी है?",
          "options": [
            "0",
            "1",
            "2",
            "3"
          ],
          "answerIndex": 2,
          "answer": "2",
          "explanation": "2 सबसे छोटी prime number है और यह even prime भी है।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-009",
          "subject": "Maths",
          "chapter": "Simplification",
          "level": "basic",
          "language": "bilingual",
          "question": "5 + 3 × 2 = ?",
          "options": [
            "16",
            "11",
            "13",
            "10"
          ],
          "answerIndex": 1,
          "answer": "11",
          "explanation": "BODMAS के अनुसार पहले multiplication: 3×2=6, फिर 5+6=11।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MATH-BASIC-010",
          "subject": "Maths",
          "chapter": "Mensuration",
          "level": "basic",
          "language": "bilingual",
          "question": "Side 5 cm वाले square का perimeter क्या होगा?",
          "options": [
            "10 cm",
            "20 cm",
            "25 cm",
            "30 cm"
          ],
          "answerIndex": 1,
          "answer": "20 cm",
          "explanation": "Square perimeter = 4 × side = 4 × 5 = 20 cm।",
          "sourceCheck": "TAIPOQ original maths item; answer verified by direct calculation.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "maths-test-paper"
    },
    {
      "file": "07_GENERAL_AWARENESS_TEST_PAPER.md",
      "title": "General Awareness Static Test Paper 01",
      "subject": "General Awareness",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Static GK/GA basic paper.",
      "questions": [
        {
          "id": "GA-BASIC-001",
          "subject": "General Awareness",
          "chapter": "Indian Constitution",
          "level": "basic",
          "language": "bilingual",
          "question": "भारत का संविधान कब लागू हुआ?",
          "options": [
            "15 August 1947",
            "26 January 1950",
            "26 November 1949",
            "2 October 1950"
          ],
          "answerIndex": 1,
          "answer": "26 January 1950",
          "explanation": "भारत का संविधान 26 January 1950 को लागू हुआ।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-002",
          "subject": "General Awareness",
          "chapter": "Polity",
          "level": "basic",
          "language": "bilingual",
          "question": "भारत की संसद के दो सदन कौन-से हैं?",
          "options": [
            "लोकसभा और राज्यसभा",
            "विधानसभा और विधान परिषद",
            "राज्यसभा और पंचायत",
            "लोकसभा और ग्रामसभा"
          ],
          "answerIndex": 0,
          "answer": "लोकसभा और राज्यसभा",
          "explanation": "Indian Parliament consists of Lok Sabha and Rajya Sabha with the President as part of Parliament constitutionally; common exam answer for two houses is Lok Sabha and Rajya Sabha.",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-003",
          "subject": "General Awareness",
          "chapter": "Geography",
          "level": "basic",
          "language": "bilingual",
          "question": "भारत की सबसे लंबी नदी कौन-सी मानी जाती है?",
          "options": [
            "गंगा",
            "यमुना",
            "गोदावरी",
            "कावेरी"
          ],
          "answerIndex": 0,
          "answer": "गंगा",
          "explanation": "भारत में बहने वाली longest river commonly Ganga मानी जाती है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-004",
          "subject": "General Awareness",
          "chapter": "History",
          "level": "basic",
          "language": "bilingual",
          "question": "भारत की स्वतंत्रता किस वर्ष मिली?",
          "options": [
            "1945",
            "1947",
            "1950",
            "1952"
          ],
          "answerIndex": 1,
          "answer": "1947",
          "explanation": "भारत 15 August 1947 को स्वतंत्र हुआ।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-005",
          "subject": "General Awareness",
          "chapter": "Economy",
          "level": "basic",
          "language": "bilingual",
          "question": "भारत में currency जारी करने वाला केंद्रीय बैंक कौन-सा है?",
          "options": [
            "SBI",
            "RBI",
            "SEBI",
            "NABARD"
          ],
          "answerIndex": 1,
          "answer": "RBI",
          "explanation": "Reserve Bank of India भारत का central bank है और currency issue system से जुड़ा है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-006",
          "subject": "General Awareness",
          "chapter": "Static GK",
          "level": "basic",
          "language": "bilingual",
          "question": "राष्ट्रीय ध्वज में Ashoka Chakra में कितनी spokes होती हैं?",
          "options": [
            "12",
            "18",
            "24",
            "32"
          ],
          "answerIndex": 2,
          "answer": "24",
          "explanation": "Ashoka Chakra में 24 spokes होती हैं।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-007",
          "subject": "General Awareness",
          "chapter": "Environment",
          "level": "basic",
          "language": "bilingual",
          "question": "World Environment Day कब मनाया जाता है?",
          "options": [
            "5 June",
            "15 August",
            "2 October",
            "26 January"
          ],
          "answerIndex": 0,
          "answer": "5 June",
          "explanation": "World Environment Day 5 June को मनाया जाता है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-008",
          "subject": "General Awareness",
          "chapter": "Sports",
          "level": "basic",
          "language": "bilingual",
          "question": "Cricket में एक over में सामान्यतः कितनी legal balls होती हैं?",
          "options": [
            "4",
            "5",
            "6",
            "8"
          ],
          "answerIndex": 2,
          "answer": "6",
          "explanation": "Cricket में एक over में सामान्यतः 6 legal deliveries होती हैं।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-009",
          "subject": "General Awareness",
          "chapter": "Awards",
          "level": "basic",
          "language": "bilingual",
          "question": "भारत का सर्वोच्च civilian award कौन-सा है?",
          "options": [
            "Padma Shri",
            "Padma Bhushan",
            "Bharat Ratna",
            "Arjuna Award"
          ],
          "answerIndex": 2,
          "answer": "Bharat Ratna",
          "explanation": "Bharat Ratna भारत का highest civilian award है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "GA-BASIC-010",
          "subject": "General Awareness",
          "chapter": "International Organisations",
          "level": "basic",
          "language": "bilingual",
          "question": "United Nations की स्थापना किस वर्ष हुई?",
          "options": [
            "1919",
            "1945",
            "1950",
            "1965"
          ],
          "answerIndex": 1,
          "answer": "1945",
          "explanation": "United Nations की स्थापना 1945 में हुई।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "general-awareness-test-paper"
    },
    {
      "file": "08_GENERAL_SCIENCE_TEST_PAPER.md",
      "title": "General Science Basic Test Paper 01",
      "subject": "General Science",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "NCERT-level science basics for competitive exams.",
      "questions": [
        {
          "id": "SCI-BASIC-001",
          "subject": "General Science",
          "chapter": "Physics",
          "level": "basic",
          "language": "bilingual",
          "question": "बल की SI unit क्या है?",
          "options": [
            "Joule",
            "Newton",
            "Watt",
            "Pascal"
          ],
          "answerIndex": 1,
          "answer": "Newton",
          "explanation": "Force की SI unit Newton है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-002",
          "subject": "General Science",
          "chapter": "Chemistry",
          "level": "basic",
          "language": "bilingual",
          "question": "पानी का chemical formula क्या है?",
          "options": [
            "CO2",
            "H2O",
            "O2",
            "NaCl"
          ],
          "answerIndex": 1,
          "answer": "H2O",
          "explanation": "Water का chemical formula H2O है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-003",
          "subject": "General Science",
          "chapter": "Biology",
          "level": "basic",
          "language": "bilingual",
          "question": "मानव शरीर में blood pump करने वाला organ कौन-सा है?",
          "options": [
            "Lungs",
            "Heart",
            "Kidney",
            "Liver"
          ],
          "answerIndex": 1,
          "answer": "Heart",
          "explanation": "Heart blood को body में pump करता है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-004",
          "subject": "General Science",
          "chapter": "Human Body",
          "level": "basic",
          "language": "bilingual",
          "question": "मानव शरीर की सबसे बड़ी gland कौन-सी है?",
          "options": [
            "Liver",
            "Pancreas",
            "Thyroid",
            "Pituitary"
          ],
          "answerIndex": 0,
          "answer": "Liver",
          "explanation": "Liver human body की largest gland है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-005",
          "subject": "General Science",
          "chapter": "Biology",
          "level": "basic",
          "language": "bilingual",
          "question": "Plants food बनाने की प्रक्रिया को क्या कहते हैं?",
          "options": [
            "Respiration",
            "Photosynthesis",
            "Digestion",
            "Evaporation"
          ],
          "answerIndex": 1,
          "answer": "Photosynthesis",
          "explanation": "Plants sunlight की help से food बनाते हैं; इस process को photosynthesis कहते हैं।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-006",
          "subject": "General Science",
          "chapter": "Chemistry",
          "level": "basic",
          "language": "bilingual",
          "question": "Common salt का chemical name क्या है?",
          "options": [
            "Sodium chloride",
            "Calcium carbonate",
            "Potassium nitrate",
            "Hydrogen peroxide"
          ],
          "answerIndex": 0,
          "answer": "Sodium chloride",
          "explanation": "Common salt का chemical name sodium chloride है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-007",
          "subject": "General Science",
          "chapter": "Physics",
          "level": "basic",
          "language": "bilingual",
          "question": "Electric current की SI unit क्या है?",
          "options": [
            "Ampere",
            "Volt",
            "Ohm",
            "Watt"
          ],
          "answerIndex": 0,
          "answer": "Ampere",
          "explanation": "Electric current की SI unit ampere है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-008",
          "subject": "General Science",
          "chapter": "Disease and Nutrition",
          "level": "basic",
          "language": "bilingual",
          "question": "Vitamin C की कमी से कौन-सा रोग होता है?",
          "options": [
            "Scurvy",
            "Rickets",
            "Beriberi",
            "Night blindness"
          ],
          "answerIndex": 0,
          "answer": "Scurvy",
          "explanation": "Vitamin C deficiency से scurvy होता है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-009",
          "subject": "General Science",
          "chapter": "Environment",
          "level": "basic",
          "language": "bilingual",
          "question": "Ozone layer मुख्यतः किससे protection देती है?",
          "options": [
            "UV rays",
            "Sound waves",
            "Dust only",
            "Gravity"
          ],
          "answerIndex": 0,
          "answer": "UV rays",
          "explanation": "Ozone layer harmful ultraviolet rays से protection देती है।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "SCI-BASIC-010",
          "subject": "General Science",
          "chapter": "Physics",
          "level": "basic",
          "language": "bilingual",
          "question": "ध्वनि vacuum में क्यों नहीं चल सकती?",
          "options": [
            "क्योंकि medium नहीं होता",
            "क्योंकि light नहीं होती",
            "क्योंकि temperature zero होता",
            "क्योंकि gravity नहीं होती"
          ],
          "answerIndex": 0,
          "answer": "क्योंकि medium नहीं होता",
          "explanation": "Sound को travel करने के लिए material medium चाहिए; vacuum में medium नहीं होता।",
          "sourceCheck": "Checked against standard NCERT-level school science/social science concepts.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "general-science-test-paper"
    },
    {
      "file": "09_CURRENT_AFFAIRS_TEST_PAPER.md",
      "title": "Current Affairs Practice Test Paper 01 — Date Stamped",
      "subject": "Current Affairs",
      "level": "practice",
      "access": "practice_pass",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Date-stamped current affairs pilot paper (source checked 2026-06-29). Refresh before long-term use.",
      "questions": [
        {
          "id": "CA-2026-001",
          "subject": "Current Affairs",
          "chapter": "Budget 2026-27",
          "level": "practice",
          "language": "en",
          "question": "Union Budget 2026-27 documents are published on which official portal?",
          "options": [
            "indiabudget.gov.in",
            "rbi.org.in",
            "ssc.gov.in",
            "ctet.nic.in"
          ],
          "answerIndex": 0,
          "answer": "indiabudget.gov.in",
          "explanation": "Union Budget documents are officially hosted on India Budget portal: indiabudget.gov.in.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-002",
          "subject": "Current Affairs",
          "chapter": "Budget 2026-27",
          "level": "practice",
          "language": "en",
          "question": "Budget 2026-27 Budget at a Glance estimated total expenditure at approximately:",
          "options": [
            "₹5.34 lakh crore",
            "₹53.47 lakh crore",
            "₹12.21 crore",
            "₹25.43 crore"
          ],
          "answerIndex": 1,
          "answer": "₹53.47 lakh crore",
          "explanation": "Budget at a Glance 2026-27 gives total expenditure BE as ₹53,47,315 crore, i.e. about ₹53.47 lakh crore.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-003",
          "subject": "Current Affairs",
          "chapter": "Padma Awards 2026",
          "level": "practice",
          "language": "en",
          "question": "Padma Awards 2026 announced by PIB comprised how many total awards approved by the President?",
          "options": [
            "100",
            "113",
            "131",
            "150"
          ],
          "answerIndex": 2,
          "answer": "131",
          "explanation": "PIB release stated that 131 Padma Awards were approved for 2026.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-004",
          "subject": "Current Affairs",
          "chapter": "Padma Awards 2026",
          "level": "practice",
          "language": "en",
          "question": "Padma Awards 2026 list comprised how many Padma Vibhushan awards?",
          "options": [
            "5",
            "13",
            "19",
            "113"
          ],
          "answerIndex": 0,
          "answer": "5",
          "explanation": "PIB release stated: 5 Padma Vibhushan, 13 Padma Bhushan and 113 Padma Shri Awards.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-005",
          "subject": "Current Affairs",
          "chapter": "Padma Awards 2026",
          "level": "practice",
          "language": "en",
          "question": "Padma Awards are usually conferred at ceremonial functions held at:",
          "options": [
            "Parliament House",
            "Rashtrapati Bhavan",
            "Supreme Court",
            "India Gate"
          ],
          "answerIndex": 1,
          "answer": "Rashtrapati Bhavan",
          "explanation": "PIB states Padma Awards are conferred at Rashtrapati Bhavan, usually around March/April.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-006",
          "subject": "Current Affairs",
          "chapter": "CTET 2026",
          "level": "practice",
          "language": "en",
          "question": "CTET official archive lists which 2026 question paper entry?",
          "options": [
            "Question Paper Feb 2026",
            "Question Paper May 2026",
            "Question Paper June 2026",
            "Question Paper July 2026"
          ],
          "answerIndex": 0,
          "answer": "Question Paper Feb 2026",
          "explanation": "CTET archive lists Question Paper Feb 2026 among previous year question papers.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-007",
          "subject": "Current Affairs",
          "chapter": "Budget 2026-27",
          "level": "practice",
          "language": "en",
          "question": "Budget speech 2026 said the Income Tax Act, 2025 would come into effect from:",
          "options": [
            "1 April 2025",
            "1 April 2026",
            "1 July 2026",
            "1 January 2027"
          ],
          "answerIndex": 1,
          "answer": "1 April 2026",
          "explanation": "Budget Speech 2026 stated that Income Tax Act, 2025 will come into effect from 1st April, 2026.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-008",
          "subject": "Current Affairs",
          "chapter": "Budget 2026-27",
          "level": "practice",
          "language": "en",
          "question": "Budget at a Glance 2026-27 estimated total capital expenditure at approximately:",
          "options": [
            "₹12.22 lakh crore",
            "₹17.14 lakh crore",
            "₹53.47 lakh crore",
            "₹25.43 lakh crore"
          ],
          "answerIndex": 0,
          "answer": "₹12.22 lakh crore",
          "explanation": "Budget at a Glance gives total capital expenditure as ₹12,21,821 crore, about ₹12.22 lakh crore.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-009",
          "subject": "Current Affairs",
          "chapter": "Padma Awards 2026",
          "level": "practice",
          "language": "en",
          "question": "Padma Awards 2026 list comprised how many Padma Bhushan awards?",
          "options": [
            "5",
            "13",
            "24",
            "113"
          ],
          "answerIndex": 1,
          "answer": "13",
          "explanation": "PIB release stated the 2026 list comprised 13 Padma Bhushan awards.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CA-2026-010",
          "subject": "Current Affairs",
          "chapter": "Source Awareness",
          "level": "practice",
          "language": "en",
          "question": "For TAIPOQ Current Affairs, the safest practice is to include:",
          "options": [
            "No date",
            "Date and source note",
            "Only WhatsApp source",
            "Only coaching name"
          ],
          "answerIndex": 1,
          "answer": "Date and source note",
          "explanation": "Current Affairs changes over time; every current question should be date-stamped and source-noted.",
          "sourceCheck": "Date-stamped current affairs checked against official Government/PIB/Budget sources available on 2026-06-29.",
          "tags": [
            "2026-06-29"
          ],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "current-affairs-test-paper"
    },
    {
      "file": "10_HINDI_TEST_PAPER.md",
      "title": "Hindi Basic Test Paper 01",
      "subject": "Hindi",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Hindi grammar basic paper.",
      "questions": [
        {
          "id": "HINDI-BASIC-001",
          "subject": "Hindi",
          "chapter": "विलोम",
          "level": "basic",
          "language": "hi",
          "question": "'दिन' का विलोम क्या है?",
          "options": [
            "रात",
            "प्रकाश",
            "सूर्य",
            "समय"
          ],
          "answerIndex": 0,
          "answer": "रात",
          "explanation": "दिन का सामान्य विलोम रात है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-002",
          "subject": "Hindi",
          "chapter": "पर्यायवाची",
          "level": "basic",
          "language": "hi",
          "question": "'जल' का पर्यायवाची कौन-सा है?",
          "options": [
            "अग्नि",
            "नीर",
            "धरा",
            "गगन"
          ],
          "answerIndex": 1,
          "answer": "नीर",
          "explanation": "जल और नीर समान अर्थ वाले शब्द हैं।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-003",
          "subject": "Hindi",
          "chapter": "समास",
          "level": "basic",
          "language": "hi",
          "question": "'राजपुत्र' में कौन-सा समास है?",
          "options": [
            "तत्पुरुष",
            "द्वंद्व",
            "बहुव्रीहि",
            "अव्ययीभाव"
          ],
          "answerIndex": 0,
          "answer": "तत्पुरुष",
          "explanation": "राजा का पुत्र = राजपुत्र; यह तत्पुरुष समास का सरल उदाहरण है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-004",
          "subject": "Hindi",
          "chapter": "संधि",
          "level": "basic",
          "language": "hi",
          "question": "'विद्यालय' शब्द में मूल रूप क्या माना जाता है?",
          "options": [
            "विद्या + आलय",
            "विद्या + लय",
            "विदि + आलय",
            "वेद + आलय"
          ],
          "answerIndex": 0,
          "answer": "विद्या + आलय",
          "explanation": "विद्या + आलय से विद्यालय रूप बनता है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-005",
          "subject": "Hindi",
          "chapter": "वाक्य शुद्धि",
          "level": "basic",
          "language": "hi",
          "question": "शुद्ध वाक्य चुनिए:",
          "options": [
            "मैं विद्यालय गया था।",
            "मैं विद्यालय गए था।",
            "मैं विद्यालय गई था।",
            "मैं विद्यालय जाता थी।"
          ],
          "answerIndex": 0,
          "answer": "मैं विद्यालय गया था।",
          "explanation": "कर्ता 'मैं' पुरुष वक्ता मानकर सही रूप 'गया था' है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-006",
          "subject": "Hindi",
          "chapter": "वचन",
          "level": "basic",
          "language": "hi",
          "question": "'लड़का' का बहुवचन क्या है?",
          "options": [
            "लड़की",
            "लड़के",
            "लड़कपन",
            "लड़कियाँ"
          ],
          "answerIndex": 1,
          "answer": "लड़के",
          "explanation": "लड़का का बहुवचन लड़के होता है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-007",
          "subject": "Hindi",
          "chapter": "लिंग",
          "level": "basic",
          "language": "hi",
          "question": "'माता' का पुल्लिंग क्या है?",
          "options": [
            "पिता",
            "भाई",
            "बहन",
            "पुत्री"
          ],
          "answerIndex": 0,
          "answer": "पिता",
          "explanation": "माता का पुल्लिंग पिता है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-008",
          "subject": "Hindi",
          "chapter": "अलंकार",
          "level": "basic",
          "language": "hi",
          "question": "जहाँ किसी वस्तु की अत्यधिक समानता दिखाकर तुलना की जाती है, वहाँ सामान्यतः कौन-सा अलंकार होता है?",
          "options": [
            "उपमा",
            "यमक",
            "श्लेष",
            "अनुप्रास"
          ],
          "answerIndex": 0,
          "answer": "उपमा",
          "explanation": "उपमा अलंकार में समानता के आधार पर तुलना होती है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-009",
          "subject": "Hindi",
          "chapter": "रस",
          "level": "basic",
          "language": "hi",
          "question": "हास्य उत्पन्न करने वाला रस कौन-सा है?",
          "options": [
            "वीर रस",
            "हास्य रस",
            "करुण रस",
            "भयानक रस"
          ],
          "answerIndex": 1,
          "answer": "हास्य रस",
          "explanation": "हास्य रस हँसी या विनोद से संबंधित है।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "HINDI-BASIC-010",
          "subject": "Hindi",
          "chapter": "वर्ण",
          "level": "basic",
          "language": "hi",
          "question": "हिन्दी वर्णमाला में अ, आ, इ आदि क्या हैं?",
          "options": [
            "स्वर",
            "व्यंजन",
            "समास",
            "छंद"
          ],
          "answerIndex": 0,
          "answer": "स्वर",
          "explanation": "अ, आ, इ आदि स्वर हैं।",
          "sourceCheck": "Checked against standard Hindi grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "hindi-test-paper"
    },
    {
      "file": "11_ENGLISH_TEST_PAPER.md",
      "title": "English Basic Test Paper 01",
      "subject": "English",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "English language basic paper.",
      "questions": [
        {
          "id": "ENG-BASIC-001",
          "subject": "English",
          "chapter": "Antonyms",
          "level": "basic",
          "language": "en",
          "question": "Choose the antonym of 'hot'.",
          "options": [
            "Warm",
            "Cold",
            "Heat",
            "Fire"
          ],
          "answerIndex": 1,
          "answer": "Cold",
          "explanation": "Cold is the opposite of hot.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-002",
          "subject": "English",
          "chapter": "Synonyms",
          "level": "basic",
          "language": "en",
          "question": "Choose the synonym of 'quick'.",
          "options": [
            "Slow",
            "Fast",
            "Late",
            "Weak"
          ],
          "answerIndex": 1,
          "answer": "Fast",
          "explanation": "Fast and quick have similar meanings.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-003",
          "subject": "English",
          "chapter": "Articles",
          "level": "basic",
          "language": "en",
          "question": "Choose the correct article: He is ___ honest man.",
          "options": [
            "a",
            "an",
            "the",
            "no article"
          ],
          "answerIndex": 1,
          "answer": "an",
          "explanation": "'Honest' begins with a vowel sound, so 'an' is used.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-004",
          "subject": "English",
          "chapter": "Tense",
          "level": "basic",
          "language": "en",
          "question": "Choose the correct sentence.",
          "options": [
            "She go to school.",
            "She goes to school.",
            "She going to school.",
            "She gone to school."
          ],
          "answerIndex": 1,
          "answer": "She goes to school.",
          "explanation": "With singular subject 'She' in simple present, verb takes -es: goes.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-005",
          "subject": "English",
          "chapter": "Preposition",
          "level": "basic",
          "language": "en",
          "question": "Choose the correct preposition: The book is ___ the table.",
          "options": [
            "on",
            "at",
            "into",
            "from"
          ],
          "answerIndex": 0,
          "answer": "on",
          "explanation": "If a book rests on the surface of the table, 'on' is correct.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-006",
          "subject": "English",
          "chapter": "Plural",
          "level": "basic",
          "language": "en",
          "question": "What is the plural of 'child'?",
          "options": [
            "childs",
            "children",
            "childes",
            "childrens"
          ],
          "answerIndex": 1,
          "answer": "children",
          "explanation": "The correct irregular plural of child is children.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-007",
          "subject": "English",
          "chapter": "Spelling",
          "level": "basic",
          "language": "en",
          "question": "Choose the correct spelling.",
          "options": [
            "Recieve",
            "Receive",
            "Receeve",
            "Receve"
          ],
          "answerIndex": 1,
          "answer": "Receive",
          "explanation": "The correct spelling is receive.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-008",
          "subject": "English",
          "chapter": "Voice",
          "level": "basic",
          "language": "en",
          "question": "Active voice: 'Ram writes a letter.' Passive voice is:",
          "options": [
            "A letter is written by Ram.",
            "A letter was written by Ram.",
            "A letter writes Ram.",
            "Ram is written by a letter."
          ],
          "answerIndex": 0,
          "answer": "A letter is written by Ram.",
          "explanation": "Simple present active changes to 'is/am/are + past participle' in passive.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-009",
          "subject": "English",
          "chapter": "One Word Substitution",
          "level": "basic",
          "language": "en",
          "question": "A person who teaches is called a:",
          "options": [
            "Doctor",
            "Teacher",
            "Farmer",
            "Driver"
          ],
          "answerIndex": 1,
          "answer": "Teacher",
          "explanation": "A person who teaches is a teacher.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "ENG-BASIC-010",
          "subject": "English",
          "chapter": "Error Spotting",
          "level": "basic",
          "language": "en",
          "question": "Choose the correct sentence.",
          "options": [
            "They is playing.",
            "They are playing.",
            "They am playing.",
            "They was playing."
          ],
          "answerIndex": 1,
          "answer": "They are playing.",
          "explanation": "Plural subject 'They' takes 'are'.",
          "sourceCheck": "Checked against standard English grammar usage.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "english-test-paper"
    },
    {
      "file": "12_UP_GK_TEST_PAPER.md",
      "title": "UP GK Basic Test Paper 01",
      "subject": "UP GK",
      "level": "basic",
      "access": "free",
      "durationMinutes": 12,
      "questionCount": 10,
      "intro": "Uttar Pradesh special basic GK paper.",
      "questions": [
        {
          "id": "UPGK-BASIC-001",
          "subject": "UP GK",
          "chapter": "Geography",
          "level": "basic",
          "language": "hi",
          "question": "उत्तर प्रदेश की राजधानी क्या है?",
          "options": [
            "कानपुर",
            "लखनऊ",
            "वाराणसी",
            "प्रयागराज"
          ],
          "answerIndex": 1,
          "answer": "लखनऊ",
          "explanation": "उत्तर प्रदेश की राजधानी लखनऊ है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-002",
          "subject": "UP GK",
          "chapter": "Rivers",
          "level": "basic",
          "language": "hi",
          "question": "गंगा और यमुना का संगम उत्तर प्रदेश के किस नगर में है?",
          "options": [
            "प्रयागराज",
            "मेरठ",
            "गोरखपुर",
            "अलीगढ़"
          ],
          "answerIndex": 0,
          "answer": "प्रयागराज",
          "explanation": "गंगा, यमुना और पौराणिक सरस्वती का संगम प्रयागराज में माना जाता है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-003",
          "subject": "UP GK",
          "chapter": "Culture",
          "level": "basic",
          "language": "hi",
          "question": "काशी विश्वनाथ मंदिर किस नगर में स्थित है?",
          "options": [
            "अयोध्या",
            "मथुरा",
            "वाराणसी",
            "झाँसी"
          ],
          "answerIndex": 2,
          "answer": "वाराणसी",
          "explanation": "काशी विश्वनाथ मंदिर वाराणसी में है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-004",
          "subject": "UP GK",
          "chapter": "History",
          "level": "basic",
          "language": "hi",
          "question": "झाँसी की रानी का नाम क्या था?",
          "options": [
            "लक्ष्मीबाई",
            "अहिल्याबाई",
            "दुर्गावती",
            "सरोजिनी"
          ],
          "answerIndex": 0,
          "answer": "लक्ष्मीबाई",
          "explanation": "झाँसी की रानी लक्ष्मीबाई 1857 के विद्रोह से जुड़ी प्रमुख वीरांगना थीं।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-005",
          "subject": "UP GK",
          "chapter": "Agriculture",
          "level": "basic",
          "language": "hi",
          "question": "उत्तर प्रदेश की प्रमुख खाद्यान्न फसल कौन-सी है?",
          "options": [
            "धान और गेहूँ",
            "केवल कॉफी",
            "केवल रबर",
            "केवल नारियल"
          ],
          "answerIndex": 0,
          "answer": "धान और गेहूँ",
          "explanation": "UP में गेहूँ और धान प्रमुख खाद्यान्न फसलें हैं।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-006",
          "subject": "UP GK",
          "chapter": "Districts",
          "level": "basic",
          "language": "hi",
          "question": "ताजमहल किस जिले/नगर में स्थित है?",
          "options": [
            "आगरा",
            "लखनऊ",
            "बरेली",
            "मुरादाबाद"
          ],
          "answerIndex": 0,
          "answer": "आगरा",
          "explanation": "ताजमहल आगरा में स्थित है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-007",
          "subject": "UP GK",
          "chapter": "Culture",
          "level": "basic",
          "language": "hi",
          "question": "अयोध्या किससे विशेष रूप से जुड़ी है?",
          "options": [
            "भगवान राम",
            "भगवान बुद्ध का जन्म",
            "ताजमहल",
            "सांची स्तूप"
          ],
          "answerIndex": 0,
          "answer": "भगवान राम",
          "explanation": "अयोध्या भगवान राम की जन्मभूमि परंपरा से जुड़ी है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-008",
          "subject": "UP GK",
          "chapter": "Geography",
          "level": "basic",
          "language": "hi",
          "question": "उत्तर प्रदेश भारत के किस भाग में स्थित है?",
          "options": [
            "उत्तर भारत",
            "दक्षिण भारत",
            "पूर्वोत्तर भारत",
            "द्वीपीय भारत"
          ],
          "answerIndex": 0,
          "answer": "उत्तर भारत",
          "explanation": "उत्तर प्रदेश भारत के उत्तरी भाग में स्थित है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-009",
          "subject": "UP GK",
          "chapter": "Education",
          "level": "basic",
          "language": "hi",
          "question": "बनारस हिन्दू विश्वविद्यालय किस नगर में स्थित है?",
          "options": [
            "वाराणसी",
            "कानपुर",
            "नोएडा",
            "मथुरा"
          ],
          "answerIndex": 0,
          "answer": "वाराणसी",
          "explanation": "Banaras Hindu University वाराणसी में है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "UPGK-BASIC-010",
          "subject": "UP GK",
          "chapter": "Rivers",
          "level": "basic",
          "language": "hi",
          "question": "यमुना नदी उत्तर प्रदेश के किस प्रसिद्ध ऐतिहासिक नगर से होकर बहती है?",
          "options": [
            "आगरा",
            "भोपाल",
            "जयपुर",
            "रायपुर"
          ],
          "answerIndex": 0,
          "answer": "आगरा",
          "explanation": "यमुना आगरा से होकर बहती है, जहाँ ताजमहल स्थित है।",
          "sourceCheck": "Checked against standard static GK / public reference knowledge.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "up-gk-test-paper"
    },
    {
      "file": "13_PYQ_PRACTICE_TEST_PAPER.md",
      "title": "CTET January 2021 Paper I — Child Development and Pedagogy PYQs",
      "subject": "Verified PYQ",
      "level": "basic",
      "access": "practice_pass",
      "durationMinutes": 10,
      "questionCount": 10,
      "intro": "This practice set is based on Questions 1–10 of the official CTET January 2021 Paper I, Main Set I, Child Development and Pedagogy section. The correct options have been checked against the official final answer key. The wording has been lightly adapted for clear digital practice; this page is not an official CBSE or CTET publication.",
      "questions": [
        {
          "id": "CTET-JAN2021-P1-I-Q001",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "After Rohan was injured while playing, he began to cry. His father told him that boys should not cry like girls. The father's statement:",
          "options": [
            "Reflects a gender stereotype",
            "Challenges a gender stereotype",
            "Reduces gender bias",
            "Promotes gender equality"
          ],
          "answerIndex": 0,
          "answer": "Reflects a gender stereotype",
          "explanation": "The statement prescribes different emotional behaviour for boys and girls. It therefore reflects a gender stereotype.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 1. Official final answer-key option: 1.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q002",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "Which practice is appropriate in a progressive classroom?",
          "options": [
            "The teacher follows a completely fixed curriculum",
            "Competition among learners receives the greatest emphasis",
            "Learners receive ample opportunities to construct knowledge",
            "Learners are labelled according to academic scores"
          ],
          "answerIndex": 2,
          "answer": "Learners receive ample opportunities to construct knowledge",
          "explanation": "Progressive education treats learners as active participants who construct understanding through experience, enquiry and interaction.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 2. Official final answer-key option: 3.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q003",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "Learners are unable to proceed with an activity. The teacher gives cues and prompts such as \"what,\" \"why\" and \"how.\" According to Vygotsky, this support:",
          "options": [
            "Demotivates learners",
            "Functions as scaffolding",
            "Causes learners to withdraw",
            "Has no value in learning"
          ],
          "answerIndex": 1,
          "answer": "Functions as scaffolding",
          "explanation": "Temporary support that enables a learner to complete a task and gradually become independent is described as scaffolding.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 3. Official final answer-key option: 2.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q004",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "Which statement about the socialisation of children is correct?",
          "options": [
            "Family is a primary agent, while school is a secondary agent",
            "School is a primary agent, while peers are secondary agents",
            "Peers are primary agents, while family is a secondary agent",
            "Family and mass media are both only secondary agents"
          ],
          "answerIndex": 0,
          "answer": "Family is a primary agent, while school is a secondary agent",
          "explanation": "A child's earliest socialisation ordinarily occurs within the family. School subsequently becomes an important secondary institution of socialisation.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 4. Official final answer-key option: 1.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q005",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "The theory of multiple intelligences emphasises that:",
          "options": [
            "Intelligence can be measured only through objective IQ tests",
            "Ability in one domain guarantees equal ability in every domain",
            "Intelligence has several distinct forms",
            "Individual differences in intelligence do not exist"
          ],
          "answerIndex": 2,
          "answer": "Intelligence has several distinct forms",
          "explanation": "The theory rejects the idea that intelligence is one uniform capacity and proposes several forms of intellectual ability.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 5. Official final answer-key option: 3.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q006",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "According to Kohlberg, doing something because other people approve of it represents which broad level of moral development?",
          "options": [
            "Pre-conventional",
            "Conventional",
            "Post-conventional",
            "Formal conventional"
          ],
          "answerIndex": 1,
          "answer": "Conventional",
          "explanation": "Seeking social approval and conforming to expected behaviour are associated with the conventional level of moral reasoning.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 6. Official final answer-key option: 2.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q007",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "Vygotsky's sociocultural perspective gives particular importance to which factor in learning?",
          "options": [
            "Cultural tools",
            "Attribution",
            "Motivation alone",
            "Equilibration"
          ],
          "answerIndex": 0,
          "answer": "Cultural tools",
          "explanation": "Vygotsky emphasised the role of language, symbols and other culturally developed tools in learning and cognitive development.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 7. Official final answer-key option: 1.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q008",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "In Piaget's theory, cognitive structures are described in terms of:",
          "options": [
            "Psychological tools",
            "Stimulus-response associations",
            "Zone of proximal development",
            "Schemas"
          ],
          "answerIndex": 3,
          "answer": "Schemas",
          "explanation": "Schemas are organised patterns of thought or action through which children understand and respond to experience.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 8. Official final answer-key option: 4.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q009",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "Which feature characterises Piaget's pre-operational stage?",
          "options": [
            "Abstract reasoning",
            "Centration of thought",
            "Hypothetico-deductive reasoning",
            "Conservation and seriation"
          ],
          "answerIndex": 1,
          "answer": "Centration of thought",
          "explanation": "Children in the pre-operational stage often focus on one prominent feature of a situation while overlooking other relevant features. This is called centration.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 9. Official final answer-key option: 2.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "CTET-JAN2021-P1-I-Q010",
          "subject": "Verified PYQ",
          "chapter": "Child Development and Pedagogy",
          "level": "basic",
          "language": "en",
          "question": "Which statement about development is correct?",
          "options": [
            "Development proceeds at exactly the same rate across all cultures",
            "Development occurs only through school learning",
            "Development occurs only during childhood",
            "Development is multidimensional"
          ],
          "answerIndex": 3,
          "answer": "Development is multidimensional",
          "explanation": "Human development includes interacting physical, cognitive, emotional, linguistic and social dimensions and continues beyond childhood.",
          "sourceCheck": "Official-source verified adapted PYQ. CTET January 2021, Paper I, Main Set I, Child Development and Pedagogy, original Question 10. Official final answer-key option: 4.",
          "tags": ["CTET", "CDP", "2021"],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "pyq-practice-test-paper"
    },
    {
      "file": "14_MODEL_PAPER_01.md",
      "title": "TAIPOQ Basic Mixed Model Paper 01",
      "subject": "Model Papers",
      "level": "basic",
      "access": "exam_pass",
      "durationMinutes": 15,
      "questionCount": 10,
      "intro": "Original mixed mini model paper for pilot testing.",
      "questions": [
        {
          "id": "MODEL-001",
          "subject": "Model Papers",
          "chapter": "Mixed Computer",
          "level": "moderate",
          "language": "bilingual",
          "question": "RAM किस प्रकार की memory है?",
          "options": [
            "Volatile",
            "Non-volatile only",
            "Output device",
            "Input device"
          ],
          "answerIndex": 0,
          "answer": "Volatile",
          "explanation": "RAM volatile memory है।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-002",
          "subject": "Model Papers",
          "chapter": "Mixed Excel",
          "level": "moderate",
          "language": "bilingual",
          "question": "=SUM(4,6,10) का result क्या है?",
          "options": [
            "10",
            "16",
            "20",
            "24"
          ],
          "answerIndex": 2,
          "answer": "20",
          "explanation": "4 + 6 + 10 = 20।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-003",
          "subject": "Model Papers",
          "chapter": "Mixed Reasoning",
          "level": "moderate",
          "language": "bilingual",
          "question": "3, 6, 12, 24, ? में अगली संख्या क्या है?",
          "options": [
            "30",
            "36",
            "48",
            "60"
          ],
          "answerIndex": 2,
          "answer": "48",
          "explanation": "हर संख्या double हो रही है: 24×2=48।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-004",
          "subject": "Model Papers",
          "chapter": "Mixed Maths",
          "level": "moderate",
          "language": "bilingual",
          "question": "₹500 का 20% कितना है?",
          "options": [
            "₹50",
            "₹100",
            "₹150",
            "₹200"
          ],
          "answerIndex": 1,
          "answer": "₹100",
          "explanation": "20% of 500 = 100।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-005",
          "subject": "Model Papers",
          "chapter": "Mixed Science",
          "level": "moderate",
          "language": "bilingual",
          "question": "Photosynthesis के लिए plants को मुख्यतः क्या चाहिए?",
          "options": [
            "Sunlight",
            "Printer",
            "Keyboard",
            "Salt only"
          ],
          "answerIndex": 0,
          "answer": "Sunlight",
          "explanation": "Photosynthesis में sunlight essential input है।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-006",
          "subject": "Model Papers",
          "chapter": "Mixed GA",
          "level": "moderate",
          "language": "bilingual",
          "question": "भारत का संविधान कब लागू हुआ?",
          "options": [
            "26 January 1950",
            "15 August 1947",
            "2 October 1948",
            "1 April 1951"
          ],
          "answerIndex": 0,
          "answer": "26 January 1950",
          "explanation": "Constitution came into force on 26 January 1950।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-007",
          "subject": "Model Papers",
          "chapter": "Mixed Hindi",
          "level": "moderate",
          "language": "hi",
          "question": "'जल' का पर्यायवाची क्या है?",
          "options": [
            "नीर",
            "अग्नि",
            "धरती",
            "आकाश"
          ],
          "answerIndex": 0,
          "answer": "नीर",
          "explanation": "जल और नीर समानार्थी हैं।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-008",
          "subject": "Model Papers",
          "chapter": "Mixed English",
          "level": "moderate",
          "language": "en",
          "question": "Choose the correct sentence.",
          "options": [
            "He go home.",
            "He goes home.",
            "He going home.",
            "He gone home."
          ],
          "answerIndex": 1,
          "answer": "He goes home.",
          "explanation": "Singular subject 'He' takes 'goes' in simple present।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-009",
          "subject": "Model Papers",
          "chapter": "Mixed UP GK",
          "level": "moderate",
          "language": "hi",
          "question": "उत्तर प्रदेश की राजधानी क्या है?",
          "options": [
            "लखनऊ",
            "कानपुर",
            "आगरा",
            "मेरठ"
          ],
          "answerIndex": 0,
          "answer": "लखनऊ",
          "explanation": "उत्तर प्रदेश की राजधानी लखनऊ है।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        },
        {
          "id": "MODEL-010",
          "subject": "Model Papers",
          "chapter": "Mixed Typing",
          "level": "moderate",
          "language": "en",
          "question": "WPM typing में क्या मापता है?",
          "options": [
            "Words per minute",
            "Windows per month",
            "Write page margin",
            "Word print method"
          ],
          "answerIndex": 0,
          "answer": "Words per minute",
          "explanation": "WPM means Words Per Minute।",
          "sourceCheck": "TAIPOQ original model paper item; answer rechecked from subject bank logic.",
          "tags": [],
          "reviewed": true,
          "createdBy": "taipoq"
        }
      ],
      "paperId": "model-paper-01"
    }
  ]
} as const;
