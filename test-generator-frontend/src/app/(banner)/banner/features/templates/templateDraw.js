import { box, push } from "./templateHelpers";

export function rect(doc, f, fill, rx, ry, rw, rh, extra = {}) {
  push(doc, {
    type: "shape",
    shape: "rect",
    fill,
    ...extra,
    ...box(f, rx, ry, rw, rh),
  });
}

export function txt(doc, f, content, rx, ry, rw, rh, extra = {}) {
  push(doc, {
    type: "text",
    content,
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 700,
    align: "center",
    valign: "middle",
    color: "#ffffff",
    ...extra,
    ...box(f, rx, ry, rw, rh),
  });
}

export function photo(doc, f, src, rx, ry, rw, rh, extra = {}) {
  push(doc, {
    type: "image",
    src,
    objectFit: "cover",
    placeholderLabel: "",
    ...extra,
    ...box(f, rx, ry, rw, rh),
  });
}
