import { z } from "zod"

export const activitySchema = z.object({
  dateAssignment: z
    .date({ required_error: "Debes seleccionar una fecha de asignación" })
    .optional(),
  collaborator: z
    .string({ required_error: "Debes seleccionar un colaborador" })
    .min(1, "Debes seleccionar un colaborador"),
  description: z
    .string({ required_error: "Debes seleccionar un colaborador" })
    .min(5, "Descripción demasiado corta")
    .max(100, "Descripción demasiado larga"),
  timeHours: z
    .object({
      start: z.string({ required_error: "Debe seleccionar hora inicio" }),
      end: z.string({ required_error: "Debe seleccionar hora fin" })
    }),
  solicit: z
    .string({ required_error: "Debes seleccionar una solicitud" })
    .min(1, "Debes seleccionar una solicitud")
    .refine(
      (value) => { const regularExpression = /^[0-9a-fA-F]{24}$/;/* standard uid */ return regularExpression.test(value) },
      { message: "Debes seleccionar una solicitud de la lista proporcionada" }
    )
}).superRefine((data, ctx) => {
  if (!data.dateAssignment) {
    ctx.addIssue({
      path: ["dateAssignment"],
      code: z.ZodIssueCode.custom,
      message: "Debes seleccionar una fecha de asignación",
    })
  }
})

export type ActivityFormProps = z.infer<typeof activitySchema>