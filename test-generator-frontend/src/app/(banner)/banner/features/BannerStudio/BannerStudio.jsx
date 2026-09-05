"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createElementId, applyFormat, applyPalette } from "../bannerModel";
import { createBannerFromQuery, getBannerTemplate } from "../bannerTemplates";
import {
  getBannerDraft,
  loadLastStyle,
  saveBannerDraft,
  saveLastStyle,
  subscribeBannerDrafts,
} from "../bannerStorage";
import { applyStyle, extractStyle, hasLastStyle } from "../bannerStyle";
import { exportBannerPng, readImageFile } from "../bannerExport";
import { createImageElement, createPresetElement } from "../bannerPresets";
import { alignElement } from "../snap";
import {
  addElement,
  removeElement,
  replaceElement,
  useBannerDocument,
} from "../useBannerDocument";
import { BannerToolbar } from "../BannerToolbar";
import { BannerCanvas } from "../BannerCanvas";
import { LeftPanel } from "../LeftPanel";
import { RightPanel } from "../RightPanel";
import { PreviewModal } from "../PreviewModal";

export function BannerStudio() {
  const searchParams = useSearchParams();
  const initial = useMemo(
    () =>
      createBannerFromQuery({
        templateId: searchParams.get("template") || "blank",
        formatId: searchParams.get("format") || "ig-post",
      }),
    [searchParams],
  );
  const { doc, commit, preview, load, undo, redo, canUndo, canRedo } =
    useBannerDocument(initial);
  const [selectedId, setSelectedId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [canApplyLastStyle, setCanApplyLastStyle] = useState(false);
  const stageRef = useRef(null);
  const selected = doc.elements.find((el) => el.id === selectedId) ?? null;

  const onSelect = useCallback((id) => {
    setSelectedId(id);
    if (id) setRightOpen(true);
    else setRightOpen(false);
  }, []);

  const commitEl = useCallback(
    (nextEl) => commit(replaceElement(doc, nextEl)),
    [commit, doc],
  );

  const onPreviewElement = useCallback(
    (nextEl) => preview(replaceElement(doc, nextEl)),
    [doc, preview],
  );

  useEffect(() => {
    const draftId = searchParams.get("draft");
    if (!draftId) return undefined;
    const draft = getBannerDraft(draftId);
    if (draft) load(draft);
    return undefined;
  }, [load, searchParams]);

  useEffect(() => {
    const refresh = () => setCanApplyLastStyle(hasLastStyle(loadLastStyle()));
    refresh();
    return subscribeBannerDrafts(refresh);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if (meta && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        const tag = event.target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        event.preventDefault();
        commit(removeElement(doc, selectedId));
        setSelectedId(null);
      }
      if (selected && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        if (event.target?.tagName === "INPUT" || event.target?.tagName === "TEXTAREA") return;
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        const next = { ...selected };
        if (event.key === "ArrowLeft") next.x -= step;
        if (event.key === "ArrowRight") next.x += step;
        if (event.key === "ArrowUp") next.y -= step;
        if (event.key === "ArrowDown") next.y += step;
        commitEl(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commit, commitEl, doc, redo, selected, selectedId, undo]);

  const persistStyle = (nextDoc) => saveLastStyle(extractStyle(nextDoc));

  const onExport = async () => {
    setSelectedId(null);
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await exportBannerPng(stageRef.current);
      persistStyle(doc);
      toast.success("Banner downloaded");
    } catch (error) {
      toast.error(error?.message || "Could not export PNG");
    }
  };

  const onSave = () => {
    const result = saveBannerDraft(doc);
    if (result.ok) {
      persistStyle(result.doc);
      if (result.doc.id !== doc.id) load(result.doc);
      toast.success(
        result.photosSaved === false ? result.error : "Banner saved on this device",
      );
    } else toast.error(result.error);
  };

  const onApplyLastStyle = () => {
    const style = loadLastStyle();
    if (!hasLastStyle(style)) {
      toast.error("Save a banner first to reuse its settings.");
      return;
    }
    if (!window.confirm("Apply your last saved colors, fonts, and sizes to this banner?")) {
      return;
    }
    commit(applyStyle(doc, style));
    toast.success("Last settings applied");
  };

  const onAdd = (kind) => {
    const el = createPresetElement(kind, doc);
    commit(addElement(doc, el));
    setSelectedId(el.id);
    setLeftOpen(false);
  };

  const onUpload = async (file) => {
    try {
      const src = await readImageFile(file);
      const el = createImageElement(doc, src);
      commit(addElement(doc, el));
      setSelectedId(el.id);
      setLeftOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const panel = (
    <LeftPanel
      onAdd={onAdd}
      onUpload={onUpload}
      onApplyTemplate={(id) => {
        const template = getBannerTemplate(id);
        if (!template) return;
        if (!window.confirm("Replace the current banner with this template?")) return;
        const next = template.create(doc.formatId, doc.paletteId);
        commit(next);
        setSelectedId(null);
      }}
    />
  );

  const propsPanel = (
    <RightPanel
      doc={doc}
      selected={selected}
      onChangeElement={(patch) => selected && commitEl({ ...selected, ...patch })}
      onAlign={(edge) => selected && commitEl(alignElement(selected, doc, edge))}
      onDuplicate={() => {
        if (!selected) return;
        const copy = { ...selected, id: createElementId(), x: selected.x + 24, y: selected.y + 24, z: (selected.z || 0) + 1 };
        commit(addElement(doc, copy));
        setSelectedId(copy.id);
      }}
      onDelete={() => {
        if (!selected) return;
        commit(removeElement(doc, selected.id));
        setSelectedId(null);
      }}
      onZ={(dir) => selected && commitEl({ ...selected, z: (selected.z || 0) + dir })}
      onPalette={(paletteId) =>
        commit({
          ...applyPalette(doc, paletteId),
          background: { fillRole: "canvas" },
        })
      }
      onBackground={(fill) =>
        commit({ ...doc, background: { fill, fillRole: null } })
      }
      onReplaceImage={async (file) => {
        if (!selected) return;
        const src = await readImageFile(file);
        commitEl({ ...selected, src });
      }}
      onRemoveImage={() => selected && commitEl({ ...selected, src: "" })}
    />
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-1 flex-col">
      <BannerToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        formatId={doc.formatId}
        onUndo={undo}
        onRedo={redo}
        onFormat={(formatId) => commit(applyFormat(doc, formatId))}
        onPreview={() => setShowPreview(true)}
        onSave={onSave}
        onExport={onExport}
        onApplyLastStyle={onApplyLastStyle}
        canApplyLastStyle={canApplyLastStyle}
        onOpenLeft={() => setLeftOpen(true)}
        onOpenRight={() => setRightOpen(true)}
      />
      <div className="relative flex min-h-0 min-w-0 flex-1">
        <div className="hidden lg:flex">{panel}</div>
        <BannerCanvas
          stageRef={stageRef}
          doc={doc}
          selectedId={selectedId}
          onSelect={onSelect}
          onPreviewElement={onPreviewElement}
          onCommit={() => commit()}
          onDelete={(id) => {
            commit(removeElement(doc, id));
            setSelectedId(null);
          }}
        />
        <div className="pointer-events-none relative hidden w-64 shrink-0 lg:block">
          <div className="pointer-events-auto absolute inset-0">
            {propsPanel}
          </div>
        </div>
      </div>
      {leftOpen ? (
        <Drawer onClose={() => setLeftOpen(false)} side="left">
          {panel}
        </Drawer>
      ) : null}
      {rightOpen ? (
        <Drawer onClose={() => setRightOpen(false)} side="right">
          {propsPanel}
        </Drawer>
      ) : null}
      {showPreview ? (
        <PreviewModal
          doc={doc}
          onClose={() => setShowPreview(false)}
          onExport={onExport}
        />
      ) : null}
    </div>
  );
}

function Drawer({ side, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-neutral-900/40"
        aria-label="Close panel"
        onClick={onClose}
      />
      <div
        className={`absolute top-0 h-full shadow-md ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
