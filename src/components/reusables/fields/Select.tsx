import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select";
import { FormField, FormItem, FormControl } from "#/ui/form";

import { ThemeContextProps } from "@/interfaces/context.interface";
import HeaderCustom from "#/reusables/elements/HeaderCustom";
import { ControlProps } from "@/interfaces/form.interface";

interface SelectFieldProps extends ControlProps, ThemeContextProps {
  name: string;
  label?: string;
  options: string[];
  placeholder?: string;
}

const SelectField = ({ name, label, control, options, placeholder, theme }: SelectFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {/* Header label */}
          {label && (
            <HeaderCustom
              theme={theme}
              to='component'
              title={label}
            />
          )}

          {/* Input select customizable */}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={`
                ${theme === 'dark'
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                  : 'bg-white border-gray-300'
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
}

export default SelectField