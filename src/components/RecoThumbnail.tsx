import Image from "next/image";
import { IRecommendation } from "@/types/recommendation";

interface RecoThumbnailProps {
  rec: Pick<IRecommendation, "title" | "imageUrl">;
  /** Sizing/color/radius of the box (e.g. "w-24 h-24 rounded-xl bg-category-book"). */
  className?: string;
  /** Styling of the fallback initial when there is no cover image. */
  textClassName?: string;
}

/**
 * Recommendation cover: shows `imageUrl` if present, else the title's initial.
 * Cover images are arbitrary user URLs → `unoptimized` so the Next optimizer
 * is not an open image proxy (SSRF). See next.config.ts.
 */
export default function RecoThumbnail({ rec, className = "", textClassName = "" }: RecoThumbnailProps) {
  return (
    <span className={`relative overflow-hidden flex items-center justify-center shrink-0 ${className}`}>
      {rec.imageUrl ? (
        <Image src={rec.imageUrl} alt={rec.title} fill sizes="96px" unoptimized className="object-cover" />
      ) : (
        <span className={`font-serif ${textClassName}`}>{rec.title.charAt(0)}</span>
      )}
    </span>
  );
}
