"use client";

import { X } from "lucide-react";
import { RESIZE_HANDLES } from "../pointerMath";

export function ResizeHandles({ scale, onResizeStart, onDelete }) {
  const size = 12 / scale;
  const remove = 22 / scale;
  return (
    <>
      {RESIZE_HANDLES.map((handle) => (
        <span
          key={handle.id}
          role="presentation"
          onPointerDown={(event) => onResizeStart(event, handle.id)}
          className="absolute z-10 border border-white bg-primary-600 shadow-xs"
          style={{
            width: size,
            height: size,
            left: `calc(${handle.x * 100}% - ${size / 2}px)`,
            top: `calc(${handle.y * 100}% - ${size / 2}px)`,
            cursor: handle.cursor,
          }}
        />
      ))}
      <button
        type="button"
        aria-label="Remove"
        className="absolute z-20 flex items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm"
        style={{
          width: remove,
          height: remove,
          top: -remove * 0.25,
          right: -remove * 0.25,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onDelete?.();
        }}
      >
        <X
          aria-hidden="true"
          strokeWidth={2.5}
          style={{ width: remove * 0.55, height: remove * 0.55 }}
        />
      </button>
    </>
  );
}
