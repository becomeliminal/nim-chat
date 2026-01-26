import { useState, useEffect } from 'react';
import type { ConfirmationRequest } from '../types';

interface ConfirmationCardProps {
  request: ConfirmationRequest;
  onConfirm: (actionId: string) => void;
  onCancel: (actionId: string) => void;
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
    const interval = setInterval(updateTimeLeft, 100);
    return () => clearInterval(interval);
  }, [request.expiresAt, request.actionId, onCancel]);

  const totalDuration = request.expiresAt.getTime() - Date.now() + timeLeft;
  const progress = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  const secondsLeft = Math.ceil(timeLeft / 1000);

  return (
    <div className="bg-white border-2 border-nim-orange rounded-bubble p-4 shadow-lg">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-nim-orange/10 rounded-full flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-nim-orange"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M3.6 15.8l4.8-9.6a2 2 0 0 1 3.6 0l4.8 9.6a2 2 0 0 1-1.8 2.8H5.4a2 2 0 0 1-1.8-2.8z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-body font-semibold text-nim-black text-sm">
            Action Confirmation
          </h4>
          <p className="text-nim-brown text-xs mt-0.5 font-mono">
            {request.tool}
          </p>
          <p className="text-nim-black text-sm mt-2">
            {request.summary}
          </p>
        </div>

        {/* Countdown */}
        <div className="flex-shrink-0 relative w-10 h-10">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#F1EDE7"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#FF6D00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100 - progress}
              className="transition-all duration-100"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-nim-orange">
            {secondsLeft}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onCancel(request.actionId)}
          className="flex-1 h-9 px-4 bg-nim-cream text-nim-black rounded-full text-sm font-medium hover:bg-nim-cream/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(request.actionId)}
          className="flex-1 h-9 px-4 bg-nim-green text-white rounded-full text-sm font-medium hover:bg-nim-green/90 transition-colors"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
