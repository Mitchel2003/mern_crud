import { z } from "zod"

export const maintenanceSchema = z.object({
  //helpers fields not has been sent to database
  client: z
    .string({ required_error: "El cliente es requerido" })
    .min(1, "Debes seleccionar un cliente"),
  headquarter: z
    .string({ required_error: "La sede es requerida" })
    .min(1, "Debes seleccionar una sede"),
  office: z
    .string({ required_error: "La oficina es requerida" })
    .min(1, "Debes seleccionar una oficina"),
  curriculum: z
    .string({ required_error: "El currículo es requerido" })
    .min(1, "Debes seleccionar un currículo"),

  //timestandard
  annexesPreview: z.array(z.string()).optional().default([]),
  dateNextMaintenance: z.date().optional().nullable(),
  dateMaintenance: z.date({
    required_error: "La fecha del mantenimiento es requerida",
    invalid_type_error: "La fecha del mantenimiento debe ser un valor válido"
  }).optional().nullable(),

  //maintenance
  typeMaintenance: z
    .string({ required_error: "El tipo de mantenimiento es requerido" })
    .min(1, "Debes seleccionar un tipo de mantenimiento"),
  statusEquipment: z
    .string({ required_error: "El estado del equipo es requerido" })
    .min(1, "Debes seleccionar un estado del equipo"),
  observations: z
    .string({ required_error: "Las observaciones son requeridas" })
    .min(1, "Debes seleccionar una observación"),
  newAnnexes: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([])
}).refine((data) => {
  if (data.typeMaintenance === 'preventivo') return data.dateNextMaintenance !== null
  return true
}, { message: "La fecha del próximo mantenimiento es requerida cuando el tipo es preventivo", path: ["dateNextMaintenance"] })

export type MaintenanceFormProps = z.infer<typeof maintenanceSchema>