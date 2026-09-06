"use client";

import { BANNER_TEMPLATES } from "../bannerTemplates";
import { TemplatePreview } from "../TemplatePreview";
import { Typography, buttonVariants } from "@/components/ui";
import { cn } from "@/utils";

export function TemplatesTab({ onApply, formatId = "ig-post" }) {
  return (
    <ul className="space-y-2">
      {BANNER_TEMPLATES.map((template) => (
        <li key={template.id}>
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-auto w-full flex-col items-stretch overflow-hidden p-0 text-left",
            )}
            onClick={() => onApply(template.id)}
          >
            <TemplatePreview
              template={template}
              formatId={formatId}
              className="aspect-square w-full"
            />
            <span className="flex flex-col items-start gap-0.5 px-2.5 py-2">
              <Typography variant="label" as="span" className="text-neutral-900">
                {template.title}
              </Typography>
              <Typography variant="caption" as="span">
                {template.description}
              </Typography>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
