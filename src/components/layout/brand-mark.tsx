import Image from "next/image";
import { COMPANY } from "@/lib/data/company";
import { cn } from "@/lib/cn";

/**
 * The company's visual identity in the header, footer and admin chrome.
 *
 * When the active company has a logo (COMPANY.logo), it renders that image.
 * Otherwise it falls back to the company name as a text wordmark, so a company
 * with no logo yet still shows its own name rather than another company's logo.
 */
export function BrandMark({
  imgClassName,
  textClassName,
  width = 256,
  height = 256,
  priority = false,
}: {
  imgClassName?: string;
  textClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  if (COMPANY.logo) {
    return (
      <Image
        src={COMPANY.logo}
        alt={COMPANY.legalName}
        width={width}
        height={height}
        priority={priority}
        className={imgClassName}
      />
    );
  }

  return (
    <span
      className={cn(
        "font-heading font-extrabold tracking-tight leading-none whitespace-nowrap",
        textClassName,
      )}
    >
      {COMPANY.shortName}
    </span>
  );
}
