import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Input } from "#/ui/input";

import { FieldProps } from "@/interfaces/form.interface";

const Field = ({ name, label, control, type = "text", placeholder }: FieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type} placeholder={placeholder} className="bg-white" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default Field