import { z } from "zod"

export const signMaintenanceSchema = z.object({
  preview: z.string().optional(),
  signature: z.array(
    z.object({ png: z.string() })
  ).optional().default([]),
})

export const officeSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  services: z
    .array(z.string({ required_error: "El servicio es requerido" }))
    .min(1, "Debes seleccionar al menos un servicio"),
  headquarter: z
    .string({ required_error: "La sede es requerida" })
    .min(1, "Debes seleccionar una sede")
}).superRefine((data, ctx) => {
  const groups = data.services.map((service) => service.split(' - ')[1])
  if (groups.length > 1 && new Set(groups).size > 1) ctx.addIssue({
    message: "Debes seleccionar servicios del mismo grupo",
    code: z.ZodIssueCode.custom,
    path: ['services'],
  })
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
    .min(1, "Debes seleccionar una ciudad"),
  state: z
    .string({ required_error: "El estado es requerido" })
    .min(1, "Debes seleccionar un estado"),
  country: z
    .string({ required_error: "El país es requerido" })
    .min(1, "Debes seleccionar un país")
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
export type OfficeFormProps = z.infer<typeof officeSchema>
export type CountryFormProps = z.infer<typeof countrySchema>
export type HeadquarterFormProps = z.infer<typeof headquarterSchema>
export type SignMaintenanceFormProps = z.infer<typeof signMaintenanceSchema>