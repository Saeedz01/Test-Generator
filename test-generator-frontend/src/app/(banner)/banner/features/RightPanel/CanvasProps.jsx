"use client";

import { BANNER_PALETTES } from "../bannerPalettes";
import { backgroundFill } from "../bannerColors";
import { Field } from "./PropFields";
import { ColorField } from "./ColorField";

export function CanvasProps({ doc, onPalette, onBackground }) {
  return (
    <div className="space-y-3">
      <Field label="Palette">
        <div className="mt-1.5 grid grid-cols-1 gap-1.5">
          {BANNER_PALETTES.map((palette) => (
            <button
              key={palette.id}
              type="button"
              className={`flex items-center gap-2 rounded-[var(--radius-sm)] border px-2 py-1.5 text-left text-caption ${
                doc.paletteId === palette.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 hover:bg-neutral-50"
              }`}
              onClick={() => onPalette(palette.id)}
            >
              <span
                className="size-4 shrink-0 rounded-full"
                style={{ background: palette.roles.accent }}
              />
              {palette.label}
            </button>
          ))}
        </div>
      </Field>
      <ColorField
        label="Background"
        fill
        value={backgroundFill(doc)}
        paletteId={doc.paletteId}
        role={doc.background?.fill ? null : doc.background?.fillRole}
        onPick={onBackground}
      />
    </div>
  );
}
