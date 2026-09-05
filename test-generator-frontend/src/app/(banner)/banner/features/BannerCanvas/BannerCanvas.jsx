"use client";

import { useEffect, useRef, useState } from "react";
import { backgroundFill } from "../bannerColors";
import { applyPointerDelta } from "../pointerMath";
import { sortElements } from "../bannerModel";
import { BannerElement } from "./BannerElement";

export function BannerCanvas({
  doc,
  selectedId,
  preview = false,
  stageRef,
  onSelect,
  onPreviewElement,
  onCommit,
  onDelete,
}) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(null);
  const [guides, setGuides] = useState([]);
  const dragRef = useRef(null);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    let fitted = null;
    const measure = () => {
      if (node.clientWidth < 80 || node.clientHeight < 80) return;
      const pad = 32;
      const next = Math.min(
        (node.clientWidth - pad) / doc.width,
        (node.clientHeight - pad) / doc.height,
        1,
      );
      const clamped = Math.max(0.12, next);
      if (preview) {
        setScale(clamped);
        return;
      }
      // Keep the first fitted size. Opening the editor panel (or the
      // mobile keyboard) shrinks this wrap — do not zoom the banner out.
      if (fitted == null || clamped > fitted + 0.001) {
        fitted = clamped;
        setScale(clamped);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [doc.width, doc.height, preview]);

  useEffect(() => {
    if (!scale) return undefined;
    const onMove = (event) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = (event.clientX - drag.startX) / scale;
      const dy = (event.clientY - drag.startY) / scale;
      const { el, guides: nextGuides } = applyPointerDelta(
        drag.orig,
        drag.mode,
        drag.handle,
        dx,
        dy,
        doc,
      );
      setGuides(nextGuides);
      onPreviewElement(el);
    };
    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        setGuides([]);
        onCommit();
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [doc, scale, onPreviewElement, onCommit]);

  const startDrag = (event, mode, handle, elementId) => {
    event.stopPropagation();
    const orig = doc.elements.find(
      (item) => item.id === (elementId || selectedId),
    );
    if (!orig || orig.locked) return;
    dragRef.current = {
      mode,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      orig,
    };
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-auto bg-neutral-100 p-4"
      onPointerDown={() => onSelect(null)}
    >
      {scale ? (
      <div
        style={{
          width: doc.width * scale,
          height: doc.height * scale,
          position: "relative",
        }}
      >
        <div
          ref={stageRef}
          data-banner-stage="true"
          style={{
            width: doc.width,
            height: doc.height,
            background: backgroundFill(doc),
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "relative",
            overflow: "hidden",
            touchAction: "none",
          }}
        >
          {sortElements(doc.elements).map((el) => (
            <BannerElement
              key={el.id}
              el={el}
              paletteId={doc.paletteId}
              selected={el.id === selectedId}
              preview={preview}
              scale={scale}
              onSelect={onSelect}
              onDragStart={(event) => startDrag(event, "move", undefined, el.id)}
              onResizeStart={(event, handle) =>
                startDrag(event, "resize", handle, el.id)
              }
              onDelete={() => onDelete?.(el.id)}
            />
          ))}
          {!preview
            ? guides.map((guide) => (
                <div
                  key={`${guide.axis}-${guide.position}`}
                  className="pointer-events-none absolute bg-primary-400"
                  style={
                    guide.axis === "v"
                      ? { left: guide.position, top: 0, width: 1, height: "100%" }
                      : { top: guide.position, left: 0, height: 1, width: "100%" }
                  }
                />
              ))
            : null}
        </div>
      </div>
      ) : null}
    </div>
  );
}

