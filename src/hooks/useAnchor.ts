import { useState, useMemo, useCallback } from 'react';

export type AnchorProviderId = 'circle' | 'moneygram';
export type AnchorTransactionType = 'deposit' | 'withdraw';
export type AnchorTransactionStatus = 'idle' | 'redirecting' | 'pending' | 'processing' | 'completed' | 'failed';

export interface AnchorProvider {
  id: AnchorProviderId;
  name: string;
  asset: string;
  feePercent: number;
  fixedFee: number;
  minAmount: number;
  maxAmount: number;
  estimatedArrival: string;
  description: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  country: string;
}

export interface AnchorTransaction {
  id: string;
  type: AnchorTransactionType;
  anchor: string;
  amount: number;
  asset: string;
  fee: number;
  status: Exclude<AnchorTransactionStatus, 'idle' | 'redirecting'>;
  requestedAt: string;
  estimatedArrival: string;
  details: string;
}

const ANCHOR_PROVIDERS: AnchorProvider[] = [
  {
    id: 'circle',
    name: 'Circle',
    asset: 'USDC',
    feePercent: 0.01,
    fixedFee: 0.50,
    minAmount: 20,
    maxAmount: 10000,
    estimatedArrival: '1-2 business days',
    description: 'Fast stablecoin deposits with transparent fees.',
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    asset: 'USD',
    feePercent: 0.015,
    fixedFee: 1.25,
    minAmount: 50,
    maxAmount: 15000,
    estimatedArrival: '2-4 business days',
    description: 'Bank payout and withdrawal network for global transfers.',
  },
];

const INITIAL_BANK_DETAILS: BankDetails = {
  bankName: '',
  accountName: '',
  accountNumber: '',
  routingNumber: '',
  country: '',
};

export function useAnchor() {
  const [anchorOptions] = useState<AnchorProvider[]>(ANCHOR_PROVIDERS);
  const [selectedAnchorId, setSelectedAnchorId] = useState<AnchorProviderId>('circle');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState<BankDetails>(INITIAL_BANK_DETAILS);
  const [depositStatus, setDepositStatus] = useState<AnchorTransactionStatus>('idle');
  const [withdrawStatus, setWithdrawStatus] = useState<AnchorTransactionStatus>('idle');
  const [anchorHistory, setAnchorHistory] = useState<AnchorTransaction[]>([
    {
      id: 'a1',
      type: 'deposit',
      anchor: 'Circle',
      amount: 240,
      asset: 'USDC',
      fee: 3.90,
      status: 'completed',
      requestedAt: '2026-03-18',
      estimatedArrival: '1-2 business days',
      details: 'USDC deposit for session payouts',
    },
    {
      id: 'a2',
      type: 'withdraw',
      anchor: 'MoneyGram',
      amount: 500,
      asset: 'USD',
      fee: 8.75,
      status: 'processing',
      requestedAt: '2026-03-24',
      estimatedArrival: '2-4 business days',
      details: 'Bank withdrawal to receiving account',
    },
    {
      id: 'a3',
      type: 'deposit',
      anchor: 'Circle',
      amount: 85,
      asset: 'USDC',
      fee: 1.35,
      status: 'pending',
      requestedAt: '2026-03-26',
      estimatedArrival: '1-2 business days',
      details: 'Pending deposit before session release',
    },
  ]);

  const selectedAnchor = useMemo(
    () => anchorOptions.find((option) => option.id === selectedAnchorId) ?? anchorOptions[0],
    [anchorOptions, selectedAnchorId]
  );

  const depositAmountValue = useMemo(() => parseFloat(depositAmount) || 0, [depositAmount]);
  const withdrawAmountValue = useMemo(() => parseFloat(withdrawAmount) || 0, [withdrawAmount]);

  const feeBreakdown = useMemo(() => {
    const fee = depositAmountValue > 0 ? selectedAnchor.fixedFee + depositAmountValue * selectedAnchor.feePercent : 0;
    return {
      fee,
      total: depositAmountValue > 0 ? depositAmountValue + fee : 0,
    };
  }, [depositAmountValue, selectedAnchor]);

  const withdrawFee = useMemo(
    () => (withdrawAmountValue > 0 ? selectedAnchor.fixedFee + withdrawAmountValue * selectedAnchor.feePercent : 0),
    [withdrawAmountValue, selectedAnchor]
  );

  const withdrawTotal = useMemo(() => (withdrawAmountValue > 0 ? withdrawAmountValue + withdrawFee : 0), [withdrawAmountValue, withdrawFee]);

  const selectedAnchorArrival = selectedAnchor.estimatedArrival;

  const selectAnchor = useCallback((id: AnchorProviderId) => {
    setSelectedAnchorId(id);
  }, []);

  const setBankDetail = useCallback((key: keyof BankDetails, value: string) => {
    setBankDetails((current) => ({ ...current, [key]: value }));
  }, []);

  const resetDepositStatus = useCallback(() => {
    setDepositStatus('idle');
  }, []);

  const resetWithdrawStatus = useCallback(() => {
    setWithdrawStatus('idle');
  }, []);

  const initiateDeposit = useCallback(() => {
    if (depositAmountValue <= 0 || depositAmountValue < selectedAnchor.minAmount || depositAmountValue > selectedAnchor.maxAmount) {
      return;
    }

    setDepositStatus('redirecting');
    window.open(`https://sandbox.anchor.example/${selectedAnchor.id}`, '_blank');

    const transactionId = `anchor-${Date.now()}`;
    const newTransaction: AnchorTransaction = {
      id: transactionId,
      type: 'deposit',
      anchor: selectedAnchor.name,
      amount: depositAmountValue,
      asset: selectedAnchor.asset,
      fee: feeBreakdown.fee,
      status: 'pending',
      requestedAt: new Date().toISOString().slice(0, 10),
      estimatedArrival: selectedAnchor.estimatedArrival,
      details: `Deposit via ${selectedAnchor.name}`,
    };

    setAnchorHistory((previous) => [newTransaction, ...previous]);

    const pendingTimer = window.setTimeout(() => {
      setDepositStatus('pending');
      setAnchorHistory((previous) =>
        previous.map((tx) => (tx.id === transactionId ? { ...tx, status: 'pending' } : tx))
      );
    }, 700);

    const processingTimer = window.setTimeout(() => {
      setDepositStatus('processing');
      setAnchorHistory((previous) =>
        previous.map((tx) => (tx.id === transactionId ? { ...tx, status: 'processing' } : tx))
      );
    }, 1800);

    const completeTimer = window.setTimeout(() => {
      setDepositStatus('completed');
      setAnchorHistory((previous) =>
        previous.map((tx) => (tx.id === transactionId ? { ...tx, status: 'completed' } : tx))
      );
      setDepositAmount('');
    }, 3200);

    return () => {
      window.clearTimeout(pendingTimer);
      window.clearTimeout(processingTimer);
      window.clearTimeout(completeTimer);
    };
  }, [depositAmountValue, feeBreakdown.fee, selectedAnchor, selectedAnchor.estimatedArrival, selectedAnchor.name, selectedAnchor.id, selectedAnchor.maxAmount, selectedAnchor.minAmount]);

  const initiateWithdraw = useCallback(() => {
    const isBankDetailsComplete = Object.values(bankDetails).every((value) => value.trim().length > 0);
    if (withdrawAmountValue <= 0 || withdrawAmountValue < selectedAnchor.minAmount || withdrawAmountValue > selectedAnchor.maxAmount || !isBankDetailsComplete) {
      return;
    }

    setWithdrawStatus('pending');
    const transactionId = `anchor-${Date.now()}`;
    const newTransaction: AnchorTransaction = {
      id: transactionId,
      type: 'withdraw',
      anchor: selectedAnchor.name,
      amount: withdrawAmountValue,
      asset: selectedAnchor.asset,
      fee: withdrawFee,
      status: 'pending',
      requestedAt: new Date().toISOString().slice(0, 10),
      estimatedArrival: selectedAnchor.estimatedArrival,
      details: `Withdraw to bank account via ${selectedAnchor.name}`,
    };

    setAnchorHistory((previous) => [newTransaction, ...previous]);

    const processingTimer = window.setTimeout(() => {
      setWithdrawStatus('processing');
      setAnchorHistory((previous) =>
        previous.map((tx) => (tx.id === transactionId ? { ...tx, status: 'processing' } : tx))
      );
    }, 1200);

    const completeTimer = window.setTimeout(() => {
      setWithdrawStatus('completed');
      setAnchorHistory((previous) =>
        previous.map((tx) => (tx.id === transactionId ? { ...tx, status: 'completed' } : tx))
      );
      setWithdrawAmount('');
      setBankDetails(INITIAL_BANK_DETAILS);
    }, 3000);

    return () => {
      window.clearTimeout(processingTimer);
      window.clearTimeout(completeTimer);
    };
  }, [bankDetails, withdrawAmountValue, withdrawFee, selectedAnchor, selectedAnchor.maxAmount, selectedAnchor.minAmount]);

  return {
    anchorOptions,
    selectedAnchor,
    depositAmount,
    withdrawAmount,
    bankDetails,
    depositStatus,
    withdrawStatus,
    anchorHistory,
    feeBreakdown,
    withdrawFee,
    withdrawTotal,
    selectedAnchorArrival,
    selectAnchor,
    setDepositAmount,
    setWithdrawAmount,
    setBankDetail,
    initiateDeposit,
    initiateWithdraw,
    resetDepositStatus,
    resetWithdrawStatus,
  };
}
