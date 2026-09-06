"use client";

import { ImageIcon } from "lucide-react";
import { getBannerFont } from "../bannerFonts";
import { elementColor, elementFill, elementStroke, textBoxFill } from "../bannerColors";
import { ResizeHandles } from "./ResizeHandles";

export function BannerElement({
  el,
  paletteId,
  selected,
  preview,
  scale,
  onSelect,
  onDragStart,
  onResizeStart,
  onDelete,
}) {
  const font = getBannerFont(el.fontId);
  const style = {
    position: "absolute",
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    boxSizing: "border-box",
  };

  return (
    <div
      data-banner-el={el.id}
      className={selected && !preview ? "ring-2 ring-primary-500" : undefined}
      style={style}
      onPointerDown={(event) => {
        if (el.locked) return;
        onSelect(el.id);
        onDragStart(event);
      }}
    >
      {el.type === "text" ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent:
              el.valign === "top"
                ? "flex-start"
                : el.valign === "bottom"
                  ? "flex-end"
                  : "center",
            color: elementColor(el, paletteId),
            background: textBoxFill(el, paletteId) || undefined,
            borderRadius: el.radius || 0,
            fontFamily: font.value,
            fontSize: el.fontSize || 24,
            fontWeight: el.fontWeight || 500,
            textAlign: el.align || "left",
            lineHeight: el.lineHeight || 1.25,
            letterSpacing: el.letterSpacing ? `${el.letterSpacing}em` : undefined,
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            userSelect: "none",
            direction: el.dir || "ltr",
            writingMode: el.writingMode,
          }}
        >
          <span
            style={{
              width: "100%",
              WebkitTextStroke: el.strokeWidth
                ? `${el.strokeWidth}px ${elementStroke(el, paletteId)}`
                : undefined,
              paintOrder: el.strokeWidth ? "stroke fill" : undefined,
              textShadow: el.shadow,
            }}
          >
            {el.content}
          </span>
        </div>
      ) : null}

      {el.type === "shape" ? (
        <div
          style={{
            width: "100%",
            height: el.shape === "line" ? 4 : "100%",
            background: elementFill(el, paletteId),
            borderRadius: el.shape === "ellipse" ? "50%" : el.radius || 0,
            border: el.strokeWidth
              ? `${el.strokeWidth}px solid ${elementStroke(el, paletteId)}`
              : undefined,
            boxSizing: "border-box",
          }}
        />
      ) : null}

      {el.type === "image" ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: el.clip === "circle" ? "50%" : el.radius || 0,
            border: el.strokeWidth
              ? `${el.strokeWidth}px solid ${elementStroke(el, paletteId)}`
              : undefined,
            boxSizing: "border-box",
          }}
        >
          {el.src ? (
            // User-uploaded / data-URL photos cannot use next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={el.src}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: el.objectFit || "cover",
                objectPosition: el.objectPosition || "center",
                pointerEvents: "none",
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-neutral-400 bg-neutral-100/40 text-neutral-500">
              <ImageIcon className="size-8" aria-hidden="true" />
              {el.placeholderLabel ? (
                <span className="mt-1 text-[20px] font-medium">
                  {el.placeholderLabel}
                </span>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {selected && !preview ? (
        <ResizeHandles
          scale={scale}
          onResizeStart={onResizeStart}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  );
}
