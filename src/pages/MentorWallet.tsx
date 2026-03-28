import React, { useState } from "react";
import { useMentorWallet } from "../hooks/useMentorWallet";
import { useEscrow } from "../hooks/useEscrow";
import WalletDashboard from "../components/mentor/WalletDashboard";
import EarningsBreakdown from "../components/mentor/EarningsBreakdown";
import PayoutRequest from "../components/mentor/PayoutRequest";
import PayoutHistory from "../components/mentor/PayoutHistory";
import MetricCard from "../components/charts/MetricCard";
import { FreighterConnect } from "../components/wallet/FreighterConnect";
import EscrowStatus from "../components/payment/EscrowStatus";
import EscrowTimeline from "../components/payment/EscrowTimeline";

const MentorWallet: React.FC<{ isOnline?: boolean }> = ({ isOnline = true }) => {
  const {
    wallet,
    txFilter,
    setTxFilter,
    filteredTx,
    payoutAmount,
    setPayoutAmount,
    payoutAsset,
    setPayoutAsset,
    payoutStatus,
    requestPayout,
    copied,
    copyAddress,
    exportEarnings,
  } = useMentorWallet();

  const [activeTab, setActiveTab] = useState<"overview" | "escrow">("overview");
  const [selectedEscrowId, setSelectedEscrowId] = useState<string | null>(null);

  const {
    escrows,
    loading: escrowLoading,
    releaseEscrow,
    getCountdown,
    canRelease,
    canDispute,
    isWithinDisputeWindow,
  } = useEscrow({ userRole: "mentor", userId: "mentor-001" });

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold mb-1">Wallet</h2>
        <p className="text-gray-500">
          Manage your Stellar earnings and payouts.
        </p>
      </div>

      {/* Wallet Connect */}
      <div className="mb-6">
        <FreighterConnect
          showNetworkIndicator={true}
          onConnect={(walletInfo) => {
            console.log("Wallet connected:", walletInfo);
          }}
          onDisconnect={() => {
            console.log("Wallet disconnected");
          }}
        />
      </div>

      {/* Wallet + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WalletDashboard
          wallet={wallet}
          copied={copied}
          onCopy={copyAddress}
        />

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <MetricCard
            title="Total Earned"
            value={`$${wallet.totalEarned.toLocaleString()}`}
            change={18.2}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Available to Withdraw"
            value={`$${wallet.availableEarnings.toLocaleString()}`}
            change={5.4}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Pending Clearance"
            value={`$${wallet.pendingEarnings.toLocaleString()}`}
          />
          <MetricCard
            title="Forecast Next Month"
            value={`$${wallet.forecastNextMonth.toLocaleString()}`}
            change={12.1}
            changeLabel="projected"
          />
        </div>
      </div>

      {/* Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PayoutRequest
          availableEarnings={wallet.availableEarnings}
          pendingEarnings={wallet.pendingEarnings}
          amount={payoutAmount}
          asset={payoutAsset}
          status={payoutStatus}
          onAmountChange={setPayoutAmount}
          onAssetChange={setPayoutAsset}
          onSubmit={
            isOnline
              ? requestPayout
              : () => alert("Payouts disabled offline")
          }
        />

        <div className="lg:col-span-2">
          <PayoutHistory
            transactions={filteredTx}
            payoutHistory={wallet.payoutHistory}
            filter={txFilter}
            onFilterChange={setTxFilter}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {["overview", "escrow"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <EarningsBreakdown
          sessions={wallet.sessionEarnings}
          platformFeeRate={wallet.platformFeeRate}
          onExport={exportEarnings}
        />
      )}

      {/* Escrow */}
      {activeTab === "escrow" && (
        <div className="space-y-4">
          {escrowLoading ? (
            <div className="h-40 bg-gray-200 animate-pulse rounded" />
          ) : (
            escrows.map((escrow) => (
              <div key={escrow.id}>
                <EscrowStatus
                  escrow={escrow}
                  userRole="mentor"
                  onRelease={() => releaseEscrow(escrow.id)}
                  getCountdown={getCountdown}
                  canRelease={canRelease(escrow)}
                  canDispute={canDispute(escrow)}
                  isWithinDisputeWindow={isWithinDisputeWindow(escrow)}
                />
                <EscrowTimeline escrow={escrow} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MentorWallet;