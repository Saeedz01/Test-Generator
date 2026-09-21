"use client";

import { BANNER_PALETTES } from "../bannerPalettes";
import { backgroundFill } from "../bannerColors";
import { Field } from "./PropFields";
import { ColorField } from "./ColorField";

export function CanvasProps({ doc, onPalette, onBackground }) {
  return (
    <div className="space-y-3">
      <ColorField
        label="Background"
        fill
        value={backgroundFill(doc)}
        paletteId={doc.paletteId}
        role={doc.background?.fill ? null : doc.background?.fillRole}
        onPick={onBackground}
      />

      <Field label="Palette">
        <div className="mt-1.5 grid grid-cols-1 gap-1.5">
          {BANNER_PALETTES.map((palette) => {
            const selected = doc.paletteId === palette.id;
            const usesPaletteCanvas =
              !doc.background?.fill &&
              (doc.background?.fillRole === "canvas" ||
                !doc.background?.fillRole);
            const active = selected && usesPaletteCanvas;
            return (
              <button
                key={palette.id}
                type="button"
                className={`flex items-center gap-2 rounded-[var(--radius-sm)] border px-2 py-1.5 text-left text-caption ${
                  active
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200 hover:bg-neutral-50"
                }`}
                onClick={() => onPalette(palette.id)}
              >
                <span
                  className="relative size-4 shrink-0 rounded-full border border-neutral-300"
                  style={{ background: palette.roles.canvas }}
                  title={`Canvas ${palette.roles.canvas}`}
                >
                  <span
                    className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-white"
                    style={{ background: palette.roles.accent }}
                    aria-hidden="true"
                  />
                </span>
                {palette.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-caption text-neutral-500">
          Swatch shows the canvas background for that palette.
        </p>
      </Field>
    </div>
  );
}
