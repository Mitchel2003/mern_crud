import HeaderCustom from "#/reusables/elements/HeaderCustom"
import SelectField from "#/reusables/fields/Select"
import InputField from "#/reusables/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { useForm } from "react-hook-form"

interface ClientProps extends ThemeContextProps { }

const ClientSection = ({ theme }: ClientProps) => {
  const methods = useForm()

  return (
    <div className="space-y-4">

      <HeaderCustom
        theme={theme}
        to="section"
        title="Datos del cliente"
      />

      <div className="grid grid-cols-2 gap-4">

        <SelectField
          theme={theme}
          name="client"
          control={methods.control}
          options={['IPS Sanitas', 'EDS Nueva esperanza']}
          placeholder="Selecciona un cliente"
        />
        {/* <InputField
          name="client"
          label="Cliente"
          theme={theme}
          control={methods.control}
          placeholder=""
        /> */}
        <FormField
          control={form.control}
          name="cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CLIENTE:</FormLabel>
              <FormControl>
                <Input placeholder="IPS PROTEGER OCAÑA S.A.S" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CONTACTO:</FormLabel>
              <FormControl>
                <Input placeholder="607569257" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DIRECCIÓN:</FormLabel>
              <FormControl>
                <Input placeholder="CALLE 9 # 11-105, CONSULTORIO 2" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FECHA:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
export default ClientSection