interface ScrollToBottomButtonProps {
  visible: boolean;
  unreadCount?: number;
  onClick: () => void;
}

export function ScrollToBottomButton({
  visible,
  unreadCount = 0,
  onClick,
}: ScrollToBottomButtonProps) {
  return (
    <div
      className={`
        absolute bottom-2 left-1/2 -translate-x-1/2 z-10
        nim-scroll-btn-enter
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}
    >
      <button
        onClick={onClick}
        className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-nim-cream transition-colors"
        aria-label="Scroll to bottom"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-nim-brown"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-nim-orange text-white text-[10px] font-bold flex items-center justify-center px-1">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
