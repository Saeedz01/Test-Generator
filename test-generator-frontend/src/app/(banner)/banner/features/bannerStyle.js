const TEXT_KEYS = [
  "fontId",
  "fontSize",
  "fontWeight",
  "color",
  "colorRole",
  "align",
  "valign",
  "lineHeight",
  "letterSpacing",
];

const SHAPE_KEYS = ["shape", "fill", "fillRole", "radius"];

const IMAGE_KEYS = [
  "clip",
  "objectFit",
  "objectPosition",
  "aspectLocked",
  "radius",
  "stroke",
  "strokeWidth",
];

function pick(el, keys) {
  const next = { type: el.type };
  keys.forEach((key) => {
    if (el[key] !== undefined) next[key] = el[key];
  });
  return next;
}

function styleKeys(type) {
  if (type === "text") return TEXT_KEYS;
  if (type === "shape") return SHAPE_KEYS;
  if (type === "image") return IMAGE_KEYS;
  return [];
}

export function extractStyle(doc) {
  return {
    paletteId: doc.paletteId,
    background: doc.background || { fillRole: "canvas" },
    elements: (doc.elements || []).map((el) => pick(el, styleKeys(el.type))),
    savedAt: Date.now(),
  };
}

export function applyStyle(doc, style) {
  if (!style) return doc;
  const queues = {};
  (style.elements || []).forEach((item) => {
    if (!queues[item.type]) queues[item.type] = [];
    queues[item.type].push(item);
  });
  return {
    ...doc,
    paletteId: style.paletteId || doc.paletteId,
    background: style.background || doc.background,
    elements: doc.elements.map((el) => {
      const queue = queues[el.type];
      const match = queue && queue.length ? queue.shift() : null;
      if (!match) return el;
      const props = { ...match };
      delete props.type;
      return { ...el, ...props };
    }),
  };
}

export function hasLastStyle(style) {
  return Boolean(style && (style.paletteId || style.elements?.length));
}
