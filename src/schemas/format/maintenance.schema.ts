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

  //cv (autocomplete)
  cv: z.object({
    name: z.string(),
    serie: z.string(),
    brand: z.string(),
    preview: z.string(),
    modelEquip: z.string(),
    healthRecord: z.string(),
  }).optional(),

  //timestandard
  dateNextMaintenance: z.date({ required_error: "La fecha del próximo mantenimiento es requerida" }).nullable(),
  dateMaintenance: z.date().optional().nullable(),

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
}).refine(data => { return data.dateNextMaintenance }, {
  message: "La fecha del próximo mantenimiento es requerida", path: ["dateNextMaintenance"]
})

export type MaintenanceFormProps = z.infer<typeof maintenanceSchema>