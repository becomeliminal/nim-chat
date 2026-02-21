interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center my-4 px-4">
      <div className="flex-1 h-px bg-nim-beige/30" />
      <span className="mx-4 text-xs font-body text-nim-grey uppercase tracking-[0.6px]">
        {date}
      </span>
      <div className="flex-1 h-px bg-nim-beige/30" />
    </div>
  );
}
