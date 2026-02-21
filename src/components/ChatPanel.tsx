import { useRef, useEffect, useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ConfirmationCard } from './ConfirmationCard';
import { ChatEmptyState } from './ChatEmptyState';
import { StreamingMessage } from './StreamingMessage';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { DateSeparator } from './DateSeparator';
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
  onNewChat?: () => void;
  onClose: () => void;
  onLogout?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr);

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';

  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCalendarDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
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
  onNewChat,
  onClose,
  onLogout,
  isExpanded,
  onToggleExpand,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distanceFromBottom > 100);
  }, []);

  // Auto-scroll when near bottom
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 150) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, confirmationRequest]);

  const isConnecting = connectionState === 'connecting';
  const isReconnecting = connectionState === 'reconnecting';
  const isDisconnected = connectionState === 'disconnected';
  const hasError = connectionState === 'error';

  const showEmpty = messages.length === 0 && !isConnecting;

  // Detect streaming: when isStreaming and last message is assistant, render it as StreamingMessage
  const lastMessage = messages[messages.length - 1];
  const isLastMessageStreaming = isStreaming && lastMessage?.role === 'assistant';
  const showThinking = isStreaming && !isLastMessageStreaming;

  // Build messages with date separators
  const renderMessages = () => {
    const elements: React.ReactNode[] = [];
    let lastDateKey = '';

    const messagesToRender = isLastMessageStreaming ? messages.slice(0, -1) : messages;

    for (const message of messagesToRender) {
      const dateKey = getCalendarDate(message.createdAt);
      if (dateKey !== lastDateKey) {
        elements.push(
          <DateSeparator key={`date-${dateKey}`} date={formatDateHeader(message.createdAt)} />
        );
        lastDateKey = dateKey;
      }
      elements.push(<ChatMessage key={message.id} message={message} />);
    }

    return elements;
  };

  return (
    <div className="nim-panel-enter flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-nim-cream">
        <h2 className="font-display text-xl font-medium text-nim-black">{title}</h2>
        <div className="flex items-center gap-1">
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs rounded-lg bg-nim-cream hover:bg-nim-cream/80 text-nim-black font-body transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
          {onNewChat && (
            <button
              onClick={onNewChat}
              disabled={isStreaming}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nim-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="New chat"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-nim-black"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nim-cream transition-colors"
              aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-nim-black"
              >
                {isExpanded ? (
                  <>
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                ) : (
                  <>
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                )}
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nim-cream transition-colors"
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
      </div>

      {/* Connection status banner */}
      {isReconnecting && (
        <div className="px-4 py-2 bg-yellow-100 border-b border-yellow-200 text-nim-black font-body text-sm">
          Reconnecting...
        </div>
      )}
      {isDisconnected && !isReconnecting && (
        <div className="px-4 py-2 bg-orange-100 border-b border-orange-200 text-nim-black font-body text-sm">
          Connection lost. Reconnecting...
        </div>
      )}
      {hasError && (
        <div className="px-4 py-2 bg-red-100 border-b border-red-200 text-nim-black font-body text-sm">
          Connection failed. Please refresh the page.
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="nim-chat-messages flex-1 overflow-y-auto p-4 space-y-3 relative"
      >
        {showEmpty ? (
          <ChatEmptyState onSuggestionPress={onSendMessage} />
        ) : (
          <>
            {renderMessages()}

            {showThinking && <ThinkingIndicator />}

            {isLastMessageStreaming && (
              <StreamingMessage content={lastMessage.content} />
            )}

            {confirmationRequest && (
              <div className="py-2">
                <ConfirmationCard
                  request={confirmationRequest}
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                />
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom */}
      <div className="relative">
        <ScrollToBottomButton
          visible={showScrollButton}
          onClick={scrollToBottom}
        />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-nim-cream bg-white">
        <ChatInput
          onSend={onSendMessage}
          disabled={isConnecting || isReconnecting || isDisconnected || hasError || isStreaming || !!confirmationRequest}
          placeholder={
            isConnecting
              ? 'Connecting...'
              : isReconnecting
                ? 'Reconnecting...'
                : isDisconnected || hasError
                  ? 'Disconnected'
                  : isStreaming
                    ? 'Nim is responding...'
                    : confirmationRequest
                      ? 'Waiting for confirmation...'
                      : 'Message Nim...'
          }
        />
      </div>
    </div>
  );
}
