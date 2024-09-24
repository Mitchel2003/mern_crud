import { EngineerReferenceSection as TypeEngineerReference } from '@/interfaces/form.interface'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'
import { useForm } from 'react-hook-form'

const EngineerReferenceSection = () => {
  const form = useForm<TypeEngineerReference>()

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Referencia del Ingeniero Encargado</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <FormField
          name="service_engineer"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingeniero de Servicio</FormLabel>
              <FormControl>
                <Input className="bg-white" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="invima_registration"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registro INVIMA</FormLabel>
              <FormControl>
                <Input className="bg-white" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-400" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default EngineerReferenceSection