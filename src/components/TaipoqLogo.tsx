import { BRAND_ASSETS } from "@/lib/brand";
import { cn } from "@/lib/utils";

type TaipoqLogoProps = {
  variant?: "icon" | "full";
  className?: string;
  width?: number;
  height?: number;
};

export function TaipoqLogo({
  variant = "icon",
  className,
  width,
  height,
}: TaipoqLogoProps) {
  const isFull = variant === "full";
  const src = isFull ? BRAND_ASSETS.logoFull : BRAND_ASSETS.logoIcon;
  const w = width ?? (isFull ? 140 : 40);
  const h = height ?? (isFull ? 140 : 40);

  return (
    <img
      src={src}
      alt="TAIPOQ logo"
      width={w}
      height={h}
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
