import { BRAND_ASSETS } from "@/lib/brand";
import { cn } from "@/lib/utils";

export type TaipoqLogoVariant = "icon" | "navbar" | "fullLight" | "fullDark" | "full";

type TaipoqLogoProps = {
  variant?: TaipoqLogoVariant;
  className?: string;
  width?: number;
  height?: number;
};

const VARIANT_SRC: Record<TaipoqLogoVariant, string> = {
  icon: BRAND_ASSETS.logoIcon,
  navbar: BRAND_ASSETS.navbarMark,
  fullLight: BRAND_ASSETS.logoFullLight,
  fullDark: BRAND_ASSETS.logoFullDark,
  full: BRAND_ASSETS.logoFullLight,
};

const DEFAULT_SIZE: Record<TaipoqLogoVariant, number> = {
  icon: 40,
  navbar: 40,
  fullLight: 140,
  fullDark: 140,
  full: 140,
};

export function TaipoqLogo({
  variant = "icon",
  className,
  width,
  height,
}: TaipoqLogoProps) {
  const w = width ?? DEFAULT_SIZE[variant];
  const h = height ?? DEFAULT_SIZE[variant];

  return (
    <img
      src={VARIANT_SRC[variant]}
      alt="TAIPOQ logo"
      width={w}
      height={h}
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
