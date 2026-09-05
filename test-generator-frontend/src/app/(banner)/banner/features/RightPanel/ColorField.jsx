"use client";

import { useEffect, useState } from "react";
import { getBannerPalette } from "../bannerPalettes";

const TEXT_ROLES = [
  { id: "text", label: "Text" },
  { id: "muted", label: "Muted" },
  { id: "accent", label: "Accent" },
  { id: "accentText", label: "On accent" },
];

const PRESETS = ["#ffffff", "#000000", "#1a1a18", "#c4a24a", "#7aab3c"];

function toHex(value) {
  const hex = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
  }
  return "#ffffff";
}

export function ColorField({ label, value, paletteId, role, onPick }) {
  const palette = getBannerPalette(paletteId);
  const hex = toHex(value);
  const [draft, setDraft] = useState(hex);
  useEffect(() => {
    setDraft(hex);
  }, [hex]);

  return (
    <div>
      <span className="text-caption font-medium text-neutral-600">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {TEXT_ROLES.map((item) => {
          const color = palette.roles[item.id];
          const active = role === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              className={`size-7 rounded-full border ${
                active
                  ? "border-primary-600 ring-2 ring-primary-500/40"
                  : "border-neutral-300"
              }`}
              style={{ background: color }}
              onClick={() => onPick({ color: null, colorRole: item.id })}
            />
          );
        })}
        {PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            aria-label={`Color ${color}`}
            className={`size-7 rounded-full border ${
              hex === color && !role
                ? "border-primary-600 ring-2 ring-primary-500/40"
                : "border-neutral-300"
            }`}
            style={{ background: color }}
            onClick={() => onPick({ color, colorRole: null })}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0"
          value={hex}
          onChange={(event) =>
            onPick({ color: event.target.value, colorRole: null })
          }
        />
        <input
          type="text"
          spellCheck={false}
          aria-label={`${label} hex`}
          className="h-9 min-w-0 flex-1 rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 font-mono text-caption text-neutral-900"
          value={draft}
          onChange={(event) => {
            const next = event.target.value.trim();
            setDraft(next);
            if (/^#[0-9a-fA-F]{6}$/.test(next)) {
              onPick({ color: next.toLowerCase(), colorRole: null });
            }
          }}
          onBlur={() => setDraft(hex)}
        />
      </div>
    </div>
  );
}
