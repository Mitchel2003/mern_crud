import { z } from "zod"

// Schema base para la fila de asistencia
const attendanceRowSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  position: z.string().min(1, "El cargo es requerido"),
  document: z.string().min(1, "El documento es requerido"),
  signature: z.string().min(1, "La firma es requerida")
})

// Schema principal con validaciones condicionales
export const scheduleSchema = z.object({
  // Campos base siempre requeridos
  client: z.string().min(1, "El cliente es requerido"),
  typeSchedule: z.string().min(1, "El tipo de cronograma es requerido"),

  // Campos opcionales que pueden volverse requeridos
  monthOperation: z.array(z.string()).optional(), //to maintenance or training
  yearOperation: z.array(z.string()).optional(), //to maintenance
  typeClassification: z.string().optional(), //to maintenance
  subject: z.string().optional(), //to attendance
  message: z.string().optional(), //to attendance
  dateAttendance: z.date().optional(), //to attendance
  newRowAttendance: z.array(attendanceRowSchema).optional(), //to attendance
}).superRefine((data, ctx) => {
  switch (data.typeSchedule) {
    case 'mantenimiento':
      if (!data.typeClassification) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La clasificación es requerida", path: ["typeClassification"] }) }
      if (!data.monthOperation?.length) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe seleccionar al menos un mes", path: ["monthOperation"] }) }
      if (!data.yearOperation?.length) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe seleccionar el año", path: ["yearOperation"] }) }
      if (data.yearOperation?.length && data.yearOperation.length > 1) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "No permitido selección multiple", path: ["yearOperation"] }) }
      break;

    case 'capacitación':
      if (!data.monthOperation?.length) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe seleccionar al menos un mes", path: ["monthOperation"] }) }
      break;

    case 'acta de asistencia':
      if (!data.dateAttendance) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La fecha es requerida", path: ["dateAttendance"] }) }
      if (!data.subject?.trim()) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El asunto es requerido", path: ["subject"] }) }
      if (!data.message?.trim()) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El mensaje es requerido", path: ["message"] }) }
      if (!data.newRowAttendance?.length) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe agregar al menos un asistente", path: ["newRowAttendance"] }) }
      break;
  }
})

export type ScheduleFormProps = z.infer<typeof scheduleSchema>