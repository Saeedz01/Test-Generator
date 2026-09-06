"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, LayoutTemplate, Square } from "lucide-react";
import { Card, Container, Typography, buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { SavedBanners } from "./SavedBanners";
import { BANNER_FORMATS } from "../bannerFormats";
import { BANNER_TEMPLATES } from "../bannerTemplates";
import { TemplatePreview } from "../TemplatePreview";
import { loadBannerDrafts, subscribeBannerDrafts } from "../bannerStorage";

function studioHref(template, formatId) {
  const params = new URLSearchParams({
    template,
    format: formatId,
  });
  return `${ROUTES.BANNER_STUDIO}?${params.toString()}`;
}

export function BannerStart() {
  const [formatId, setFormatId] = useState("ig-post");
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const refresh = () => setDrafts(loadBannerDrafts());
    refresh();
    return subscribeBannerDrafts(refresh);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <Container className="py-10 sm:py-14">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Typography variant="h1">Banner Designer</Typography>
            <Typography variant="body" className="mt-3 max-w-2xl text-neutral-600">
              Create promotional and achievement banners for your academy. Start
              from a Testora template or a blank canvas — every element stays
              editable.
            </Typography>
          </div>
          <a
            href="#saved-banners"
            className={cn(
              buttonVariants({ variant: "outline", size: "md" }),
              "shrink-0",
            )}
          >
            <FolderOpen className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Saved banners</span>
            <span className="sm:hidden">Saved</span>
            {drafts.length ? (
              <span className="rounded-full bg-primary-50 px-1.5 text-caption font-semibold text-primary-800">
                {drafts.length}
              </span>
            ) : null}
          </a>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2">
              <LayoutTemplate
                className="size-5 text-primary-700"
                aria-hidden="true"
              />
              <Typography variant="h3">Start from template</Typography>
            </div>
            <label className="block w-full max-w-xs sm:min-w-[16rem]">
              <Typography variant="label" as="span">
                Preview size
              </Typography>
              <select
                className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small text-neutral-900 outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
                value={formatId}
                onChange={(event) => setFormatId(event.target.value)}
              >
                {BANNER_FORMATS.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.label} ({format.width}×{format.height})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {BANNER_TEMPLATES.map((template) => (
              <li key={template.id}>
                <Card
                  hoverable
                  padded={false}
                  className="flex h-full flex-col overflow-hidden p-0"
                >
                  <Link
                    href={studioHref(template.id, formatId)}
                    className="flex h-full flex-col"
                  >
                    <TemplatePreview
                      template={template}
                      formatId={formatId}
                      className="aspect-square w-full border-b border-neutral-100"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <Typography variant="h5" as="h3">
                        {template.title}
                      </Typography>
                      <Typography variant="bodySmall" className="mt-2 flex-1">
                        {template.description}
                      </Typography>
                      <span
                        className={cn(
                          buttonVariants({ variant: "primary", size: "sm" }),
                          "mt-5 w-fit",
                        )}
                      >
                        Use template
                      </span>
                    </div>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <SavedBanners drafts={drafts} />

        <section className="mt-14">
          <div className="mb-5 flex items-center gap-2">
            <Square className="size-5 text-primary-700" aria-hidden="true" />
            <Typography variant="h3">Start from blank canvas</Typography>
          </div>
          <Card className="max-w-xl">
            <Typography variant="bodySmall">
              Choose a size, then build the banner yourself with the same
              tools as the templates.
            </Typography>
            <label className="mt-4 block">
              <Typography variant="label" as="span">
                Banner size
              </Typography>
              <select
                className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small text-neutral-900 outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
                value={formatId}
                onChange={(event) => setFormatId(event.target.value)}
              >
                {BANNER_FORMATS.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.label} ({format.width}×{format.height})
                  </option>
                ))}
              </select>
            </label>
            <Link
              href={studioHref("blank", formatId)}
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "mt-5 inline-flex w-full sm:w-auto",
              )}
            >
              Open blank canvas
            </Link>
          </Card>
        </section>
      </Container>
    </div>
  );
}
