import { chaptersFromTitles } from "./helpers";

/**
 * Punjab middle-grade VIII — titles mirror mainstream PCTB middle streams.
 */

/** @type {import('./helpers').ChapterDef[]} */
export const CLASS_8_BOOKS = [
  {
    id: "8-mathematics",
    title: "Mathematics Grade VIII (PCTB)",
    category: "Core",
    textbookNote: "Middle school syllabus",
    chapters: chaptersFromTitles([
      "Rational numbers",
      "Operations with algebraic expressions",
      "Square roots & approximation",
      "Financial literacy: profit & loss",
      "Geometry of polygons & angles",
      "Data handling & averages",
      "Mensuration: surface area basics",
      "Mixed problem-solving review",
    ]),
  },
  {
    id: "8-general-science",
    title: "General Science Grade VIII",
    category: "Science",
    textbookNote: "Integrated science textbook",
    chapters: chaptersFromTitles([
      "Cell structure",
      "States of matter & heat transfer",
      "Forces in everyday situations",
      "Photosynthesis fundamentals",
      "Human body systems introductory",
      "Acids – bases household links",
      "Earth & ecology introduction",
      "Science inquiry & safety review",
    ]),
  },
  {
    id: "8-english",
    title: "English Grade VIII — Language & Literature",
    category: "Language",
    textbookNote: "PCTB English coursebook",
    chapters: chaptersFromTitles([
      "Reading comprehension strategies",
      "Grammar: tenses & agreement",
      "Paragraph development",
      "Creative writing: narrative",
      "Letter & email formats",
      "Poetry appreciation",
      "Listening & speaking practice",
      "Exam-style integrated tasks",
    ]),
  },
  {
    id: "8-urdu",
    title: "Urdu Grade VIII — لسانیات و ادب",
    category: "Language",
    textbookNote: "ضروری مضامین",
    chapters: chaptersFromTitles([
      "ہم آہنگی اور اسلوب",
      "ضرب الامثال و محاورات",
      "غزل و نظم کے عناصر",
      "انشا: تفصیلی نگارش",
      "خط و تحریر کی درستگی",
      "حمد و نعت کے بنیادی عناصر",
      "خطابیاتی مضامین",
      "امتحانی فارمیٹ مشق",
    ]),
  },
  {
    id: "8-islamiyat",
    title: "Islamiyat Grade VIII",
    category: "Religious studies",
    textbookNote: "PCTB middle Islamiyat",
    chapters: chaptersFromTitles([
      "Tauheed & prophets’ stories recap",
      "Salah & adab in daily routine",
      "Seerat glimpses — Madinah charter",
      "Ahadith on character building",
      "Halal livelihood themes",
      "Social cooperation in Islam",
      "Quranic etiquette & reflection",
      "Revision & values-based prompts",
    ]),
  },
  {
    id: "8-computer",
    title: "Computer Education Grade VIII",
    category: "ICT",
    textbookNote: "PCTB computer literacy strand",
    chapters: chaptersFromTitles([
      "Digital citizenship & etiquette",
      "Operating system essentials",
      "Word processing workflows",
      "Spreadsheets: charts & formulae basics",
      "Online safety",
      "Algorithmic thinking intro",
      "Mini project documentation",
      "ICT assessment lab",
    ]),
  },
];
