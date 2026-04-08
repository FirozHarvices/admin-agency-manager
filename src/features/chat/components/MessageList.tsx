import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr.endsWith('Z') ? dateStr : dateStr + 'Z');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Group messages by date
  const grouped: { label: string; messages: ChatMessage[] }[] = [];
  let currentLabel = '';

  for (const msg of messages) {
    const label = formatDateLabel(msg.created_at);
    if (label !== currentLabel) {
      currentLabel = label;
      grouped.push({ label, messages: [msg] });
    } else {
      grouped[grouped.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
      {grouped.map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-[10px] text-gray-400 font-medium">{group.label}</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="space-y-2">
            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
