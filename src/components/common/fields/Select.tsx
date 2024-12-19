import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import { FormField, FormItem, FormControl, FormMessage } from "#/ui/form"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "#/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "#/ui/popover"
import HeaderCustom from "#/common/elements/HeaderCustom"
import { Check, ChevronsUpDown } from "lucide-react"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { HeaderSpanProps } from "@/interfaces/props.interface"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import React from "react"

export interface SelectOption<T = string> {
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
  isSearchable?: boolean
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
  placeholder,
  isSearchable
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
            {isSearchable ? (
              <SearchableSelect
                {...field}
                ref={ref}
                id={`${name}-select`}
                theme={theme}
                options={options}
                placeholder={placeholder}
              />
            ) : (
              <SimpleSelect
                {...field}
                ref={ref}
                id={`${name}-select`}
                theme={theme}
                options={options}
                placeholder={placeholder}
              />
            )}
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
const SimpleSelect = React.forwardRef<HTMLButtonElement, SelectProps>(({
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
SimpleSelect.displayName = 'SimpleSelect'

// Componente para select buscable usando Combobox pattern
const SearchableSelect = React.forwardRef<HTMLButtonElement, SelectProps>(({
  id,
  theme,
  value,
  options,
  placeholder,
  onChange
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [options, searchTerm])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border px-3",
            "text-sm ring-offset-background focus:outline-none focus:ring-2",
            "focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed",
            "disabled:opacity-50 [&>span]:line-clamp-1",
            theme === "dark"
              ? "bg-zinc-700 border-zinc-600 text-zinc-100 hover:bg-zinc-600"
              : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
          )}
        >
          <span className="flex-1 truncate text-left">
            {options.find(opt => opt.value === value)?.label || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value.toString()}
                value={option.value.toString()}
                disabled={option.disabled}
                onSelect={(currentValue) => {
                  onChange(currentValue as any)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
})
SearchableSelect.displayName = 'SearchableSelect'