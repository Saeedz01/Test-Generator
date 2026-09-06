"use client";

import { Field, NumberField } from "./PropFields";
import { ColorField } from "./ColorField";
import { elementFill } from "../bannerColors";

export function ShapeProps({ el, paletteId, onChange }) {
  const fill = elementFill(el, paletteId);
  return (
    <div className="space-y-3">
      <Field label="Shape">
        <select
          className="mt-1.5 h-9 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
          value={el.shape || "rect"}
          onChange={(event) => onChange({ shape: event.target.value })}
        >
          <option value="rect">Rectangle</option>
          <option value="ellipse">Ellipse</option>
          <option value="line">Line</option>
        </select>
      </Field>
      <ColorField
        label="Fill"
        fill
        value={fill === "transparent" ? "#ffffff" : fill}
        paletteId={paletteId}
        role={el.fill ? null : el.fillRole}
        onPick={onChange}
      />
      {el.shape !== "ellipse" && el.shape !== "line" ? (
        <NumberField
          label="Corner radius"
          value={el.radius || 0}
          min={0}
          max={400}
          onChange={(radius) => onChange({ radius })}
        />
      ) : null}
    </div>
  );
}
