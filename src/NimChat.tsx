import { useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { useNimWebSocket } from './hooks/useNimWebSocket';
import type { NimChatProps } from './types';

export function NimChat({
  wsUrl,
  title = 'Nim',
  position = 'bottom-right',
  defaultOpen = false,
}: NimChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const {
    messages,
    isStreaming,
    connectionState,
    confirmationRequest,
    sendMessage,
    confirmAction,
    cancelAction,
  } = useNimWebSocket({
    wsUrl,
    onError: (error) => console.error('[NimChat]', error),
  });

  const positionClasses =
    position === 'bottom-right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6';

  return (
    <div className="nim-chat-widget fixed bottom-4 sm:bottom-6 z-50" style={{ [position === 'bottom-right' ? 'right' : 'left']: '1rem' }}>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`
            absolute bottom-16 ${positionClasses}
            w-[calc(100vw-2rem)] sm:w-96
            h-[min(600px,calc(100vh-8rem))]
          `}
          style={{
            [position === 'bottom-right' ? 'right' : 'left']: 0,
          }}
        >
          <ChatPanel
            title={title}
            messages={messages}
            isStreaming={isStreaming}
            connectionState={connectionState}
            confirmationRequest={confirmationRequest}
            onSendMessage={sendMessage}
            onConfirm={confirmAction}
            onCancel={cancelAction}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14
          bg-nim-orange text-white
          rounded-full
          shadow-lg
          flex items-center justify-center
          transition-all duration-200
          hover:scale-110 hover:shadow-xl
          active:scale-95
          ${isOpen ? 'rotate-0' : 'rotate-0'}
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
