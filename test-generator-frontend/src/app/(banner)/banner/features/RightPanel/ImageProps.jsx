"use client";

import { Field, NumberField } from "./PropFields";
import { ColorField } from "./ColorField";
import { elementStroke } from "../bannerColors";

export function ImageProps({ el, paletteId, onChange, onReplace, onRemoveSrc }) {
  const stroke = elementStroke(el, paletteId);

  return (
    <div className="space-y-3">
      <Field label="Fit">
        <select
          className="mt-1.5 h-9 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
          value={el.objectFit || "cover"}
          onChange={(event) => onChange({ objectFit: event.target.value })}
        >
          <option value="cover">Cover (crop)</option>
          <option value="contain">Contain</option>
        </select>
      </Field>
      <Field label="Position">
        <select
          className="mt-1.5 h-9 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
          value={el.objectPosition || "center"}
          onChange={(event) => onChange({ objectPosition: event.target.value })}
        >
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </Field>
      <label className="flex items-center gap-2 text-small text-neutral-700">
        <input
          type="checkbox"
          checked={el.aspectLocked !== false}
          onChange={(event) => onChange({ aspectLocked: event.target.checked })}
        />
        Lock aspect ratio
      </label>
      <label className="flex items-center gap-2 text-small text-neutral-700">
        <input
          type="checkbox"
          checked={el.clip === "circle"}
          onChange={(event) =>
            onChange({ clip: event.target.checked ? "circle" : null })
          }
        />
        Round photo
      </label>
      <ColorField
        label="Circle color"
        mode="stroke"
        value={stroke}
        paletteId={paletteId}
        role={el.stroke ? null : el.strokeRole}
        onPick={(patch) =>
          onChange({
            ...patch,
            strokeWidth: el.strokeWidth || 10,
          })
        }
      />
      <NumberField
        label="Circle width"
        value={el.strokeWidth || 0}
        min={0}
        max={40}
        onChange={(strokeWidth) => onChange({ strokeWidth })}
      />
      <label className="flex h-9 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-neutral-300 text-caption font-semibold hover:bg-neutral-50">
        {el.src ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onReplace(file);
            event.target.value = "";
          }}
        />
      </label>
      {el.src ? (
        <button
          type="button"
          className="w-full text-caption font-semibold text-error-700"
          onClick={onRemoveSrc}
        >
          Remove image
        </button>
      ) : null}
    </div>
  );
}
