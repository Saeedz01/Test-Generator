"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { getBannerPalette } from "../bannerPalettes";

const TEXT_ROLES = [
  { id: "text", label: "Text" },
  { id: "muted", label: "Muted" },
  { id: "accent", label: "Accent" },
  { id: "accentText", label: "On accent" },
];

const FILL_ROLES = [
  { id: "canvas", label: "Canvas" },
  { id: "surface", label: "Surface" },
  { id: "accent", label: "Accent" },
];

const PRESETS = [
  "#ffffff",
  "#000000",
  "#6b1d2a",
  "#0d4a2c",
  "#0a2e8c",
  "#e10600",
  "#c5a028",
  "#ffe000",
];

function toHex(value) {
  const hex = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
  }
  return "#ffffff";
}

function colorPatch(mode, hex, role) {
  if (mode === "fill") {
    return hex ? { fill: hex, fillRole: null } : { fill: null, fillRole: role };
  }
  if (mode === "stroke") {
    return hex
      ? { stroke: hex, strokeRole: null }
      : { stroke: null, strokeRole: role };
  }
  return hex ? { color: hex, colorRole: null } : { color: null, colorRole: role };
}

export function ColorField({
  label,
  value,
  paletteId,
  role,
  onPick,
  fill = false,
  mode,
}) {
  const kind = mode || (fill ? "fill" : "text");
  const palette = getBannerPalette(paletteId);
  const hex = toHex(value);
  const [draft, setDraft] = useState(hex);
  useEffect(() => {
    setDraft(hex);
  }, [hex]);
  const chips = kind === "text" ? TEXT_ROLES : FILL_ROLES;
  const [copied, setCopied] = useState(false);

  const copyHex = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <span className="text-caption font-medium text-neutral-600">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {chips.map((item) => {
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
              onClick={() => onPick(colorPatch(kind, null, item.id))}
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
            onClick={() => onPick(colorPatch(kind, color))}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0"
          value={hex}
          onChange={(event) => onPick(colorPatch(kind, event.target.value))}
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
              onPick(colorPatch(kind, next.toLowerCase()));
            }
          }}
          onBlur={() => setDraft(hex)}
          onFocus={(event) => event.target.select()}
        />
        <button
          type="button"
          title={copied ? "Copied" : "Copy color code"}
          aria-label={copied ? "Copied" : `Copy ${hex}`}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-input)] border border-neutral-300 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          onClick={copyHex}
        >
          {copied ? (
            <Check className="size-4 text-primary-700" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
