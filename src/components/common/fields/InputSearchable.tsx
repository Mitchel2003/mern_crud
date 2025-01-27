import { ThemeContextProps } from "@/interfaces/context.interface"
import { HeaderSpanProps } from "@/interfaces/props.interface"
import { useFormContext, Controller } from "react-hook-form"
import HeaderCustom from "#/common/elements/HeaderCustom"
import { InputSearchable } from "#/ui/input-searchable"
import { FormItem, FormMessage } from "#/ui/form"
import { cn } from "@/lib/utils"
import React from "react"

interface InputSearchableFieldProps extends HeaderSpanProps, ThemeContextProps {
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  name: string
}

const InputSearchableField = React.forwardRef<HTMLInputElement, InputSearchableFieldProps>(({
  iconSpan = 'none',
  placeholder,
  className,
  disabled,
  options,
  theme,
  label,
  name,
  span,
}, ref) => {
  const { control } = useFormContext()

  return (
    <FormItem>
      {/* Header */}
      <HeaderCustom
        to="input"
        span={span}
        title={label}
        theme={theme}
        iconSpan={iconSpan}
        htmlFor={name}
      />

      {/* Input */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <InputSearchable
              {...field}
              ref={ref}
              options={options}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                error && "border-red-500",
                disabled && "opacity-50 cursor-not-allowed",
                className
              )}
            />
            {error && <FormMessage>{error.message}</FormMessage>}
          </>
        )}
      />
    </FormItem>
  )
})

InputSearchableField.displayName = "SearchableInputField"

export default InputSearchableField
