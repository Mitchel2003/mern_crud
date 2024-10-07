import { Popover, PopoverContent, PopoverTrigger } from '#/ui/popover'
import { FormField, FormItem, FormControl } from '#/ui/form'
import { Calendar } from '#/ui/calendar'
import { Button } from '#/ui/button'

import { ThemeContextProps } from '@/interfaces/context.interface'
import HeaderCustom from '#/reusables/elements/HeaderCustom'
import { ControlProps } from '@/interfaces/form.interface'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface DateFieldProps extends ControlProps, ThemeContextProps {
  name: string;
  label: string;
  placeholder?: string;
}

const DateField = ({ name, label, control, placeholder, theme }: DateFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>

          <HeaderCustom
            theme={theme}
            to='component'
            title={label}
          />

          <Popover>
            {/* trigger calendar */}
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={`w-full pl-3 font-normal
                    ${!field.value && 'text-muted-foreground'}
                    ${theme === 'dark'
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 hover:bg-zinc-600'
                      : 'bg-white border-gray-300 hover:bg-white'
                    }
                  `}
                >
                  {field.value
                    ? (format(field.value, "PPP"))
                    : (<span>{placeholder}</span>)
                  }
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            {/* calendar */}
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem >
      )}
    />
  )
}

export default DateField