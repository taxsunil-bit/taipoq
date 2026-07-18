export const PRIVACY_POLICY_EFFECTIVE_DATE = "18 July 2026";
export const PRIVACY_POLICY_CONTACT_EMAIL = "manasdixit5050@gmail.com";

export const PRIVACY_POLICY_INTRO =
  "Your privacy matters. This Privacy Policy explains what taipoq.com stores in your browser, optional analytics consent, and how outbound official-source links work. TAIPOQ does not create cloud accounts.";

export const PRIVACY_POLICY_SECTIONS = [
  {
    id: "intro",
    title: "Privacy Policy",
    paragraphs: [PRIVACY_POLICY_INTRO],
  },
  {
    id: "information-we-collect",
    title: "Information Stored on This Device",
    paragraphs: [
      "TAIPOQ is designed so that profile and progress stay in the current browser on your device. Depending on the features you use, the site may store locally:",
    ],
    list: [
      "A display name for your local profile (no password).",
      "Practice and test progress, including typing results, Daily Mission completion, Math Speed Lab progress, and subject-test history.",
      "Cookie-preference choices (whether analytics is allowed).",
      "Optional sound or interface preferences.",
    ],
  },
  {
    id: "local-storage",
    title: "Browser Storage",
    paragraphs: [
      "Local profile and progress use browser storage such as localStorage (or equivalent browser storage). This data remains on your device unless you clear it.",
      "Clearing site data, cookies, or using private/incognito browsing can remove locally stored progress. TAIPOQ does not sync this data to a personal cloud account.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics (Optional)",
    paragraphs: [
      "If you grant analytics consent, taipoq.com may load Vercel Web Analytics to understand aggregate traffic and page performance.",
      "Google Analytics support exists in the codebase but is only loaded when a real measurement ID is configured and analytics consent is granted. It is not used to collect government IDs, payment details, or other sensitive personal data for advertising profiles.",
      "You can change analytics consent through Cookie Preferences in the site footer.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Preferences",
    paragraphs: [
      "Necessary site operation does not require creating an online account.",
      "Cookie preference choices are stored locally so the site can remember whether analytics is allowed.",
      "Visitors can also control cookies through browser settings.",
    ],
  },
  {
    id: "how-we-use",
    title: "How This Information Is Used",
    list: [
      "To show your local display name and saved preparation progress on this device.",
      "To run practice features such as tests, PYQs, Daily Mission, typing practice, and Math Speed Lab.",
      "To remember analytics consent preferences.",
      "If analytics consent is granted, to understand aggregate website traffic and improve reliability.",
      "To diagnose technical issues and protect the website from misuse.",
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    paragraphs: [
      "taipoq.com does not sell visitor data.",
      "When analytics consent is granted, limited technical usage data may be processed by the analytics providers named above according to their terms.",
      "We may disclose information if required by law, legal process, or to protect website security or users.",
    ],
  },
  {
    id: "third-party-links",
    title: "Official Sources and Third-Party Links",
    paragraphs: [
      "Vacancy cards and study pages may link to official government or examination websites and PDFs. Those destinations are outside TAIPOQ’s control.",
      "When you open an official-source or other third-party link, that site’s own privacy practices apply.",
    ],
  },
  {
    id: "retention",
    title: "Retention and Reset",
    paragraphs: [
      "Locally stored profile and progress remain until you clear them in the product UI (where available) or clear browser data for taipoq.com.",
      "There is no separate cloud retention of your local profile because progress is not stored in a TAIPOQ account database.",
    ],
  },
  {
    id: "pii",
    title: "Personally Identifiable Information",
    paragraphs: [
      "The local profile asks only for a display name stored in your browser. Do not enter passwords, government IDs, or sensitive personal information into practice fields that are not designed for that purpose.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    paragraphs: [
      "This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated effective date.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: ["For privacy-related questions, please contact us at:"],
  },
] as const;
