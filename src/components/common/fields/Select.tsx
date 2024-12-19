import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import { FormField, FormItem, FormControl, FormMessage } from "#/ui/form"
import HeaderCustom from "#/common/elements/HeaderCustom"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { HeaderSpanProps } from "@/interfaces/props.interface"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import React from "react"

interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
}

interface SelectFieldProps<T = string> extends HeaderSpanProps, ThemeContextProps {
  name: string
  label?: string
  className?: string
  placeholder?: string
  options: SelectOption<T>[]
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
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex flex-col">
          <HeaderCustom
            to='input'
            theme={theme}
            title={label}
            span={span}
            iconSpan={iconSpan}
            className={className}
            htmlFor={`${name}-select`}
          />
          <FormControl>
            <SelectWrapper
              {...field}
              ref={ref}
              id={`${name}-select`}
              theme={theme}
              options={options}
              placeholder={placeholder}
            />
          </FormControl>
          {error && (
            <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
              {error.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
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
  options: SelectOption<T>[]
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