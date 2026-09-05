"use client";

import { Typography } from "@/components/ui";

export function UploadsTab({ onUpload }) {
  return (
    <div>
      <Typography variant="caption">
        Upload a logo or student photo. It is stored on this device only.
      </Typography>
      <label className="mt-3 flex h-11 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-neutral-300 bg-neutral-0 text-small font-semibold text-neutral-800 hover:bg-neutral-50">
        Choose image
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
