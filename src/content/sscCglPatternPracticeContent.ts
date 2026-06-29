export type SscCglPracticeQuestion = {
  id: string;
  subject:
    | "Quantitative Aptitude"
    | "General Intelligence and Reasoning"
    | "English Comprehension"
    | "General Awareness";
  chapter: string;
  questionNumber: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  question: string;
  options: {
    label: "A" | "B" | "C" | "D";
    text: string;
  }[];
  answer: string;
  explanation: string;
  shortcut?: string;
  commonMistake?: string;
};

export type SscCglPracticeSubject = {
  slug: string;
  title: string;
  hindiTitle: string;
  description: string;
  questions: SscCglPracticeQuestion[];
};

export const SSC_CGL_PATTERN_PRACTICE_HREF = "/study-corner/ssc-cgl-pattern-practice" as const;

export const SSC_CGL_PATTERN_PRACTICE_META = {
  title: "SSC CGL Pattern Practice — 100 Starter Questions",
  subtitle:
    "TAIPOQ original illustrative practice for SSC CGL Tier-I pattern. This is not an official SSC previous-year question paper or official PYQ book.",
  notice:
    "This practice page contains TAIPOQ original illustrative questions based on the common SSC CGL Tier-I structure. It is not an official SSC previous-year paper, not an official PYQ book, and does not reproduce paid books or downloaded PDFs. Official questions may be added later only after source tagging, solving, rewriting, and adding original explanations.",
  howToUse: {
    title: "How to use this page",
    text: "Use this page to understand the question pattern, practise starter-level concepts, and identify weak topics. After this, solve official SSC papers and maintain your own source-tagged notes.",
  },
  contentPolicy: [
    "TAIPOQ original illustrative practice",
    "Not an official SSC paper",
    "Not an official PYQ book",
    "Paid books and PDFs are not copied",
    "Downloaded pattern PDFs are not republished",
    "Future official questions must be source-tagged, solved, rewritten, and explained originally",
  ],
  seoTitle: "SSC CGL Pattern Practice 100 Questions | TAIPOQ",
  seoDescription:
    "Practice 100 SSC CGL Tier-I pattern questions for Quantitative Aptitude, Reasoning, English Comprehension and General Awareness. TAIPOQ original illustrative practice.",
  subjectJumps: [
    { label: "Maths", slug: "quantitative-aptitude" },
    { label: "Reasoning", slug: "general-intelligence-reasoning" },
    { label: "English", slug: "english-comprehension" },
    { label: "General Awareness", slug: "general-awareness" },
  ],
} as const;

export const sscCglPatternPracticeSubjects: SscCglPracticeSubject[] = [
  {
    "slug": "quantitative-aptitude",
    "title": "Quantitative Aptitude",
    "hindiTitle": "गणितीय योग्यता",
    "description": "Percentage, profit-loss, interest, time-work, algebra, geometry, DI, and number system — Tier-I style starter practice.",
    "questions": [
      {
        "id": "SSC-CGL-QA-001",
        "subject": "Quantitative Aptitude",
        "chapter": "Percentage",
        "questionNumber": 1,
        "difficulty": "Moderate",
        "question": "A student gets 40% marks and fails by 50 marks. At 60% marks, he gets 30 marks more than the pass marks. What are the maximum marks?",
        "options": [
          {
            "label": "A",
            "text": "300"
          },
          {
            "label": "B",
            "text": "400"
          },
          {
            "label": "C",
            "text": "500"
          },
          {
            "label": "D",
            "text": "600"
          }
        ],
        "answer": "400",
        "explanation": "The difference between 60% and 40% is 20% of maximum marks. This 20% equals 50 + 30 = 80 marks. So 100% = 400 marks.",
        "shortcut": "Gap between two scores = total change around pass marks.",
        "commonMistake": "Do not subtract 30 from 50; both gaps are on opposite sides of the pass mark."
      },
      {
        "id": "SSC-CGL-QA-002",
        "subject": "Quantitative Aptitude",
        "chapter": "Percentage",
        "questionNumber": 2,
        "difficulty": "Easy",
        "question": "The price of an item increases by 25%. By what percent should consumption be reduced so that total expenditure remains the same?",
        "options": [
          {
            "label": "A",
            "text": "20%"
          },
          {
            "label": "B",
            "text": "25%"
          },
          {
            "label": "C",
            "text": "30%"
          },
          {
            "label": "D",
            "text": "33.33%"
          }
        ],
        "answer": "20%",
        "explanation": "If original price is 100, new price is 125. For the same expenditure, consumption becomes 100/125 = 80% of the original. Reduction = 20%.",
        "shortcut": "For x% price increase, required reduction = x/(100+x) × 100.",
        "commonMistake": "Do not answer 25%; equal percent decrease does not balance a percent increase."
      },
      {
        "id": "SSC-CGL-QA-003",
        "subject": "Quantitative Aptitude",
        "chapter": "Percentage",
        "questionNumber": 3,
        "difficulty": "Easy",
        "question": "40% of a number is 240. What is 60% of that number?",
        "options": [
          {
            "label": "A",
            "text": "300"
          },
          {
            "label": "B",
            "text": "320"
          },
          {
            "label": "C",
            "text": "360"
          },
          {
            "label": "D",
            "text": "400"
          }
        ],
        "answer": "360",
        "explanation": "40% = 240, so 10% = 60. Therefore, 60% = 360.",
        "shortcut": "Find 10% first when percentages are multiples of 10.",
        "commonMistake": "Do not calculate 60% of 240."
      },
      {
        "id": "SSC-CGL-QA-004",
        "subject": "Quantitative Aptitude",
        "chapter": "Profit and Loss",
        "questionNumber": 4,
        "difficulty": "Easy",
        "question": "The cost price of 12 articles is equal to the selling price of 10 articles. Find the profit percent.",
        "options": [
          {
            "label": "A",
            "text": "10%"
          },
          {
            "label": "B",
            "text": "16.66%"
          },
          {
            "label": "C",
            "text": "20%"
          },
          {
            "label": "D",
            "text": "25%"
          }
        ],
        "answer": "20%",
        "explanation": "Let the cost price of each article be 1. CP of 12 articles = 12. SP of 10 articles = 12, so SP of 1 article = 1.2. Profit = 0.2 on CP 1 = 20%.",
        "shortcut": "When CP of more units equals SP of fewer units, profit is present.",
        "commonMistake": "Keep CP and SP on the same single-article base."
      },
      {
        "id": "SSC-CGL-QA-005",
        "subject": "Quantitative Aptitude",
        "chapter": "Profit and Loss",
        "questionNumber": 5,
        "difficulty": "Easy",
        "question": "A man sells two items at Rs. 1200 each. He gains 20% on one item and loses 20% on the other. Find the overall result.",
        "options": [
          {
            "label": "A",
            "text": "No profit no loss"
          },
          {
            "label": "B",
            "text": "4% loss"
          },
          {
            "label": "C",
            "text": "4% profit"
          },
          {
            "label": "D",
            "text": "5% loss"
          }
        ],
        "answer": "4% loss",
        "explanation": "CP of profit item = 1200/1.2 = 1000. CP of loss item = 1200/0.8 = 1500. Total CP = 2500 and total SP = 2400. Loss = 100 = 4%.",
        "shortcut": "Equal SP with equal gain and loss percent gives loss = x²/100 = 4%.",
        "commonMistake": "Do not cancel equal 20% profit and 20% loss."
      },
      {
        "id": "SSC-CGL-QA-006",
        "subject": "Quantitative Aptitude",
        "chapter": "Simple Interest",
        "questionNumber": 6,
        "difficulty": "Easy",
        "question": "Find the simple interest on Rs. 5000 at 8% per annum for 3 years.",
        "options": [
          {
            "label": "A",
            "text": "Rs. 800"
          },
          {
            "label": "B",
            "text": "Rs. 1000"
          },
          {
            "label": "C",
            "text": "Rs. 1200"
          },
          {
            "label": "D",
            "text": "Rs. 1500"
          }
        ],
        "answer": "Rs. 1200",
        "explanation": "SI = PRT/100 = 5000 × 8 × 3 / 100 = 1200.",
        "shortcut": "Use PRT/100 directly.",
        "commonMistake": "Do not calculate compound interest."
      },
      {
        "id": "SSC-CGL-QA-007",
        "subject": "Quantitative Aptitude",
        "chapter": "Compound Interest",
        "questionNumber": 7,
        "difficulty": "Moderate",
        "question": "Find the difference between compound interest and simple interest for 2 years at 10% per annum on Rs. 1000.",
        "options": [
          {
            "label": "A",
            "text": "Rs. 10"
          },
          {
            "label": "B",
            "text": "Rs. 20"
          },
          {
            "label": "C",
            "text": "Rs. 100"
          },
          {
            "label": "D",
            "text": "Rs. 110"
          }
        ],
        "answer": "Rs. 10",
        "explanation": "For 2 years, difference = P × (r/100)² = 1000 × (10/100)² = 10.",
        "shortcut": "2-year CI-SI difference formula saves time.",
        "commonMistake": "Do not confuse total CI with the difference between CI and SI."
      },
      {
        "id": "SSC-CGL-QA-008",
        "subject": "Quantitative Aptitude",
        "chapter": "Time and Work",
        "questionNumber": 8,
        "difficulty": "Moderate",
        "question": "A can complete a work in 12 days and B can complete it in 15 days. In how many days can they complete it together?",
        "options": [
          {
            "label": "A",
            "text": "6 days"
          },
          {
            "label": "B",
            "text": "6.67 days"
          },
          {
            "label": "C",
            "text": "7 days"
          },
          {
            "label": "D",
            "text": "8 days"
          }
        ],
        "answer": "6.67 days",
        "explanation": "A’s rate = 1/12 and B’s rate = 1/15. Together = 3/20 work per day. Time = 20/3 = 6.67 days.",
        "shortcut": "LCM method: total work 60 units; daily work = 5 + 4 = 9 units.",
        "commonMistake": "Do not add days directly."
      },
      {
        "id": "SSC-CGL-QA-009",
        "subject": "Quantitative Aptitude",
        "chapter": "Time and Work",
        "questionNumber": 9,
        "difficulty": "Moderate",
        "question": "A and B together complete a work in 6 days. A alone can complete it in 10 days. In how many days can B alone complete it?",
        "options": [
          {
            "label": "A",
            "text": "12 days"
          },
          {
            "label": "B",
            "text": "15 days"
          },
          {
            "label": "C",
            "text": "18 days"
          },
          {
            "label": "D",
            "text": "20 days"
          }
        ],
        "answer": "15 days",
        "explanation": "B’s rate = 1/6 - 1/10 = 4/60 = 1/15. So B alone takes 15 days.",
        "shortcut": "Subtract rates, not days.",
        "commonMistake": "Do not do 10 - 6 = 4 days."
      },
      {
        "id": "SSC-CGL-QA-010",
        "subject": "Quantitative Aptitude",
        "chapter": "Speed and Distance",
        "questionNumber": 10,
        "difficulty": "Easy",
        "question": "Two trains are 100 km apart and move towards each other at 40 km/h and 60 km/h. In how much time will they meet?",
        "options": [
          {
            "label": "A",
            "text": "30 minutes"
          },
          {
            "label": "B",
            "text": "1 hour"
          },
          {
            "label": "C",
            "text": "1.5 hours"
          },
          {
            "label": "D",
            "text": "2 hours"
          }
        ],
        "answer": "1 hour",
        "explanation": "Relative speed = 40 + 60 = 100 km/h. Time = distance/speed = 100/100 = 1 hour.",
        "shortcut": "Opposite direction means add speeds.",
        "commonMistake": "Do not use only one train’s speed."
      },
      {
        "id": "SSC-CGL-QA-011",
        "subject": "Quantitative Aptitude",
        "chapter": "Speed and Distance",
        "questionNumber": 11,
        "difficulty": "Easy",
        "question": "A car covers 180 km in 3 hours. What is its average speed?",
        "options": [
          {
            "label": "A",
            "text": "50 km/h"
          },
          {
            "label": "B",
            "text": "60 km/h"
          },
          {
            "label": "C",
            "text": "70 km/h"
          },
          {
            "label": "D",
            "text": "90 km/h"
          }
        ],
        "answer": "60 km/h",
        "explanation": "Average speed = total distance / total time = 180/3 = 60 km/h.",
        "shortcut": "Distance divided by time is enough when total distance and total time are given.",
        "commonMistake": "Do not divide 3 by 180."
      },
      {
        "id": "SSC-CGL-QA-012",
        "subject": "Quantitative Aptitude",
        "chapter": "Algebra",
        "questionNumber": 12,
        "difficulty": "Moderate",
        "question": "If x + 1/x = 5, find x² + 1/x².",
        "options": [
          {
            "label": "A",
            "text": "21"
          },
          {
            "label": "B",
            "text": "23"
          },
          {
            "label": "C",
            "text": "25"
          },
          {
            "label": "D",
            "text": "27"
          }
        ],
        "answer": "23",
        "explanation": "(x + 1/x)² = x² + 2 + 1/x². So 25 = required value + 2. Required value = 23.",
        "shortcut": "Square the given expression.",
        "commonMistake": "Do not forget the middle term 2."
      },
      {
        "id": "SSC-CGL-QA-013",
        "subject": "Quantitative Aptitude",
        "chapter": "Geometry",
        "questionNumber": 13,
        "difficulty": "Easy",
        "question": "Find the area of an equilateral triangle with side 10 cm.",
        "options": [
          {
            "label": "A",
            "text": "25√3 sq cm"
          },
          {
            "label": "B",
            "text": "50√3 sq cm"
          },
          {
            "label": "C",
            "text": "100√3 sq cm"
          },
          {
            "label": "D",
            "text": "75 sq cm"
          }
        ],
        "answer": "25√3 sq cm",
        "explanation": "Area = (√3/4) × a² = (√3/4) × 100 = 25√3 sq cm.",
        "shortcut": "Memorize the equilateral triangle area formula.",
        "commonMistake": "Do not use the right-triangle formula directly."
      },
      {
        "id": "SSC-CGL-QA-014",
        "subject": "Quantitative Aptitude",
        "chapter": "Mensuration",
        "questionNumber": 14,
        "difficulty": "Easy",
        "question": "Find the volume of a cylinder with radius 7 cm and height 10 cm. Use π = 22/7.",
        "options": [
          {
            "label": "A",
            "text": "1540 cu cm"
          },
          {
            "label": "B",
            "text": "1400 cu cm"
          },
          {
            "label": "C",
            "text": "770 cu cm"
          },
          {
            "label": "D",
            "text": "2200 cu cm"
          }
        ],
        "answer": "1540 cu cm",
        "explanation": "Volume = πr²h = 22/7 × 7 × 7 × 10 = 1540 cubic cm.",
        "shortcut": "Cancel 7 before multiplication.",
        "commonMistake": "Do not use curved surface area formula."
      },
      {
        "id": "SSC-CGL-QA-015",
        "subject": "Quantitative Aptitude",
        "chapter": "Data Interpretation",
        "questionNumber": 15,
        "difficulty": "Easy",
        "question": "A table shows sales of A, B, C and D as 120, 150, 180 and 210 units. Find the average sales.",
        "options": [
          {
            "label": "A",
            "text": "155"
          },
          {
            "label": "B",
            "text": "160"
          },
          {
            "label": "C",
            "text": "165"
          },
          {
            "label": "D",
            "text": "170"
          }
        ],
        "answer": "165",
        "explanation": "Total sales = 120 + 150 + 180 + 210 = 660. Average = 660/4 = 165.",
        "shortcut": "Average = total / number of entries.",
        "commonMistake": "Do not average only the highest and lowest values."
      },
      {
        "id": "SSC-CGL-QA-016",
        "subject": "Quantitative Aptitude",
        "chapter": "Data Interpretation",
        "questionNumber": 16,
        "difficulty": "Easy",
        "question": "Using sales A=120, B=150, C=180, D=210, find the ratio of A to D.",
        "options": [
          {
            "label": "A",
            "text": "4:7"
          },
          {
            "label": "B",
            "text": "2:3"
          },
          {
            "label": "C",
            "text": "3:5"
          },
          {
            "label": "D",
            "text": "5:7"
          }
        ],
        "answer": "4:7",
        "explanation": "A:D = 120:210 = 12:21 = 4:7.",
        "shortcut": "Divide both terms by the HCF.",
        "commonMistake": "Do not reverse the ratio."
      },
      {
        "id": "SSC-CGL-QA-017",
        "subject": "Quantitative Aptitude",
        "chapter": "Data Interpretation",
        "questionNumber": 17,
        "difficulty": "Moderate",
        "question": "Using sales A=120, B=150, C=180, D=210, C is what percent of total sales?",
        "options": [
          {
            "label": "A",
            "text": "25%"
          },
          {
            "label": "B",
            "text": "27.27%"
          },
          {
            "label": "C",
            "text": "30%"
          },
          {
            "label": "D",
            "text": "33.33%"
          }
        ],
        "answer": "27.27%",
        "explanation": "Total = 660. C = 180. Percent = 180/660 × 100 = 27.27%.",
        "shortcut": "Reduce 180/660 to 3/11.",
        "commonMistake": "Do not divide C by D."
      },
      {
        "id": "SSC-CGL-QA-018",
        "subject": "Quantitative Aptitude",
        "chapter": "Data Interpretation",
        "questionNumber": 18,
        "difficulty": "Easy",
        "question": "Using sales A=120, B=150, C=180, D=210, find the difference between highest and lowest sales.",
        "options": [
          {
            "label": "A",
            "text": "60"
          },
          {
            "label": "B",
            "text": "70"
          },
          {
            "label": "C",
            "text": "80"
          },
          {
            "label": "D",
            "text": "90"
          }
        ],
        "answer": "90",
        "explanation": "Highest = 210 and lowest = 120. Difference = 90.",
        "shortcut": "Identify extremes first.",
        "commonMistake": "Do not subtract adjacent values blindly."
      },
      {
        "id": "SSC-CGL-QA-019",
        "subject": "Quantitative Aptitude",
        "chapter": "Data Interpretation",
        "questionNumber": 19,
        "difficulty": "Easy",
        "question": "Using sales A=120, B=150, C=180, D=210, if each value increases by 10%, what is the new total?",
        "options": [
          {
            "label": "A",
            "text": "660"
          },
          {
            "label": "B",
            "text": "700"
          },
          {
            "label": "C",
            "text": "726"
          },
          {
            "label": "D",
            "text": "760"
          }
        ],
        "answer": "726",
        "explanation": "Old total = 660. New total = 660 + 10% of 660 = 726.",
        "shortcut": "Increase the total directly when all entries increase by the same percent.",
        "commonMistake": "Do not add 10 to each value."
      },
      {
        "id": "SSC-CGL-QA-020",
        "subject": "Quantitative Aptitude",
        "chapter": "Data Interpretation",
        "questionNumber": 20,
        "difficulty": "Moderate",
        "question": "Using sales A=120, B=150, C=180, D=210, B is how much less than D?",
        "options": [
          {
            "label": "A",
            "text": "20%"
          },
          {
            "label": "B",
            "text": "25%"
          },
          {
            "label": "C",
            "text": "28.57%"
          },
          {
            "label": "D",
            "text": "40%"
          }
        ],
        "answer": "28.57%",
        "explanation": "Difference = 60. Compared to D, percent less = 60/210 × 100 = 28.57%.",
        "shortcut": "For “less than D,” denominator is D.",
        "commonMistake": "Do not use B as denominator unless asked “increase from B to D.”"
      },
      {
        "id": "SSC-CGL-QA-021",
        "subject": "Quantitative Aptitude",
        "chapter": "Number System",
        "questionNumber": 21,
        "difficulty": "Easy",
        "question": "Find the HCF of 36 and 84.",
        "options": [
          {
            "label": "A",
            "text": "6"
          },
          {
            "label": "B",
            "text": "12"
          },
          {
            "label": "C",
            "text": "18"
          },
          {
            "label": "D",
            "text": "24"
          }
        ],
        "answer": "12",
        "explanation": "36 = 2² × 3² and 84 = 2² × 3 × 7. Common product = 2² × 3 = 12.",
        "shortcut": "Prime factorization is reliable.",
        "commonMistake": "Do not confuse HCF with LCM."
      },
      {
        "id": "SSC-CGL-QA-022",
        "subject": "Quantitative Aptitude",
        "chapter": "Simplification",
        "questionNumber": 22,
        "difficulty": "Easy",
        "question": "Find 25% of 40% of 50% of 2000.",
        "options": [
          {
            "label": "A",
            "text": "50"
          },
          {
            "label": "B",
            "text": "100"
          },
          {
            "label": "C",
            "text": "200"
          },
          {
            "label": "D",
            "text": "250"
          }
        ],
        "answer": "100",
        "explanation": "50% of 2000 = 1000; 40% of 1000 = 400; 25% of 400 = 100.",
        "shortcut": "Work from right to left.",
        "commonMistake": "Do not add percentages."
      },
      {
        "id": "SSC-CGL-QA-023",
        "subject": "Quantitative Aptitude",
        "chapter": "Average",
        "questionNumber": 23,
        "difficulty": "Easy",
        "question": "Find the average of the first 10 natural numbers.",
        "options": [
          {
            "label": "A",
            "text": "4.5"
          },
          {
            "label": "B",
            "text": "5"
          },
          {
            "label": "C",
            "text": "5.5"
          },
          {
            "label": "D",
            "text": "6"
          }
        ],
        "answer": "5.5",
        "explanation": "Sum of first 10 natural numbers = 10 × 11 / 2 = 55. Average = 55/10 = 5.5.",
        "shortcut": "Average of 1 to n is (n+1)/2.",
        "commonMistake": "Do not include zero here."
      },
      {
        "id": "SSC-CGL-QA-024",
        "subject": "Quantitative Aptitude",
        "chapter": "Simplification",
        "questionNumber": 24,
        "difficulty": "Easy",
        "question": "Find the square root of 0.0009.",
        "options": [
          {
            "label": "A",
            "text": "0.003"
          },
          {
            "label": "B",
            "text": "0.03"
          },
          {
            "label": "C",
            "text": "0.3"
          },
          {
            "label": "D",
            "text": "0.09"
          }
        ],
        "answer": "0.03",
        "explanation": "0.0009 = 9/10000. Square root = 3/100 = 0.03.",
        "shortcut": "Count decimal places carefully.",
        "commonMistake": "Do not answer 0.3."
      },
      {
        "id": "SSC-CGL-QA-025",
        "subject": "Quantitative Aptitude",
        "chapter": "Number Series",
        "questionNumber": 25,
        "difficulty": "Easy",
        "question": "Find 2² + 3² + ... + 10².",
        "options": [
          {
            "label": "A",
            "text": "380"
          },
          {
            "label": "B",
            "text": "384"
          },
          {
            "label": "C",
            "text": "385"
          },
          {
            "label": "D",
            "text": "386"
          }
        ],
        "answer": "384",
        "explanation": "Sum of squares from 1² to 10² is 385. Subtract 1² = 1. Required sum = 384.",
        "shortcut": "Memorize 1² to 10² sum = 385 or use formula.",
        "commonMistake": "Do not include 1²."
      }
    ]
  },
  {
    "slug": "general-intelligence-reasoning",
    "title": "General Intelligence and Reasoning",
    "hindiTitle": "सामान्य बुद्धिमत्ता एवं तर्क",
    "description": "Analogy, coding, blood relation, series, direction, syllogism, Venn diagram, and arrangement — reasoning pattern practice.",
    "questions": [
      {
        "id": "SSC-CGL-GIR-001",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Analogy",
        "questionNumber": 1,
        "difficulty": "Easy",
        "question": "Doctor : Hospital :: Teacher : ?",
        "options": [
          {
            "label": "A",
            "text": "Court"
          },
          {
            "label": "B",
            "text": "School"
          },
          {
            "label": "C",
            "text": "Farm"
          },
          {
            "label": "D",
            "text": "Bank"
          }
        ],
        "answer": "School",
        "explanation": "A doctor commonly works in a hospital; a teacher commonly works in a school.",
        "shortcut": "Relation: profession and workplace.",
        "commonMistake": "Do not choose a place unrelated to the profession."
      },
      {
        "id": "SSC-CGL-GIR-002",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Analogy",
        "questionNumber": 2,
        "difficulty": "Moderate",
        "question": "25 : 125 :: 36 : ?",
        "options": [
          {
            "label": "A",
            "text": "144"
          },
          {
            "label": "B",
            "text": "180"
          },
          {
            "label": "C",
            "text": "216"
          },
          {
            "label": "D",
            "text": "256"
          }
        ],
        "answer": "216",
        "explanation": "25 is 5² and 125 is 5³. Similarly, 36 is 6², so answer is 6³ = 216.",
        "shortcut": "Square to cube relation.",
        "commonMistake": "Do not multiply by 5 mechanically."
      },
      {
        "id": "SSC-CGL-GIR-003",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Coding-Decoding",
        "questionNumber": 3,
        "difficulty": "Easy",
        "question": "If A=1, B=2, C=3, and so on, then CAT = ?",
        "options": [
          {
            "label": "A",
            "text": "24"
          },
          {
            "label": "B",
            "text": "27"
          },
          {
            "label": "C",
            "text": "31"
          },
          {
            "label": "D",
            "text": "42"
          }
        ],
        "answer": "24",
        "explanation": "C=3, A=1, T=20. Sum = 24.",
        "shortcut": "Alphabet position sum.",
        "commonMistake": "Do not use reverse alphabet unless specified."
      },
      {
        "id": "SSC-CGL-GIR-004",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Coding-Decoding",
        "questionNumber": 4,
        "difficulty": "Easy",
        "question": "If APPLE is written as BQQMF, then ORANGE is written as ?",
        "options": [
          {
            "label": "A",
            "text": "PSBOHF"
          },
          {
            "label": "B",
            "text": "PSBOGF"
          },
          {
            "label": "C",
            "text": "PQBOHF"
          },
          {
            "label": "D",
            "text": "PSBNHF"
          }
        ],
        "answer": "PSBOHF",
        "explanation": "Each letter is shifted one step forward: O→P, R→S, A→B, N→O, G→H, E→F.",
        "shortcut": "Forward +1 coding.",
        "commonMistake": "Check every letter; one wrong letter changes the answer."
      },
      {
        "id": "SSC-CGL-GIR-005",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Blood Relation",
        "questionNumber": 5,
        "difficulty": "Moderate",
        "question": "Pointing to a photo, a man says, “His mother is the only daughter of my mother.” How is the man related to the person in the photo?",
        "options": [
          {
            "label": "A",
            "text": "Father"
          },
          {
            "label": "B",
            "text": "Maternal uncle"
          },
          {
            "label": "C",
            "text": "Brother"
          },
          {
            "label": "D",
            "text": "Son"
          }
        ],
        "answer": "Maternal uncle",
        "explanation": "Only daughter of my mother = my sister. Her son is my nephew. So the man is the maternal uncle of the person.",
        "shortcut": "Convert the statement into a family tree.",
        "commonMistake": "Do not assume the speaker is female."
      },
      {
        "id": "SSC-CGL-GIR-006",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Blood Relation",
        "questionNumber": 6,
        "difficulty": "Easy",
        "question": "A is the brother of B. B is the daughter of C. How is C related to A?",
        "options": [
          {
            "label": "A",
            "text": "Father only"
          },
          {
            "label": "B",
            "text": "Mother only"
          },
          {
            "label": "C",
            "text": "Parent"
          },
          {
            "label": "D",
            "text": "Sister"
          }
        ],
        "answer": "Parent",
        "explanation": "B is daughter of C, and A is B’s brother. So C is a parent of A. Gender is not fixed.",
        "shortcut": "When gender is not given, use a gender-neutral relation.",
        "commonMistake": "Do not assume C is father."
      },
      {
        "id": "SSC-CGL-GIR-007",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Series",
        "questionNumber": 7,
        "difficulty": "Easy",
        "question": "Find the next term: 2, 6, 12, 20, 30, ?",
        "options": [
          {
            "label": "A",
            "text": "36"
          },
          {
            "label": "B",
            "text": "40"
          },
          {
            "label": "C",
            "text": "42"
          },
          {
            "label": "D",
            "text": "44"
          }
        ],
        "answer": "42",
        "explanation": "Differences are 4, 6, 8, 10. Next difference = 12. So 30 + 12 = 42.",
        "shortcut": "Look at differences.",
        "commonMistake": "Do not multiply by a fixed number."
      },
      {
        "id": "SSC-CGL-GIR-008",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Alphabet Series",
        "questionNumber": 8,
        "difficulty": "Easy",
        "question": "Find the next term: AZ, BY, CX, ?",
        "options": [
          {
            "label": "A",
            "text": "DW"
          },
          {
            "label": "B",
            "text": "EV"
          },
          {
            "label": "C",
            "text": "DX"
          },
          {
            "label": "D",
            "text": "CY"
          }
        ],
        "answer": "DW",
        "explanation": "First letters move forward A, B, C, D. Second letters move backward Z, Y, X, W.",
        "shortcut": "Track both positions separately.",
        "commonMistake": "Do not track only the first letter."
      },
      {
        "id": "SSC-CGL-GIR-009",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Direction Sense",
        "questionNumber": 9,
        "difficulty": "Easy",
        "question": "A man walks 10 m north, turns right and walks 10 m, then turns right and walks 10 m. In which direction is he from the starting point?",
        "options": [
          {
            "label": "A",
            "text": "North"
          },
          {
            "label": "B",
            "text": "East"
          },
          {
            "label": "C",
            "text": "South"
          },
          {
            "label": "D",
            "text": "West"
          }
        ],
        "answer": "East",
        "explanation": "He goes north, then east, then south. Final position is 10 m east of the start.",
        "shortcut": "Draw a small line diagram.",
        "commonMistake": "Do not answer based only on the last facing direction."
      },
      {
        "id": "SSC-CGL-GIR-010",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Syllogism",
        "questionNumber": 10,
        "difficulty": "Moderate",
        "question": "Statements: All dogs are animals. Some animals are cats. Which conclusion definitely follows?",
        "options": [
          {
            "label": "A",
            "text": "All cats are dogs"
          },
          {
            "label": "B",
            "text": "Some dogs are cats"
          },
          {
            "label": "C",
            "text": "Some animals are dogs"
          },
          {
            "label": "D",
            "text": "No dog is cat"
          }
        ],
        "answer": "Some animals are dogs",
        "explanation": "If all dogs are animals, then dogs are definitely included in animals. Other conclusions are not definite.",
        "shortcut": "Accept only definite conclusions.",
        "commonMistake": "Do not connect cats and dogs without proof."
      },
      {
        "id": "SSC-CGL-GIR-011",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Odd One Out",
        "questionNumber": 11,
        "difficulty": "Easy",
        "question": "Choose the odd one: 121, 169, 225, 256.",
        "options": [
          {
            "label": "A",
            "text": "121"
          },
          {
            "label": "B",
            "text": "169"
          },
          {
            "label": "C",
            "text": "225"
          },
          {
            "label": "D",
            "text": "256"
          }
        ],
        "answer": "256",
        "explanation": "121=11², 169=13² and 225=15² are squares of odd numbers. 256=16² is a square of an even number.",
        "shortcut": "When all are squares, check deeper property.",
        "commonMistake": "Do not stop at square/non-square."
      },
      {
        "id": "SSC-CGL-GIR-012",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Odd One Out",
        "questionNumber": 12,
        "difficulty": "Easy",
        "question": "Choose the odd one: Apple, Banana, Carrot, Mango.",
        "options": [
          {
            "label": "A",
            "text": "Apple"
          },
          {
            "label": "B",
            "text": "Banana"
          },
          {
            "label": "C",
            "text": "Carrot"
          },
          {
            "label": "D",
            "text": "Mango"
          }
        ],
        "answer": "Carrot",
        "explanation": "Apple, Banana and Mango are fruits. Carrot is a vegetable/root.",
        "shortcut": "Category classification.",
        "commonMistake": "Do not group by color or taste unless that relation is stronger."
      },
      {
        "id": "SSC-CGL-GIR-013",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Venn Diagram",
        "questionNumber": 13,
        "difficulty": "Easy",
        "question": "In a class, 40 students like Maths, 30 like English, and 10 like both. How many like at least one of the two subjects?",
        "options": [
          {
            "label": "A",
            "text": "50"
          },
          {
            "label": "B",
            "text": "60"
          },
          {
            "label": "C",
            "text": "70"
          },
          {
            "label": "D",
            "text": "80"
          }
        ],
        "answer": "60",
        "explanation": "At least one = 40 + 30 - 10 = 60.",
        "shortcut": "Use inclusion-exclusion.",
        "commonMistake": "Do not add 40 and 30 without subtracting overlap."
      },
      {
        "id": "SSC-CGL-GIR-014",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Venn Diagram",
        "questionNumber": 14,
        "difficulty": "Moderate",
        "question": "Out of 100 people, 60 like tea, 50 like coffee and 20 like both. How many like neither?",
        "options": [
          {
            "label": "A",
            "text": "10"
          },
          {
            "label": "B",
            "text": "20"
          },
          {
            "label": "C",
            "text": "30"
          },
          {
            "label": "D",
            "text": "40"
          }
        ],
        "answer": "10",
        "explanation": "At least one = 60 + 50 - 20 = 90. Neither = 100 - 90 = 10.",
        "shortcut": "Neither = total - union.",
        "commonMistake": "Do not subtract both groups directly from total."
      },
      {
        "id": "SSC-CGL-GIR-015",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Seating Arrangement",
        "questionNumber": 15,
        "difficulty": "Easy",
        "question": "Five people A, B, C, D and E sit in a row. B is to the immediate right of A. C is to the immediate right of B. Who is in the middle among A, B and C?",
        "options": [
          {
            "label": "A",
            "text": "A"
          },
          {
            "label": "B",
            "text": "B"
          },
          {
            "label": "C",
            "text": "C"
          },
          {
            "label": "D",
            "text": "D"
          }
        ],
        "answer": "B",
        "explanation": "The order of these three is A-B-C, so B is in the middle.",
        "shortcut": "Fix definite blocks first.",
        "commonMistake": "Do not consider D and E because the question asks only among A, B and C."
      },
      {
        "id": "SSC-CGL-GIR-016",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Ordered Coding",
        "questionNumber": 16,
        "difficulty": "Easy",
        "question": "If Monday is coded as 1, Tuesday as 2, and so on, what is Friday coded as?",
        "options": [
          {
            "label": "A",
            "text": "4"
          },
          {
            "label": "B",
            "text": "5"
          },
          {
            "label": "C",
            "text": "6"
          },
          {
            "label": "D",
            "text": "7"
          }
        ],
        "answer": "5",
        "explanation": "Counting from Monday: Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5.",
        "shortcut": "Use the given starting point.",
        "commonMistake": "Do not start from Sunday unless specified."
      },
      {
        "id": "SSC-CGL-GIR-017",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Matrix",
        "questionNumber": 17,
        "difficulty": "Easy",
        "question": "Find the missing number: Row 1: 2, 3, 5; Row 2: 4, 5, 9; Row 3: 6, 7, ?",
        "options": [
          {
            "label": "A",
            "text": "11"
          },
          {
            "label": "B",
            "text": "12"
          },
          {
            "label": "C",
            "text": "13"
          },
          {
            "label": "D",
            "text": "14"
          }
        ],
        "answer": "13",
        "explanation": "In each row, third number = first + second. So 6 + 7 = 13.",
        "shortcut": "Check row-wise relation first.",
        "commonMistake": "Do not force a column rule if it does not fit all rows."
      },
      {
        "id": "SSC-CGL-GIR-018",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Number Analogy",
        "questionNumber": 18,
        "difficulty": "Easy",
        "question": "9 : 81 :: 11 : ?",
        "options": [
          {
            "label": "A",
            "text": "99"
          },
          {
            "label": "B",
            "text": "110"
          },
          {
            "label": "C",
            "text": "121"
          },
          {
            "label": "D",
            "text": "132"
          }
        ],
        "answer": "121",
        "explanation": "9 maps to 9² = 81. So 11 maps to 11² = 121.",
        "shortcut": "Number to its square.",
        "commonMistake": "Do not multiply by 9."
      },
      {
        "id": "SSC-CGL-GIR-019",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Mirror Image Concept",
        "questionNumber": 19,
        "difficulty": "Easy",
        "question": "In the mirror image of the word TAIPOQ, which side will the letter T appear?",
        "options": [
          {
            "label": "A",
            "text": "Leftmost"
          },
          {
            "label": "B",
            "text": "Rightmost"
          },
          {
            "label": "C",
            "text": "Middle"
          },
          {
            "label": "D",
            "text": "Not visible"
          }
        ],
        "answer": "Rightmost",
        "explanation": "A mirror reverses left and right. The first letter moves to the last visible position.",
        "shortcut": "For word mirror images, order reverses.",
        "commonMistake": "Do not read the mirror image as normal text."
      },
      {
        "id": "SSC-CGL-GIR-020",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Paper Folding Concept",
        "questionNumber": 20,
        "difficulty": "Easy",
        "question": "A square paper is folded once vertically and punched near the folded edge. After unfolding, how many holes appear?",
        "options": [
          {
            "label": "A",
            "text": "1"
          },
          {
            "label": "B",
            "text": "2"
          },
          {
            "label": "C",
            "text": "3"
          },
          {
            "label": "D",
            "text": "4"
          }
        ],
        "answer": "2",
        "explanation": "One vertical fold creates two layers. A punch through both layers gives two symmetric holes.",
        "shortcut": "One fold usually doubles the visible punch count.",
        "commonMistake": "Do not count only the visible folded layer."
      },
      {
        "id": "SSC-CGL-GIR-021",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Embedded Figure Concept",
        "questionNumber": 21,
        "difficulty": "Easy",
        "question": "If a small triangle is hidden inside a complex figure, which skill is mainly being tested?",
        "options": [
          {
            "label": "A",
            "text": "Vocabulary"
          },
          {
            "label": "B",
            "text": "Visual recognition"
          },
          {
            "label": "C",
            "text": "Calculation"
          },
          {
            "label": "D",
            "text": "Grammar"
          }
        ],
        "answer": "Visual recognition",
        "explanation": "Embedded figure questions test whether you can identify a given shape inside a larger figure.",
        "shortcut": "Focus on orientation and outlines.",
        "commonMistake": "Do not look for numerical patterns."
      },
      {
        "id": "SSC-CGL-GIR-022",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Counting Figures",
        "questionNumber": 22,
        "difficulty": "Moderate",
        "question": "A large triangle is divided into 4 small non-overlapping triangles. At minimum, how many triangles can be counted?",
        "options": [
          {
            "label": "A",
            "text": "4"
          },
          {
            "label": "B",
            "text": "5"
          },
          {
            "label": "C",
            "text": "6"
          },
          {
            "label": "D",
            "text": "8"
          }
        ],
        "answer": "5",
        "explanation": "The 4 small triangles plus the one large outer triangle give at least 5 triangles.",
        "shortcut": "Count small figures and the complete outer figure.",
        "commonMistake": "Do not forget the largest figure."
      },
      {
        "id": "SSC-CGL-GIR-023",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Calendar",
        "questionNumber": 23,
        "difficulty": "Easy",
        "question": "If today is Wednesday, what day will it be after 10 days?",
        "options": [
          {
            "label": "A",
            "text": "Friday"
          },
          {
            "label": "B",
            "text": "Saturday"
          },
          {
            "label": "C",
            "text": "Sunday"
          },
          {
            "label": "D",
            "text": "Monday"
          }
        ],
        "answer": "Saturday",
        "explanation": "10 days later means 10 mod 7 = 3 days ahead. Wednesday + 3 = Saturday.",
        "shortcut": "Use the remainder after division by 7.",
        "commonMistake": "Do not count the present day as day 1 unless asked."
      },
      {
        "id": "SSC-CGL-GIR-024",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Ranking",
        "questionNumber": 24,
        "difficulty": "Easy",
        "question": "In a row, Ramesh is 12th from the left and 18th from the right. How many persons are there in the row?",
        "options": [
          {
            "label": "A",
            "text": "28"
          },
          {
            "label": "B",
            "text": "29"
          },
          {
            "label": "C",
            "text": "30"
          },
          {
            "label": "D",
            "text": "31"
          }
        ],
        "answer": "29",
        "explanation": "Total = left position + right position - 1 = 12 + 18 - 1 = 29.",
        "shortcut": "Subtract 1 because the person is counted twice.",
        "commonMistake": "Do not add without subtracting one."
      },
      {
        "id": "SSC-CGL-GIR-025",
        "subject": "General Intelligence and Reasoning",
        "chapter": "Alphabet Test",
        "questionNumber": 25,
        "difficulty": "Easy",
        "question": "Which letter is 5th to the right of M in the English alphabet?",
        "options": [
          {
            "label": "A",
            "text": "Q"
          },
          {
            "label": "B",
            "text": "R"
          },
          {
            "label": "C",
            "text": "S"
          },
          {
            "label": "D",
            "text": "T"
          }
        ],
        "answer": "R",
        "explanation": "M → N(1), O(2), P(3), Q(4), R(5).",
        "shortcut": "Count steps carefully.",
        "commonMistake": "Do not count M as the first step."
      }
    ]
  },
  {
    "slug": "english-comprehension",
    "title": "English Comprehension",
    "hindiTitle": "अंग्रेज़ी समझ",
    "description": "Grammar, vocabulary, comprehension, and sentence improvement — English section pattern practice.",
    "questions": [
      {
        "id": "SSC-CGL-ENG-001",
        "subject": "English Comprehension",
        "chapter": "Error Spotting",
        "questionNumber": 1,
        "difficulty": "Moderate",
        "question": "Choose the corrected sentence: “The committee have submitted its report.”",
        "options": [
          {
            "label": "A",
            "text": "The committee has submitted its report."
          },
          {
            "label": "B",
            "text": "The committee have submitted their report."
          },
          {
            "label": "C",
            "text": "The committee has submit its report."
          },
          {
            "label": "D",
            "text": "No correction"
          }
        ],
        "answer": "The committee has submitted its report.",
        "explanation": "Committee is treated as one body here, so the singular verb “has” is used.",
        "shortcut": "Collective noun as one unit → singular verb.",
        "commonMistake": "Do not use a plural verb when the group acts as one unit."
      },
      {
        "id": "SSC-CGL-ENG-002",
        "subject": "English Comprehension",
        "chapter": "Subject-Verb Agreement",
        "questionNumber": 2,
        "difficulty": "Moderate",
        "question": "Choose the correct sentence.",
        "options": [
          {
            "label": "A",
            "text": "Neither the manager nor his assistants was present."
          },
          {
            "label": "B",
            "text": "Neither the manager nor his assistants were present."
          },
          {
            "label": "C",
            "text": "Neither manager nor assistants was present."
          },
          {
            "label": "D",
            "text": "Neither the manager or his assistants were present."
          }
        ],
        "answer": "Neither the manager nor his assistants were present.",
        "explanation": "With neither...nor, the verb agrees with the nearer subject. The nearer subject is “assistants,” so use “were.”",
        "shortcut": "Nearer subject rule.",
        "commonMistake": "Do not make the verb agree with the first subject."
      },
      {
        "id": "SSC-CGL-ENG-003",
        "subject": "English Comprehension",
        "chapter": "Article",
        "questionNumber": 3,
        "difficulty": "Easy",
        "question": "He is ___ honest man.",
        "options": [
          {
            "label": "A",
            "text": "a"
          },
          {
            "label": "B",
            "text": "an"
          },
          {
            "label": "C",
            "text": "the"
          },
          {
            "label": "D",
            "text": "no article"
          }
        ],
        "answer": "an",
        "explanation": "The word “honest” begins with a vowel sound because h is silent. So “an” is used.",
        "shortcut": "Article depends on sound, not spelling alone.",
        "commonMistake": "Do not choose “a” only because h is a consonant letter."
      },
      {
        "id": "SSC-CGL-ENG-004",
        "subject": "English Comprehension",
        "chapter": "Preposition",
        "questionNumber": 4,
        "difficulty": "Easy",
        "question": "She is good ___ mathematics.",
        "options": [
          {
            "label": "A",
            "text": "in"
          },
          {
            "label": "B",
            "text": "at"
          },
          {
            "label": "C",
            "text": "on"
          },
          {
            "label": "D",
            "text": "for"
          }
        ],
        "answer": "at",
        "explanation": "The standard phrase is “good at” a subject or activity.",
        "shortcut": "Good at = skilled in.",
        "commonMistake": "Avoid “good in” in standard exam grammar."
      },
      {
        "id": "SSC-CGL-ENG-005",
        "subject": "English Comprehension",
        "chapter": "Synonym",
        "questionNumber": 5,
        "difficulty": "Easy",
        "question": "Choose the synonym of “Eloquent.”",
        "options": [
          {
            "label": "A",
            "text": "Fluent"
          },
          {
            "label": "B",
            "text": "Silent"
          },
          {
            "label": "C",
            "text": "Weak"
          },
          {
            "label": "D",
            "text": "Angry"
          }
        ],
        "answer": "Fluent",
        "explanation": "Eloquent means able to express ideas clearly and effectively.",
        "shortcut": "Eloquent speech is fluent and expressive.",
        "commonMistake": "Do not confuse it with silent."
      },
      {
        "id": "SSC-CGL-ENG-006",
        "subject": "English Comprehension",
        "chapter": "Synonym",
        "questionNumber": 6,
        "difficulty": "Easy",
        "question": "Choose the synonym of “Benevolent.”",
        "options": [
          {
            "label": "A",
            "text": "Kind"
          },
          {
            "label": "B",
            "text": "Cruel"
          },
          {
            "label": "C",
            "text": "Careless"
          },
          {
            "label": "D",
            "text": "Proud"
          }
        ],
        "answer": "Kind",
        "explanation": "Benevolent means kind and helpful.",
        "shortcut": "Bene = good can be a root clue.",
        "commonMistake": "Do not confuse it with brilliant."
      },
      {
        "id": "SSC-CGL-ENG-007",
        "subject": "English Comprehension",
        "chapter": "Antonym",
        "questionNumber": 7,
        "difficulty": "Easy",
        "question": "Choose the antonym of “Optimist.”",
        "options": [
          {
            "label": "A",
            "text": "Pessimist"
          },
          {
            "label": "B",
            "text": "Realist"
          },
          {
            "label": "C",
            "text": "Artist"
          },
          {
            "label": "D",
            "text": "Tourist"
          }
        ],
        "answer": "Pessimist",
        "explanation": "An optimist expects good results; a pessimist expects bad results.",
        "shortcut": "Opposite pair: optimistic/pessimistic.",
        "commonMistake": "Realist is not the direct opposite."
      },
      {
        "id": "SSC-CGL-ENG-008",
        "subject": "English Comprehension",
        "chapter": "Antonym",
        "questionNumber": 8,
        "difficulty": "Easy",
        "question": "Choose the antonym of “Ancient.”",
        "options": [
          {
            "label": "A",
            "text": "Old"
          },
          {
            "label": "B",
            "text": "Modern"
          },
          {
            "label": "C",
            "text": "Historic"
          },
          {
            "label": "D",
            "text": "Past"
          }
        ],
        "answer": "Modern",
        "explanation": "Ancient means very old; modern means of the present or recent times.",
        "shortcut": "Ancient vs modern is a common pair.",
        "commonMistake": "Old is similar, not opposite."
      },
      {
        "id": "SSC-CGL-ENG-009",
        "subject": "English Comprehension",
        "chapter": "One Word Substitution",
        "questionNumber": 9,
        "difficulty": "Easy",
        "question": "One who cannot be corrected is called:",
        "options": [
          {
            "label": "A",
            "text": "Incorrigible"
          },
          {
            "label": "B",
            "text": "Invisible"
          },
          {
            "label": "C",
            "text": "Irregular"
          },
          {
            "label": "D",
            "text": "Incredible"
          }
        ],
        "answer": "Incorrigible",
        "explanation": "Incorrigible means unable to be corrected or reformed.",
        "shortcut": "Corrigible relates to correction; in- can mean not.",
        "commonMistake": "Do not choose incredible."
      },
      {
        "id": "SSC-CGL-ENG-010",
        "subject": "English Comprehension",
        "chapter": "One Word Substitution",
        "questionNumber": 10,
        "difficulty": "Easy",
        "question": "A government by the people is called:",
        "options": [
          {
            "label": "A",
            "text": "Monarchy"
          },
          {
            "label": "B",
            "text": "Democracy"
          },
          {
            "label": "C",
            "text": "Oligarchy"
          },
          {
            "label": "D",
            "text": "Autocracy"
          }
        ],
        "answer": "Democracy",
        "explanation": "Democracy is a system where power belongs to the people, directly or through representatives.",
        "shortcut": "Demo = people.",
        "commonMistake": "Do not confuse monarchy with rule by one person."
      },
      {
        "id": "SSC-CGL-ENG-011",
        "subject": "English Comprehension",
        "chapter": "Idiom",
        "questionNumber": 11,
        "difficulty": "Easy",
        "question": "“A piece of cake” means:",
        "options": [
          {
            "label": "A",
            "text": "A difficult task"
          },
          {
            "label": "B",
            "text": "An easy task"
          },
          {
            "label": "C",
            "text": "A sweet dish only"
          },
          {
            "label": "D",
            "text": "A secret plan"
          }
        ],
        "answer": "An easy task",
        "explanation": "The idiom means something very easy to do.",
        "shortcut": "Idioms are not always literal.",
        "commonMistake": "Do not select the literal food meaning."
      },
      {
        "id": "SSC-CGL-ENG-012",
        "subject": "English Comprehension",
        "chapter": "Idiom",
        "questionNumber": 12,
        "difficulty": "Easy",
        "question": "“Break the ice” means:",
        "options": [
          {
            "label": "A",
            "text": "Start a conversation"
          },
          {
            "label": "B",
            "text": "Destroy something"
          },
          {
            "label": "C",
            "text": "Cool water"
          },
          {
            "label": "D",
            "text": "End a meeting"
          }
        ],
        "answer": "Start a conversation",
        "explanation": "It means to reduce initial awkwardness and begin interaction.",
        "shortcut": "Think of removing social stiffness.",
        "commonMistake": "Do not take “ice” literally."
      },
      {
        "id": "SSC-CGL-ENG-013",
        "subject": "English Comprehension",
        "chapter": "Cloze Grammar",
        "questionNumber": 13,
        "difficulty": "Easy",
        "question": "Choose the best word: Reading is a habit ___ improves vocabulary.",
        "options": [
          {
            "label": "A",
            "text": "who"
          },
          {
            "label": "B",
            "text": "which"
          },
          {
            "label": "C",
            "text": "where"
          },
          {
            "label": "D",
            "text": "what"
          }
        ],
        "answer": "which",
        "explanation": "The relative pronoun “which” refers to the habit.",
        "shortcut": "Which refers to things or ideas.",
        "commonMistake": "Do not use “who” for non-person nouns."
      },
      {
        "id": "SSC-CGL-ENG-014",
        "subject": "English Comprehension",
        "chapter": "Cloze Grammar",
        "questionNumber": 14,
        "difficulty": "Easy",
        "question": "Choose the best word: He worked hard ___ he could pass the exam.",
        "options": [
          {
            "label": "A",
            "text": "so that"
          },
          {
            "label": "B",
            "text": "because"
          },
          {
            "label": "C",
            "text": "although"
          },
          {
            "label": "D",
            "text": "unless"
          }
        ],
        "answer": "so that",
        "explanation": "“So that” shows purpose: he worked hard in order to pass.",
        "shortcut": "Purpose connector = so that.",
        "commonMistake": "Because gives reason, not purpose here."
      },
      {
        "id": "SSC-CGL-ENG-015",
        "subject": "English Comprehension",
        "chapter": "Cloze Grammar",
        "questionNumber": 15,
        "difficulty": "Easy",
        "question": "Choose the best word: The train had left ___ we reached the station.",
        "options": [
          {
            "label": "A",
            "text": "before"
          },
          {
            "label": "B",
            "text": "after"
          },
          {
            "label": "C",
            "text": "until"
          },
          {
            "label": "D",
            "text": "since"
          }
        ],
        "answer": "before",
        "explanation": "The train leaving happened earlier than reaching the station.",
        "shortcut": "Past perfect often pairs with before/when.",
        "commonMistake": "Do not use “after”; it reverses the meaning."
      },
      {
        "id": "SSC-CGL-ENG-016",
        "subject": "English Comprehension",
        "chapter": "Cloze Vocabulary",
        "questionNumber": 16,
        "difficulty": "Easy",
        "question": "Choose the best word: Regular practice brings ___ in typing speed.",
        "options": [
          {
            "label": "A",
            "text": "improvement"
          },
          {
            "label": "B",
            "text": "damage"
          },
          {
            "label": "C",
            "text": "delay"
          },
          {
            "label": "D",
            "text": "confusion"
          }
        ],
        "answer": "improvement",
        "explanation": "Practice generally increases or improves skill.",
        "shortcut": "Use context meaning.",
        "commonMistake": "Do not pick a negative word against the context."
      },
      {
        "id": "SSC-CGL-ENG-017",
        "subject": "English Comprehension",
        "chapter": "Cloze Vocabulary",
        "questionNumber": 17,
        "difficulty": "Easy",
        "question": "Choose the best word: A calm mind helps in making a ___ decision.",
        "options": [
          {
            "label": "A",
            "text": "wise"
          },
          {
            "label": "B",
            "text": "noisy"
          },
          {
            "label": "C",
            "text": "heavy"
          },
          {
            "label": "D",
            "text": "blank"
          }
        ],
        "answer": "wise",
        "explanation": "A calm mind helps in making a sensible or wise decision.",
        "shortcut": "Choose the adjective that fits “decision.”",
        "commonMistake": "Do not choose words that describe sound or weight."
      },
      {
        "id": "SSC-CGL-ENG-018",
        "subject": "English Comprehension",
        "chapter": "Reading Comprehension",
        "questionNumber": 18,
        "difficulty": "Easy",
        "question": "A passage says: “Trees reduce heat and improve air quality.” What is the main idea?",
        "options": [
          {
            "label": "A",
            "text": "Trees are useful for the environment."
          },
          {
            "label": "B",
            "text": "Trees increase pollution."
          },
          {
            "label": "C",
            "text": "Trees stop all rain."
          },
          {
            "label": "D",
            "text": "Trees are only for decoration."
          }
        ],
        "answer": "Trees are useful for the environment.",
        "explanation": "The sentence gives two environmental benefits of trees.",
        "shortcut": "Main idea summarizes the whole point.",
        "commonMistake": "Do not choose an extreme statement not given."
      },
      {
        "id": "SSC-CGL-ENG-019",
        "subject": "English Comprehension",
        "chapter": "Vocabulary in Context",
        "questionNumber": 19,
        "difficulty": "Easy",
        "question": "In the sentence “Water conservation is essential,” what does “essential” mean?",
        "options": [
          {
            "label": "A",
            "text": "Optional"
          },
          {
            "label": "B",
            "text": "Necessary"
          },
          {
            "label": "C",
            "text": "Expensive"
          },
          {
            "label": "D",
            "text": "Temporary"
          }
        ],
        "answer": "Necessary",
        "explanation": "Essential means very important or necessary.",
        "shortcut": "Use context and common vocabulary.",
        "commonMistake": "Optional is almost opposite."
      },
      {
        "id": "SSC-CGL-ENG-020",
        "subject": "English Comprehension",
        "chapter": "Inference",
        "questionNumber": 20,
        "difficulty": "Easy",
        "question": "A passage states that online learning saves travel time. Which inference is valid?",
        "options": [
          {
            "label": "A",
            "text": "Students may use saved time for study."
          },
          {
            "label": "B",
            "text": "All schools will close."
          },
          {
            "label": "C",
            "text": "Travel is always harmful."
          },
          {
            "label": "D",
            "text": "Books are not needed."
          }
        ],
        "answer": "Students may use saved time for study.",
        "explanation": "This is a reasonable inference from saving travel time. Other options are extreme.",
        "shortcut": "Avoid extreme inferences.",
        "commonMistake": "Do not add unsupported claims."
      },
      {
        "id": "SSC-CGL-ENG-021",
        "subject": "English Comprehension",
        "chapter": "Tone",
        "questionNumber": 21,
        "difficulty": "Easy",
        "question": "If a passage criticizes excessive plastic use, what is the likely tone?",
        "options": [
          {
            "label": "A",
            "text": "Concerned"
          },
          {
            "label": "B",
            "text": "Celebratory"
          },
          {
            "label": "C",
            "text": "Comic"
          },
          {
            "label": "D",
            "text": "Indifferent"
          }
        ],
        "answer": "Concerned",
        "explanation": "Criticism of excessive plastic use shows concern about its effects.",
        "shortcut": "Tone reflects the writer’s attitude.",
        "commonMistake": "Do not confuse topic with tone."
      },
      {
        "id": "SSC-CGL-ENG-022",
        "subject": "English Comprehension",
        "chapter": "Vocabulary in Context",
        "questionNumber": 22,
        "difficulty": "Easy",
        "question": "A passage says exercise improves stamina. Which word is closest to “stamina”?",
        "options": [
          {
            "label": "A",
            "text": "Endurance"
          },
          {
            "label": "B",
            "text": "Decoration"
          },
          {
            "label": "C",
            "text": "Silence"
          },
          {
            "label": "D",
            "text": "Income"
          }
        ],
        "answer": "Endurance",
        "explanation": "Stamina means physical or mental endurance.",
        "shortcut": "Use context-based vocabulary.",
        "commonMistake": "Do not choose unrelated nouns."
      },
      {
        "id": "SSC-CGL-ENG-023",
        "subject": "English Comprehension",
        "chapter": "Spelling",
        "questionNumber": 23,
        "difficulty": "Easy",
        "question": "Choose the correct spelling.",
        "options": [
          {
            "label": "A",
            "text": "Accomodation"
          },
          {
            "label": "B",
            "text": "Accommodation"
          },
          {
            "label": "C",
            "text": "Acommodation"
          },
          {
            "label": "D",
            "text": "Accommadation"
          }
        ],
        "answer": "Accommodation",
        "explanation": "The correct spelling is Accommodation: double c and double m.",
        "shortcut": "Remember: ac + commodation.",
        "commonMistake": "Missing one c or m is common."
      },
      {
        "id": "SSC-CGL-ENG-024",
        "subject": "English Comprehension",
        "chapter": "Voice",
        "questionNumber": 24,
        "difficulty": "Easy",
        "question": "Change to passive voice: “They built the house.”",
        "options": [
          {
            "label": "A",
            "text": "The house is built by them."
          },
          {
            "label": "B",
            "text": "The house was built by them."
          },
          {
            "label": "C",
            "text": "The house has built them."
          },
          {
            "label": "D",
            "text": "The house built by them."
          }
        ],
        "answer": "The house was built by them.",
        "explanation": "Simple past active changes to was/were + past participle in passive voice.",
        "shortcut": "Object becomes subject.",
        "commonMistake": "Do not change tense to present."
      },
      {
        "id": "SSC-CGL-ENG-025",
        "subject": "English Comprehension",
        "chapter": "Narration",
        "questionNumber": 25,
        "difficulty": "Moderate",
        "question": "Change to indirect speech: He said, “I am happy.”",
        "options": [
          {
            "label": "A",
            "text": "He said that he was happy."
          },
          {
            "label": "B",
            "text": "He said that I am happy."
          },
          {
            "label": "C",
            "text": "He says that he was happy."
          },
          {
            "label": "D",
            "text": "He said he is happy."
          }
        ],
        "answer": "He said that he was happy.",
        "explanation": "After a past reporting verb, “am” changes to “was” and “I” changes according to the speaker.",
        "shortcut": "Backshift tense and change pronoun.",
        "commonMistake": "Do not keep “I” unless the context requires it."
      }
    ]
  },
  {
    "slug": "general-awareness",
    "title": "General Awareness",
    "hindiTitle": "सामान्य जागरूकता",
    "description": "History, geography, polity, science, economy, and static GK — awareness section pattern practice.",
    "questions": [
      {
        "id": "SSC-CGL-GA-001",
        "subject": "General Awareness",
        "chapter": "History",
        "questionNumber": 1,
        "difficulty": "Easy",
        "question": "Who founded the Mughal Empire in India?",
        "options": [
          {
            "label": "A",
            "text": "Akbar"
          },
          {
            "label": "B",
            "text": "Babur"
          },
          {
            "label": "C",
            "text": "Humayun"
          },
          {
            "label": "D",
            "text": "Aurangzeb"
          }
        ],
        "answer": "Babur",
        "explanation": "Babur defeated Ibrahim Lodi in the First Battle of Panipat in 1526 and established Mughal rule in India.",
        "shortcut": "Babur → beginning of Mughal Empire.",
        "commonMistake": "Do not confuse founder with Akbar."
      },
      {
        "id": "SSC-CGL-GA-002",
        "subject": "General Awareness",
        "chapter": "History",
        "questionNumber": 2,
        "difficulty": "Easy",
        "question": "In which year did the Jallianwala Bagh massacre take place?",
        "options": [
          {
            "label": "A",
            "text": "1915"
          },
          {
            "label": "B",
            "text": "1919"
          },
          {
            "label": "C",
            "text": "1922"
          },
          {
            "label": "D",
            "text": "1930"
          }
        ],
        "answer": "1919",
        "explanation": "The massacre took place on 13 April 1919 in Amritsar.",
        "shortcut": "Remember 1919 with the Rowlatt Act period.",
        "commonMistake": "Do not confuse it with the Non-Cooperation Movement year."
      },
      {
        "id": "SSC-CGL-GA-003",
        "subject": "General Awareness",
        "chapter": "History",
        "questionNumber": 3,
        "difficulty": "Easy",
        "question": "The First Battle of Panipat was fought between:",
        "options": [
          {
            "label": "A",
            "text": "Babur and Ibrahim Lodi"
          },
          {
            "label": "B",
            "text": "Akbar and Hemu"
          },
          {
            "label": "C",
            "text": "Shivaji and Afzal Khan"
          },
          {
            "label": "D",
            "text": "Prithviraj and Ghori"
          }
        ],
        "answer": "Babur and Ibrahim Lodi",
        "explanation": "The First Battle of Panipat in 1526 was between Babur and Ibrahim Lodi.",
        "shortcut": "Panipat I = 1526 = Babur vs Lodi.",
        "commonMistake": "Do not confuse it with the Second Battle of Panipat."
      },
      {
        "id": "SSC-CGL-GA-004",
        "subject": "General Awareness",
        "chapter": "Geography",
        "questionNumber": 4,
        "difficulty": "Easy",
        "question": "Which is generally considered the longest river flowing within India in standard GK context?",
        "options": [
          {
            "label": "A",
            "text": "Ganga"
          },
          {
            "label": "B",
            "text": "Yamuna"
          },
          {
            "label": "C",
            "text": "Godavari"
          },
          {
            "label": "D",
            "text": "Narmada"
          }
        ],
        "answer": "Ganga",
        "explanation": "The Ganga is commonly treated as the longest river in India in standard GK context.",
        "shortcut": "Read wording carefully: “in India” and “entirely within India” can change answers.",
        "commonMistake": "Do not ignore exact wording."
      },
      {
        "id": "SSC-CGL-GA-005",
        "subject": "General Awareness",
        "chapter": "Geography",
        "questionNumber": 5,
        "difficulty": "Easy",
        "question": "Which is the largest Indian state by area?",
        "options": [
          {
            "label": "A",
            "text": "Rajasthan"
          },
          {
            "label": "B",
            "text": "Madhya Pradesh"
          },
          {
            "label": "C",
            "text": "Maharashtra"
          },
          {
            "label": "D",
            "text": "Uttar Pradesh"
          }
        ],
        "answer": "Rajasthan",
        "explanation": "Rajasthan is the largest state of India by area.",
        "shortcut": "Largest by area = Rajasthan.",
        "commonMistake": "Do not confuse area with population."
      },
      {
        "id": "SSC-CGL-GA-006",
        "subject": "General Awareness",
        "chapter": "Geography",
        "questionNumber": 6,
        "difficulty": "Easy",
        "question": "The Tropic of Cancer passes through how many Indian states?",
        "options": [
          {
            "label": "A",
            "text": "6"
          },
          {
            "label": "B",
            "text": "7"
          },
          {
            "label": "C",
            "text": "8"
          },
          {
            "label": "D",
            "text": "9"
          }
        ],
        "answer": "8",
        "explanation": "The Tropic of Cancer passes through 8 Indian states.",
        "shortcut": "Remember: 8 states.",
        "commonMistake": "Do not include Union Territories without checking."
      },
      {
        "id": "SSC-CGL-GA-007",
        "subject": "General Awareness",
        "chapter": "Polity",
        "questionNumber": 7,
        "difficulty": "Easy",
        "question": "Who is known as the Father of the Indian Constitution?",
        "options": [
          {
            "label": "A",
            "text": "Mahatma Gandhi"
          },
          {
            "label": "B",
            "text": "B. R. Ambedkar"
          },
          {
            "label": "C",
            "text": "Jawaharlal Nehru"
          },
          {
            "label": "D",
            "text": "Sardar Patel"
          }
        ],
        "answer": "B. R. Ambedkar",
        "explanation": "Dr. B. R. Ambedkar is widely known as the Father of the Indian Constitution and chaired the Drafting Committee.",
        "shortcut": "Ambedkar → Drafting Committee.",
        "commonMistake": "Do not confuse with Father of the Nation."
      },
      {
        "id": "SSC-CGL-GA-008",
        "subject": "General Awareness",
        "chapter": "Polity",
        "questionNumber": 8,
        "difficulty": "Easy",
        "question": "Fundamental Rights are mainly contained in which Articles of the Indian Constitution?",
        "options": [
          {
            "label": "A",
            "text": "Articles 1-4"
          },
          {
            "label": "B",
            "text": "Articles 12-35"
          },
          {
            "label": "C",
            "text": "Articles 36-51"
          },
          {
            "label": "D",
            "text": "Articles 52-78"
          }
        ],
        "answer": "Articles 12-35",
        "explanation": "Part III of the Constitution contains Fundamental Rights from Articles 12 to 35.",
        "shortcut": "FR = Part III = Articles 12-35.",
        "commonMistake": "Do not confuse with Directive Principles."
      },
      {
        "id": "SSC-CGL-GA-009",
        "subject": "General Awareness",
        "chapter": "Polity",
        "questionNumber": 9,
        "difficulty": "Easy",
        "question": "Who appoints the Chief Election Commissioner of India?",
        "options": [
          {
            "label": "A",
            "text": "Prime Minister"
          },
          {
            "label": "B",
            "text": "President of India"
          },
          {
            "label": "C",
            "text": "Chief Justice of India"
          },
          {
            "label": "D",
            "text": "Lok Sabha Speaker"
          }
        ],
        "answer": "President of India",
        "explanation": "The Chief Election Commissioner is appointed by the President of India. Current legal procedure may govern recommendation/selection, but the appointment is by the President.",
        "shortcut": "Constitutional appointments often involve the President.",
        "commonMistake": "Do not answer Election Commission itself."
      },
      {
        "id": "SSC-CGL-GA-010",
        "subject": "General Awareness",
        "chapter": "Economy",
        "questionNumber": 10,
        "difficulty": "Easy",
        "question": "GDP stands for:",
        "options": [
          {
            "label": "A",
            "text": "Gross Domestic Product"
          },
          {
            "label": "B",
            "text": "General Domestic Price"
          },
          {
            "label": "C",
            "text": "Gross Development Plan"
          },
          {
            "label": "D",
            "text": "Government Debt Product"
          }
        ],
        "answer": "Gross Domestic Product",
        "explanation": "GDP measures the monetary value of final goods and services produced within a country during a period.",
        "shortcut": "GDP = Gross Domestic Product.",
        "commonMistake": "Do not confuse GDP with GNP."
      },
      {
        "id": "SSC-CGL-GA-011",
        "subject": "General Awareness",
        "chapter": "Economy",
        "questionNumber": 11,
        "difficulty": "Easy",
        "question": "Who presents the Union Budget in India?",
        "options": [
          {
            "label": "A",
            "text": "Finance Minister"
          },
          {
            "label": "B",
            "text": "Home Minister"
          },
          {
            "label": "C",
            "text": "President"
          },
          {
            "label": "D",
            "text": "RBI Governor"
          }
        ],
        "answer": "Finance Minister",
        "explanation": "The Union Budget is presented in Parliament by the Finance Minister.",
        "shortcut": "Budget → Finance Minister.",
        "commonMistake": "Do not choose RBI Governor; RBI handles monetary policy."
      },
      {
        "id": "SSC-CGL-GA-012",
        "subject": "General Awareness",
        "chapter": "Economy",
        "questionNumber": 12,
        "difficulty": "Moderate",
        "question": "Fiscal deficit broadly means:",
        "options": [
          {
            "label": "A",
            "text": "Total revenue minus total assets"
          },
          {
            "label": "B",
            "text": "Government borrowing requirement when expenditure exceeds receipts"
          },
          {
            "label": "C",
            "text": "Only foreign debt"
          },
          {
            "label": "D",
            "text": "Only tax collection"
          }
        ],
        "answer": "Government borrowing requirement when expenditure exceeds receipts",
        "explanation": "Fiscal deficit broadly shows the gap between government expenditure and receipts, excluding borrowings.",
        "shortcut": "Deficit means a gap to be financed.",
        "commonMistake": "Do not define it as total debt only."
      },
      {
        "id": "SSC-CGL-GA-013",
        "subject": "General Awareness",
        "chapter": "Science",
        "questionNumber": 13,
        "difficulty": "Easy",
        "question": "Vitamin D is also known as:",
        "options": [
          {
            "label": "A",
            "text": "Ascorbic acid"
          },
          {
            "label": "B",
            "text": "Calciferol"
          },
          {
            "label": "C",
            "text": "Thiamine"
          },
          {
            "label": "D",
            "text": "Riboflavin"
          }
        ],
        "answer": "Calciferol",
        "explanation": "Vitamin D is commonly known as calciferol.",
        "shortcut": "D → Calciferol.",
        "commonMistake": "Ascorbic acid is Vitamin C."
      },
      {
        "id": "SSC-CGL-GA-014",
        "subject": "General Awareness",
        "chapter": "Science",
        "questionNumber": 14,
        "difficulty": "Easy",
        "question": "The normal pH of human blood is approximately:",
        "options": [
          {
            "label": "A",
            "text": "5.5"
          },
          {
            "label": "B",
            "text": "6.5"
          },
          {
            "label": "C",
            "text": "7.4"
          },
          {
            "label": "D",
            "text": "8.8"
          }
        ],
        "answer": "7.4",
        "explanation": "Human blood is slightly alkaline, with pH around 7.35 to 7.45.",
        "shortcut": "Blood pH ≈ 7.4.",
        "commonMistake": "Do not answer exactly 7; that is neutral."
      },
      {
        "id": "SSC-CGL-GA-015",
        "subject": "General Awareness",
        "chapter": "Science",
        "questionNumber": 15,
        "difficulty": "Easy",
        "question": "The SI unit of power is:",
        "options": [
          {
            "label": "A",
            "text": "Joule"
          },
          {
            "label": "B",
            "text": "Watt"
          },
          {
            "label": "C",
            "text": "Newton"
          },
          {
            "label": "D",
            "text": "Pascal"
          }
        ],
        "answer": "Watt",
        "explanation": "Power is the rate of doing work. Its SI unit is watt.",
        "shortcut": "Power → Watt.",
        "commonMistake": "Joule is the unit of energy."
      },
      {
        "id": "SSC-CGL-GA-016",
        "subject": "General Awareness",
        "chapter": "Static GK",
        "questionNumber": 16,
        "difficulty": "Easy",
        "question": "Who wrote the Indian National Anthem?",
        "options": [
          {
            "label": "A",
            "text": "Bankim Chandra Chatterjee"
          },
          {
            "label": "B",
            "text": "Rabindranath Tagore"
          },
          {
            "label": "C",
            "text": "Sarojini Naidu"
          },
          {
            "label": "D",
            "text": "Subhas Chandra Bose"
          }
        ],
        "answer": "Rabindranath Tagore",
        "explanation": "Jana Gana Mana was composed by Rabindranath Tagore.",
        "shortcut": "National Anthem → Tagore.",
        "commonMistake": "Do not confuse it with Vande Mataram."
      },
      {
        "id": "SSC-CGL-GA-017",
        "subject": "General Awareness",
        "chapter": "Static GK",
        "questionNumber": 17,
        "difficulty": "Easy",
        "question": "Which is the highest civilian award in India?",
        "options": [
          {
            "label": "A",
            "text": "Padma Shri"
          },
          {
            "label": "B",
            "text": "Padma Bhushan"
          },
          {
            "label": "C",
            "text": "Bharat Ratna"
          },
          {
            "label": "D",
            "text": "Param Vir Chakra"
          }
        ],
        "answer": "Bharat Ratna",
        "explanation": "Bharat Ratna is the highest civilian award of India.",
        "shortcut": "Civilian highest = Bharat Ratna.",
        "commonMistake": "Param Vir Chakra is a military decoration."
      },
      {
        "id": "SSC-CGL-GA-018",
        "subject": "General Awareness",
        "chapter": "History",
        "questionNumber": 18,
        "difficulty": "Easy",
        "question": "The Indus Valley Civilization is also known as:",
        "options": [
          {
            "label": "A",
            "text": "Harappan Civilization"
          },
          {
            "label": "B",
            "text": "Vedic Civilization"
          },
          {
            "label": "C",
            "text": "Gupta Civilization"
          },
          {
            "label": "D",
            "text": "Mauryan Civilization"
          }
        ],
        "answer": "Harappan Civilization",
        "explanation": "The Indus Valley Civilization is also called the Harappan Civilization because Harappa was one of its major excavated sites.",
        "shortcut": "Indus Valley → Harappan.",
        "commonMistake": "Do not confuse it with the Vedic period."
      },
      {
        "id": "SSC-CGL-GA-019",
        "subject": "General Awareness",
        "chapter": "Polity",
        "questionNumber": 19,
        "difficulty": "Easy",
        "question": "Directive Principles of State Policy are mainly contained in which part of the Indian Constitution?",
        "options": [
          {
            "label": "A",
            "text": "Part II"
          },
          {
            "label": "B",
            "text": "Part III"
          },
          {
            "label": "C",
            "text": "Part IV"
          },
          {
            "label": "D",
            "text": "Part V"
          }
        ],
        "answer": "Part IV",
        "explanation": "Directive Principles of State Policy are contained in Part IV of the Constitution.",
        "shortcut": "DPSP = Part IV.",
        "commonMistake": "Do not confuse with Fundamental Rights in Part III."
      },
      {
        "id": "SSC-CGL-GA-020",
        "subject": "General Awareness",
        "chapter": "Geography",
        "questionNumber": 20,
        "difficulty": "Easy",
        "question": "Which planet is known as the Red Planet?",
        "options": [
          {
            "label": "A",
            "text": "Venus"
          },
          {
            "label": "B",
            "text": "Mars"
          },
          {
            "label": "C",
            "text": "Jupiter"
          },
          {
            "label": "D",
            "text": "Saturn"
          }
        ],
        "answer": "Mars",
        "explanation": "Mars is known as the Red Planet due to iron oxide on its surface.",
        "shortcut": "Red Planet → Mars.",
        "commonMistake": "Do not confuse with Venus, the hottest planet."
      },
      {
        "id": "SSC-CGL-GA-021",
        "subject": "General Awareness",
        "chapter": "Science",
        "questionNumber": 21,
        "difficulty": "Easy",
        "question": "Which gas is mainly responsible for the greenhouse effect among the following?",
        "options": [
          {
            "label": "A",
            "text": "Carbon dioxide"
          },
          {
            "label": "B",
            "text": "Oxygen"
          },
          {
            "label": "C",
            "text": "Nitrogen"
          },
          {
            "label": "D",
            "text": "Helium"
          }
        ],
        "answer": "Carbon dioxide",
        "explanation": "Carbon dioxide is a major greenhouse gas and is commonly asked in basic science/GK.",
        "shortcut": "CO₂ traps heat.",
        "commonMistake": "Do not choose nitrogen only because it is abundant in air."
      },
      {
        "id": "SSC-CGL-GA-022",
        "subject": "General Awareness",
        "chapter": "Science",
        "questionNumber": 22,
        "difficulty": "Easy",
        "question": "Which part of the plant mainly performs photosynthesis?",
        "options": [
          {
            "label": "A",
            "text": "Root"
          },
          {
            "label": "B",
            "text": "Leaf"
          },
          {
            "label": "C",
            "text": "Stem"
          },
          {
            "label": "D",
            "text": "Flower"
          }
        ],
        "answer": "Leaf",
        "explanation": "Leaves contain chlorophyll and are the main site of photosynthesis.",
        "shortcut": "Photosynthesis → leaf + chlorophyll.",
        "commonMistake": "Do not choose root."
      },
      {
        "id": "SSC-CGL-GA-023",
        "subject": "General Awareness",
        "chapter": "Economy",
        "questionNumber": 23,
        "difficulty": "Easy",
        "question": "Which institution is known as the central bank of India?",
        "options": [
          {
            "label": "A",
            "text": "SBI"
          },
          {
            "label": "B",
            "text": "RBI"
          },
          {
            "label": "C",
            "text": "SEBI"
          },
          {
            "label": "D",
            "text": "NABARD"
          }
        ],
        "answer": "RBI",
        "explanation": "The Reserve Bank of India is the central bank of India.",
        "shortcut": "Central bank → RBI.",
        "commonMistake": "Do not confuse SBI as central bank."
      },
      {
        "id": "SSC-CGL-GA-024",
        "subject": "General Awareness",
        "chapter": "Static GK",
        "questionNumber": 24,
        "difficulty": "Easy",
        "question": "Kathak is a classical dance form mainly associated with which region of India?",
        "options": [
          {
            "label": "A",
            "text": "North India"
          },
          {
            "label": "B",
            "text": "Kerala"
          },
          {
            "label": "C",
            "text": "Tamil Nadu"
          },
          {
            "label": "D",
            "text": "Manipur"
          }
        ],
        "answer": "North India",
        "explanation": "Kathak is a major classical dance form associated with North India.",
        "shortcut": "Kathak → North India.",
        "commonMistake": "Do not confuse it with Kathakali of Kerala."
      },
      {
        "id": "SSC-CGL-GA-025",
        "subject": "General Awareness",
        "chapter": "Current Affairs Handling",
        "questionNumber": 25,
        "difficulty": "Moderate",
        "question": "For TAIPOQ, how should current affairs questions be added?",
        "options": [
          {
            "label": "A",
            "text": "Without date"
          },
          {
            "label": "B",
            "text": "With month/year and source checked"
          },
          {
            "label": "C",
            "text": "Copied from a private PDF"
          },
          {
            "label": "D",
            "text": "Only as images"
          }
        ],
        "answer": "With month/year and source checked",
        "explanation": "Current affairs change regularly. For publication, each question should have month/year and a checked source.",
        "shortcut": "Current affairs need dated metadata.",
        "commonMistake": "Do not copy private compilations verbatim."
      }
    ]
  }
];

export const SSC_CGL_PATTERN_PRACTICE_TOTAL = 100;
