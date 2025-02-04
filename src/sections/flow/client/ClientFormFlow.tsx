import { ThemeContextProps } from "@/interfaces/context.interface"
import FormWrapper from "#/ui/step-form/step-form-wrapper"
import InputField from "#/common/fields/Input"
import { Mail } from "lucide-react"

const ClientForm = ({ theme }: ThemeContextProps) => {
  return (
    <FormWrapper theme={theme} title="Cliente" description="Proporcione la información del cliente.">
      <div className="flex flex-col gap-5">
        <InputField theme={theme} label="Nombre" name="client.name" placeholder="Nombre del cliente" />
        <InputField theme={theme} label="Email" name="client.email" placeholder="Email del cliente" icon={Mail} type="email" />
        <InputField theme={theme} label="Teléfono" name="client.phone" placeholder="Teléfono del cliente" />
        <InputField theme={theme} label="NIT" name="client.nit" placeholder="NIT del cliente" />
      </div>
    </FormWrapper>
  )
}

export default ClientForm