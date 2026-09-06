"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils";
import { backgroundFill } from "./bannerColors";
import { sortElements } from "./bannerModel";
import { BannerElement } from "./BannerCanvas/BannerElement";

export function TemplatePreview({ template, formatId, className }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0);
  const doc = useMemo(
    () => template.create(formatId, template.defaultPalette),
    [template, formatId],
  );

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const measure = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (width < 8 || height < 8) return;
      setScale(Math.min(width / doc.width, height / doc.height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [doc.width, doc.height]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative flex items-center justify-center overflow-hidden bg-neutral-200",
        className,
      )}
    >
      {scale ? (
        <div
          style={{
            width: doc.width * scale,
            height: doc.height * scale,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: doc.width,
              height: doc.height,
              background: backgroundFill(doc),
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {sortElements(doc.elements).map((el) => (
              <BannerElement
                key={el.id}
                el={el}
                paletteId={doc.paletteId}
                selected={false}
                preview
                scale={scale}
                onSelect={() => {}}
                onDragStart={() => {}}
                onResizeStart={() => {}}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
