import { z } from "zod"

/*--------------------------------------------------countrySchema--------------------------------------------------*/
export const countrySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
})
export const countryUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres")
    .optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Al menos un campo debe ser proporcionado", path: ["root"] })
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------stateSchema--------------------------------------------------*/
export const stateSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre debe tener menos de 50 caracteres"),
  country: z.string().min(3, "El país debe tener al menos 3 caracteres").max(50, "El país debe tener menos de 50 caracteres"),
})
export const stateUpdateSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre debe tener menos de 50 caracteres").optional(),
  country: z.string().min(3, "El país debe tener al menos 3 caracteres").max(50, "El país debe tener menos de 50 caracteres").optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Al menos un campo debe ser proporcionado", path: ["root"] })
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------types--------------------------------------------------*/
export type CountryFormProps = z.infer<typeof countrySchema>
export type CountryUpdateFormProps = z.infer<typeof countryUpdateSchema>

export type StateFormProps = z.infer<typeof stateSchema>
export type StateUpdateFormProps = z.infer<typeof stateUpdateSchema>
/*---------------------------------------------------------------------------------------------------------*/