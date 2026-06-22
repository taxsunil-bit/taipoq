export const PRIVACY_POLICY_EFFECTIVE_DATE = "16 June 2026";
export const PRIVACY_POLICY_CONTACT_EMAIL = "manasdixit5050@gmail.com";

export const PRIVACY_POLICY_INTRO =
  "Your privacy matters. This Privacy Policy explains how taipoq.com may use cookies, analytics tools and limited non-personal usage information to improve the website.";

export const PRIVACY_POLICY_SECTIONS = [
  {
    id: "intro",
    title: "Privacy Policy",
    paragraphs: [PRIVACY_POLICY_INTRO],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    paragraphs: [
      "When visitors use taipoq.com, the website may collect limited technical and non-personal information such as browser type, device type, approximate location, pages visited, session duration, referring source, website performance data and general interaction data.",
      "If users use typing practice features, typing speed, accuracy and test interaction data may be processed to display typing results and improve the user experience. Unless a specific feature clearly states otherwise, we do not intentionally use this information to personally identify individual visitors.",
    ],
  },
  {
    id: "analytics",
    title: "Use of Analytics",
    paragraphs: [
      "taipoq.com may use privacy-respecting analytics tools, including Google Analytics and Vercel Web Analytics, to understand website traffic, page performance, visitor behaviour and general usage trends. These tools may process limited technical and non-personal usage information according to their applicable terms and policies.",
      "taipoq.com does not knowingly send personally identifiable information such as name, email address, phone number, physical address, government ID, financial information or sensitive personal data to Google Analytics.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "The website may use cookies and similar technologies for analytics, performance measurement and improvement of user experience.",
      "Visitors can control or disable cookies through browser settings. If a cookie preference option is available on the website, visitors may also manage their preferences through that option.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Information",
    list: [
      "To understand website traffic and visitor behaviour.",
      "To improve website design, content and performance.",
      "To display typing test results.",
      "To improve typing practice features.",
      "To diagnose technical issues.",
      "To protect the website from misuse or security risks.",
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    paragraphs: [
      "taipoq.com does not sell visitor data.",
      "The website may use trusted third-party services, including Google Analytics and Vercel Web Analytics, to process analytics and performance data according to their applicable terms and policies.",
      "We may disclose information if required by law, legal process, government authority, or to protect our legal rights, website security or users.",
    ],
  },
  {
    id: "pii",
    title: "Personally Identifiable Information",
    paragraphs: [
      "We do not intentionally collect personally identifiable information through Google Analytics. Visitors should not submit personal or sensitive information in areas of the website that are not specifically designed for such submission.",
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    paragraphs: [
      "taipoq.com may contain links to third-party websites. We are not responsible for the privacy practices, content or policies of external websites.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    paragraphs: [
      "We take reasonable steps to protect our website and processed information. However, no method of internet transmission or electronic storage can be guaranteed as completely secure.",
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
