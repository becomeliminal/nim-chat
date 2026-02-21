import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="nim-message-enter flex justify-end">
        <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-nim-orange text-white font-display text-base leading-normal">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nim-message-enter px-4">
      <div className="nim-message-content font-display text-base leading-normal text-nim-black">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
