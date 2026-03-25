"use client";

export default function AssetVault({
  assets,
  selectedAssetId,
  onSelectAsset
}) {
  return (
    <article className="asset-vault-card">
      <div className="section-head">
        <div>
          <p className="section-label">Imported 3D Assets</p>
          <h3>Everything currently in `public/assets/`.</h3>
        </div>
        <span className="count-pill">{assets.length} models</span>
      </div>

      <div className="asset-grid">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            className={`asset-card${
              asset.id === selectedAssetId ? " active" : ""
            }`}
            onClick={() => onSelectAsset(asset)}
          >
            <span className="asset-type">
              {asset.assignedProjectId ? "Mapped hero asset" : "Library asset"}
            </span>
            <strong>{asset.label}</strong>
            <span className="asset-file">{asset.fileName}</span>
          </button>
        ))}
      </div>
    </article>
  );
}
