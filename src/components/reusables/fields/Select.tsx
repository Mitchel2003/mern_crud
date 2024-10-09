import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import { FormField, FormItem, FormControl } from "#/ui/form"

import { ControlProps, HeaderSpanProps } from "@/interfaces/form.interface"
import { ThemeContextProps } from "@/interfaces/context.interface"
import FormHeader from "#/reusables/elements/FormHeader"

interface SelectFieldProps extends ControlProps, ThemeContextProps, HeaderSpanProps {
  name: string;
  label?: string;
  options: string[];
  placeholder?: string;
}

const SelectField = ({
  theme,
  name,
  label,
  control,
  options,
  placeholder,
  span,
  iconSpan
}: SelectFieldProps) => {

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>

          {/* -------------------- Header label -------------------- */}
          <FormHeader
            to="component"
            theme={theme}
            label={label}
            span={span}
            iconSpan={iconSpan}
          />

          {/* -------------------- Input select customizable -------------------- */}
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
          {/* ---------------------------------------------------------------- */}

        </FormItem>
      )}
    />
  )
}

export default SelectField