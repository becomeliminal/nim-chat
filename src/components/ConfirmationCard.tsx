import { useState, useEffect, useMemo } from 'react';
import type { ConfirmationRequest } from '../types';

interface ConfirmationCardProps {
  request: ConfirmationRequest;
  onConfirm: (actionId: string) => void;
  onCancel: (actionId: string) => void;
}

interface ParsedDetails {
  recipient?: string;
  amount?: string;
  currency?: string;
  note?: string;
  vault?: string;
}

function getActionTitle(tool: string): string {
  switch (tool) {
    case 'send_money':
      return 'Confirm Transfer';
    case 'deposit_savings':
      return 'Confirm Deposit';
    case 'withdraw_savings':
      return 'Confirm Withdrawal';
    default:
      return 'Confirm Action';
  }
}

function parseDetails(summary: string): ParsedDetails | null {
  const details: ParsedDetails = {};
  const amountMatch = summary.match(/\$[\d,.]+|\d+\.?\d*\s*(?:USD|EUR|GBP)/i);
  if (amountMatch) details.amount = amountMatch[0];
  const toMatch = summary.match(/(?:to|recipient:?)\s+([^\s,]+)/i);
  if (toMatch) details.recipient = toMatch[1];
  return Object.keys(details).length > 0 ? details : null;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs font-body text-nim-grey">{label}</span>
      <span className="text-sm font-display font-medium text-nim-black">{value}</span>
    </div>
  );
}

export function ConfirmationCard({ request, onConfirm, onCancel }: ConfirmationCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const updateTimeLeft = () => {
      const remaining = Math.max(0, request.expiresAt.getTime() - Date.now());
      setTimeLeft(remaining);

      if (remaining <= 0) {
        onCancel(request.actionId);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [request.expiresAt, request.actionId, onCancel]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isExpiringSoon = minutes < 1;

  const details = useMemo(() => parseDetails(request.summary), [request.summary]);

  return (
    <div className="nim-message-enter bg-white border border-nim-beige/30 rounded-[24px] p-4 shadow-sm mx-4">
      <h4 className="font-display font-semibold text-nim-black text-lg">
        {getActionTitle(request.tool)}
      </h4>

      <div className="my-1">
        {details ? (
          <div className="divide-y divide-nim-cream">
            {details.recipient && <DetailRow label="To" value={details.recipient} />}
            {details.amount && <DetailRow label="Amount" value={details.amount} />}
            {details.note && <DetailRow label="Note" value={details.note} />}
            {details.vault && <DetailRow label="Vault" value={details.vault} />}
          </div>
        ) : (
          <p className="text-sm font-display text-nim-black leading-relaxed">
            {request.summary}
          </p>
        )}
      </div>

      <p
        className={`text-xs font-body ${
          isExpiringSoon ? 'text-nim-orange' : 'text-nim-grey'
        }`}
      >
        Expires in {minutes}:{seconds.toString().padStart(2, '0')}
      </p>

      <div className="flex justify-end gap-2 mt-1">
        <button
          onClick={() => onCancel(request.actionId)}
          className="h-9 px-3 text-sm font-body uppercase tracking-[0.5px] border border-nim-orange text-nim-orange hover:bg-nim-cream rounded-2xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(request.actionId)}
          className="h-9 px-3 text-sm font-body uppercase tracking-[0.5px] text-nim-black bg-nim-orange rounded-2xl hover:opacity-90 transition-opacity"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
