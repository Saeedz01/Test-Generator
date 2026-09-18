/**
 * Wipe curriculum tables and seed bilingual sample data.
 * Does not touch users / roles. Keeps the same three classes only.
 *
 * Run: npm run prisma:seed
 */

import { PrismaClient, QuestionDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

type McqSeed = {
  en: string;
  ur: string;
  options: Array<{ en: string; ur: string }>;
  marks?: number;
  difficulty?: QuestionDifficulty;
};

type ShortSeed = {
  en: string;
  ur: string;
  marks?: number;
  difficulty?: QuestionDifficulty;
};

type LongSeed = ShortSeed;

type ChapterSeed = {
  name: string;
  order: number;
  description?: string;
  mcqs: McqSeed[];
  shorts: ShortSeed[];
  longs: LongSeed[];
};

type BookSeed = {
  name: string;
  edition?: string;
  description?: string;
  chapters: ChapterSeed[];
};

type ClassSeed = {
  name: string;
  code: string;
  description?: string;
  sortOrder: number;
  books: BookSeed[];
};

function mcq(
  en: string,
  ur: string,
  options: Array<[string, string]>,
  difficulty: QuestionDifficulty = 'medium',
): McqSeed {
  return {
    en,
    ur,
    difficulty,
    options: options.map(([e, u]) => ({ en: e, ur: u })),
  };
}

function short(
  en: string,
  ur: string,
  difficulty: QuestionDifficulty = 'medium',
): ShortSeed {
  return { en, ur, difficulty };
}

function long(
  en: string,
  ur: string,
  difficulty: QuestionDifficulty = 'medium',
): LongSeed {
  return { en, ur, difficulty };
}

const curriculum: ClassSeed[] = [
  {
    name: '9th Grade',
    code: '9th',
    description: 'Secondary School Certificate — Class 9',
    sortOrder: 1,
    books: [
      {
        name: 'Physics',
        edition: '2024',
        description: 'Fundamentals of physics for grade 9',
        chapters: [
          {
            name: 'Physical Quantities and Measurement',
            order: 1,
            description: 'Units, instruments, and significant figures',
            mcqs: [
              mcq(
                'Which instrument is used to measure the internal diameter of a pipe?',
                'پائپ کا اندرونی قطر ناپنے کے لیے کون سا آلہ استعمال ہوتا ہے؟',
                [
                  ['Vernier callipers', 'ورنیئر کیلیپرز'],
                  ['Screw gauge', 'اسکرو گیج'],
                  ['Meter rod', 'میٹر راڈ'],
                  ['Stop watch', 'اسٹاپ واچ'],
                ],
                'easy',
              ),
              mcq(
                'SI unit of mass is:',
                'کمیت کی ایس آئی اکائی ہے:',
                [
                  ['Gram', 'گرام'],
                  ['Kilogram', 'کلوگرام'],
                  ['Pound', 'پاؤنڈ'],
                  ['Newton', 'نیوٹن'],
                ],
                'easy',
              ),
              mcq(
                'A physical quantity that has magnitude only is called:',
                'وہ طبیعی مقدار جس کی صرف مقدار ہوتی ہے کہلاتی ہے:',
                [
                  ['Vector', 'سمتیہ'],
                  ['Scalar', 'عددیہ'],
                  ['Tensor', 'ٹینسر'],
                  ['Unit', 'اکائی'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short('Define physical quantity.', 'طبیعی مقدار کی تعریف لکھیں۔', 'easy'),
              short(
                'Differentiate between base and derived units.',
                'بنیادی اور مشتق اکائیوں میں فرق واضح کریں۔',
              ),
              short(
                'What is least count? Give one example.',
                'کم از کم شمار کیا ہے؟ ایک مثال دیں۔',
              ),
            ],
            longs: [
              long(
                'Explain the working of vernier callipers with a neat labelled diagram.',
                'ورنیئر کیلیپرز کے کام کرنے کے طریقہ کار کی وضاحت لیبل شدہ خاکے کے ساتھ کریں۔',
              ),
            ],
          },
          {
            name: 'Kinematics',
            order: 2,
            description: 'Motion in a straight line',
            mcqs: [
              mcq(
                'Velocity is a:',
                'سمت رفتار ہے:',
                [
                  ['Scalar quantity', 'عددی مقدار'],
                  ['Vector quantity', 'سمتی مقدار'],
                  ['Base unit', 'بنیادی اکائی'],
                  ['Derived unit only', 'صرف مشتق اکائی'],
                ],
                'easy',
              ),
              mcq(
                'The slope of a distance-time graph gives:',
                'فاصلہ-وقت گراف کا ڈھلوان دیتا ہے:',
                [
                  ['Acceleration', 'اسراع'],
                  ['Speed', 'رفتار'],
                  ['Force', 'قوت'],
                  ['Momentum', 'مومینٹم'],
                ],
              ),
              mcq(
                'If a body covers equal distances in equal intervals of time, its motion is:',
                'اگر کوئی جسم برابر وقت میں برابر فاصلے طے کرے تو اس کی حرکت ہے:',
                [
                  ['Accelerated', 'اسراع یافتہ'],
                  ['Uniform', 'یکساں'],
                  ['Retarded', 'سست'],
                  ['Random', 'بے ترتیب'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short('State the three equations of motion.', 'حرکت کی تین مساوات بیان کریں۔'),
              short(
                'Differentiate between speed and velocity.',
                'رفتار اور سمت رفتار میں فرق لکھیں۔',
                'easy',
              ),
            ],
            longs: [
              long(
                'Derive the second equation of motion using a velocity-time graph.',
                'سمت رفتار-وقت گراف کی مدد سے حرکت کی دوسری مساوات اخذ کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Dynamics',
            order: 3,
            description: 'Force, inertia, and Newton’s laws',
            mcqs: [
              mcq(
                'Newton’s first law is also called the law of:',
                'نیوٹن کا پہلا قانون کہلاتا ہے:',
                [
                  ['Acceleration', 'اسراع'],
                  ['Inertia', 'جڑت'],
                  ['Momentum', 'مومینٹم'],
                  ['Gravitation', 'کشش ثقل'],
                ],
                'easy',
              ),
              mcq(
                'SI unit of force is:',
                'قوت کی ایس آئی اکائی ہے:',
                [
                  ['Joule', 'جول'],
                  ['Watt', 'واٹ'],
                  ['Newton', 'نیوٹن'],
                  ['Pascal', 'پاسکل'],
                ],
                'easy',
              ),
              mcq(
                'Action and reaction forces are always:',
                'عمل اور رد عمل کی قوتیں ہمیشہ ہوتی ہیں:',
                [
                  ['Equal and in the same direction', 'برابر اور ایک ہی سمت میں'],
                  ['Unequal and opposite', 'غیر برابر اور مخالف'],
                  ['Equal and opposite', 'برابر اور مخالف'],
                  ['Zero', 'صفر'],
                ],
              ),
            ],
            shorts: [
              short('State Newton’s second law of motion.', 'نیوٹن کا دوسرا قانون حرکت بیان کریں۔'),
              short('Define inertia with an example.', 'جڑت کی تعریف مثال کے ساتھ لکھیں۔', 'easy'),
            ],
            longs: [
              long(
                'Explain Newton’s three laws of motion with daily-life examples.',
                'نیوٹن کے تین قوانین حرکت کی وضاحت روزمرہ زندگی کی مثالوں کے ساتھ کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Turning Effect of Forces',
            order: 4,
            mcqs: [
              mcq(
                'Moment of a force is also called:',
                'قوت کا لمحہ کہلاتا ہے:',
                [
                  ['Torque', 'ٹارک'],
                  ['Pressure', 'دباؤ'],
                  ['Power', 'طاقت'],
                  ['Energy', 'توانائی'],
                ],
                'easy',
              ),
              mcq(
                'A body is in equilibrium if the resultant of all forces and torques is:',
                'جسم توازن میں ہوتا ہے اگر تمام قوتوں اور ٹارک کا حاصل ہو:',
                [
                  ['Maximum', 'زیادہ سے زیادہ'],
                  ['Minimum', 'کم از کم'],
                  ['Zero', 'صفر'],
                  ['Infinite', 'لا متناہی'],
                ],
              ),
            ],
            shorts: [
              short('Define centre of gravity.', 'ثقل مرکز کی تعریف لکھیں۔', 'easy'),
              short(
                'State the conditions of equilibrium.',
                'توازن کی شرائط بیان کریں۔',
              ),
            ],
            longs: [
              long(
                'Explain stable, unstable, and neutral equilibrium with examples.',
                'مستحکم، غیر مستحکم اور غیر جانبدار توازن کی وضاحت مثالوں کے ساتھ کریں۔',
              ),
            ],
          },
        ],
      },
      {
        name: 'Chemistry',
        edition: '2024',
        description: 'Introductory chemistry for grade 9',
        chapters: [
          {
            name: 'Fundamentals of Chemistry',
            order: 1,
            mcqs: [
              mcq(
                'Which of the following is a compound?',
                'مندرجہ ذیل میں سے کون سا مرکب ہے؟',
                [
                  ['Oxygen', 'آکسیجن'],
                  ['Water', 'پانی'],
                  ['Iron', 'لوہا'],
                  ['Gold', 'سونا'],
                ],
                'easy',
              ),
              mcq(
                'Atomic number of an element is equal to:',
                'عنصر کا جوہری عدد برابر ہوتا ہے:',
                [
                  ['Number of neutrons', 'نیوٹرانوں کی تعداد'],
                  ['Number of protons', 'پروٹانوں کی تعداد'],
                  ['Number of electrons + protons', 'الیکٹران + پروٹان'],
                  ['Mass number', 'کمیتی عدد'],
                ],
                'easy',
              ),
              mcq(
                'A homogeneous mixture is also called a:',
                'ہم جنس آمیزش کو کہتے ہیں:',
                [
                  ['Suspension', 'معطلہ'],
                  ['Solution', 'محلول'],
                  ['Colloid', 'کولائیڈ'],
                  ['Alloy only', 'صرف مصر'],
                ],
              ),
            ],
            shorts: [
              short(
                'Define element and compound with one example each.',
                'عنصر اور مرکب کی تعریف ایک ایک مثال کے ساتھ لکھیں۔',
              ),
              short('What is a molecule?', 'مالیکیول کیا ہے؟', 'easy'),
            ],
            longs: [
              long(
                'Explain Rutherford’s atomic model and its limitations.',
                'رترفورڈ کے جوہری ماڈل اور اس کی حدود کی وضاحت کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Structure of Atoms',
            order: 2,
            mcqs: [
              mcq(
                'Electrons revolve around the nucleus in:',
                'الیکٹران مرکزے کے گرد گھومتے ہیں:',
                [
                  ['Orbits / shells', 'مدار / شیلز'],
                  ['Nucleus only', 'صرف مرکزہ'],
                  ['Protons', 'پروٹان'],
                  ['Neutrons', 'نیوٹران'],
                ],
                'easy',
              ),
              mcq(
                'Isotopes of an element have the same:',
                'عنصر کے آاسوٹوپ میں یکساں ہوتا ہے:',
                [
                  ['Mass number', 'کمیتی عدد'],
                  ['Atomic number', 'جوہری عدد'],
                  ['Number of neutrons', 'نیوٹرانوں کی تعداد'],
                  ['Physical state always', 'ہمیشہ طبیعی حالت'],
                ],
              ),
            ],
            shorts: [
              short('Define isotope with an example.', 'آاسوٹوپ کی تعریف مثال کے ساتھ لکھیں۔'),
              short(
                'Write electronic configuration of sodium (Z = 11).',
                'سوڈیم (Z = 11) کی الیکٹرانک ترتیب لکھیں۔',
              ),
            ],
            longs: [
              long(
                'Describe Bohr’s atomic model and compare it with Rutherford’s model.',
                'بوہر کے جوہری ماڈل کی وضاحت کریں اور رترفورڈ ماڈل سے موازنہ کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Periodic Table',
            order: 3,
            mcqs: [
              mcq(
                'Elements in the same group have the same number of:',
                'ایک ہی گروپ کے عناصر میں یکساں تعداد ہوتی ہے:',
                [
                  ['Shells', 'شیلوں کی'],
                  ['Valence electrons', 'ویلینس الیکٹرانوں کی'],
                  ['Protons always', 'ہمیشہ پروٹانوں کی'],
                  ['Neutrons', 'نیوٹرانوں کی'],
                ],
              ),
              mcq(
                'Across a period from left to right, atomic size generally:',
                'دورہ میں بائیں سے دائیں جوہری سائز عام طور پر:',
                [
                  ['Increases', 'بڑھتا ہے'],
                  ['Decreases', 'گھٹتا ہے'],
                  ['Remains constant', 'مستقل رہتا ہے'],
                  ['Becomes zero', 'صفر ہو جاتا ہے'],
                ],
              ),
            ],
            shorts: [
              short(
                'Differentiate between a group and a period.',
                'گروپ اور دورہ میں فرق لکھیں۔',
                'easy',
              ),
            ],
            longs: [
              long(
                'Explain the trends of atomic size and electronegativity in the periodic table.',
                'متواتر جدول میں جوہری سائز اور برقی منفی پن کے رجحانات کی وضاحت کریں۔',
                'hard',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    name: '10th Grade',
    code: '10th',
    description: 'Secondary School Certificate — Class 10',
    sortOrder: 2,
    books: [
      {
        name: 'Biology',
        edition: '2024',
        chapters: [
          {
            name: 'Gaseous Exchange',
            order: 1,
            mcqs: [
              mcq(
                'The process of exchange of gases in humans mainly occurs in:',
                'انسانوں میں گیسوں کے تبادلے کا عمل بنیادی طور پر ہوتا ہے:',
                [
                  ['Bronchi', 'برونکائی'],
                  ['Alveoli', 'الویولی'],
                  ['Trachea', 'ٹریچیا'],
                  ['Larynx', 'لیرنکس'],
                ],
                'easy',
              ),
              mcq(
                'Which gas is released during photosynthesis?',
                'فوٹو سنتھیسز کے دوران کون سی گیس خارج ہوتی ہے؟',
                [
                  ['Carbon dioxide', 'کاربن ڈائی آکسائیڈ'],
                  ['Nitrogen', 'نائٹروجن'],
                  ['Oxygen', 'آکسیجن'],
                  ['Hydrogen', 'ہائیڈروجن'],
                ],
                'easy',
              ),
              mcq(
                'Stomata are mainly present on:',
                'سٹوماٹا زیادہ تر موجود ہوتے ہیں:',
                [
                  ['Roots', 'جڑوں پر'],
                  ['Leaves', 'پتیوں پر'],
                  ['Flowers only', 'صرف پھولوں پر'],
                  ['Seeds', 'بیجوں پر'],
                ],
              ),
            ],
            shorts: [
              short(
                'Differentiate between breathing and respiration.',
                'تنفس اور سانس لینے میں فرق واضح کریں۔',
              ),
              short('What is the function of alveoli?', 'الویولی کا کام کیا ہے؟', 'easy'),
            ],
            longs: [
              long(
                'Describe the mechanism of inspiration and expiration in humans.',
                'انسانوں میں سانس لینے اور چھوڑنے کے طریقہ کار کی تفصیل بیان کریں۔',
              ),
            ],
          },
          {
            name: 'Homeostasis',
            order: 2,
            mcqs: [
              mcq(
                'Kidneys help in maintaining:',
                'گردے برقرار رکھنے میں مدد کرتے ہیں:',
                [
                  ['Blood glucose only', 'صرف خون میں گلوکوز'],
                  ['Body temperature only', 'صرف جسمانی درجہ حرارت'],
                  ['Water and salt balance', 'پانی اور نمکیات کا توازن'],
                  ['Oxygen level only', 'صرف آکسیجن کی سطح'],
                ],
              ),
              mcq(
                'The functional unit of the kidney is:',
                'گردے کی فعال اکائی ہے:',
                [
                  ['Neuron', 'نیورون'],
                  ['Nephron', 'نیفرون'],
                  ['Alveolus', 'الویولس'],
                  ['Villus', 'ویلس'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short('What is homeostasis?', 'ہومیوسٹیسس کیا ہے؟', 'easy'),
              short('Name the main excretory organs in humans.', 'انسان کے اہم اخراجی اعضاء کے نام لکھیں۔'),
            ],
            longs: [
              long(
                'Explain the structure and function of the human kidney.',
                'انسانی گردے کی ساخت اور کام کی وضاحت کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Coordination and Control',
            order: 3,
            mcqs: [
              mcq(
                'The basic unit of the nervous system is:',
                'عصبی نظام کی بنیادی اکائی ہے:',
                [
                  ['Nephron', 'نیفرون'],
                  ['Neuron', 'نیورون'],
                  ['Osteocyte', 'آسٹیوسائٹ'],
                  ['Myocyte', 'مائیوسائٹ'],
                ],
                'easy',
              ),
              mcq(
                'Which hormone regulates blood sugar level?',
                'کون سا ہارمون خون میں شکر کی سطح منظم کرتا ہے؟',
                [
                  ['Thyroxine', 'تھائروکسین'],
                  ['Insulin', 'انسولین'],
                  ['Adrenaline', 'ایڈرینالین'],
                  ['Estrogen', 'ایسٹروجن'],
                ],
              ),
            ],
            shorts: [
              short(
                'Differentiate between sensory and motor neurons.',
                'حسی اور حرکی نیورون میں فرق لکھیں۔',
              ),
            ],
            longs: [
              long(
                'Describe the structure of a neuron and explain how a nerve impulse is transmitted.',
                'نیورون کی ساخت بیان کریں اور وضاحت کریں کہ عصبی تحریک کیسے منتقل ہوتی ہے۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Reproduction',
            order: 4,
            mcqs: [
              mcq(
                'Binary fission is common in:',
                'ثنائی انشقاق عام ہے:',
                [
                  ['Humans', 'انسانوں میں'],
                  ['Amoeba', 'امیبا میں'],
                  ['Birds', 'پرندوں میں'],
                  ['Flowering plants only', 'صرف پھولدار پودوں میں'],
                ],
                'easy',
              ),
              mcq(
                'Pollination is the transfer of pollen from:',
                'جرگنشانی جرگ کی منتقلی ہے از:',
                [
                  ['Ovary to anther', 'انڈاشے سے اینتھر'],
                  ['Anther to stigma', 'اینتھر سے اسٹگما'],
                  ['Root to leaf', 'جڑ سے پتی'],
                  ['Seed to fruit', 'بیج سے پھل'],
                ],
              ),
            ],
            shorts: [
              short(
                'Differentiate between asexual and sexual reproduction.',
                'غیر جنسی اور جنسی تولید میں فرق لکھیں۔',
              ),
            ],
            longs: [
              long(
                'Explain the process of fertilization in flowering plants.',
                'پھولدار پودوں میں بارآوری کے عمل کی وضاحت کریں۔',
              ),
            ],
          },
        ],
      },
      {
        name: 'Mathematics',
        edition: '2024',
        chapters: [
          {
            name: 'Quadratic Equations',
            order: 1,
            mcqs: [
              mcq(
                'The roots of a quadratic equation are real and equal when discriminant is:',
                'مربعی مساوات کی جڑیں حقیقی اور برابر ہوتی ہیں جب ممیز ہو:',
                [
                  ['Positive', 'مثبت'],
                  ['Negative', 'منفی'],
                  ['Zero', 'صفر'],
                  ['Undefined', 'غیر معین'],
                ],
              ),
              mcq(
                'Standard form of a quadratic equation is:',
                'مربعی مساوات کی معیاری شکل ہے:',
                [
                  ['ax + b = 0', 'ax + b = 0'],
                  ['ax² + bx + c = 0', 'ax² + bx + c = 0'],
                  ['a/x + b = 0', 'a/x + b = 0'],
                  ['ax³ + b = 0', 'ax³ + b = 0'],
                ],
                'easy',
              ),
              mcq(
                'If one root of x² − 5x + k = 0 is 2, then k equals:',
                'اگر x² − 5x + k = 0 کی ایک جڑ 2 ہو تو k برابر ہے:',
                [
                  ['2', '2'],
                  ['6', '6'],
                  ['10', '10'],
                  ['3', '3'],
                ],
                'hard',
              ),
            ],
            shorts: [
              short('Solve: x² − 5x + 6 = 0', 'حل کریں: x² − 5x + 6 = 0'),
              short('Define discriminant of a quadratic equation.', 'مربعی مساوات کے ممیز کی تعریف لکھیں۔', 'easy'),
            ],
            longs: [
              long(
                'Derive the quadratic formula and use it to solve 2x² − 7x + 3 = 0.',
                'مربعی فارمولا اخذ کریں اور اس سے 2x² − 7x + 3 = 0 حل کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Partial Fractions',
            order: 2,
            mcqs: [
              mcq(
                'Partial fractions are used to resolve:',
                'جزوی کسر استعمال ہوتی ہیں توڑنے کے لیے:',
                [
                  ['Proper rational fractions', 'مناسب عقلی کسور'],
                  ['Irrational numbers only', 'صرف غیر عقلی اعداد'],
                  ['Integers only', 'صرف صحیح اعداد'],
                  ['Matrices', 'میٹرکس'],
                ],
              ),
            ],
            shorts: [
              short(
                'Resolve into partial fractions: (x + 1)/(x² − 1)',
                'جزوی کسور میں توڑیں: (x + 1)/(x² − 1)',
              ),
            ],
            longs: [
              long(
                'Explain the method of resolving a proper rational fraction into partial fractions with an example.',
                'مناسب عقلی کسر کو جزوی کسور میں توڑنے کا طریقہ مثال کے ساتھ بیان کریں۔',
              ),
            ],
          },
          {
            name: 'Basic Statistics',
            order: 3,
            mcqs: [
              mcq(
                'The average of a data set is also called:',
                'ڈیٹا سیٹ کی اوسط کہلاتی ہے:',
                [
                  ['Median', 'درمیانیہ'],
                  ['Mode', 'کثرتیہ'],
                  ['Arithmetic mean', 'حسابی اوسط'],
                  ['Range', 'وسعت'],
                ],
                'easy',
              ),
              mcq(
                'Mode is the value that:',
                'کثرتیہ وہ قدر ہے جو:',
                [
                  ['Appears most frequently', 'سب سے زیادہ بار آتی ہے'],
                  ['Lies in the middle', 'درمیان میں ہوتی ہے'],
                  ['Is always the largest', 'ہمیشہ سب سے بڑی ہوتی ہے'],
                  ['Is always zero', 'ہمیشہ صفر ہوتی ہے'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short(
                'Find the mean of 2, 4, 6, 8, 10.',
                '2, 4, 6, 8, 10 کی اوسط معلوم کریں۔',
                'easy',
              ),
              short('Differentiate between mean, median, and mode.', 'اوسط، درمیانیہ اور کثرتیہ میں فرق لکھیں۔'),
            ],
            longs: [
              long(
                'Construct a frequency table for the given data and calculate mean and median.',
                'دیے گئے ڈیٹا کے لیے تعدد جدول بنائیں اور اوسط و درمیانیہ معلوم کریں۔',
                'hard',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'ICS Part-I',
    code: 'ics-1',
    description: 'Intermediate Computer Science — Part I',
    sortOrder: 3,
    books: [
      {
        name: 'Computer Science',
        edition: '2024',
        chapters: [
          {
            name: 'Introduction to Computers',
            order: 1,
            mcqs: [
              mcq(
                'Which of the following is an input device?',
                'مندرجہ ذیل میں سے کون سا ان پٹ ڈیوائس ہے؟',
                [
                  ['Monitor', 'مانیٹر'],
                  ['Printer', 'پرنٹر'],
                  ['Keyboard', 'کی بورڈ'],
                  ['Speaker', 'اسپیکر'],
                ],
                'easy',
              ),
              mcq(
                'CPU stands for:',
                'سی پی یو کا مطلب ہے:',
                [
                  ['Central Processing Unit', 'سنٹرل پروسیسنگ یونٹ'],
                  ['Computer Personal Unit', 'کمپیوٹر پرسنل یونٹ'],
                  ['Control Process Utility', 'کنٹرول پروسیس یوٹیلیٹی'],
                  ['Central Print Unit', 'سنٹرل پرنٹ یونٹ'],
                ],
                'easy',
              ),
              mcq(
                'RAM is a type of:',
                'ریم ایک قسم ہے:',
                [
                  ['Permanent storage', 'مستقل ذخیرہ'],
                  ['Volatile memory', 'غیر پائیدار میموری'],
                  ['Output device', 'آؤٹ پٹ ڈیوائس'],
                  ['Network protocol', 'نیٹ ورک پروٹوکول'],
                ],
              ),
            ],
            shorts: [
              short(
                'Differentiate between hardware and software.',
                'ہارڈویئر اور سافٹ ویئر میں فرق لکھیں۔',
              ),
              short('What is system software?', 'سسٹم سافٹ ویئر کیا ہے؟', 'easy'),
            ],
            longs: [
              long(
                'Explain the basic components of a computer system with a block diagram.',
                'کمپیوٹر سسٹم کے بنیادی اجزاء کی وضاحت بلاک ڈایاگرام کے ساتھ کریں۔',
              ),
            ],
          },
          {
            name: 'Data Communication',
            order: 2,
            mcqs: [
              mcq(
                'LAN stands for:',
                'ایل اے این کا مطلب ہے:',
                [
                  ['Large Area Network', 'لارج ایریا نیٹ ورک'],
                  ['Local Area Network', 'لوکل ایریا نیٹ ورک'],
                  ['Long Access Node', 'لانگ ایکسیس نوڈ'],
                  ['Logical Area Node', 'لاجیکل ایریا نوڈ'],
                ],
                'easy',
              ),
              mcq(
                'Which topology connects all nodes to a single central cable?',
                'کون سی ٹوپولوجی تمام نوڈز کو ایک مرکزی کیبل سے جوڑتی ہے؟',
                [
                  ['Star', 'ستارہ'],
                  ['Ring', 'حلقہ'],
                  ['Bus', 'بس'],
                  ['Mesh', 'جال'],
                ],
              ),
            ],
            shorts: [
              short('Define bandwidth.', 'بینڈوڈتھ کی تعریف لکھیں۔', 'easy'),
              short(
                'Differentiate between LAN and WAN.',
                'LAN اور WAN میں فرق لکھیں۔',
              ),
            ],
            longs: [
              long(
                'Compare guided and unguided transmission media with examples.',
                'ہدایت یافتہ اور غیر ہدایت یافتہ ترسیلی ذرائع کا موازنہ مثالوں کے ساتھ کریں۔',
              ),
            ],
          },
          {
            name: 'Boolean Algebra',
            order: 3,
            mcqs: [
              mcq(
                'The output of an AND gate is 1 only when:',
                'اینڈ گیٹ کا آؤٹ پٹ 1 تب ہوتا ہے جب:',
                [
                  ['Any input is 1', 'کوئی بھی ان پٹ 1 ہو'],
                  ['All inputs are 1', 'تمام ان پٹ 1 ہوں'],
                  ['All inputs are 0', 'تمام ان پٹ 0 ہوں'],
                  ['Inputs are different', 'ان پٹ مختلف ہوں'],
                ],
                'easy',
              ),
              mcq(
                'NOT gate is also called:',
                'ناٹ گیٹ کہلاتی ہے:',
                [
                  ['Inverter', 'انورٹر'],
                  ['Amplifier', 'ایمپلیفائر'],
                  ['Adder', 'ایڈر'],
                  ['Encoder', 'انکوڈر'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short('Draw the truth table of OR gate.', 'OR گیٹ کا صداقت جدول بنائیں۔'),
              short('State De Morgan’s theorems.', 'ڈی مورگن کے نظریات بیان کریں۔', 'hard'),
            ],
            longs: [
              long(
                'Explain AND, OR, and NOT gates with symbols, truth tables, and Boolean expressions.',
                'AND، OR اور NOT گیٹس کی وضاحت علامات، صداقت جداول اور بولین اظہار کے ساتھ کریں۔',
              ),
            ],
          },
          {
            name: 'Operating Systems',
            order: 4,
            mcqs: [
              mcq(
                'Which of the following is an operating system?',
                'مندرجہ ذیل میں سے کون سا آپریٹنگ سسٹم ہے؟',
                [
                  ['MS Word', 'ایم ایس ورڈ'],
                  ['Windows', 'ونڈوز'],
                  ['Google Chrome', 'گوگل کروم'],
                  ['Adobe Photoshop', 'اڈوبی فوٹوشاپ'],
                ],
                'easy',
              ),
              mcq(
                'Multitasking OS can:',
                'ملٹی ٹاسکنگ او ایس کر سکتا ہے:',
                [
                  ['Run only one program', 'صرف ایک پروگرام چلا سکتا ہے'],
                  ['Run multiple programs at once', 'ایک وقت میں کئی پروگرام چلا سکتا ہے'],
                  ['Store data permanently only', 'صرف مستقل ڈیٹا محفوظ کر سکتا ہے'],
                  ['Replace the CPU', 'سی پی یو بدل سکتا ہے'],
                ],
              ),
            ],
            shorts: [
              short(
                'Differentiate between CLI and GUI.',
                'CLI اور GUI میں فرق لکھیں۔',
              ),
            ],
            longs: [
              long(
                'Explain the main functions of an operating system.',
                'آپریٹنگ سسٹم کے اہم کاموں کی وضاحت کریں۔',
              ),
            ],
          },
        ],
      },
      {
        name: 'Physics',
        edition: '2024',
        chapters: [
          {
            name: 'Electrostatics',
            order: 1,
            mcqs: [
              mcq(
                'Like charges:',
                'ہم جنس چارج:',
                [
                  ['Attract each other', 'ایک دوسرے کو کھینچتے ہیں'],
                  ['Repel each other', 'ایک دوسرے کو دھکیلتے ہیں'],
                  ['Have no effect', 'کوئی اثر نہیں رکھتے'],
                  ['Neutralize instantly', 'فوراً غیر مؤثر ہو جاتے ہیں'],
                ],
                'easy',
              ),
              mcq(
                'SI unit of electric charge is:',
                'برقی چارج کی ایس آئی اکائی ہے:',
                [
                  ['Ampere', 'ایمپیئر'],
                  ['Coulomb', 'کولمب'],
                  ['Volt', 'وولٹ'],
                  ['Ohm', 'اوہم'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short('State Coulomb’s law.', 'کولمب کا قانون بیان کریں۔'),
              short('Define electric field intensity.', 'برقی میدان کی شدت کی تعریف لکھیں۔'),
            ],
            longs: [
              long(
                'Derive an expression for electric field intensity due to a point charge.',
                'نقطہ چارج کی وجہ سے برقی میدان کی شدت کا اظہار اخذ کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Current Electricity',
            order: 2,
            mcqs: [
              mcq(
                'Ohm’s law states that V is proportional to I when:',
                'اوہم کا قانون کہتا ہے کہ V، I کے متناسب ہے جب:',
                [
                  ['Temperature changes freely', 'درجہ حرارت آزادانہ بدلے'],
                  ['Physical conditions remain constant', 'طبیعی حالات مستقل رہیں'],
                  ['Resistance is zero', 'مقاومت صفر ہو'],
                  ['Current is alternating only', 'کرنٹ صرف متبادل ہو'],
                ],
              ),
              mcq(
                'SI unit of resistance is:',
                'مقاومت کی ایس آئی اکائی ہے:',
                [
                  ['Volt', 'وولٹ'],
                  ['Ohm', 'اوہم'],
                  ['Ampere', 'ایمپیئر'],
                  ['Watt', 'واٹ'],
                ],
                'easy',
              ),
            ],
            shorts: [
              short('Define electric current.', 'برقی رو کی تعریف لکھیں۔', 'easy'),
              short(
                'Differentiate between series and parallel combination of resistors.',
                'مزاحمتوں کے سلسلہ وار اور متوازی جوڑ میں فرق لکھیں۔',
              ),
            ],
            longs: [
              long(
                'State and explain Ohm’s law. Also derive the equivalent resistance for three resistors in series.',
                'اوہم کا قانون بیان اور وضاحت کریں۔ نیز تین مزاحمتوں کے سلسلہ وار جوڑ کی مساوی مزاحمت اخذ کریں۔',
                'hard',
              ),
            ],
          },
          {
            name: 'Electromagnetism',
            order: 3,
            mcqs: [
              mcq(
                'A magnetic field is produced around a:',
                'مقناطیسی میدان پیدا ہوتا ہے گرد:',
                [
                  ['Stationary charge only', 'صرف ساکن چارج کے'],
                  ['Current-carrying conductor', 'رو رکھنے والے موصل کے'],
                  ['Insulator only', 'صرف غیر موصل کے'],
                  ['Neutral atom only', 'صرف غیر جانبدار ایٹم کے'],
                ],
              ),
            ],
            shorts: [
              short(
                'State Fleming’s left-hand rule.',
                'فلیمنگ کا بایاں ہاتھ اصول بیان کریں۔',
              ),
            ],
            longs: [
              long(
                'Explain the working principle of a simple DC motor.',
                'سادہ ڈی سی موٹر کے کام کرنے کے اصول کی وضاحت کریں۔',
              ),
            ],
          },
        ],
      },
    ],
  },
];

async function clearCurriculum() {
  await prisma.mcqQuestion.deleteMany();
  await prisma.shortQuestion.deleteMany();
  await prisma.longQuestion.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.book.deleteMany();
  await prisma.schoolClass.deleteMany();
}

/** Ensure every book's first chapter has at least 5 MCQs, 6 short, 2 long (EN+UR). */
function padFirstChapters(data: ClassSeed[]): ClassSeed[] {
  const minMcq = 5;
  const minShort = 6;
  const minLong = 2;

  return data.map((schoolClass) => ({
    ...schoolClass,
    books: schoolClass.books.map((book) => ({
      ...book,
      chapters: book.chapters.map((chapter) => {
        if (chapter.order !== 1) return chapter;

        const mcqs = [...chapter.mcqs];
        const shorts = [...chapter.shorts];
        const longs = [...chapter.longs];

        let i = mcqs.length + 1;
        while (mcqs.length < minMcq) {
          mcqs.push(
            mcq(
              `Practice MCQ ${i}: Which statement is correct about this topic?`,
              `مشقی کثیر الانتخابی ${i}: اس موضوع کے بارے میں کون سا بیان درست ہے؟`,
              [
                ['Statement A', 'بیان الف'],
                ['Statement B', 'بیان ب'],
                ['Statement C', 'بیان ج'],
                ['Statement D', 'بیان د'],
              ],
              'easy',
            ),
          );
          i += 1;
        }

        let s = shorts.length + 1;
        while (shorts.length < minShort) {
          shorts.push(
            short(
              `Practice short ${s}: Write a brief note on a key idea from this chapter.`,
              `مشقی مختصر ${s}: اس باب کے ایک اہم خیال پر مختصر نوٹ لکھیں۔`,
              'easy',
            ),
          );
          s += 1;
        }

        let l = longs.length + 1;
        while (longs.length < minLong) {
          longs.push(
            long(
              `Practice long ${l}: Explain the main concepts of this chapter with examples.`,
              `مشقی طویل ${l}: اس باب کے بنیادی تصورات کی مثالوں کے ساتھ وضاحت کریں۔`,
              'medium',
            ),
          );
          l += 1;
        }

        return { ...chapter, mcqs, shorts, longs };
      }),
    })),
  }));
}

async function seedCurriculum() {
  const seeded = padFirstChapters(curriculum);
  for (const schoolClass of seeded) {
    const createdClass = await prisma.schoolClass.create({
      data: {
        name: schoolClass.name,
        code: schoolClass.code,
        description: schoolClass.description ?? null,
        sortOrder: schoolClass.sortOrder,
      },
    });

    for (const book of schoolClass.books) {
      const createdBook = await prisma.book.create({
        data: {
          book_name: book.name,
          edition: book.edition ?? null,
          description: book.description ?? null,
          classId: createdClass.id,
        },
      });

      for (const chapter of book.chapters) {
        const createdChapter = await prisma.chapter.create({
          data: {
            chapter_name: chapter.name,
            order: chapter.order,
            description: chapter.description ?? null,
            bookId: createdBook.id,
          },
        });

        for (const item of chapter.mcqs) {
          await prisma.mcqQuestion.create({
            data: {
              question_text: item.en,
              questionTextUr: item.ur,
              options: item.options,
              marks: item.marks ?? 1,
              difficulty: item.difficulty ?? 'medium',
              chapterId: createdChapter.id,
            },
          });
        }

        for (const item of chapter.shorts) {
          await prisma.shortQuestion.create({
            data: {
              question_text: item.en,
              questionTextUr: item.ur,
              marks: item.marks ?? 2,
              difficulty: item.difficulty ?? 'medium',
              chapterId: createdChapter.id,
            },
          });
        }

        for (const item of chapter.longs) {
          await prisma.longQuestion.create({
            data: {
              question_text: item.en,
              questionTextUr: item.ur,
              marks: item.marks ?? 5,
              difficulty: item.difficulty ?? 'medium',
              chapterId: createdChapter.id,
            },
          });
        }
      }
    }
  }
}

async function main() {
  console.log('Clearing curriculum (keeping same 3 classes on re-seed)...');
  await clearCurriculum();
  console.log('Seeding curriculum (first chapter of each book ≥5 MCQ / 6 short / 2 long)...');
  await seedCurriculum();

  const firstChapterStats = await prisma.chapter.findMany({
    where: { order: 1 },
    select: {
      chapter_name: true,
      book: { select: { book_name: true } },
      _count: {
        select: {
          mcqQuestions: true,
          shortQuestions: true,
          questions: true,
        },
      },
    },
    orderBy: { chapter_name: 'asc' },
  });

  console.log('First-chapter question counts:');
  for (const ch of firstChapterStats) {
    console.log(
      `  ${ch.book.book_name} / ${ch.chapter_name}: mcq=${ch._count.mcqQuestions}, short=${ch._count.shortQuestions}, long=${ch._count.questions}`,
    );
  }
  const [classes, books, chapters, mcqs, shorts, longs] = await Promise.all([
    prisma.schoolClass.count(),
    prisma.book.count(),
    prisma.chapter.count(),
    prisma.mcqQuestion.count(),
    prisma.shortQuestion.count(),
    prisma.longQuestion.count(),
  ]);

  console.log('Seed complete:');
  console.log(`  classes:  ${classes}`);
  console.log(`  books:    ${books}`);
  console.log(`  chapters: ${chapters}`);
  console.log(`  mcqs:     ${mcqs}`);
  console.log(`  shorts:   ${shorts}`);
  console.log(`  longs:    ${longs}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
