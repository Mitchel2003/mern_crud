import { FormField, FormItem, FormControl } from '#/ui/form'
import HeaderText from '#/curriculum/reusables/HeaderText'
import { Checkbox } from '#/ui/checkbox'

import { CheckboxFieldProps } from '@/interfaces/form.interface'

/**
 * Its a component that receive a list of options and display a checkbox for each option.
 * It can be used as a component multiple selection.
 * @param {CheckboxFieldProps} props - The properties of the component.
 * @param {string} props.label - To define the text of the field and properties like name, control and options for example.
 * @param {Control<any>} props.control - To use the form control in the field.
 * @param {string[]} props.options - Contains the list of options to display on differents checkboxes.
 * @param {boolean} props.isMultiple - Helps us to know if the field is a multiple selection, by default is false.
 */
const CheckboxField = ({ label, control, options, isMultiple = false }: CheckboxFieldProps) => {
  // Convert the label to a name (replace spaces with underscores)
  const name = label.toLowerCase().replace(/ /g, '_');

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>

          {/* Header of component */}
          {isMultiple ? (
            <HeaderText
              icon="info"
              to="component"
              title={label}
              description="Seleccion multiple"
            />
          ) : (
            <HeaderText
              to="component"
              title={label}
            />
          )}

          {/* Checkbox list */}
          <FormControl>
            <div className="flex flex-wrap gap-6">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option}`}
                    checked={field.value?.includes(option)}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? (isMultiple ? [...(field.value ?? []), option] : [option])
                        : field.value?.filter((value: string) => value !== option) ?? [];
                      field.onChange(updatedValue);
                    }}
                  />
                  <label
                    htmlFor={`${name}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </FormControl>

        </FormItem>
      )}
    />
  )
}

export default CheckboxField