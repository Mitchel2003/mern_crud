import { FormField, FormItem, FormLabel, FormControl } from '#/ui/form'
import { Textarea } from '#/ui/textarea'

import { AreaFieldProps } from '@/interfaces/form.interface'

const AreaField = ({ name, label, control, placeholder }: AreaFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="bg-white min-h-[100px]"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default AreaField