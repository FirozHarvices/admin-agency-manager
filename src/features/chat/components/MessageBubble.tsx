import { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg'];

function isImagePath(path: string) {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTENSIONS.includes(ext);
}

function isVideoPath(path: string) {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.includes(ext);
}

function isPDFPath(path: string) {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return ext === 'pdf';
}

function getAttachmentUrl(path: string) {
  return `${import.meta.env.VITE_FILE_DOWNLOAD_URL}/${encodeURIComponent(path)}`;
}

function getFileName(path: string) {
  return path.split('/').pop() ?? 'Download';
}

function ImagePreview({ url, filename, isAdmin }: { url: string; filename: string; isAdmin: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-1 text-xs underline ${
          isAdmin ? 'text-white/80' : 'text-brand-primary'
        }`}
      >
        <Paperclip className="h-3 w-3" />
        {filename}
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <img
        src={url}
        alt={filename}
        onError={() => setFailed(true)}
        className="max-w-full max-h-48 rounded-lg object-cover cursor-pointer"
      />
    </a>
  );
}

function VideoPreview({ url }: { url: string }) {
  return (
    <div className="max-w-full rounded-lg overflow-hidden bg-black/5">
      <video
        src={url}
        controls
        className="max-w-full max-h-48 mx-auto"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function AttachmentView({ attachment, isAdmin }: { attachment: ChatAttachment; isAdmin: boolean }) {
  const path = attachment.attachment_path;
  if (!path) return null;

  const url = getAttachmentUrl(path);
  const isImage = isImagePath(path);
  const isVideo = isVideoPath(path);
  const isPDF = isPDFPath(path);

  if (isImage) {
    return <ImagePreview url={url} filename={getFileName(path)} isAdmin={isAdmin} />;
  }

  if (isVideo) {
    return <VideoPreview url={url} />;
  }

  const fileName = getFileName(path);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
        isAdmin
          ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          : 'bg-white border-gray-200 text-brand-primary hover:bg-gray-50'
      }`}
      title={isPDF ? 'Preview PDF' : 'Download file'}
    >
      <Paperclip className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate max-w-[180px]">{fileName}</span>
      {isPDF && <span className="text-[10px] opacity-70 ml-auto pl-2">(Preview)</span>}
    </a>
  );
}


export function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.sender_type === 'ADMIN';

  const createdAt = message.created_at.endsWith('Z')
    ? message.created_at
    : message.created_at + 'Z';
  const time = new Date(createdAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const attachments = Array.isArray(message.attachments) ? message.attachments : [];

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 ${
          isAdmin
            ? 'bg-brand-primary text-white rounded-br-sm'
            : 'bg-gray-100 text-brand-text-primary rounded-bl-sm'
        }`}
      >
        {message.msg && message.msg.trim() && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.msg}</p>
        )}

        {attachments && attachments.length > 0 && (
          <div className="mt-1 space-y-1">
            {attachments.map((att) => (
              <AttachmentView key={att.id || att.attachment_path} attachment={att} isAdmin={isAdmin} />
            ))}
          </div>
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
