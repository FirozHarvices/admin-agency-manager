import { Paperclip } from 'lucide-react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.sender_type === 'ADMIN';

  const time = new Date(message.created_at).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleAttachmentClick = () => {
    if (!message.attachment) return;
    const url = `${import.meta.env.VITE_FILE_DOWNLOAD_URL}/${message.attachment}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 ${
          isAdmin
            ? 'bg-brand-primary text-white rounded-br-sm'
            : 'bg-gray-100 text-brand-text-primary rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.msg}</p>

        {message.attachment && (
          <button
            onClick={handleAttachmentClick}
            className={`mt-1 flex items-center gap-1 text-xs underline ${
              isAdmin ? 'text-white/80' : 'text-brand-primary'
            }`}
          >
            <Paperclip className="h-3 w-3" />
            {message.attachment}
          </button>
        )}

        <p
          className={`text-[10px] mt-1 ${
            isAdmin ? 'text-white/60' : 'text-gray-400'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
