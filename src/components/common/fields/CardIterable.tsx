import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { cloneElement, ReactElement } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Card, CardContent } from '#/ui/card'
import { FormItem } from '#/ui/form'
import { Button } from '#/ui/button'

interface CardFieldProps { name: string, component: ReactElement }
interface CardIterableFieldProps extends ThemeContextProps {
  onSubmit?: (e: React.MouseEvent) => void
  fields: CardFieldProps[]
  titleButton?: string
  disabled?: boolean
  limit?: number
  name: string
}

const CardIterable = ({
  titleButton = 'Agregar',
  limit = 1,
  onSubmit,
  disabled,
  fields,
  theme,
  name,
}: CardIterableFieldProps) => {
  const { control } = useFormContext()
  const { fields: items, append, remove } = useFieldArray({ control, name })

  const handleAppend = () => {
    const initialValue = fields.reduce((acc, field) => {
      const fieldName = field.name.split('.').pop() || field.name
      acc[fieldName] = ''
      return acc
    }, {} as Record<string, any>)
    append(initialValue)
  }

  return (
    <FormItem className="space-y-4">
      {/* Button add card */}
      {items.length < limit && (
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={handleAppend}
          className={cn(
            'flex w-full text-sm h-[5vh]',
            theme === 'dark'
              ? 'bg-zinc-700 border-zinc-600 text-zinc-100 hover:bg-zinc-600'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'
          )}
        >
          {titleButton}
          <PlusCircle className={cn(
            'ml-2 h-4 w-4',
            theme === 'dark' ? 'text-gray-300' : 'text-zinc-600'
          )} />
        </Button>
      )}

      {/* Cards */}
      {items.map((item, index) => (
        <Card
          key={item.id}
          className={cn(
            'relative',
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-700'
              : 'bg-white border-gray-300'
          )}
        >
          {/* Delete button */}
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => remove(index)}
            className={cn(
              'absolute top-2 right-2',
              theme === 'dark'
                ? 'text-zinc-300 hover:text-zinc-100'
                : 'text-gray-800 hover:text-gray-600'
            )}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Form fields */}
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field) => {
                const fieldName = field.name.split('.').pop() || field.name
                return (
                  <Controller
                    control={control}
                    key={`${name}.${index}.${fieldName}`}
                    name={`${name}.${index}.${fieldName}`}
                    render={({ field: formField }) => (
                      <FormItem>
                        {cloneElement(field.component, {
                          theme,
                          ...formField,
                          name: `${name}.${index}.${fieldName}`
                        })}
                      </FormItem>
                    )}
                  />
                )
              })}

              {onSubmit && (
                <Button
                  disabled={disabled}
                  variant="outline"
                  onClick={onSubmit}
                  className="mt-2"
                >
                  Guardar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </FormItem>
  )
}

export default CardIterable