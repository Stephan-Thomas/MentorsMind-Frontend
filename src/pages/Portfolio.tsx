import { useState } from "react";
import { AssetRow } from "../components/wallet/AssetRow";
import { PortfolioChart } from "../components/wallet/PortfolioChart";
import { SendModal } from "../components/wallet/SendModal";
import { ReceiveModal } from "../components/wallet/ReceiveModal";
import { usePortfolio } from "../hooks/usePortfolio";

export default function Portfolio() {
  const {
    assets,
    totalValue,
    sortBy,
    setSortBy,
    loading,
    lastUpdated,
    refreshPortfolio,
    toggleTrustline,
  } = usePortfolio();

  const [sendAsset, setSendAsset] = useState<string | null>(null);
  const [receiveAsset, setReceiveAsset] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "value" | "name" | "change")
            }
            className="px-3 py-2 border rounded"
          >
            <option value="value">Sort by Value</option>
            <option value="name">Sort by Name</option>
            <option value="change">Sort by 24h Change</option>
          </select>

          <button
            onClick={refreshPortfolio}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-xl">
        <p className="text-gray-500">Total Portfolio Value</p>
        <h2 className="text-3xl font-bold">${totalValue.toFixed(2)}</h2>
        <p className="text-sm text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>

      <PortfolioChart assets={assets} />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Assets</h3>

        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl bg-gray-200 animate-pulse"
              />
            ))
          : assets.map((asset) => (
              <AssetRow
                key={asset.id}
                icon={asset.icon}
                name={asset.name}
                balance={asset.balance}
                usdValue={asset.usdValue}
                change24h={asset.change24h}
                trusted={asset.trusted}
                onSend={() => setSendAsset(asset.name)}
                onReceive={() => setReceiveAsset(asset.name)}
                onToggleTrustline={() => toggleTrustline(asset.id)}
              />
            ))}
      </div>

      {sendAsset && (
        <SendModal assetName={sendAsset} onClose={() => setSendAsset(null)} />
      )}

      {receiveAsset && (
        <ReceiveModal
          assetName={receiveAsset}
          onClose={() => setReceiveAsset(null)}
        />
      )}
    </div>
  );
}