import ReactMarkdown from 'react-markdown';

interface StreamingMessageProps {
  content: string;
}

export function StreamingMessage({ content }: StreamingMessageProps) {
  return (
    <div className="nim-message-enter px-4">
      <div className="flex items-end">
        <div className="flex-1 nim-message-content font-display text-base leading-normal text-nim-black">
          {content ? (
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
              {content}
            </ReactMarkdown>
          ) : (
            <span>{'\u00A0'}</span>
          )}
        </div>
        <span className="nim-streaming-cursor inline-block w-0.5 h-4 bg-nim-orange rounded-[1px] ml-0.5 mb-0.5 flex-shrink-0" />
      </div>
    </div>
  );
}
