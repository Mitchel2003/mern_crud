import { FormField, FormItem, FormLabel, FormControl } from '#/ui/form'
import { Textarea } from '#/ui/textarea'

import { ThemeContextProps } from '@/interfaces/context.interface';
import { ControlProps } from '@/interfaces/form.interface'

interface AreaFieldProps extends ControlProps, ThemeContextProps {
  name: string;
  label: string;
  placeholder?: string;
}

const AreaField = ({ name, label, control, placeholder, theme }: AreaFieldProps) => {
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
              className={`min-h-[100px]
                ${theme === 'dark'
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                  : 'bg-white border-gray-300'
                }`}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default AreaField