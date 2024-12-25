import { Headquarter, ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { useFormContext, Controller } from 'react-hook-form'
import { LucideIcon, MapPinHouseIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'

import HeaderCustom from '#/common/elements/HeaderCustom'
import { FormMessage, FormItem } from '#/ui/form'
import { MultiSelect } from '#/ui/select-multi'

interface SelectMultiProps extends HeaderSpanProps, ThemeContextProps {
  name: string
  label?: string
  className?: string
  placeholder?: string
  locations?: Headquarter[]
}

const SelectMulti = React.forwardRef<HTMLButtonElement, SelectMultiProps>(({
  placeholder,
  className,
  locations,
  iconSpan,
  theme,
  label,
  name,
  span,
}, ref) => {
  const { control } = useFormContext()

  return (
    <FormItem>
      {/* Header */}
      <HeaderCustom
        to='input'
        theme={theme}
        title={label}
        span={span}
        iconSpan={iconSpan}
        className={className}
        htmlFor={`${name}-select`}
      />

      {/* MultiSelect */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <MultiSelect
              {...field}
              ref={ref}
              maxCount={2}
              theme={theme}
              variant="inverted"
              id={`${name}-select`}
              placeholder={placeholder}
              options={normalize(locations)}
              onValueChange={field.onChange}
            />

            {error && (
              <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                {error.message}
              </FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  )
})

export default SelectMulti
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface Option {
  value: string
  label: string
  icon: LucideIcon
}
const normalize = (locations?: Headquarter[]): Option[] => locations && locations.length > 0
  ? locations.map(e => ({
    value: e._id,
    icon: MapPinHouseIcon,
    label: `${e.client} - ${e.address} - ${e.city}`
  }))
  : []