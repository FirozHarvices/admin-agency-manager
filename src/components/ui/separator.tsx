import { cn } from "../../lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

function Separator({ className, ...props }: SeparatorProps) {
  return (
    <div
      className={cn("shrink-0 bg-border h-[1px] w-full", className)}
      {...props}
    />
  )
}

export { Separator }
