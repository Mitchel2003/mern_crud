import { z } from "zod"

export const citySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre debe tener menos de 50 caracteres"),
  state: z.string().min(3, "El estado debe tener al menos 3 caracteres").max(50, "El estado debe tener menos de 50 caracteres"),
})

export const stateSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  country: z
    .string()
    .min(3, "El país debe tener al menos 3 caracteres")
    .max(50, "El país debe tener menos de 50 caracteres"),
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