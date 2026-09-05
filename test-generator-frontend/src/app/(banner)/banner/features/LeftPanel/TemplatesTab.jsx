"use client";

import { BANNER_TEMPLATES } from "../bannerTemplates";
import { Typography, buttonVariants } from "@/components/ui";
import { cn } from "@/utils";

export function TemplatesTab({ onApply }) {
  return (
    <ul className="space-y-2">
      {BANNER_TEMPLATES.map((template) => (
        <li key={template.id}>
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-auto w-full flex-col items-start py-2 text-left",
            )}
            onClick={() => onApply(template.id)}
          >
            <Typography variant="label" as="span" className="text-neutral-900">
              {template.title}
            </Typography>
            <Typography variant="caption" as="span">
              {template.description}
            </Typography>
          </button>
        </li>
      ))}
    </ul>
  );
}
