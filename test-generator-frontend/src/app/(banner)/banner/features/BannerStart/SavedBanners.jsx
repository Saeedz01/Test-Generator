"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Card, Typography, buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { getBannerFormat } from "../bannerFormats";
import {
  deleteBannerDraft,
  loadBannerDrafts,
  subscribeBannerDrafts,
} from "../bannerStorage";

function draftHref(id) {
  return `${ROUTES.BANNER_STUDIO}?draft=${encodeURIComponent(id)}`;
}

function label(draft) {
  const format = getBannerFormat(draft.formatId);
  const when = draft.updatedAt
    ? new Date(draft.updatedAt).toLocaleString()
    : "";
  return [draft.name || "Saved banner", format.label, when]
    .filter(Boolean)
    .join(" · ");
}

export function SavedBanners() {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const refresh = () => setDrafts(loadBannerDrafts());
    refresh();
    return subscribeBannerDrafts(refresh);
  }, []);

  if (!drafts.length) return null;

  return (
    <section className="mt-14">
      <div className="mb-5 flex items-center gap-2">
        <FolderOpen className="size-5 text-primary-700" aria-hidden="true" />
        <Typography variant="h3">Saved on this device</Typography>
      </div>
      <Typography variant="bodySmall" className="mb-4 max-w-2xl">
        These banners stay in this browser only — colors, type, layout, and
        photos. Open one to keep editing, or apply last settings from the
        studio.
      </Typography>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {drafts.map((draft) => (
          <li key={draft.id}>
            <Card className="flex h-full flex-col">
              <Typography variant="h5" as="h3">
                {draft.name || "Saved banner"}
              </Typography>
              <Typography variant="bodySmall" className="mt-2 flex-1">
                {label(draft)}
              </Typography>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={draftHref(draft.id)}
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
                >
                  Open
                </Link>
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  onClick={() => {
                    if (!window.confirm("Remove this saved banner from this device?")) {
                      return;
                    }
                    deleteBannerDraft(draft.id);
                  }}
                >
                  Remove
                </button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
