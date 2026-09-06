import Image from "next/image";
import { cn } from "@/utils";
import { BRAND_NAME } from "@/constants";

const LOGO = {
  src: "/images/brand/testora-logo.png",
  width: 882,
  height: 224,
};

const MARK = {
  src: "/images/brand/testora-mark.png",
  width: 249,
  height: 220,
};

/**
 * Testora T + document mark (icon-only).
 */
export function BrandMark({ className, title }) {
  return (
    <Image
      src={MARK.src}
      alt={title ?? ""}
      width={MARK.width}
      height={MARK.height}
      className={cn("size-8 object-contain", className)}
      aria-hidden={title ? undefined : true}
    />
  );
}

/**
 * Header / footer lockup: full Testora logo.
 */
export function BrandLogo({
  className,
  showWordmark = true,
  markClassName,
  priority = false,
}) {
  if (!showWordmark) {
    return (
      <BrandMark title={BRAND_NAME} className={cn(markClassName, className)} />
    );
  }

  return (
    <Image
      src={LOGO.src}
      alt={BRAND_NAME}
      width={LOGO.width}
      height={LOGO.height}
      className={cn("h-9 w-auto sm:h-10", className)}
      priority={priority}
    />
  );
}
