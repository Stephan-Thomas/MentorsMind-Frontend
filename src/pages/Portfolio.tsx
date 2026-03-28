import { useAnchor } from '../hooks/useAnchor';
import { AnchorDeposit } from '../components/wallet/AnchorDeposit';
import { AnchorWithdraw } from '../components/wallet/AnchorWithdraw';
import { AnchorStatus } from '../components/wallet/AnchorStatus';

const Portfolio: React.FC = () => {
  const anchor = useAnchor();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stellar">Anchor On/Off Ramp</p>
          <h1 className="mt-3 text-4xl font-black text-gray-900">Portfolio & Anchor Flow</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Manage fiat on/off ramp deposits, withdraws, and see the latest status of Stellar anchor transactions.
          </p>
        </div>
        <div className="rounded-3xl bg-stellar/5 px-5 py-4 text-sm font-semibold text-stellar">
          {anchor.anchorHistory.filter((tx) => tx.type === 'deposit').length} deposits • {anchor.anchorHistory.filter((tx) => tx.type === 'withdraw').length} withdrawals
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <AnchorDeposit
            anchorOptions={anchor.anchorOptions}
            selectedAnchor={anchor.selectedAnchor}
            amount={anchor.depositAmount}
            onAmountChange={anchor.setDepositAmount}
            onSelectAnchor={anchor.selectAnchor}
            onDeposit={anchor.initiateDeposit}
            depositStatus={anchor.depositStatus}
            feeBreakdown={anchor.feeBreakdown}
            estimatedArrival={anchor.selectedAnchorArrival}
            onReset={anchor.resetDepositStatus}
          />

          <AnchorWithdraw
            selectedAnchor={anchor.selectedAnchor}
            amount={anchor.withdrawAmount}
            bankDetails={anchor.bankDetails}
            onAmountChange={anchor.setWithdrawAmount}
            onBankDetailChange={anchor.setBankDetail}
            onWithdraw={anchor.initiateWithdraw}
            status={anchor.withdrawStatus}
            fee={anchor.withdrawFee}
            total={anchor.withdrawTotal}
            estimatedArrival={anchor.selectedAnchorArrival}
          />
        </div>

        <AnchorStatus transactions={anchor.anchorHistory} />
      </div>
    </div>
  );
};

export default Portfolio;
