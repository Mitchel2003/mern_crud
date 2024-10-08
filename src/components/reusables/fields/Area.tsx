import { FormField, FormItem, FormControl } from '#/ui/form'
import { Textarea } from '#/ui/textarea'

import { ControlProps } from '@/interfaces/form.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'

interface AreaFieldProps extends ControlProps, ThemeContextProps {
  name: string;
  placeholder?: string;
}

const AreaField = ({
  theme,
  name,
  control,
  placeholder
}: AreaFieldProps) => {

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
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