import { chaptersFromTitles } from "./helpers";

/**
 * Matric Part I & II (Classes 9–10) titles follow mainstream PCTB subject names.
 * Math Gr. IX chapter sequencing mirrors widespread Punjab textbooks (Matrices → Practical geometry).
 */

const MATH_IX = chaptersFromTitles([
  "Matrices and determinants",
  "Real and complex numbers",
  "Logarithms",
  "Algebraic expressions & formulas",
  "Factorization",
  "Algebraic manipulation",
  "Linear equations & inequalities",
  "Linear graphs & applications",
  "Introduction to coordinate geometry",
  "Congruent triangles",
  "Parallelograms & triangles",
  "Line & angle bisectors",
  "Sides & angles of a triangle",
  "Ratio and proportion",
  "Pythagoras’ theorem",
  "Area-related theorem applications",
  "Practical geometry — triangles",
]);

const MATH_X = chaptersFromTitles([
  "Quadratic equations",
  "Theory of quadratic equations",
  "Variations",
  "Partial fractions",
  "Sets and functions",
  "Sequences & series",
  "Permutation, combination & probability intro",
  "Binomial theorem",
  "Fundamentals of trigonometry",
  "Trigonometric identities",
  "Practical application of trigonometry",
  "Angle in a segment of a circle",
  "Practical geometry — circles",
]);

const PHYSICS_IX = chaptersFromTitles([
  "Physical quantities & measurements",
  "Kinematics",
  "Dynamics",
  "Turning effect of forces",
  "Gravitation",
  "Work & energy",
  "Properties of matter",
  "Thermal properties of matter",
  "Transfer of heat",
  "Thermal expansion of solids",
  "Sound waves",
  "Light",
]);

const PHYSICS_X = chaptersFromTitles([
  "Simple harmonic motion & waves",
  "Sound & musical instruments contextual",
  "Geometric optics recap",
  "Electrostatics",
  "Electric current",
  "Electromagnetism basics",
  "Electronics fundamentals",
  "Information & communication tech intro",
]);

const CHEM_IX = chaptersFromTitles([
  "Fundamentals of chemistry",
  "Structure of atom",
  "Periodic table & periodicity",
  "Structure of molecules",
  "Physical states & solutions",
  "Chemical equilibrium",
  "Acids bases & salts contextual",
]);

const CHEM_X = chaptersFromTitles([
  "Acids bases & salts expanded",
  "Organic chemistry hydrocarbons",
  "Organic chemistry oxygen compounds",
  "Biochemistry contextual",
  "Industrial chemistry glimpses",
  "Environmental chemistry of Punjab watersheds",
]);

const BIO_IX = chaptersFromTitles([
  "Introduction & branches of biology",
  "Classification & cell structure",
  "Tissue level organization",
  "Cell cycle",
  "Biomolecules & nutrition",
]);

const BIO_X = chaptersFromTitles([
  "Gas exchange transport & excretion",
  "Coordination & response",
  "Support & locomotion recap",
  "Reproduction in plants contextual",
  "Inheritance recap",
]);

const ENG_IX = chaptersFromTitles([
  "Reading comprehension & inference",
  "Grammar: verb patterns & agreement",
  "Descriptive paragraphs & cohesion",
  "Story writing — plot & climax",
]);

const ENG_X = chaptersFromTitles([
  "Media literacy & argumentative writing",
  "Formal reports & persuasive tone",
  "Drama dialogues comprehension",
]);

const COMPUTER_IX = chaptersFromTitles([
  "Fundamentals & history of computing",
  "Computer hardware taxonomy",
  "Storage devices & virtualization intro",
]);

const COMPUTER_X = chaptersFromTitles([
  "Programming constructs — loops & decisions",
  "Arrays & flowcharts",
]);

const URDU_IX = chaptersFromTitles([
  "نظم و قطعات کی تحلیل",
  "حماد و نعت — بنیادی اسالیب",
  "غزل — موضوعات و مفاہیم",
  "انشا: تاثراتی انداز تحریر",
]);

const URDU_X = chaptersFromTitles([
  "ادبی تاریخ کے اقتباسات",
  "خطابتی مضامین و موضوعی انشاء",
]);

const ISLAMIYAT_IX = chaptersFromTitles([
  "Tauheed pillars & salaah adab",
  "Seerat — Makkah period highlights",
  "Ahkaam of mutual rights",
]);

const ISLAMIYAT_X = chaptersFromTitles([
  "Islamic brotherhood themes",
  "Contemporary fiqh-lite guidance for youth",
]);

const TARJUMA_IX = chaptersFromTitles([
  "Translation etiquette — short surahs",
  "Themes of rahmah & adab",
]);

const PAK_IX = chaptersFromTitles([
  "Ideology of Pakistan",
  "Punjab in freedom movement glimpses",
  "Land & people introduction",
]);

const PAK_X = chaptersFromTitles([
  "Administrative pillars & federation",
]);

export const CLASS_9_BOOKS = [
  {
    id: "9-mathematics",
    title: "Mathematics IX (PCTB / Matric Part I)",
    category: "Core",
    chapters: MATH_IX,
  },
  {
    id: "9-physics",
    title: "Physics IX — English Medium Textbook",
    category: "Science",
    chapters: PHYSICS_IX,
  },
  {
    id: "9-chemistry",
    title: "Chemistry IX — English Medium Textbook",
    category: "Science",
    chapters: CHEM_IX,
  },
  {
    id: "9-biology",
    title: "Biology IX — English Medium Textbook",
    category: "Science",
    chapters: BIO_IX,
  },
  {
    id: "9-computer",
    title: "Computer Science IX (PCTB)",
    category: "ICT",
    chapters: COMPUTER_IX,
  },
  {
    id: "9-english",
    title: "English IX — Punjab Textbook",
    category: "Language",
    chapters: ENG_IX,
  },
  {
    id: "9-urdu",
    title: "Urdu compulsory IX",
    category: "Language",
    chapters: URDU_IX,
  },
  {
    id: "9-islamiyat",
    title: "Islamiyat compulsory IX",
    category: "Religious studies",
    chapters: ISLAMIYAT_IX,
  },
  {
    id: "9-tarjuma-quran",
    title: "Tarjama tul Qur’an IX (where applicable)",
    category: "Religious studies",
    chapters: TARJUMA_IX,
  },
  {
    id: "9-pak-studies",
    title: "Pakistan Studies IX",
    category: "Social studies",
    chapters: PAK_IX,
  },
];

export const CLASS_10_BOOKS = [
  {
    id: "10-mathematics",
    title: "Mathematics X (PCTB / Matric Part II)",
    category: "Core",
    chapters: MATH_X,
  },
  {
    id: "10-physics",
    title: "Physics X — Matric textbook",
    category: "Science",
    chapters: PHYSICS_X,
  },
  {
    id: "10-chemistry",
    title: "Chemistry X — Matric textbook",
    category: "Science",
    chapters: CHEM_X,
  },
  {
    id: "10-biology",
    title: "Biology X — Matric textbook",
    category: "Science",
    chapters: BIO_X,
  },
  {
    id: "10-computer",
    title: "Computer Science X (PCTB)",
    category: "ICT",
    chapters: COMPUTER_X,
  },
  {
    id: "10-english",
    title: "English X — Punjab Textbook",
    category: "Language",
    chapters: ENG_X,
  },
  {
    id: "10-urdu",
    title: "Urdu compulsory X",
    category: "Language",
    chapters: URDU_X,
  },
  {
    id: "10-islamiyat",
    title: "Islamiyat compulsory X",
    category: "Religious studies",
    chapters: ISLAMIYAT_X,
  },
  {
    id: "10-pak-studies",
    title: "Pakistan Studies X",
    category: "Social studies",
    chapters: PAK_X,
  },
];
