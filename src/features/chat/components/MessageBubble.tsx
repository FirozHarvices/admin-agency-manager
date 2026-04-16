import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatMessage, ChatAttachment } from '../types';
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, MIME_BY_EXTENSION } from '../constants';

interface MessageBubbleProps {
  message: ChatMessage;
}

function getExtension(path: string) {
  return path.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
}

function isImagePath(path: string) {
  return IMAGE_EXTENSIONS.includes(getExtension(path));
}

function isVideoPath(path: string) {
  return VIDEO_EXTENSIONS.includes(getExtension(path));
}

function isPDFPath(path: string) {
  return getExtension(path) === 'pdf';
}

function getAttachmentUrl(path: string) {
  return `${import.meta.env.VITE_FILE_DOWNLOAD_URL}/${encodeURIComponent(path)}`;
}

function getFileName(path: string) {
  return path.split('/').pop() ?? 'Download';
}

async function openBlobPreview(url: string, filename: string, fileTypeLabel: string) {
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    toast.error(`Pop-up blocked. Please allow pop-ups to preview ${fileTypeLabel}.`);
    return;
  }

  previewWindow.opener = null;
  previewWindow.document.write(
    '<!doctype html><title>Loading preview...</title><body style="font-family: sans-serif; padding: 24px;">Loading preview...</body>'
  );

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch failed');

    const blob = await response.blob();
    const mimeType = MIME_BY_EXTENSION[getExtension(filename)] || blob.type;
    const previewBlob = mimeType && blob.type !== mimeType
      ? new Blob([blob], { type: mimeType })
      : blob;
    const blobUrl = URL.createObjectURL(previewBlob);

    previewWindow.location.href = blobUrl;
  } catch {
    toast.error(`Failed to prepare ${fileTypeLabel} preview. Opening direct link instead...`);
    previewWindow.location.href = url;
  }
}

function ImagePreview({ url, filename, isAdmin }: { url: string; filename: string; isAdmin: boolean }) {
  const [failed, setFailed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    void openBlobPreview(url, filename, 'image');
  };

  if (failed) {
    return (
      <a
        href={url}
        onClick={handleClick}
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
    <a href={url} onClick={handleClick} target="_blank" rel="noopener noreferrer" className="block">
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

  const handleClick = async (e: React.MouseEvent) => {
    // Only intercept for PDFs to force browser preview
    if (!isPDF) return;

    e.preventDefault();
    await openBlobPreview(url, fileName, 'PDF');
  };

  return (
    <a
      href={url}
      onClick={handleClick}
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
