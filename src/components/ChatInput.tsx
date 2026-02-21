import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 120;

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Message Nim...',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  const resetHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = `${MIN_HEIGHT}px`;
    const scrollHeight = el.scrollHeight;
    el.style.height = `${Math.min(scrollHeight, MAX_HEIGHT)}px`;
  }, []);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_HEIGHT}px`;
      }
    });
  }, [canSend, value, onSend]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    resetHeight();
  }, [value, resetHeight]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div
        className={`
          flex-1 flex items-center
          rounded-3xl
          bg-nim-cream
          border transition-colors duration-200
          ${isFocused ? 'border-nim-beige/50' : 'border-transparent'}
          ${disabled ? 'opacity-60' : ''}
        `}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent px-4 py-3 text-nim-black placeholder-nim-grey font-display text-base outline-none"
          style={{
            minHeight: `${MIN_HEIGHT}px`,
            maxHeight: `${MAX_HEIGHT}px`,
          }}
          aria-label="Message input"
        />

        <div className="pr-1.5">
          <button
            type="submit"
            disabled={!canSend}
            className={`
              w-[34px] h-[34px] rounded-full
              bg-nim-orange text-white
              flex items-center justify-center
              transition-all duration-200
              ${canSend ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            `}
            aria-label="Send message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
