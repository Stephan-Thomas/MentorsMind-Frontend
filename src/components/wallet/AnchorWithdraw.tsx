import type { AnchorProvider, BankDetails } from '../../hooks/useAnchor';

interface AnchorWithdrawProps {
  selectedAnchor: AnchorProvider;
  amount: string;
  bankDetails: BankDetails;
  onAmountChange: (value: string) => void;
  onBankDetailChange: (key: keyof BankDetails, value: string) => void;
  onWithdraw: () => void;
  status: string;
  fee: number;
  total: number;
  estimatedArrival: string;
}

export function AnchorWithdraw({
  selectedAnchor,
  amount,
  bankDetails,
  onAmountChange,
  onBankDetailChange,
  onWithdraw,
  status,
  fee,
  total,
  estimatedArrival,
}: AnchorWithdrawProps) {
  const isFormComplete =
    amount.trim().length > 0 &&
    bankDetails.bankName.trim().length > 0 &&
    bankDetails.accountName.trim().length > 0 &&
    bankDetails.accountNumber.trim().length > 0 &&
    bankDetails.routingNumber.trim().length > 0 &&
    bankDetails.country.trim().length > 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">Anchor Withdraw</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">Withdraw to Bank</h2>
        </div>
        <div className="rounded-3xl bg-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
          {selectedAnchor.name}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Amount ({selectedAnchor.asset})</label>
          <input
            type="number"
            inputMode="decimal"
            min={selectedAnchor.minAmount}
            max={selectedAnchor.maxAmount}
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="Enter withdrawal amount"
            className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-stellar focus:ring-2 focus:ring-stellar/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Bank Name</label>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(event) => onBankDetailChange('bankName', event.target.value)}
              placeholder="Bank name"
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-stellar focus:ring-2 focus:ring-stellar/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Account Name</label>
            <input
              type="text"
              value={bankDetails.accountName}
              onChange={(event) => onBankDetailChange('accountName', event.target.value)}
              placeholder="Account holder"
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-stellar focus:ring-2 focus:ring-stellar/20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Account Number</label>
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(event) => onBankDetailChange('accountNumber', event.target.value)}
              placeholder="123456789"
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-stellar focus:ring-2 focus:ring-stellar/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Routing / SWIFT</label>
            <input
              type="text"
              value={bankDetails.routingNumber}
              onChange={(event) => onBankDetailChange('routingNumber', event.target.value)}
              placeholder="Routing or SWIFT"
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-stellar focus:ring-2 focus:ring-stellar/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Country</label>
          <input
            type="text"
            value={bankDetails.country}
            onChange={(event) => onBankDetailChange('country', event.target.value)}
            placeholder="United States"
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
              <p className="mt-2 text-lg font-semibold text-gray-900">${fee.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="text-gray-500">Total debited</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onWithdraw}
          disabled={!isFormComplete || Number(amount) <= 0}
          className="w-full rounded-3xl bg-stellar px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stellar/20 transition hover:bg-stellar-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'pending' || status === 'processing' ? 'Processing withdrawal...' : 'Submit Withdrawal'}
        </button>

        {status !== 'idle' && (
          <div className="rounded-3xl bg-white p-4 text-sm text-gray-700 shadow-sm border border-gray-200">
            <p className="font-semibold text-gray-900">Withdrawal status</p>
            <p className="mt-2 text-sm text-gray-600">
              {status === 'pending' && 'Your request is pending at the anchor provider.'}
              {status === 'processing' && 'Your withdrawal is being processed and will arrive soon.'}
              {status === 'completed' && 'Withdrawal complete. Please verify your bank account.'}
              {status === 'failed' && 'Withdrawal failed. Please update the details and try again.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
