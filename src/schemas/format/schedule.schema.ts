import { z } from "zod"

export const scheduleSchema = z.object({
  client: z.string(),
  typeSchedule: z.string(),
  typeClassification: z.string().optional(),
  monthOperation: z.array(z.string()).optional(),
  dateAttendance: z.date().optional(),
  subject: z.string().optional(),

  newRowAttendance: z.array(z.object({
    name: z.string(),
    position: z.string(),
    document: z.string(),
    signature: z.string()
  })).optional()
})

export type ScheduleFormProps = z.infer<typeof scheduleSchema>