"use client";

import { BANNER_FONTS } from "../bannerFonts";
import { elementColor, textBoxFill } from "../bannerColors";
import { ColorField } from "./ColorField";
import { Field, NumberField } from "./PropFields";

export function TextProps({ el, paletteId, fillEl, onChange, onChangeFill }) {
  const fillSource = fillEl || el;
  const boxFill = textBoxFill(fillSource, paletteId);
  const setFill = onChangeFill || onChange;

  return (
    <div className="space-y-3">
      <Field label="Text">
        <textarea
          className="mt-1.5 min-h-20 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 py-1.5 text-small text-neutral-900"
          value={el.content || ""}
          onChange={(event) => onChange({ content: event.target.value })}
        />
      </Field>
      <ColorField
        label="Text color"
        value={elementColor(el, paletteId)}
        paletteId={paletteId}
        role={el.color ? null : el.colorRole}
        onPick={onChange}
      />
      <ColorField
        label="Background"
        fill
        value={boxFill || "#ffffff"}
        paletteId={paletteId}
        role={fillSource.fill ? null : fillSource.fillRole}
        onPick={setFill}
      />
      <button
        type="button"
        className="text-caption font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
        onClick={() => setFill({ fill: "transparent", fillRole: null })}
      >
        No background
      </button>
      <NumberField
        label="Background radius"
        value={fillSource.radius || 0}
        min={0}
        max={400}
        onChange={(radius) => setFill({ radius })}
      />
      <Field label="Font">
        <select
          className="mt-1.5 h-9 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
          value={el.fontId || "jakarta"}
          onChange={(event) => onChange({ fontId: event.target.value })}
        >
          {BANNER_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </Field>
      <NumberField
        label="Size"
        value={el.fontSize || 24}
        onChange={(fontSize) => onChange({ fontSize })}
      />
      <NumberField
        label="Weight"
        value={el.fontWeight || 500}
        min={300}
        max={800}
        step={100}
        onChange={(fontWeight) => onChange({ fontWeight })}
      />
      <Field label="Align">
        <select
          className="mt-1.5 h-9 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
          value={el.align || "left"}
          onChange={(event) => onChange({ align: event.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </Field>
      <Field label="Vertical align">
        <select
          className="mt-1.5 h-9 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
          value={el.valign || "middle"}
          onChange={(event) => onChange({ valign: event.target.value })}
        >
          <option value="top">Top</option>
          <option value="middle">Middle</option>
          <option value="bottom">Bottom</option>
        </select>
      </Field>
      <NumberField
        label="Line height"
        value={el.lineHeight || 1.25}
        min={0.8}
        max={2.4}
        step={0.05}
        onChange={(lineHeight) => onChange({ lineHeight })}
      />
      <NumberField
        label="Letter spacing"
        value={el.letterSpacing || 0}
        min={-0.1}
        max={0.4}
        step={0.01}
        onChange={(letterSpacing) => onChange({ letterSpacing })}
      />
    </div>
  );
}
