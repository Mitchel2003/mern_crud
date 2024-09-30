import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { SelectFieldProps } from "@/interfaces/form.interface";

const SelectField = ({ name, label, control, options, placeholder }: SelectFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-white">
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