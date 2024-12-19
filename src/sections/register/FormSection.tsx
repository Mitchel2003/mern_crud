import { LoginComponentsProps } from '@/interfaces/props.interface'
import { Headquarter } from '@/interfaces/context.interface'
import SelectField from '#/common/fields/Select'
import InputField from '#/common/fields/Input'
import { CardContent } from '#/ui/card'
import { Button } from '#/ui/button'

import { LogIn, Lock, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface FormSectionProps extends LoginComponentsProps {
  locations?: Headquarter[]
}

const FormSection = ({ theme, locations }: FormSectionProps) => {
  const navigate = useNavigate()

  const clientsOptions = locations && locations.length > 0
    ? locations.map(e => ({ value: e._id, label: `${e.client} - ${e.address} - ${e.city}` }))
    : [
      { label: 'No hay clientes', value: 'n/a' },
      { label: 'ejemplo1', value: 'n/a' },
      { label: 'ejemplo2', value: 'n/a' },
      { label: 'ejemplo3', value: 'n/a' },
      { label: 'ejemplo4', value: 'n/a' },
      { label: 'ejemplo5', value: 'n/a' },
    ]

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
          { label: 'Administrador', value: 'admin' },
          { label: 'Ingeniero', value: 'engineer' },
          { label: 'Médico', value: 'medical' }
        ]}
      />
      <SelectField
        name='clients'
        theme={theme}
        label='Cliente(s)'
        options={clientsOptions}
        placeholder='Selecciona al menos un cliente'
        isSearchable
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