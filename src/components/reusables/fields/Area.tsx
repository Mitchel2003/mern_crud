import { FormField, FormItem, FormControl } from '#/ui/form'
import { Textarea } from '#/ui/textarea'

import HeaderCustom from '#/reusables/elements/HeaderCustom'

import { ControlProps, HeaderSpanProps } from '@/interfaces/form.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'

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
          {/* Header label */}
          {label && (
            <>
              {span ? (
                <HeaderCustom
                  to='component'
                  theme={theme}
                  title={label}
                  span={span}
                  iconSpan={iconSpan}
                />
              ) : (
                <HeaderCustom
                  to='component'
                  theme={theme}
                  title={label}
                />
              )}
            </>
          )}

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