import type { AnchorTransaction } from '../../hooks/useAnchor';

interface AnchorStatusProps {
  transactions: AnchorTransaction[];
}

const STATUS_STYLES: Record<AnchorTransaction['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

export function AnchorStatus({ transactions }: AnchorStatusProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">Anchor History</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">Deposit & Withdraw Status</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {transactions.length} records
        </span>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 capitalize">{tx.type} • {tx.anchor}</p>
                <p className="text-sm text-gray-500">{tx.details}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[tx.status]}`}>
                {tx.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Amount</p>
                <p className="mt-2 font-semibold text-gray-900">{tx.amount.toFixed(2)} {tx.asset}</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Fee</p>
                <p className="mt-2 font-semibold text-gray-900">${tx.fee.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Arrival</p>
                <p className="mt-2 font-semibold text-gray-900">{tx.estimatedArrival}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
