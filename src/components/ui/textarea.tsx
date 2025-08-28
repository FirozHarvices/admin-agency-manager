import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    const id = React.useId();

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-gray-500 mb-1"
        >
          {label}
        </label>
        <textarea
          id={id}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border-none bg-[#F9FAFF] px-3 py-2 text-xs  ',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };