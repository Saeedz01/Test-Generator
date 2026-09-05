import { snapElement } from "./snap";

export const RESIZE_HANDLES = [
  { id: "nw", cursor: "nwse-resize", x: 0, y: 0 },
  { id: "n", cursor: "ns-resize", x: 0.5, y: 0 },
  { id: "ne", cursor: "nesw-resize", x: 1, y: 0 },
  { id: "e", cursor: "ew-resize", x: 1, y: 0.5 },
  { id: "se", cursor: "nwse-resize", x: 1, y: 1 },
  { id: "s", cursor: "ns-resize", x: 0.5, y: 1 },
  { id: "sw", cursor: "nesw-resize", x: 0, y: 1 },
  { id: "w", cursor: "ew-resize", x: 0, y: 0.5 },
];

export function resizeByHandle(orig, handle, dx, dy) {
  let { x, y, width, height } = orig;
  const lock = orig.type === "image" && orig.aspectLocked !== false;
  const ratio = lock ? orig.width / Math.max(orig.height, 1) : null;

  if (handle.includes("e")) width = orig.width + dx;
  if (handle.includes("s")) height = orig.height + dy;
  if (handle.includes("w")) {
    width = orig.width - dx;
    x = orig.x + dx;
  }
  if (handle.includes("n")) {
    height = orig.height - dy;
    y = orig.y + dy;
  }

  if (ratio) {
    if (handle === "e" || handle === "w") height = width / ratio;
    else if (handle === "n" || handle === "s") width = height * ratio;
    else height = width / ratio;
    if (handle.includes("n")) y = orig.y + orig.height - height;
    if (handle.includes("w")) x = orig.x + orig.width - width;
  }

  width = Math.max(24, width);
  height = Math.max(24, height);
  return { ...orig, x, y, width, height };
}

export function applyPointerDelta(orig, mode, handle, dx, dy, doc) {
  if (mode === "move") {
    return snapElement(
      { ...orig, x: orig.x + dx, y: orig.y + dy },
      doc,
    );
  }
  return { el: resizeByHandle(orig, handle, dx, dy), guides: [] };
}
