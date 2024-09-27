import { FormItem, FormLabel, FormControl } from "#/ui/form"
import { Card, CardContent } from "#/ui/card"
import { Button } from "#/ui/button"
import { Input } from "#/ui/input"

import { useFieldArray, useFormContext, Controller } from "react-hook-form"
import { IterableCardFieldProps } from "@/interfaces/form.interface"
import { PlusCircle, X } from "lucide-react"

/**
 * Componente para renderizar un campo iterable de cards,
 * cada card representa un elemento del array (item from useFieldArray)
 * y se renderiza un componente de card por cada elemento del array
 * @param {IterableCardFieldProps} props - Las propiedades del componente
 * @param {string} props.name - El nombre del campo iterable
 * @param {string} props.title - El título de la card
 * @param {FieldFormat[]} props.fields - Los campos que se renderizarán en cada card
 * @param {string} props.addButtonText - El texto del botón de agregar
 */
const IterableCardField = ({ name, title, fields, addButtonText }: IterableCardFieldProps) => {
  /**
   * @description usamos useFormContext en vez de useController porque manipulamos
   * varios elementos en este componente de cards iterables, en vez de usar uno solo
   * conn una logica mas compleja, como la de ImageField.tsx
   */
  const { control } = useFormContext()

  const { fields: items, append, remove } = useFieldArray({ control, name })

  /**
   * @const {newItem} - Este termina siendo el nuevo elemento que se agrega al array.
   * @example const newItem = {name: '', type: '', series: '', model: ''}
   * @description El funcionamiento de reduce es el siguiente:
   * - Se toma el valor inicial y se le aplica la función a cada elemento del array
   * - En este caso, el acumulador (acc) es un objeto que acumula los campos con valores vacíos
   * - El segundo parametro (field) es el campo que se esta iterando, al final se le aplica la función a cada elemento del array
   */
  const handleAppend = () => {
    const initialValue = {} as Record<string, string>
    const newItem = fields.reduce((acc, field) => { acc[field.name] = ''; return acc }, initialValue)
    append(newItem)
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="mt-2"
          onClick={handleAppend}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      </div>

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
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <Controller
                  key={field.name}
                  control={control}
                  name={`${name}.${index}.${field.name}`}
                  render={({ field: controllerField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={field.placeholder} {...controllerField} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default IterableCardField