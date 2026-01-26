import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ConfirmationCard } from './ConfirmationCard';
import type { Message, ConfirmationRequest, ConnectionState } from '../types';

interface ChatPanelProps {
  title: string;
  messages: Message[];
  isStreaming: boolean;
  connectionState: ConnectionState;
  confirmationRequest: ConfirmationRequest | null;
  onSendMessage: (content: string) => void;
  onConfirm: (actionId: string) => void;
  onCancel: (actionId: string) => void;
  onClose: () => void;
}

export function ChatPanel({
  title,
  messages,
  isStreaming,
  connectionState,
  confirmationRequest,
  onSendMessage,
  onConfirm,
  onCancel,
  onClose,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming, confirmationRequest]);

  const isConnecting = connectionState === 'connecting';
  const isDisconnected = connectionState === 'disconnected' || connectionState === 'error';

  return (
    <div className="nim-panel-enter flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-nim-cream">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-nim-cream border-b border-nim-orange/20">
        <h2 className="font-display text-lg font-semibold text-nim-black">{title}</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-nim-orange/10 transition-colors"
          aria-label="Close chat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-nim-black"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Connection status banner */}
      {isDisconnected && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          Disconnected. Attempting to reconnect...
        </div>
      )}

      {/* Messages */}
      <div className="nim-chat-messages flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !isConnecting && (
          <div className="text-center text-nim-brown/60 py-8">
            <p className="text-sm">Start a conversation</p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Thinking indicator when streaming starts but no content yet */}
        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <ThinkingIndicator />
        )}

        {/* Confirmation card */}
        {confirmationRequest && (
          <div className="py-2">
            <ConfirmationCard
              request={confirmationRequest}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-nim-cream">
        <ChatInput
          onSend={onSendMessage}
          disabled={isConnecting || isDisconnected || isStreaming || !!confirmationRequest}
          placeholder={
            isConnecting
              ? 'Connecting...'
              : isStreaming
                ? 'Nim is responding...'
                : confirmationRequest
                  ? 'Waiting for confirmation...'
                  : 'Type a message...'
          }
        />
      </div>
    </div>
  );
}
