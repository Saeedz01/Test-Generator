"use client";

import { buttonVariants } from "@/components/ui";
import { cn } from "@/utils";
import { TextProps } from "./TextProps";
import { ImageProps } from "./ImageProps";
import { ShapeProps } from "./ShapeProps";
import { CanvasProps } from "./CanvasProps";
import { NumberField } from "./PropFields";

const ALIGN = ["left", "center", "right", "top", "middle", "bottom"];

export function RightPanel({
  doc,
  selected,
  onChangeElement,
  onAlign,
  onDuplicate,
  onDelete,
  onZ,
  onPalette,
  onBackground,
  onReplaceImage,
  onRemoveImage,
}) {
  return (
    <aside className="flex h-full w-64 max-w-64 min-w-64 shrink-0 flex-col overflow-hidden border-l border-neutral-200 bg-neutral-0">
      <p className="border-b border-neutral-200 px-3 py-2.5 text-caption font-semibold text-neutral-700">
        {selected ? "Element" : "Banner"}
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!selected ? (
          <CanvasProps
            doc={doc}
            onPalette={onPalette}
            onBackground={onBackground}
          />
        ) : (
          <div className="space-y-4">
            {selected.type === "text" ? (
              <TextProps
                el={selected}
                paletteId={doc.paletteId}
                onChange={onChangeElement}
              />
            ) : null}
            {selected.type === "image" ? (
              <ImageProps
                el={selected}
                onChange={onChangeElement}
                onReplace={onReplaceImage}
                onRemoveSrc={onRemoveImage}
              />
            ) : null}
            {selected.type === "shape" ? (
              <ShapeProps
                el={selected}
                paletteId={doc.paletteId}
                onChange={onChangeElement}
              />
            ) : null}
            <NumberField
              label="X"
              value={Math.round(selected.x)}
              onChange={(x) => onChangeElement({ x })}
            />
            <NumberField
              label="Y"
              value={Math.round(selected.y)}
              onChange={(y) => onChangeElement({ y })}
            />
            <NumberField
              label="Width"
              value={Math.round(selected.width)}
              onChange={(width) => onChangeElement({ width })}
            />
            <NumberField
              label="Height"
              value={Math.round(selected.height)}
              onChange={(height) => onChangeElement({ height })}
            />
            <div className="flex flex-wrap gap-1">
              {ALIGN.map((edge) => (
                <button
                  key={edge}
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "capitalize",
                  )}
                  onClick={() => onAlign(edge)}
                >
                  {edge}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={() => onZ(1)}
              >
                Bring forward
              </button>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={() => onZ(-1)}
              >
                Send backward
              </button>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={onDuplicate}
              >
                Duplicate
              </button>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "destructive", size: "sm" }),
                )}
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
