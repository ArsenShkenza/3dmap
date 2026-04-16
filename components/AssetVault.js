"use client";

import { cn } from "@/lib/cn";
import {
  countPill,
  sectionLabel,
  serifHeading,
  switcherCard,
} from "@/lib/uiClasses";

export default function AssetVault({
  assets,
  selectedAssetId,
  onSelectAsset
}) {
  return (
    <article className="mt-[18px] grid gap-4 border-t border-white/8 pt-[18px]">
      <div className="flex items-start justify-between gap-3 max-[820px]:flex-col max-[820px]:items-start">
        <div className="min-w-0">
          <p className={sectionLabel}>Imported 3D Assets</p>
          <h3 className={cn(serifHeading, "text-[1.05rem]")}>
            Models under `public/assets/` (exterior, full, interior).
          </h3>
        </div>
        <span className={countPill}>{assets.length} models</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-[1480px]:grid-cols-1 max-[820px]:grid-cols-1">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            aria-pressed={asset.id === selectedAssetId}
            className={cn(switcherCard, "rounded-2xl p-[14px]")}
            onClick={() => onSelectAsset(asset)}
          >
            <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-(--gold-bright)">
              {asset.assignedProjectId ? "Mapped hero asset" : "Library asset"}
            </span>
            <strong className={cn(serifHeading, "mt-2 block text-base")}>
              {asset.label}
            </strong>
            <span className="mt-[6px] block wrap-break-word text-[0.82rem] text-(--text-soft)">
              {asset.fileName}
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}
