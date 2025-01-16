import { z } from "zod"

export const serviceSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres")
})

export const officeSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  area: z
    .string({ required_error: "El área es requerida" })
    .min(1, "Debes seleccionar un área"),
  services: z
    .array(z.string({ required_error: "El servicio es requerido" }))
    .min(1, "Debes seleccionar al menos un servicio")
})

export const areaSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  headquarter: z
    .string({ required_error: "La sede es requerida" })
    .min(1, "Debes seleccionar una sede")
})

export const headquarterSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  address: z
    .string({ required_error: "La dirección es requerida" })
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .max(100, "La dirección debe tener menos de 100 caracteres"),
  client: z
    .string({ required_error: "El cliente es requerido" })
    .min(1, "Debes seleccionar un cliente"),
  city: z
    .string({ required_error: "La ciudad es requerida" })
    .min(1, "Debes seleccionar una ciudad")
})

export const citySchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  state: z
    .string({ required_error: "El estado es requerido" })
    .min(1, "Debes seleccionar un estado")
})

export const stateSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  country: z
    .string({ required_error: "El país es requerido" })
    .min(1, "Debes seleccionar un país")
})

export const countrySchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
})

export type CityFormProps = z.infer<typeof citySchema>
export type StateFormProps = z.infer<typeof stateSchema>
export type CountryFormProps = z.infer<typeof countrySchema>
export type HeadquarterFormProps = z.infer<typeof headquarterSchema>
export type AreaFormProps = z.infer<typeof areaSchema>
export type OfficeFormProps = z.infer<typeof officeSchema>
export type ServiceFormProps = z.infer<typeof serviceSchema>