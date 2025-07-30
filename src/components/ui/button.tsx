import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus:outline-none disabled:pointer-events-none px-4 py-2.5";

  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 disabled:bg-[#F2F2F2] disabled:text-gray-400",
    ghost:
      "bg-transparent hover:bg-brand-primary-light text-brand-text-secondary hover:text-brand-primary disabled:bg-[#F2F2F2] disabled:text-gray-400",
    outline:
      "text-brand-primary bg-transparent hover:bg-brand-primary/10 disabled:bg-[#F2F2F2] disabled:text-gray-400 disabled:border-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}