import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { IMAGE_EXTENSIONS, ALLOWED_EXTENSIONS } from '../constants';

interface MessageInputProps {
  onSend: (msg: string, files: File[]) => void;
  disabled?: boolean;
  sending?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILE_COUNT = 5;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(file: File) {
  return file.name.split('.').pop()?.toLowerCase() ?? '';
}

function isImageFile(file: File) {
  return IMAGE_EXTENSIONS.includes(getFileExtension(file));
}

function isAllowedFile(file: File) {
  return ALLOWED_EXTENSIONS.includes(getFileExtension(file));
}

export function MessageInput({ onSend, disabled, sending }: MessageInputProps) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed && files.length === 0) return;
    onSend(trimmed, files);
    setText('');
    clearAllFiles();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (selected.length === 0) return;

    const accepted: File[] = [];
    const newPreviews: Record<string, string> = {};

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 10 MB`);
        continue;
      }
      if (!isAllowedFile(file)) {
        toast.error(`${file.name} is not a supported file type`);
        continue;
      }
      // Deduplicate by name+size+lastModified
      const key = fileKey(file);
      if (files.some((f) => fileKey(f) === key)) continue;
      accepted.push(file);
      if (isImageFile(file)) {
        newPreviews[key] = URL.createObjectURL(file);
      }
    }

    if (accepted.length === 0) return;
    const remaining = MAX_FILE_COUNT - files.length;
    if (remaining <= 0) {
      toast.error(`You can attach up to ${MAX_FILE_COUNT} files at a time`);
      return;
    }
    if (accepted.length > remaining) {
      toast.error(`You can attach up to ${MAX_FILE_COUNT} files at a time`);
      accepted.splice(remaining);
    }
    setFiles((prev) => [...prev, ...accepted]);
    setPreviews((prev) => ({ ...prev, ...newPreviews }));
  };

  const removeFile = (index: number) => {
    const file = files[index];
    const key = fileKey(file);
    const url = previews[key];
    if (url) URL.revokeObjectURL(url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllFiles = () => {
    Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews({});
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
      {/* File preview strip */}
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, idx) => {
            const key = fileKey(file);
            const previewUrl = previews[key];
            return (
              <div
                key={key}
                className="flex items-center gap-2 rounded-lg border border-brand-border bg-[#F9FAFF] px-2 py-1.5 max-w-[220px]"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <FileText className="h-7 w-7 text-brand-text-secondary flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-brand-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-brand-text-secondary">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-brand-text-secondary" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={sending}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg text-brand-text-secondary hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

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
          disabled={(!text.trim() && files.length === 0) || sending}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
