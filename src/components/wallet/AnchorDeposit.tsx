import { useState } from 'react';
import type { AnchorProvider } from '../../hooks/useAnchor';

interface AnchorDepositProps {
  anchorOptions: AnchorProvider[];
  selectedAnchor: AnchorProvider;
  amount: string;
  onAmountChange: (value: string) => void;
  onSelectAnchor: (id: AnchorProvider['id']) => void;
  onDeposit: () => void;
  depositStatus: string;
  feeBreakdown: { fee: number; total: number };
  estimatedArrival: string;
  onReset: () => void;
}

export function AnchorDeposit({
  anchorOptions,
  selectedAnchor,
  amount,
  onAmountChange,
  onSelectAnchor,
  onDeposit,
  depositStatus,
  feeBreakdown,
  estimatedArrival,
  onReset,
}: AnchorDepositProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">Anchor Deposit</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">Add Funds</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-2xl bg-stellar px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stellar-dark"
        >
          {isOpen ? 'Close' : 'Add Funds'}
        </button>
      </div>

      {isOpen ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {anchorOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectAnchor(option.id)}
                className={`rounded-3xl border p-4 text-left transition ${
                  option.id === selectedAnchor.id
                    ? 'border-stellar bg-stellar/5'
                    : 'border-gray-200 bg-white hover:border-stellar/60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-gray-900">{option.name}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                    {option.asset}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{option.description}</p>
                <p className="mt-3 text-xs text-gray-400">Fees: {(option.feePercent * 100).toFixed(1)}% + ${option.fixedFee.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Limits: ${option.minAmount.toLocaleString()} - ${option.maxAmount.toLocaleString()}</p>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Deposit amount ({selectedAnchor.asset})</label>
            <input
              type="number"
              inputMode="decimal"
              min={selectedAnchor.minAmount}
              max={selectedAnchor.maxAmount}
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-stellar focus:ring-2 focus:ring-stellar/20"
            />
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Estimated arrival</span>
              <strong>{estimatedArrival}</strong>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-gray-500">Fee</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">${feeBreakdown.fee.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-gray-500">Total</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">${feeBreakdown.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDeposit}
            className="w-full rounded-3xl bg-stellar px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stellar/20 transition hover:bg-stellar-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue to Anchor UI
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          Click Add Funds to select an anchor and start your deposit.
        </div>
      )}

      {depositStatus !== 'idle' && (
        <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-gray-700 shadow-sm">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-900">Deposit status</p>
              <p className="text-xs text-gray-500">Track your SEP-24 deposit progress.</p>
            </div>
            <span className="rounded-full bg-stellar/10 px-3 py-1 text-xs font-semibold text-stellar">
              {depositStatus.toUpperCase()}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-3xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Current step</p>
              <p className="mt-2 text-sm text-gray-700">
                {depositStatus === 'redirecting' && 'Opening the anchor provider UI...'}
                {depositStatus === 'pending' && 'Awaiting confirmation from the anchor provider.'}
                {depositStatus === 'processing' && 'Your deposit is being processed on the Stellar network.'}
                {depositStatus === 'completed' && 'Deposit complete. Funds will appear in your wallet shortly.'}
                {depositStatus === 'failed' && 'There was an issue with the deposit. Please retry.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['pending', 'processing', 'completed'].map((step) => (
                <span
                  key={step}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    depositStatus === step || (depositStatus === 'completed' && step !== 'pending')
                      ? 'bg-stellar text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
            {depositStatus === 'completed' && (
              <button
                type="button"
                onClick={onReset}
                className="mt-3 inline-flex items-center rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50"
              >
                Reset Deposit Flow
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
