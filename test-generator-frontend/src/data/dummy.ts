import type {
  Book,
  Chapter,
  ClassWithBooks,
  McqQuestion,
  Question,
  SchoolClass,
  ShortQuestion,
  LongQuestion,
} from "@/types";

/**
 * Stable demo IDs — keep references consistent across related collections.
 */

/* -------------------------------------------------------------------------- */
/* Classes                                                                    */
/* -------------------------------------------------------------------------- */

export const dummyClasses: SchoolClass[] = [
  {
    id: "class-9",
    name: "Class 9",
    code: "G9",
    description: "Foundation year covering core sciences and language arts.",
    academicYear: "2025–26",
  },
  {
    id: "class-10",
    name: "Class 10",
    code: "G10",
    description: "Board-prep curriculum with deeper problem-solving focus.",
    academicYear: "2025–26",
  },
  {
    id: "class-11",
    name: "Class 11",
    code: "G11",
    description: "Pre-college stream with specialized subject tracks.",
    academicYear: "2025–26",
  },
  {
    id: "class-12",
    name: "Class 12",
    code: "G12",
    description: "Final secondary year emphasizing exam readiness.",
    academicYear: "2025–26",
  },
];

/* -------------------------------------------------------------------------- */
/* Books                                                                      */
/* -------------------------------------------------------------------------- */

export const dummyBooks: Book[] = [
  // Class 9
  {
    id: "book-9-physics",
    name: "Fundamentals of Physics",
    classId: "class-9",
    subject: "Physics",
    author: "National Curriculum Board",
    edition: "3rd",
    description: "Motion, force, energy, and introductory waves.",
  },
  {
    id: "book-9-biology",
    name: "Living Science",
    classId: "class-9",
    subject: "Biology",
    author: "National Curriculum Board",
    edition: "2nd",
    description: "Cells, tissues, and basic life processes.",
  },
  {
    id: "book-9-english",
    name: "English Reader",
    classId: "class-9",
    subject: "English",
    author: "Language Arts Series",
    description: "Comprehension, grammar, and short composition.",
  },
  // Class 10
  {
    id: "book-10-physics",
    name: "Physics for Secondary",
    classId: "class-10",
    subject: "Physics",
    author: "National Curriculum Board",
    edition: "4th",
    description: "Electricity, magnetism, and light for board exams.",
  },
  {
    id: "book-10-chemistry",
    name: "Principles of Chemistry",
    classId: "class-10",
    subject: "Chemistry",
    author: "National Curriculum Board",
    description: "Acids, bases, carbon compounds, and reactions.",
  },
  {
    id: "book-10-math",
    name: "Secondary Mathematics",
    classId: "class-10",
    subject: "Mathematics",
    author: "MathWorks Press",
    edition: "5th",
    description: "Algebra, geometry, and introductory trigonometry.",
  },
  // Class 11
  {
    id: "book-11-physics",
    name: "Advanced Physics I",
    classId: "class-11",
    subject: "Physics",
    author: "College Prep Series",
    description: "Kinematics, dynamics, and work-energy theorem.",
  },
  {
    id: "book-11-chemistry",
    name: "General Chemistry I",
    classId: "class-11",
    subject: "Chemistry",
    author: "College Prep Series",
    description: "Atomic structure, bonding, and stoichiometry.",
  },
  // Class 12
  {
    id: "book-12-physics",
    name: "Advanced Physics II",
    classId: "class-12",
    subject: "Physics",
    author: "College Prep Series",
    description: "Electromagnetism, modern physics, and optics.",
  },
  {
    id: "book-12-biology",
    name: "Human Biology",
    classId: "class-12",
    subject: "Biology",
    author: "Life Sciences Press",
    description: "Genetics, reproduction, and human physiology.",
  },
];

/* -------------------------------------------------------------------------- */
/* Chapters                                                                   */
/* -------------------------------------------------------------------------- */

export const dummyChapters: Chapter[] = [
  // Class 9 — Physics
  {
    id: "ch-9-phy-1",
    name: "Motion and Rest",
    classId: "class-9",
    bookId: "book-9-physics",
    order: 1,
    description: "Distance, displacement, speed, and velocity.",
  },
  {
    id: "ch-9-phy-2",
    name: "Force and Laws of Motion",
    classId: "class-9",
    bookId: "book-9-physics",
    order: 2,
    description: "Newton’s laws and everyday applications.",
  },
  {
    id: "ch-9-phy-3",
    name: "Work and Energy",
    classId: "class-9",
    bookId: "book-9-physics",
    order: 3,
    description: "Work, kinetic energy, and potential energy.",
  },
  // Class 9 — Biology
  {
    id: "ch-9-bio-1",
    name: "The Fundamental Unit of Life",
    classId: "class-9",
    bookId: "book-9-biology",
    order: 1,
    description: "Cell structure and organelles.",
  },
  {
    id: "ch-9-bio-2",
    name: "Tissues",
    classId: "class-9",
    bookId: "book-9-biology",
    order: 2,
    description: "Plant and animal tissues.",
  },
  // Class 9 — English
  {
    id: "ch-9-eng-1",
    name: "Reading Comprehension",
    classId: "class-9",
    bookId: "book-9-english",
    order: 1,
    description: "Inference and vocabulary in context.",
  },
  {
    id: "ch-9-eng-2",
    name: "Grammar Essentials",
    classId: "class-9",
    bookId: "book-9-english",
    order: 2,
    description: "Tenses, articles, and subject-verb agreement.",
  },
  // Class 10 — Physics
  {
    id: "ch-10-phy-1",
    name: "Electricity",
    classId: "class-10",
    bookId: "book-10-physics",
    order: 1,
    description: "Current, resistance, and Ohm’s law.",
  },
  {
    id: "ch-10-phy-2",
    name: "Magnetic Effects of Current",
    classId: "class-10",
    bookId: "book-10-physics",
    order: 2,
    description: "Magnetic fields and electromagnetic induction basics.",
  },
  {
    id: "ch-10-phy-3",
    name: "Light — Reflection and Refraction",
    classId: "class-10",
    bookId: "book-10-physics",
    order: 3,
    description: "Mirrors, lenses, and ray diagrams.",
  },
  // Class 10 — Chemistry
  {
    id: "ch-10-chem-1",
    name: "Acids, Bases and Salts",
    classId: "class-10",
    bookId: "book-10-chemistry",
    order: 1,
    description: "pH, indicators, and everyday chemicals.",
  },
  {
    id: "ch-10-chem-2",
    name: "Carbon and its Compounds",
    classId: "class-10",
    bookId: "book-10-chemistry",
    order: 2,
    description: "Bonding, homologous series, and functional groups.",
  },
  // Class 10 — Math
  {
    id: "ch-10-math-1",
    name: "Quadratic Equations",
    classId: "class-10",
    bookId: "book-10-math",
    order: 1,
    description: "Factoring, formula, and nature of roots.",
  },
  {
    id: "ch-10-math-2",
    name: "Triangles",
    classId: "class-10",
    bookId: "book-10-math",
    order: 2,
    description: "Similarity criteria and Pythagoras theorem.",
  },
  // Class 11 — Physics
  {
    id: "ch-11-phy-1",
    name: "Units and Measurements",
    classId: "class-11",
    bookId: "book-11-physics",
    order: 1,
    description: "SI units, dimensions, and significant figures.",
  },
  {
    id: "ch-11-phy-2",
    name: "Motion in a Straight Line",
    classId: "class-11",
    bookId: "book-11-physics",
    order: 2,
    description: "Kinematic equations and graphs.",
  },
  // Class 11 — Chemistry
  {
    id: "ch-11-chem-1",
    name: "Atomic Structure",
    classId: "class-11",
    bookId: "book-11-chemistry",
    order: 1,
    description: "Quantum numbers and electronic configuration.",
  },
  {
    id: "ch-11-chem-2",
    name: "Chemical Bonding",
    classId: "class-11",
    bookId: "book-11-chemistry",
    order: 2,
    description: "Ionic, covalent, and VSEPR theory.",
  },
  // Class 12 — Physics
  {
    id: "ch-12-phy-1",
    name: "Electrostatics",
    classId: "class-12",
    bookId: "book-12-physics",
    order: 1,
    description: "Coulomb’s law and electric field.",
  },
  {
    id: "ch-12-phy-2",
    name: "Current Electricity",
    classId: "class-12",
    bookId: "book-12-physics",
    order: 2,
    description: "Kirchhoff’s laws and circuit analysis.",
  },
  // Class 12 — Biology
  {
    id: "ch-12-bio-1",
    name: "Reproduction in Organisms",
    classId: "class-12",
    bookId: "book-12-biology",
    order: 1,
    description: "Asexual and sexual reproduction strategies.",
  },
  {
    id: "ch-12-bio-2",
    name: "Principles of Inheritance",
    classId: "class-12",
    bookId: "book-12-biology",
    order: 2,
    description: "Mendelian genetics and pedigree analysis.",
  },
];

/* -------------------------------------------------------------------------- */
/* Questions — MCQ / Short / Long                                             */
/* -------------------------------------------------------------------------- */

const mcqs: McqQuestion[] = [
  {
    id: "q-mcq-9-phy-1-1",
    type: "mcq",
    statement: "Which quantity is a vector?",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-1",
    difficulty: "easy",
    marks: 1,
    tags: ["vectors", "motion"],
    options: ["Speed", "Distance", "Displacement", "Time"],
    correctOptionIndex: 2,
  },
  {
    id: "q-mcq-9-phy-1-2",
    type: "mcq",
    statement: "The SI unit of acceleration is:",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-1",
    difficulty: "easy",
    marks: 1,
    tags: ["units"],
    options: ["m/s", "m/s²", "N", "kg·m/s"],
    correctOptionIndex: 1,
  },
  {
    id: "q-mcq-9-phy-2-1",
    type: "mcq",
    statement: "Newton’s first law is also known as the law of:",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-2",
    difficulty: "easy",
    marks: 1,
    tags: ["newton", "laws"],
    options: ["Momentum", "Inertia", "Action-reaction", "Gravitation"],
    correctOptionIndex: 1,
  },
  {
    id: "q-mcq-9-phy-3-1",
    type: "mcq",
    statement: "Work done is zero when the force is:",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-3",
    difficulty: "medium",
    marks: 1,
    tags: ["work"],
    options: [
      "Parallel to displacement",
      "Perpendicular to displacement",
      "In the same direction as velocity",
      "Larger than friction",
    ],
    correctOptionIndex: 1,
  },
  {
    id: "q-mcq-9-bio-1-1",
    type: "mcq",
    statement: "Which organelle is called the powerhouse of the cell?",
    classId: "class-9",
    bookId: "book-9-biology",
    chapterId: "ch-9-bio-1",
    difficulty: "easy",
    marks: 1,
    tags: ["cell", "organelles"],
    options: ["Ribosome", "Nucleus", "Mitochondrion", "Golgi apparatus"],
    correctOptionIndex: 2,
  },
  {
    id: "q-mcq-9-bio-2-1",
    type: "mcq",
    statement: "Xylem is responsible for the transport of:",
    classId: "class-9",
    bookId: "book-9-biology",
    chapterId: "ch-9-bio-2",
    difficulty: "easy",
    marks: 1,
    tags: ["tissues", "plants"],
    options: ["Food", "Water and minerals", "Hormones only", "Oxygen only"],
    correctOptionIndex: 1,
  },
  {
    id: "q-mcq-10-phy-1-1",
    type: "mcq",
    statement: "Ohm’s law relates:",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-1",
    difficulty: "easy",
    marks: 1,
    tags: ["electricity", "ohm"],
    options: [
      "V = IR",
      "P = IV²",
      "F = qE",
      "E = mc²",
    ],
    correctOptionIndex: 0,
  },
  {
    id: "q-mcq-10-phy-1-2",
    type: "mcq",
    statement: "The SI unit of electric current is:",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-1",
    difficulty: "easy",
    marks: 1,
    tags: ["units"],
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    correctOptionIndex: 2,
  },
  {
    id: "q-mcq-10-phy-3-1",
    type: "mcq",
    statement: "A concave lens always produces a:",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-3",
    difficulty: "medium",
    marks: 1,
    tags: ["optics", "lenses"],
    options: [
      "Real, inverted image",
      "Virtual, erect, diminished image",
      "Real, erect image",
      "Virtual, magnified image only",
    ],
    correctOptionIndex: 1,
  },
  {
    id: "q-mcq-10-chem-1-1",
    type: "mcq",
    statement: "A solution with pH = 3 is:",
    classId: "class-10",
    bookId: "book-10-chemistry",
    chapterId: "ch-10-chem-1",
    difficulty: "easy",
    marks: 1,
    tags: ["acids", "ph"],
    options: ["Neutral", "Strongly basic", "Acidic", "Weakly basic"],
    correctOptionIndex: 2,
  },
  {
    id: "q-mcq-10-math-1-1",
    type: "mcq",
    statement: "The roots of x² − 5x + 6 = 0 are:",
    classId: "class-10",
    bookId: "book-10-math",
    chapterId: "ch-10-math-1",
    difficulty: "medium",
    marks: 1,
    tags: ["quadratic"],
    options: ["2 and 3", "−2 and −3", "1 and 6", "5 and 1"],
    correctOptionIndex: 0,
  },
  {
    id: "q-mcq-11-phy-1-1",
    type: "mcq",
    statement: "Which of the following is a derived SI unit?",
    classId: "class-11",
    bookId: "book-11-physics",
    chapterId: "ch-11-phy-1",
    difficulty: "medium",
    marks: 1,
    tags: ["units"],
    options: ["Metre", "Kilogram", "Newton", "Second"],
    correctOptionIndex: 2,
  },
  {
    id: "q-mcq-11-chem-1-1",
    type: "mcq",
    statement: "The maximum electrons in an s-orbital is:",
    classId: "class-11",
    bookId: "book-11-chemistry",
    chapterId: "ch-11-chem-1",
    difficulty: "easy",
    marks: 1,
    tags: ["atomic-structure"],
    options: ["1", "2", "6", "10"],
    correctOptionIndex: 1,
  },
  {
    id: "q-mcq-12-phy-1-1",
    type: "mcq",
    statement: "Coulomb’s law is valid for:",
    classId: "class-12",
    bookId: "book-12-physics",
    chapterId: "ch-12-phy-1",
    difficulty: "medium",
    marks: 1,
    tags: ["electrostatics"],
    options: [
      "Point charges in vacuum / air approximately",
      "Only magnets",
      "Only moving charges",
      "Neutral atoms only",
    ],
    correctOptionIndex: 0,
  },
  {
    id: "q-mcq-12-bio-2-1",
    type: "mcq",
    statement: "In a monohybrid cross, the phenotypic ratio in F₂ is typically:",
    classId: "class-12",
    bookId: "book-12-biology",
    chapterId: "ch-12-bio-2",
    difficulty: "easy",
    marks: 1,
    tags: ["genetics", "mendel"],
    options: ["1 : 1", "3 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1 only"],
    correctOptionIndex: 1,
  },
];

const shortQuestions: ShortQuestion[] = [
  {
    id: "q-short-9-phy-1-1",
    type: "short",
    statement: "Define displacement. How does it differ from distance?",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-1",
    difficulty: "easy",
    marks: 2,
    tags: ["motion", "definitions"],
    sampleAnswer:
      "Displacement is the shortest path from initial to final position (vector). Distance is the total path length (scalar).",
  },
  {
    id: "q-short-9-phy-2-1",
    type: "short",
    statement: "State Newton’s third law of motion with one example.",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-2",
    difficulty: "easy",
    marks: 2,
    tags: ["newton"],
    sampleAnswer:
      "For every action there is an equal and opposite reaction — e.g. a swimmer pushes water backward to move forward.",
  },
  {
    id: "q-short-9-bio-1-1",
    type: "short",
    statement: "Why is the cell membrane called selectively permeable?",
    classId: "class-9",
    bookId: "book-9-biology",
    chapterId: "ch-9-bio-1",
    difficulty: "medium",
    marks: 2,
    tags: ["cell"],
    sampleAnswer:
      "It allows some substances to pass while restricting others, maintaining the cell’s internal environment.",
  },
  {
    id: "q-short-9-eng-1-1",
    type: "short",
    statement:
      "What is the main idea of a passage, and how do you identify it?",
    classId: "class-9",
    bookId: "book-9-english",
    chapterId: "ch-9-eng-1",
    difficulty: "easy",
    marks: 2,
    tags: ["comprehension"],
    sampleAnswer:
      "The main idea is the central point; identify it by looking at the topic sentence and recurring supporting details.",
  },
  {
    id: "q-short-10-phy-1-1",
    type: "short",
    statement: "Define one ohm of resistance.",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-1",
    difficulty: "easy",
    marks: 2,
    tags: ["electricity"],
    sampleAnswer:
      "One ohm is the resistance of a conductor when 1 A current flows under 1 V potential difference.",
  },
  {
    id: "q-short-10-phy-2-1",
    type: "short",
    statement: "What is the direction of magnetic field lines inside a bar magnet?",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-2",
    difficulty: "medium",
    marks: 2,
    tags: ["magnetism"],
    sampleAnswer: "From the south pole to the north pole inside the magnet.",
  },
  {
    id: "q-short-10-chem-2-1",
    type: "short",
    statement: "What is a homologous series? Give one example.",
    classId: "class-10",
    bookId: "book-10-chemistry",
    chapterId: "ch-10-chem-2",
    difficulty: "medium",
    marks: 2,
    tags: ["carbon"],
    sampleAnswer:
      "A series of compounds with the same functional group differing by CH₂ — e.g. alkanes: CH₄, C₂H₆, C₃H₈.",
  },
  {
    id: "q-short-10-math-2-1",
    type: "short",
    statement: "State the Pythagoras theorem.",
    classId: "class-10",
    bookId: "book-10-math",
    chapterId: "ch-10-math-2",
    difficulty: "easy",
    marks: 2,
    tags: ["geometry"],
    sampleAnswer:
      "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
  },
  {
    id: "q-short-11-phy-2-1",
    type: "short",
    statement:
      "Write the three equations of motion for constant acceleration.",
    classId: "class-11",
    bookId: "book-11-physics",
    chapterId: "ch-11-phy-2",
    difficulty: "medium",
    marks: 3,
    tags: ["kinematics"],
    sampleAnswer: "v = u + at; s = ut + ½at²; v² = u² + 2as.",
  },
  {
    id: "q-short-11-chem-2-1",
    type: "short",
    statement: "State the octet rule briefly.",
    classId: "class-11",
    bookId: "book-11-chemistry",
    chapterId: "ch-11-chem-2",
    difficulty: "easy",
    marks: 2,
    tags: ["bonding"],
    sampleAnswer:
      "Atoms tend to gain, lose, or share electrons to achieve eight electrons in their valence shell.",
  },
  {
    id: "q-short-12-phy-2-1",
    type: "short",
    statement: "State Kirchhoff’s current law (KCL).",
    classId: "class-12",
    bookId: "book-12-physics",
    chapterId: "ch-12-phy-2",
    difficulty: "medium",
    marks: 2,
    tags: ["circuits"],
    sampleAnswer:
      "The algebraic sum of currents meeting at a junction is zero (charge conservation).",
  },
  {
    id: "q-short-12-bio-1-1",
    type: "short",
    statement: "Differentiate between asexual and sexual reproduction in one point each.",
    classId: "class-12",
    bookId: "book-12-biology",
    chapterId: "ch-12-bio-1",
    difficulty: "easy",
    marks: 2,
    tags: ["reproduction"],
    sampleAnswer:
      "Asexual: single parent, offspring genetically identical. Sexual: two parents/gametes, genetic variation.",
  },
];

const longQuestions: LongQuestion[] = [
  {
    id: "q-long-9-phy-1-1",
    type: "long",
    statement:
      "Explain the difference between uniform and non-uniform motion with suitable examples and a distance-time graph description.",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-1",
    difficulty: "medium",
    marks: 5,
    tags: ["motion", "graphs"],
    suggestedWordCount: 150,
    sampleAnswer:
      "Uniform motion covers equal distances in equal intervals; non-uniform does not. Graphs: straight line vs curve.",
  },
  {
    id: "q-long-9-phy-2-1",
    type: "long",
    statement:
      "Derive and explain F = ma. Discuss how this law applies when a passenger feels a jolt in a sudden-braking bus.",
    classId: "class-9",
    bookId: "book-9-physics",
    chapterId: "ch-9-phy-2",
    difficulty: "hard",
    marks: 5,
    tags: ["newton", "applications"],
    suggestedWordCount: 180,
  },
  {
    id: "q-long-9-bio-1-1",
    type: "long",
    statement:
      "Draw a neat labelled diagram of a plant cell and describe the functions of the nucleus, chloroplast, and cell wall.",
    classId: "class-9",
    bookId: "book-9-biology",
    chapterId: "ch-9-bio-1",
    difficulty: "medium",
    marks: 5,
    tags: ["cell", "diagram"],
    suggestedWordCount: 160,
  },
  {
    id: "q-long-9-eng-2-1",
    type: "long",
    statement:
      "Write a short essay (120–150 words) on “The importance of reading habits for students.”",
    classId: "class-9",
    bookId: "book-9-english",
    chapterId: "ch-9-eng-2",
    difficulty: "medium",
    marks: 5,
    tags: ["writing"],
    suggestedWordCount: 140,
  },
  {
    id: "q-long-10-phy-1-1",
    type: "long",
    statement:
      "Explain the heating effect of electric current. Derive the expression for heat produced (H = I²Rt) and state two applications.",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-1",
    difficulty: "hard",
    marks: 5,
    tags: ["electricity", "joule"],
    suggestedWordCount: 200,
  },
  {
    id: "q-long-10-phy-3-1",
    type: "long",
    statement:
      "With the help of a ray diagram, explain image formation by a concave mirror when the object is beyond the centre of curvature.",
    classId: "class-10",
    bookId: "book-10-physics",
    chapterId: "ch-10-phy-3",
    difficulty: "hard",
    marks: 5,
    tags: ["optics"],
    suggestedWordCount: 170,
  },
  {
    id: "q-long-10-chem-1-1",
    type: "long",
    statement:
      "Describe the pH scale. Explain how acids and bases are identified using indicators, with two everyday examples of each.",
    classId: "class-10",
    bookId: "book-10-chemistry",
    chapterId: "ch-10-chem-1",
    difficulty: "medium",
    marks: 5,
    tags: ["acids", "ph"],
    suggestedWordCount: 160,
  },
  {
    id: "q-long-10-math-1-1",
    type: "long",
    statement:
      "Solve the quadratic equation 2x² − 7x + 3 = 0 by factorization and by the quadratic formula. Verify both methods give the same roots.",
    classId: "class-10",
    bookId: "book-10-math",
    chapterId: "ch-10-math-1",
    difficulty: "medium",
    marks: 5,
    tags: ["quadratic", "methods"],
    suggestedWordCount: 120,
  },
  {
    id: "q-long-11-phy-1-1",
    type: "long",
    statement:
      "Explain dimensional analysis. Using an example, show how it can check the correctness of a physical equation.",
    classId: "class-11",
    bookId: "book-11-physics",
    chapterId: "ch-11-phy-1",
    difficulty: "hard",
    marks: 5,
    tags: ["dimensions"],
    suggestedWordCount: 180,
  },
  {
    id: "q-long-11-chem-1-1",
    type: "long",
    statement:
      "Describe Bohr’s model of the atom. State its postulates and two limitations.",
    classId: "class-11",
    bookId: "book-11-chemistry",
    chapterId: "ch-11-chem-1",
    difficulty: "hard",
    marks: 5,
    tags: ["atomic-structure", "bohr"],
    suggestedWordCount: 200,
  },
  {
    id: "q-long-12-phy-1-1",
    type: "long",
    statement:
      "State Coulomb’s law in vector form. Discuss how the force between two charges changes if the distance is halved and the medium’s dielectric constant doubles.",
    classId: "class-12",
    bookId: "book-12-physics",
    chapterId: "ch-12-phy-1",
    difficulty: "hard",
    marks: 5,
    tags: ["electrostatics"],
    suggestedWordCount: 180,
  },
  {
    id: "q-long-12-bio-2-1",
    type: "long",
    statement:
      "Explain Mendel’s law of segregation with a monohybrid cross. Include phenotypic and genotypic ratios in the F₂ generation.",
    classId: "class-12",
    bookId: "book-12-biology",
    chapterId: "ch-12-bio-2",
    difficulty: "hard",
    marks: 5,
    tags: ["genetics", "mendel"],
    suggestedWordCount: 200,
  },
];

export const dummyQuestions: Question[] = [
  ...mcqs,
  ...shortQuestions,
  ...longQuestions,
];

export const dummyMcqQuestions = mcqs;
export const dummyShortQuestions = shortQuestions;
export const dummyLongQuestions = longQuestions;

/* -------------------------------------------------------------------------- */
/* Nested curriculum tree (for sidebars / drill-down UI)                      */
/* -------------------------------------------------------------------------- */

export const dummyCurriculumTree: ClassWithBooks[] = dummyClasses.map(
  (schoolClass) => ({
    ...schoolClass,
    books: dummyBooks
      .filter((book) => book.classId === schoolClass.id)
      .map((book) => ({
        ...book,
        chapters: dummyChapters
          .filter((chapter) => chapter.bookId === book.id)
          .sort((a, b) => a.order - b.order)
          .map((chapter) => ({
            ...chapter,
            questions: dummyQuestions.filter(
              (question) => question.chapterId === chapter.id,
            ),
          })),
      })),
  }),
);

/* -------------------------------------------------------------------------- */
/* Lookup helpers (UI demos — no API logic)                                   */
/* -------------------------------------------------------------------------- */

export function getBooksByClassId(classId: string): Book[] {
  return dummyBooks.filter((book) => book.classId === classId);
}

export function getChaptersByBookId(bookId: string): Chapter[] {
  return dummyChapters
    .filter((chapter) => chapter.bookId === bookId)
    .sort((a, b) => a.order - b.order);
}

export function getQuestionsByChapterId(chapterId: string): Question[] {
  return dummyQuestions.filter((question) => question.chapterId === chapterId);
}

export function getQuestionsByType(
  type: Question["type"],
  chapterId?: string,
): Question[] {
  return dummyQuestions.filter(
    (question) =>
      question.type === type &&
      (chapterId ? question.chapterId === chapterId : true),
  );
}
