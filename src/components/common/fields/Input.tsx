import HeaderCustom from "#/common/elements/HeaderCustom"
import { FormItem, FormMessage } from '#/ui/form'
import { Input } from '#/ui/input'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { HeaderSpanProps } from '@/interfaces/props.interface'
import { useFormContext, Controller } from 'react-hook-form'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export type InputType = 'text' | 'number' | 'email' | 'password'

interface InputFieldProps extends HeaderSpanProps, ThemeContextProps {
  autoComplete?: boolean
  placeholder?: string
  readOnly?: boolean
  icon?: LucideIcon
  hidden?: boolean
  type?: InputType
  value?: string
  label: string
  name: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({
  autoComplete = true,
  iconSpan = 'none',
  type = "text",
  placeholder,
  icon: Icon,
  readOnly,
  hidden,
  value,
  theme,
  label,
  name,
  span,
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const { control, setValue } = useFormContext()
  useEffect(() => { readOnly && setValue(name, value) }, [readOnly, value])
  return (
    <FormItem hidden={hidden}>
      {/* Header label */}
      <HeaderCustom
        to="input"
        theme={theme}
        title={label}
        span={span}
        iconSpan={iconSpan}
        htmlFor={`${name}-input`}
      />

      {/* Input customizable */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            {readOnly ? (
              <Input
                readOnly
                ref={ref}
                id={`${name}-input`}
                placeholder={placeholder}
                value={value || field.value || ''}
                className={cn('w-full', theme === 'dark'
                  ? 'bg-zinc-700/50 border-zinc-500 text-zinc-300'
                  : 'bg-gray-200/50 border-gray-300 text-gray-500'
                )}
              />
            ) : (
              <div className='relative'>
                <Input
                  {...field}
                  ref={ref}
                  id={`${name}-input`}
                  placeholder={placeholder}
                  type={showPassword ? 'text' : type}
                  autoComplete={autoComplete ? 'on' : 'off'}
                  className={cn((type === 'email' || type === 'password') && 'pl-10',
                    theme === 'dark'
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 hover:bg-zinc-600'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                />

                {/* Main icon */}
                {Icon && <LeadingIcon Icon={Icon} />}

                {/* Button toggle visibility password */}
                {type === 'password' && (
                  <PasswordToggle
                    theme={theme}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            )}

            {error && (
              <FormMessage className={cn(theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                {error.message}
              </FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  )
})

InputField.displayName = 'InputField'

export default InputField
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const LeadingIcon = ({ Icon }: { Icon: LucideIcon }) => (
  <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
)

interface PasswordToggleProps extends ThemeContextProps { showPassword: boolean, onToggle: () => void }
const PasswordToggle = ({ theme, showPassword, onToggle }: PasswordToggleProps) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute inset-y-0 right-0 pr-3 flex items-center"
  >
    {showPassword ? (
      <EyeOff className={cn('h-5 w-5',
        theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'
      )} />
    ) : (
      <Eye className={cn('h-5 w-5',
        theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'
      )} />
    )}
  </button>
)