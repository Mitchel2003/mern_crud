import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import { FormField, FormItem, FormControl, FormMessage } from "#/ui/form"
import HeaderCustom from "#/common/elements/HeaderCustom"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { HeaderSpanProps } from "@/interfaces/props.interface"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import React from "react"

// Definimos una interfaz genérica para las opciones
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
}

interface SelectFieldProps<T = string> extends HeaderSpanProps, ThemeContextProps {
  name: string
  label?: string
  options: SelectOption<T>[]
  className?: string
  placeholder?: string
  isSearchable?: boolean
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(({
  theme,
  name,
  label,
  options,
  className,
  placeholder,
  iconSpan,
  span,
  isSearchable
}, ref) => {
  const { control } = useFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
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
              isSearchable={isSearchable}
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
interface SelectWrapperProps<T = string> extends ThemeContextProps {
  value: T
  id: string
  placeholder?: string
  isSearchable?: boolean
  options: SelectOption<T>[]
  onChange: (value: T) => void
}

const SelectWrapper = React.forwardRef<HTMLButtonElement, SelectWrapperProps>(({
  id,
  theme,
  value,
  options,
  placeholder,
  isSearchable,
  onChange
}, ref) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = isSearchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  return (
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
        {isSearchable && (
          <input
            type="text"
            className="p-2 border-b focus:outline-none w-full"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        {filteredOptions.map((option) => (
          <SelectItem
            key={option.value.toString()}
            value={option.value.toString()}
            disabled={option.disabled}
          >
            <span>{option.label}</span>
            {option.description && <span className="text-xs">{option.description}</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

SelectWrapper.displayName = 'SelectWrapper'