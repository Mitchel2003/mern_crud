import { z } from "zod"

export const maintenanceSchema = z.object({
  //helpers fields not has been sent to database
  client: z.object({ name: z.string().min(1, "El cliente es requerido"), email: z.string(), nit: z.string() }),
  curriculum: z.string({ required_error: "El ID del currículo es requerido" }).min(1, "Debes seleccionar un currículo"),

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
  dateTest: z.date().optional().nullable(),

  //maintenance
  statusEquipment: z.string({ required_error: "El estado del equipo es requerido" }).min(1, "Debes seleccionar un estado del equipo"),
  observations: z.string({ required_error: "Las observaciones son requeridas" }).min(1, "Debes seleccionar una observación"),
  photoUrl: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([]),

  //received
  receivedBy: z.string({ required_error: "El nombre de la persona que recibe es requerido" }).min(1, "Debes seleccionar una persona que recibe"),
  nameEngineer: z.string({ required_error: "El nombre del ingeniero es requerido" }).min(1, "Debes seleccionar un ingeniero"),
  invimaEngineer: z.string({ required_error: "El INVIMA del ingeniero es requerido" }).min(1, "Debes seleccionar un INVIMA")
}).refine(data => { return data.dateNextMaintenance }, {
  message: "La fecha del próximo mantenimiento es requerida", path: ["dateNextMaintenance"]
})

export type MaintenanceFormProps = z.infer<typeof maintenanceSchema>