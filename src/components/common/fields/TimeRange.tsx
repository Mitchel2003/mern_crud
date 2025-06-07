import { ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { useFormContext, Controller } from 'react-hook-form'
import HeaderCustom from '#/common/elements/HeaderCustom'
import { TimeRangePicker } from '#/ui/time-range-picker'
import { FormItem, FormMessage } from '#/ui/form'
import { cn } from '@/lib/utils'
import React from 'react'

interface TimeRangeProps extends HeaderSpanProps, ThemeContextProps {
  defaultValue?: { start: string; end: string }
  label: string
  name: string
}

const TimeRangeField = React.forwardRef<HTMLInputElement, TimeRangeProps>(({
  iconSpan = 'none',
  defaultValue,
  theme,
  label,
  name,
  span,
}, ref) => {
  const { control } = useFormContext()
  return (
    <FormItem>
      {/* Header label */}
      <HeaderCustom
        to="input"
        span={span}
        title={label}
        theme={theme}
        iconSpan={iconSpan}
        htmlFor={name}
      />
      <div className={cn("time-range-field", { 'dark-mode': theme === 'dark' })}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TimeRangePicker
                ref={ref}
                endTime={value?.end || '23:59'}
                startTime={value?.start || '00:00'}
                onChange={(start, end) => onChange({ start, end })}
              />
              {error && <FormMessage>{error.message}</FormMessage>}
            </>
          )}
        />
      </div>
    </FormItem>
  )
})

export default TimeRangeField