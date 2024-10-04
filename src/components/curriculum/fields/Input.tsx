import { ThemeContextProps } from '@/interfaces/context.interface';
import { ControlProps } from '@/interfaces/form.interface'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'
import { useState } from 'react';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '#/ui/form'
import { Input } from '#/ui/input'

interface InputFieldProps extends ControlProps, ThemeContextProps {
  name: string;
  label: string;
  icon?: LucideIcon;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
}

/**
 * Allow us use a input field type generic, represent a basic input, with a label and placeholder optional.
 * This is a component reusable 
 * @param {InputFieldProps} props - The properties of the component
 * @param {string} props.name - Its to define the property name of the FormField
 * @param {string} props.theme - Correspond to the theme in context; could be "light" or "dark"
 * @param {string} props.label - Its a label according to the input
 * @param {Control<any>} props.control - Represent the useForm controller
 * @param {string} props.icon - Contain an Icon to use in the input field
 * @param {string} props.placeholder - Represent the placeholder
 * @param {string} props.type - Helps us to define the type of input
 * @returns 
 */
const InputField = ({
  name,
  theme,
  label,
  control,
  icon: Icon,
  placeholder,
  type = "text"
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {/* Title of input */}
          <FormLabel className={`${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-800'}`}>
            {label}
          </FormLabel>

          {/* Field component */}
          <FormControl>
            <div className='relative'>
              {/* Input with type mutable */}
              <Input
                type={showPassword ? 'text' : type}
                placeholder={placeholder}
                className={`${(type === 'email' || type === 'password') && 'pl-10'}
                  ${theme === 'dark'
                    ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
                    : 'bg-white hover:shadow-purple-500/60'
                  }`}
                {...field}
              />

              {/* Icon decorative (side left) */}
              {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              )}

              {/* Toggle to input type password (especific case) */}
              {type === 'password' && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <EyeOff className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'}`} aria-hidden="true" />
                    : <Eye className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'}`} aria-hidden="true" />
                  }
                </button>
              )}
            </div>
          </FormControl>

          {/* render error */}
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  )
}

export default InputField