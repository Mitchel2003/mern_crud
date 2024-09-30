import { FormItem, FormLabel, FormControl } from "#/ui/form";
import { Card, CardContent } from "#/ui/card";
import { Button } from "#/ui/button";

import { IterableCardCustomProps } from '@/interfaces/form.interface';
import { useFieldArray } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';
import React from 'react';

const IterableCardCustom = ({ name, title, fields, addButtonText, control }: IterableCardCustomProps) => {
  const { fields: items, append, remove } = useFieldArray({ control, name })

  const handleAppend = () => {
    const initialValue = {} as Record<string, string>
    const newItem = fields.reduce((acc, field) => { acc[field.name] = ''; return acc }, initialValue)
    append(newItem)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-medium">{title}</h3>
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={handleAppend}
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        {addButtonText}
      </Button>

      {items.map((item, index) => (
        <Card key={item.id} className="bg-white relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div>
  )
}

export default IterableCardCustom