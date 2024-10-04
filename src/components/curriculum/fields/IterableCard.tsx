import { FormItem, FormControl } from '#/ui/form'
import { Card, CardContent } from '#/ui/card'
import { Button } from '#/ui/button'

import { CardFieldProps, ControlProps } from '@/interfaces/form.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useFieldArray } from 'react-hook-form'
import { PlusCircle, X } from 'lucide-react'
import React from 'react'

interface IterableCardFieldProps extends ThemeContextProps, ControlProps {
  name: string;
  fields: CardFieldProps[];
  titleButton?: string;
  limit?: number;
}

const IterableCard = ({
  theme,
  name,
  fields,
  control,
  limit = 1,
  titleButton = 'Agregar'
}: IterableCardFieldProps) => {

  const { fields: items, append, remove } = useFieldArray({ control, name })

  const handleAppend = () => {
    const initialValue = {} as Record<string, string>
    const newItem = fields.reduce((acc, field) => { acc[field.name] = ''; return acc }, initialValue)
    append(newItem)
  }
  return (
    <>
      {/* Button add card */}
      {items.length !== limit && (
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={handleAppend}
          className={`flex text-sm h-[5vh]
            ${theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-300'
            }`}
        >
          {titleButton}
          <PlusCircle className={`ml-2 h-auto w-auto md:h-[3vh] md:w-[3vw]
            ${theme === 'dark'
              ? 'text-gray-500'
              : 'text-gray-700'
            }`} />
        </Button>
      )}

      {/* Card */}
      {items.map((item, index) => (
        <Card key={item.id} className={`relative
          ${theme === 'dark'
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-white border-gray-300'
          }`}>

          {/* Button delete card */}
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => remove(index)}
            className={`absolute top-2 right-2
              ${theme === 'dark'
                ? 'text-zinc-300'
                : 'text-gray-800'
              }`}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Component input */}
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-2">
              {fields.map((field, index) => (
                <FormItem key={`${name}-${index}`}>
                  <FormControl>
                    {React.cloneElement(field.component)}
                  </FormControl>
                </FormItem>
              ))}
            </div>
          </CardContent>

        </Card>
      ))}
    </>
  )
}

export default IterableCard