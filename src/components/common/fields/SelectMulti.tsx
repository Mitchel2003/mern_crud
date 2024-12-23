import { Headquarter, ThemeContextProps } from '@/interfaces/context.interface'
import { LucideIcon, MapPinHouseIcon, XCircle } from 'lucide-react'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import React from 'react'

import { FormMessage, FormControl, FormField, FormItem } from '#/ui/form'
import HeaderCustom from '#/common/elements/HeaderCustom'
import { MultiSelect } from '#/ui/select-multi'

interface Option {
  value: string
  label: string
  icon: LucideIcon
}

interface SelectMultiProps extends HeaderSpanProps, ThemeContextProps {
  name: string
  label?: string
  className?: string
  placeholder?: string
  locations?: Headquarter[]
}

const SelectMulti = ({
  placeholder,
  className,
  locations,
  iconSpan,
  theme,
  label,
  span,
  name,
}: SelectMultiProps) => {
  const [selectedFrameworks, setSelectedFrameworks] = React.useState<string[]>([])
  const { control } = useFormContext()

  const clientsOptions = normalize(locations) || [{ label: 'Ningun cliente', value: 'n/a', icon: XCircle }]
  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex flex-col">
          <HeaderCustom
            to='input'
            theme={theme}
            title={label}
            span={span}
            iconSpan={iconSpan}
            className={className}
            htmlFor={`${name}-select`}
          />
          <FormControl>
            <MultiSelect
              {...field}
              maxCount={2}
              theme={theme}
              variant="inverted"
              id={`${name}-select`}
              options={clientsOptions}
              placeholder={placeholder}
              defaultValue={selectedFrameworks}
              onValueChange={setSelectedFrameworks}
            />
          </FormControl>
          {error && (
            <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
              {error.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}

export default SelectMulti
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const normalize = (locations?: Headquarter[]): Option[] | undefined => locations && locations.length > 0
  ? locations.map(e => ({
    value: e._id,
    icon: MapPinHouseIcon,
    label: `${e.client} - ${e.address} - ${e.city}`
  }))
  : undefined