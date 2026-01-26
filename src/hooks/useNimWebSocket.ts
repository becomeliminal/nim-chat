import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Message,
  ClientMessage,
  ServerMessage,
  ConfirmationRequest,
  ConnectionState,
} from '../types';

const STORAGE_KEY = 'nim-chat-conversation-id';

interface UseNimWebSocketOptions {
  wsUrl: string;
  onError?: (error: string) => void;
}

interface UseNimWebSocketReturn {
  messages: Message[];
  isStreaming: boolean;
  connectionState: ConnectionState;
  confirmationRequest: ConfirmationRequest | null;
  sendMessage: (content: string) => void;
  confirmAction: (actionId: string) => void;
  cancelAction: (actionId: string) => void;
  reconnect: () => void;
}

export function useNimWebSocket({
  wsUrl,
  onError,
}: UseNimWebSocketOptions): UseNimWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [confirmationRequest, setConfirmationRequest] = useState<ConfirmationRequest | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamingContentRef = useRef<string>('');
  const conversationIdRef = useRef<string | null>(null);

  const send = useCallback((message: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState('connecting');
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionState('connected');

      // Check for existing conversation
      const storedId = localStorage.getItem(STORAGE_KEY);
      if (storedId) {
        conversationIdRef.current = storedId;
        send({ type: 'resume_conversation', conversationId: storedId });
      } else {
        send({ type: 'new_conversation' });
      }
    };

    ws.onmessage = (event) => {
      const message: ServerMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'conversation_started':
          conversationIdRef.current = message.conversationId;
          localStorage.setItem(STORAGE_KEY, message.conversationId);
          break;

        case 'conversation_resumed':
          conversationIdRef.current = message.conversationId;
          localStorage.setItem(STORAGE_KEY, message.conversationId);
          setMessages(message.messages || []);
          break;

        case 'text_chunk':
          setIsStreaming(true);
          streamingContentRef.current += message.content;

          // Update the last assistant message or create one
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant' && !lastMessage.content.endsWith('█')) {
              // Update existing streaming message
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: streamingContentRef.current },
              ];
            } else if (lastMessage?.role === 'assistant') {
              // Continue streaming
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: streamingContentRef.current },
              ];
            } else {
              // Create new assistant message
              return [
                ...prev,
                {
                  id: `msg-${Date.now()}`,
                  role: 'assistant',
                  content: streamingContentRef.current,
                  timestamp: Date.now(),
                },
              ];
            }
          });
          break;

        case 'text':
          setIsStreaming(false);
          streamingContentRef.current = '';

          // Replace streaming message with final content
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: message.content },
              ];
            }
            return [
              ...prev,
              {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: message.content,
                timestamp: Date.now(),
              },
            ];
          });
          break;

        case 'confirm_request':
          setConfirmationRequest({
            actionId: message.actionId,
            tool: message.tool,
            summary: message.summary,
            expiresAt: new Date(message.expiresAt),
          });
          break;

        case 'complete':
          setIsStreaming(false);
          streamingContentRef.current = '';
          setConfirmationRequest(null);
          break;

        case 'error':
          setIsStreaming(false);
          streamingContentRef.current = '';
          onError?.(message.content);

          // Add error as assistant message
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: `Error: ${message.content}`,
              timestamp: Date.now(),
            },
          ]);
          break;
      }
    };

    ws.onerror = () => {
      setConnectionState('error');
      onError?.('WebSocket connection error');
    };

    ws.onclose = () => {
      setConnectionState('disconnected');
      setIsStreaming(false);
    };
  }, [wsUrl, send, onError]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      // Add user message immediately
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to server
      send({ type: 'message', content: content.trim() });
    },
    [send]
  );

  const confirmAction = useCallback(
    (actionId: string) => {
      send({ type: 'confirm', actionId });
      setConfirmationRequest(null);
    },
    [send]
  );

  const cancelAction = useCallback(
    (actionId: string) => {
      send({ type: 'cancel', actionId });
      setConfirmationRequest(null);
    },
    [send]
  );

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    messages,
    isStreaming,
    connectionState,
    confirmationRequest,
    sendMessage,
    confirmAction,
    cancelAction,
    reconnect,
  };
}
