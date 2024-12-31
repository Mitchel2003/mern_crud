import { HeaderSpanProps, SelectOptionProps } from "@/interfaces/props.interface"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useFormContext, Controller } from "react-hook-form"
import { cn } from "@/lib/utils"
import React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import HeaderCustom from "#/common/elements/HeaderCustom"
import { FormItem, FormMessage } from "#/ui/form"

interface SelectFieldProps<T = string> extends HeaderSpanProps, ThemeContextProps {
  name: string
  label?: string
  className?: string
  placeholder?: string
  options: SelectOptionProps<T>[]
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(({
  theme,
  span,
  name,
  label,
  options,
  iconSpan,
  className,
  placeholder
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
            <SelectWrapper
              {...field}
              ref={ref}
              id={`${name}-select`}
              theme={theme}
              options={options}
              placeholder={placeholder}
            />

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
  value: T
  id: string
  placeholder?: string
  isSearchable?: boolean
  options: SelectOptionProps<T>[]
  onChange: (value: T) => void
}

// Componente para select simple
const SelectWrapper = React.forwardRef<HTMLButtonElement, SelectProps>(({
  id,
  theme,
  value,
  options,
  placeholder,
  onChange
}, ref) => (
  <Select onValueChange={onChange} value={value?.toString()}>
    {/* Trigger */}
    <SelectTrigger
      id={id}
      ref={ref}
      className={cn(
        "flex h-9 w-full items-center justify-between",
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