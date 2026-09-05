import { cn } from "@/utils";
import {
  ALIGN_CLASSES,
  TYPOGRAPHY_VARIANTS,
  VARIANT_TAGS,
} from "./typographyData";

/**
 * Centralized typography primitive.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {keyof typeof TYPOGRAPHY_VARIANTS} [props.variant]
 * @param {keyof JSX.IntrinsicElements|import("react").ElementType} [props.as]
 * @param {"left"|"center"|"right"} [props.align]
 * @param {boolean} [props.muted]
 * @param {string} [props.className]
 */
export function Typography({
  children,
  variant = "body",
  as,
  align,
  muted = false,
  className,
  ...props
}) {
  const Comp = as ?? VARIANT_TAGS[variant] ?? "p";
  const variantClass = TYPOGRAPHY_VARIANTS[variant] ?? TYPOGRAPHY_VARIANTS.body;

  return (
    <Comp
      className={cn(
        variantClass,
        align && ALIGN_CLASSES[align],
        muted && "text-neutral-600",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Back-compat heading helper — prefer `Typography` with heading variants.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"display"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"} [props.level]
 * @param {keyof JSX.IntrinsicElements|import("react").ElementType} [props.as]
 * @param {"left"|"center"|"right"} [props.align]
 * @param {boolean} [props.muted]
 * @param {string} [props.className]
 */
export function Heading({ level = "h2", ...props }) {
  return <Typography variant={level} {...props} />;
}
