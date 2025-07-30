import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputWithSuffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix: string;
}

const InputWithSuffix = React.forwardRef<HTMLInputElement, InputWithSuffixProps>(
  ({ className, label, suffix, ...props }, ref) => {
    const id = React.useId();

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-gray-500 mb-1"
        >
          {label}
        </label>
        <div 
          className={cn(
            'flex items-center w-full rounded-lg bg-[#F9FAFF]',
            'focus-within:ring-2 focus-within:ring-brand-primary/50', 
            className
          )}
        >
          <input
            id={id}
            className="flex-grow h-10 w-full border-none bg-transparent px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none"
            ref={ref}
            {...props}
          />
          <span className="flex-shrink-0 bg-gray-200/70 text-gray-600 text-xs font-medium px-4 py-2 rounded-md mr-2">
            .{suffix}
          </span>
        </div>
      </div>
    );
  }
);
InputWithSuffix.displayName = 'InputWithSuffix';

export { InputWithSuffix };