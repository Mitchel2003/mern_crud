import { FormItem, FormLabel, FormControl } from '#/ui/form'
import { Card, CardContent } from '#/ui/card'
import { Button } from '#/ui/button'

import { IterableCardFieldProps } from '@/interfaces/form.interface'
import { useFieldArray } from 'react-hook-form'
import { PlusCircle, X } from 'lucide-react'
import React from 'react'

const IterableCard = ({ name, control, fields, titleButton, limit }: IterableCardFieldProps) => {
  const { fields: items, append, remove } = useFieldArray({ control, name })

  const handleAppend = () => {
    const initialValue = {} as Record<string, string>
    const newItem = fields.reduce((acc, field) => { acc[field.name] = ''; return acc }, initialValue)
    append(newItem)
  }
  return (
    <>
      {items.length !== (limit ?? 1) && (
        <Button
          size="sm"
          type="button"
          variant="outline"
          className='flex text-sm h-[5vh]'
          onClick={handleAppend}
        >
          {titleButton ?? "Agregar"}
          <PlusCircle className='ml-2 h-auto w-auto md:h-[3vh] md:w-[3vw]' />
        </Button>
      )}

      {items.map((item, index) => (
        <Card key={item.id} className="bg-white relative">
          <Button
            size="sm"
            type="button"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-2">
              {fields.map((field) => (
                <FormItem key={field.name}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {React.cloneElement(field.component, {
                      name: `${name}.${index}.${field.name}`,
                      placeholder: field.placeholder,
                    })}
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