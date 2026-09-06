const BOYS = [
  "/images/banner/student-boy-1.jpg",
  "/images/banner/student-boy-2.jpg",
  "/images/banner/student-boy-3.jpg",
];

const GIRL_HINTS = [
  "fatima",
  "sara",
  "zainab",
  "hira",
  "maryam",
  "iqra",
  "ayesha",
  "sana",
  "عائشہ",
  "زینب",
  "حرا",
  "مریم",
  "اقراء",
  "فاطمہ",
  "سارہ",
  "ہانیہ",
  "رباب",
  "مہوش",
  "سنا",
];

function svgToSrc(markup) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

export function academyLogoSrc() {
  return svgToSrc(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#0b3d9a"/>
      <circle cx="100" cy="100" r="78" fill="#ffffff"/>
      <circle cx="100" cy="92" r="28" fill="#1b7a32"/>
      <rect x="62" y="108" width="76" height="12" rx="2" fill="#0b3d9a"/>
      <rect x="70" y="122" width="60" height="8" rx="2" fill="#c8102e"/>
      <path d="M58 118 L100 78 L142 118 Z" fill="#0b3d9a"/>
      <text x="100" y="168" text-anchor="middle" font-size="18" font-family="sans-serif" font-weight="700" fill="#0b3d9a">ACADEMY</text>
    </svg>
  `);
}

export function girlDummySrc() {
  return svgToSrc(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200">
      <rect width="160" height="200" fill="#d9dee6"/>
      <ellipse cx="80" cy="210" rx="58" ry="62" fill="#9aa4b2"/>
      <circle cx="80" cy="78" r="36" fill="#c5ccd6"/>
      <path d="M44 78 C48 36 112 36 116 78" fill="#8b93a0"/>
      <text x="80" y="168" text-anchor="middle" font-size="14" font-family="sans-serif" fill="#5c6570">Photo</text>
    </svg>
  `);
}

export function studentPhotoSrc(index = 0) {
  return BOYS[Math.abs(index) % BOYS.length];
}

export function studentPhotoForName(name, index = 0) {
  const value = String(name || "");
  const lower = value.toLowerCase();
  const isGirl = GIRL_HINTS.some(
    (hint) => value.includes(hint) || lower.includes(hint.toLowerCase()),
  );
  return isGirl ? girlDummySrc() : studentPhotoSrc(index);
}

export function campusPhotoSrc() {
  return "/images/banner/campus.jpg";
}

export function classroomPhotoSrc() {
  return "/images/banner/classroom.jpg";
}
