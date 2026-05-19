import { chaptersFromTitles } from "./helpers";

const MATH_XI = chaptersFromTitles([
  "Real number line & inequalities",
  "Combinatorics intro — factorial notation",
]);

const MATH_XII = chaptersFromTitles([
  "Integration techniques overview",
]);

const PHYS_XI = chaptersFromTitles([
  "Measurements & kinematics scaffolding",
]);

const PHYS_XII = chaptersFromTitles([
  "Quantum phenomena introduction",
]);

const CHEM_XI = chaptersFromTitles([
  "Ionic solids contextual",
]);

const CHEM_XII = chaptersFromTitles([
  "Common ion effect",
]);

const BIO_XI = chaptersFromTitles([
  "Nutrition thematic review",
]);

const BIO_XII = chaptersFromTitles([
  "Chromosomal disorders discussion",
]);

const CS_XI = chaptersFromTitles([
  "Programming paradigms — procedural vs object glimpses",
]);

const CS_XII = chaptersFromTitles([
  "Data structures recap — stacks queues",
]);

const ENG_XI = chaptersFromTitles([
  "Formal letter & précis scaffolding",
]);

const ENG_XII = chaptersFromTitles([
  "Technical description writing",
]);

const ISLAM_XI_ELEC = chaptersFromTitles([
  "Seerat & moral guidance excerpts",
]);

const ISLAM_XII_ELEC = chaptersFromTitles([
  "Contemporary ijtihaadi ethics vignettes",
]);

const PAK_XI_INTER = chaptersFromTitles([
  "Nation-building ideas post-partition Punjab",
]);

const PAK_XII_INTER = chaptersFromTitles([
  "Foreign policy — regional cooperation themes",
]);

export const CLASS_11_BOOKS = [
  {
    id: "11-mathematics-part1",
    title: "Mathematics Part I — F.Sc (English medium)",
    category: "Pre-engineering",
    chapters: MATH_XI,
  },
  {
    id: "11-physics-part1",
    title: "Physics Part I — F.Sc",
    category: "Pre-engineering",
    chapters: PHYS_XI,
  },
  {
    id: "11-chemistry-part1",
    title: "Chemistry Part I — F.Sc",
    category: "Pre-engineering",
    chapters: CHEM_XI,
  },
  {
    id: "11-biology-part1",
    title: "Biology Part I — F.Sc",
    category: "Pre-medical",
    chapters: BIO_XI,
  },
  {
    id: "11-computer-part1",
    title: "Computer Science Part I — F.Sc",
    category: "ICT",
    chapters: CS_XI,
  },
  {
    id: "11-english-compulsory",
    title: "English Book I compulsory (Inter)",
    category: "Language",
    chapters: ENG_XI,
  },
  {
    id: "11-islamic-studies-elective",
    title: "Islamic Studies (Elective)",
    category: "Religious studies",
    chapters: ISLAM_XI_ELEC,
  },
  {
    id: "11-pak-studies-inter",
    title: "Pakistan Studies compulsory (Inter I strand)",
    category: "Social studies",
    chapters: PAK_XI_INTER,
  },
];

export const CLASS_12_BOOKS = [
  {
    id: "12-mathematics-part2",
    title: "Mathematics Part II — F.Sc",
    category: "Pre-engineering",
    chapters: MATH_XII,
  },
  {
    id: "12-physics-part2",
    title: "Physics Part II — F.Sc",
    category: "Pre-engineering",
    chapters: PHYS_XII,
  },
  {
    id: "12-chemistry-part2",
    title: "Chemistry Part II — F.Sc",
    category: "Pre-engineering",
    chapters: CHEM_XII,
  },
  {
    id: "12-biology-part2",
    title: "Biology Part II — F.Sc",
    category: "Pre-medical",
    chapters: BIO_XII,
  },
  {
    id: "12-computer-part2",
    title: "Computer Science Part II — F.Sc",
    category: "ICT",
    chapters: CS_XII,
  },
  {
    id: "12-english-compulsory",
    title: "English Book III compulsory (Inter)",
    category: "Language",
    chapters: ENG_XII,
  },
  {
    id: "12-islamic-studies-elective",
    title: "Islamic Studies (Elective continuation)",
    category: "Religious studies",
    chapters: ISLAM_XII_ELEC,
  },
  {
    id: "12-pak-studies-inter",
    title: "Pakistan Studies compulsory (Inter II strand)",
    category: "Social studies",
    chapters: PAK_XII_INTER,
  },
];
