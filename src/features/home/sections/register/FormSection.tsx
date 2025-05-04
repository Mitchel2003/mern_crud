import { SelectMultiOptionProps } from '@/interfaces/props.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'
import SelectMulti from '#/common/fields/SelectMulti'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'
import { CardContent } from '#/ui/card'
import { Button } from '#/ui/button'

import { LogIn, Lock, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface FormSectionProps extends ThemeContextProps {
  options: SelectMultiOptionProps[]
}

const FormSection = ({ theme, options }: FormSectionProps) => {
  const navigate = useNavigate()

  return (
    <CardContent className="space-y-6">
      <InputField
        name="username"
        label="Nombre de usuario"
        placeholder="Nombre de usuario"
        theme={theme}
      />
      <InputField
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="@example.com"
        icon={LogIn}
        theme={theme}
      />
      <InputField
        name="password"
        type="password"
        label="Contraseña"
        icon={Lock}
        theme={theme}
      />
      <SelectField
        name='role'
        theme={theme}
        label='Rol del usuario'
        placeholder='Seleccionar rol'
        options={[
          { label: 'Colaborador', value: 'collaborator' },
          { label: 'Administrador', value: 'admin' },
          { label: 'Cliente', value: 'client' }
        ]}
      />
      <SelectMulti
        theme={theme}
        label='Sedes'
        iconSpan='warn'
        options={options}
        name='headquarters'
        placeholder="Selecciona las sedes"
        span='Aqui seleccionas tus sedes asociadas'
      />

      {/* -------------------- Submit -------------------- */}
      <Button
        type="submit"
        className={cn(
          'text-white w-full',
          'transform hover:scale-105',
          theme === 'dark'
            ? 'bg-purple-600 hover:bg-purple-700'
            : 'bg-purple-800 hover:bg-purple-900'
        )}
      >
        Registrar cuenta
        <UserPlus className="ml-2 h-4 w-4" />
      </Button>

      {/* -------------------- go to login -------------------- */}
      <Button
        type="button"
        onClick={() => navigate('/auth/login')}
        className={cn(
          'text-white w-full',
          'transform hover:scale-105',
          theme === 'dark'
            ? 'bg-purple-800 hover:bg-purple-900'
            : 'bg-purple-400 hover:bg-purple-500'
        )}
      >
        Ya tengo una cuenta <LogIn className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  )
}

export default FormSection