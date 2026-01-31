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
    <div className="bg-nim-white border-2 border-nim-black rounded-lg p-5 shadow-lg">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-nim-beige rounded-lg flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-nim-black"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M3.6 15.8l4.8-9.6a2 2 0 0 1 3.6 0l4.8 9.6a2 2 0 0 1-1.8 2.8H5.4a2 2 0 0 1-1.8-2.8z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-medium text-nim-black text-base">
            Confirm Action
          </h4>
          <p className="text-nim-grey-400 text-xs mt-0.5 font-mono">
            {request.tool}
          </p>
          <p className="text-nim-black font-body text-sm mt-2">
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
              stroke="#ddd"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#231f18"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100 - progress}
              className="transition-all duration-100"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-nim-black font-mono">
            {secondsLeft}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onCancel(request.actionId)}
          className="flex-1 h-10 px-4 bg-nim-beige text-nim-black rounded-lg text-sm font-display font-medium hover:bg-nim-grey-100 transition-colors border border-nim-grey-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(request.actionId)}
          className="flex-1 h-10 px-4 bg-nim-black text-nim-white rounded-lg text-sm font-display font-medium hover:opacity-90 transition-opacity"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
