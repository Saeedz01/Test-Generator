"use client";

import { Circle, ImageIcon, Square, Type } from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/utils";

const ITEMS = [
  { id: "heading", label: "Heading", Icon: Type },
  { id: "text", label: "Body text", Icon: Type },
  { id: "image", label: "Image", Icon: ImageIcon },
  { id: "rect", label: "Rectangle", Icon: Square },
  { id: "ellipse", label: "Ellipse", Icon: Circle },
];

export function ElementsTab({ onAdd }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-16 flex-col",
          )}
          onClick={() => onAdd(item.id)}
        >
          <item.Icon className="size-4" aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </div>
  );
}
