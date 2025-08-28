// src/components/ui/Input.tsx
import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const id = React.useId();

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-gray-500 mb-1"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border-none bg-[#F9FAFF] px-2 py-1 text-xs',
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
Input.displayName = 'Input';

export { Input };