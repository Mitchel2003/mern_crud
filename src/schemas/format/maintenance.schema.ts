import { z } from "zod"

export const maintenanceSchema = z.object({
  //helpers fields not has been sent to database
  client: z.string({ required_error: "El cliente es requerido" }).min(1, "Debes seleccionar un cliente"),
  curriculum: z.string({ required_error: "El ID del currículum es requerido" }).min(1, "Debes seleccionar un currículum"),
  nameClient: z.string().optional(),
  nitClient: z.string().optional(),

  //timestandard
  dateNextMaintenance: z.date({ required_error: "La fecha del próximo mantenimiento es requerida" }).nullable(),
  dateMaintenance: z.date().optional().nullable(),

  //maintenance
  statusEquipment: z.string({ required_error: "El estado del equipo es requerido" }).min(1, "Debes seleccionar un estado del equipo"),
  observations: z.string({ required_error: "Las observaciones son requeridas" }).min(1, "Debes seleccionar una observación"),

  //received
  receivedBy: z.string({ required_error: "El nombre de la persona que recibe es requerido" }).min(1, "Debes seleccionar una persona que recibe"),
  nameEngineer: z.string({ required_error: "El nombre del ingeniero es requerido" }).min(1, "Debes seleccionar un ingeniero"),
  invimaEngineer: z.string({ required_error: "El INVIMA del ingeniero es requerido" }).min(1, "Debes seleccionar un INVIMA")
}).refine(data => { return data.dateNextMaintenance }, {
  message: "La fecha del próximo mantenimiento es requerida", path: ["dateNextMaintenance"]
})

export type MaintenanceFormProps = z.infer<typeof maintenanceSchema>