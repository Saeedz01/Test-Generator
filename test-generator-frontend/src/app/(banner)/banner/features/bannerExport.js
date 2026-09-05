import { toPng } from "html-to-image";

export async function exportBannerPng(node, filename = "testora-banner.png") {
  if (!node) {
    throw new Error("Nothing to export.");
  }
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    skipAutoScale: true,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}
