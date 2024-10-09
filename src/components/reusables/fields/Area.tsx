import { FormField, FormItem, FormControl } from '#/ui/form'
import { Textarea } from '#/ui/textarea'

import { ControlProps, HeaderSpanProps } from '@/interfaces/form.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'
import FormHeader from '#/reusables/elements/FormHeader'

interface AreaFieldProps extends ControlProps, ThemeContextProps, HeaderSpanProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const AreaField = ({
  theme,
  name,
  label,
  control,
  placeholder,
  iconSpan,
  span
}: AreaFieldProps) => {

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {/* Header */}
          <FormHeader
            to='component'
            theme={theme}
            label={label}
            span={span}
            iconSpan={iconSpan}
          />

          {/* Input text area */}
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