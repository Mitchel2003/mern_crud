import { z } from "zod"

export const headquarterSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  address: z.string()
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .max(100, "La dirección debe tener menos de 100 caracteres"),
  client: z.string({ required_error: "El cliente es requerido" }),
  city: z.string({ required_error: "La ciudad es requerida" })
})

export const citySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  state: z.string({ required_error: "El estado es requerido" })
})

export const stateSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  country: z.string({ required_error: "El país es requerido" })
})

export const countrySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
})

export type CityFormProps = z.infer<typeof citySchema>
export type StateFormProps = z.infer<typeof stateSchema>
export type CountryFormProps = z.infer<typeof countrySchema>
export type HeadquarterFormProps = z.infer<typeof headquarterSchema>