import { HeaderSpanProps, SelectOptionProps } from "@/interfaces/props.interface"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useFormContext, Controller } from "react-hook-form"
import { cn } from "@/lib/utils"
import React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import HeaderCustom from "#/common/elements/HeaderCustom"
import { FormItem, FormMessage } from "#/ui/form"
import { Input } from "#/ui/input"

interface SelectFieldProps<T = string> extends HeaderSpanProps, ThemeContextProps {
  options: SelectOptionProps<T>[]
  placeholder?: string
  className?: string
  disabled?: boolean
  readOnly?: boolean
  label?: string
  value?: string
  name: string
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(({
  placeholder,
  className,
  readOnly,
  iconSpan,
  options,
  disabled,
  theme,
  value,
  label,
  name,
  span,
}, ref) => {
  const { control } = useFormContext()

  return (
    <FormItem>
      {/* Header */}
      <HeaderCustom
        to='input'
        theme={theme}
        title={label}
        span={span}
        iconSpan={iconSpan}
        className={className}
        htmlFor={`${name}-select`}
      />

      {/* Select */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            {readOnly ? (
              <Input
                readOnly
                ref={ref as any}
                id={`${name}-select`}
                value={value || options.find(opt => opt.value === field.value)?.label || ''}
                className={cn(
                  'w-full',
                  theme === 'dark'
                    ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                )}
              />
            ) : (
              <SelectWrapper
                {...field}
                ref={ref}
                theme={theme}
                options={options}
                disabled={disabled}
                id={`${name}-select`}
                placeholder={placeholder}
              />
            )}

            {error && (
              <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                {error.message}
              </FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  )
})

SelectField.displayName = 'SelectField'

export default SelectField
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface SelectProps<T = string> extends ThemeContextProps {
  options: SelectOptionProps<T>[]
  onChange: (value: T) => void
  isSearchable?: boolean
  placeholder?: string
  disabled?: boolean
  id: string
  value: T
}

const SelectWrapper = React.forwardRef<HTMLButtonElement, SelectProps>(({
  disabled,
  options,
  onChange,
  theme,
  value,
  id,
  placeholder,
}, ref) => (
  <Select onValueChange={onChange} value={value?.toString()} disabled={disabled}>
    <SelectTrigger
      id={id}
      ref={ref}
      disabled={disabled}
      className={cn(
        "flex h-9 w-full items-center justify-between",
        disabled && "opacity-50 cursor-not-allowed",
        theme === "dark"
          ? "bg-zinc-700 border-zinc-600 text-zinc-100 hover:bg-zinc-600"
          : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
      )}
    >
      <SelectValue placeholder={placeholder}>
        {options.find(opt => opt.value === value)?.label || placeholder}
      </SelectValue>
    </SelectTrigger>

    {/* Content */}
    <SelectContent>
      {options.map((option) => (
        <SelectItem
          key={option.value.toString()}
          value={option.value.toString()}
          disabled={option.disabled}
        >
          <div className="flex flex-col">
            <span>{option.label}</span>
            {option.description && <span className="text-xs">{option.description}</span>}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
))
SelectWrapper.displayName = 'SelectWrapper'