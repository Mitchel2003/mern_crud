import { FormField, FormItem, FormLabel, FormControl } from '#/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '#/ui/popover'
import { Calendar } from '#/ui/calendar'
import { Button } from '#/ui/button'

import { ControlProps } from '@/interfaces/form.interface'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface DateFieldProps extends ControlProps {
  name: string;
  label: string;
  placeholder?: string;
}

const DateField = ({ name, label, control, placeholder }: DateFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            {/* trigger calendar */}
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={`w-full pl-3 text-left font-normal
                    ${!field.value && 'text-muted-foreground'}
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
        </FormItem>
      )}
    />
  )
}

export default DateField