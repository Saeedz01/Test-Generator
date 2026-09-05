const THRESHOLD = 8;

function nearest(value, targets) {
  let best = value;
  let guide = null;
  let dist = THRESHOLD;
  targets.forEach((target) => {
    const delta = Math.abs(value - target);
    if (delta < dist) {
      dist = delta;
      best = target;
      guide = target;
    }
  });
  return { value: best, guide };
}

export function snapElement(el, doc) {
  const xs = [0, doc.width / 2, doc.width];
  const ys = [0, doc.height / 2, doc.height];
  doc.elements.forEach((other) => {
    if (other.id === el.id) return;
    xs.push(other.x, other.x + other.width / 2, other.x + other.width);
    ys.push(other.y, other.y + other.height / 2, other.y + other.height);
  });

  const left = nearest(el.x, xs);
  const cx = nearest(el.x + el.width / 2, xs);
  const right = nearest(el.x + el.width, xs);
  const top = nearest(el.y, ys);
  const cy = nearest(el.y + el.height / 2, ys);
  const bottom = nearest(el.y + el.height, ys);

  const xOptions = [
    { snapped: left.value, orig: el.x, guide: left.guide },
    { snapped: cx.value - el.width / 2, orig: el.x, guide: cx.guide },
    { snapped: right.value - el.width, orig: el.x, guide: right.guide },
  ];
  const yOptions = [
    { snapped: top.value, orig: el.y, guide: top.guide },
    { snapped: cy.value - el.height / 2, orig: el.y, guide: cy.guide },
    { snapped: bottom.value - el.height, orig: el.y, guide: bottom.guide },
  ];

  const bestX = xOptions.reduce((a, b) =>
    Math.abs(b.snapped - b.orig) < Math.abs(a.snapped - a.orig) ? b : a,
  );
  const bestY = yOptions.reduce((a, b) =>
    Math.abs(b.snapped - b.orig) < Math.abs(a.snapped - a.orig) ? b : a,
  );

  const guides = [];
  if (bestX.guide != null && Math.abs(bestX.snapped - el.x) < THRESHOLD) {
    guides.push({ axis: "v", position: bestX.guide });
  }
  if (bestY.guide != null && Math.abs(bestY.snapped - el.y) < THRESHOLD) {
    guides.push({ axis: "h", position: bestY.guide });
  }

  return {
    el: {
      ...el,
      x: Math.round(bestX.snapped),
      y: Math.round(bestY.snapped),
    },
    guides,
  };
}

export function alignElement(el, doc, edge) {
  switch (edge) {
    case "left":
      return { ...el, x: 0 };
    case "center":
      return { ...el, x: Math.round((doc.width - el.width) / 2) };
    case "right":
      return { ...el, x: doc.width - el.width };
    case "top":
      return { ...el, y: 0 };
    case "middle":
      return { ...el, y: Math.round((doc.height - el.height) / 2) };
    case "bottom":
      return { ...el, y: doc.height - el.height };
    default:
      return el;
  }
}
