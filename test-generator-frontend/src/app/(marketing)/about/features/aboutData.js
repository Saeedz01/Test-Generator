/**
 * About page copy — product intro, not a company bio.
 */

export const aboutIntro = {
  eyebrow: "About Testora",
  headline: "A calm workspace for exams and academy banners",
  body: "Testora helps teachers assemble balanced, print-ready papers from chapter-wise MCQs, short, and long questions — and design promotional or achievement banners from a template or a blank canvas.",
};

export const aboutQuestionTypes = [
  { id: "mcq", label: "MCQs" },
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
];

export const aboutHighlights = [
  {
    id: "teachers",
    step: "01",
    title: "Built for teachers",
    body: "Pick a class, book, and chapter, then tick the questions you want. Selection stays as you move.",
    icon: "book",
  },
  {
    id: "balanced",
    step: "02",
    title: "Balanced papers",
    body: "Mix MCQs, short, and long items so coverage matches the exam you need.",
    icon: "layers",
  },
  {
    id: "print",
    step: "03",
    title: "Print-ready PDFs",
    body: "Review, set institute and time, then export a clean paper ready to print.",
    icon: "file",
  },
  {
    id: "banners",
    step: "04",
    title: "Banner Designer",
    body: "Create promotional and achievement banners for your academy. Start from a Testora template or a blank canvas — every element stays editable.",
    icon: "layout",
  },
];

export const aboutStory = {
  eyebrow: "Why it exists",
  headline: "Exam papers should take minutes, not a whole evening",
  body: "Most of the work already lives in your chapter banks. Testora is the quiet path from those questions to a paper you can print — and a studio for the banners that announce results, admissions, and achievements.",
  points: [
    "One flow from class list to PDF",
    "Mix question types without reformatting",
    "Design academy banners from templates or a blank canvas",
  ],
};

export const aboutPaper = {
  institute: "Your institute",
  title: "Mid-term examination",
  meta: "Class 10 · 45 minutes",
  items: [
    { type: "MCQ", prompt: "Choose the correct option." },
    { type: "Short", prompt: "Answer in two or three lines." },
    { type: "Long", prompt: "Explain with a reasoned response." },
  ],
};

export const aboutCta = {
  headline: "Ready to generate your next test?",
  body: "Open the workspace, pick a class, and assemble a balanced paper in a few calm clicks.",
  action: "Start generating",
};
