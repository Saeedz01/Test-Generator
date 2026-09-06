"use client";

import { useState } from "react";
import { Typography } from "@/components/ui";
import { TemplatesTab } from "./TemplatesTab";
import { ElementsTab } from "./ElementsTab";
import { UploadsTab } from "./UploadsTab";

const TABS = [
  { id: "elements", label: "Elements" },
  { id: "uploads", label: "Uploads" },
  { id: "templates", label: "Templates" },
];

export function LeftPanel({ onAdd, onUpload, onApplyTemplate }) {
  const [tab, setTab] = useState("elements");

  return (
    <aside className="flex h-full w-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-neutral-0 lg:w-64 lg:max-w-64 lg:min-w-64">
      <div className="flex border-b border-neutral-200">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex-1 px-2 py-2.5 text-caption font-medium ${
              tab === item.id
                ? "border-b-2 border-primary-600 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "elements" ? <ElementsTab onAdd={onAdd} /> : null}
        {tab === "uploads" ? <UploadsTab onUpload={onUpload} /> : null}
        {tab === "templates" ? (
          <>
            <Typography variant="caption" className="mb-2">
              Replacing the canvas will discard unsaved layout changes.
            </Typography>
            <TemplatesTab onApply={onApplyTemplate} />
          </>
        ) : null}
      </div>
    </aside>
  );
}
