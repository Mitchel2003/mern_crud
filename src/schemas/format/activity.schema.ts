import { z } from "zod"

export const activitySchema = z.object({
  dateAssignment: z
    .date({ required_error: "Debes seleccionar una fecha de asignación" }),
  engineer: z
    .string({ required_error: "Debes seleccionar un colaborador" })
    .min(1, "Debes seleccionar un colaborador"),
  solicit: z
    .string({ required_error: "Debes seleccionar una solicitud" })
    .min(1, "Debes seleccionar una solicitud")
    .refine(
      (value) => { const regularExpression = /^[0-9a-fA-F]{24}$/;/* standard uid */ return regularExpression.test(value) },
      { message: "Debes seleccionar una solicitud de la lista proporcionada" }
    ),
})

export type ActivityFormProps = z.infer<typeof activitySchema>