import * as React from "react"
import { cn } from "@/lib/utils"

export interface Option {
  value: string
  label: string
}

interface InputSearchableProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: Option[]
  onValueChange?: (value: string) => void
  className?: string
}

const InputSearchable = React.forwardRef<HTMLInputElement, InputSearchableProps>(
  ({ className, options, onValueChange, onChange, ...props }, ref) => {
    const id = React.useId()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

    return (
      <div className="relative w-full">
        <input
          {...props}
          ref={ref}
          list={id}
          onChange={handleChange}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
        <datalist id={id}>
          {options.map((option) => (
            <option key={option.value} value={option.label} />
          ))}
        </datalist>
      </div>
    )
  }
)

InputSearchable.displayName = "InputSearchable"

export { InputSearchable }
