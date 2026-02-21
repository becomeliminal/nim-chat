interface ChatEmptyStateProps {
  onSuggestionPress: (text: string) => void;
}

const SUGGESTIONS = [
  "What's my balance?",
  "Send money to a friend",
  "Show recent transactions",
];

export function ChatEmptyState({ onSuggestionPress }: ChatEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <h1 className="nim-empty-title font-display text-[28px] font-bold text-nim-black">
        Nim
      </h1>
      <p className="nim-empty-subtitle font-display text-base text-nim-grey mt-1">
        Your AI financial manager
      </p>

      <div className="w-10 h-px bg-nim-beige/30 my-6" />

      <p className="text-xs font-body text-nim-grey tracking-[0.6px] uppercase mb-2">
        TRY ASKING
      </p>

      <div className="flex flex-col items-center gap-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestionPress(text)}
            className="nim-chip-enter px-4 py-2 rounded-2xl bg-nim-cream font-display text-sm text-nim-black hover:bg-nim-cream/70 transition-colors"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
