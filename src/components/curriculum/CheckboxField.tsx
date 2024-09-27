import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Checkbox } from "#/ui/checkbox";

import { CheckboxFieldProps } from "@/interfaces/form.interface";

const CheckboxField = ({ name, label, control, options }: CheckboxFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option}`}
                    checked={field.value?.includes(option)}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value ?? []), option]
                        : field.value?.filter((value: string) => value !== option) ?? [];
                      field.onChange(updatedValue);
                    }}
                  />
                  <label
                    htmlFor={`${name}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default CheckboxField