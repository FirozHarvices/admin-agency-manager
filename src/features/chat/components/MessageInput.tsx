import { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (disabled) {
    return (
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center">
        <p className="text-xs text-gray-400">This ticket is closed</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-gray-200">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-brand-border bg-[#F9FAFF] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
