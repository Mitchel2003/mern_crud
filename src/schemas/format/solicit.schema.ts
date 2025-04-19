import { z } from "zod"

export const solicitSchema = z.object({
  cv: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    serie: z.string().optional(),
    preview: z.string().optional(),
    modelEquip: z.string().optional(),
    healthRecord: z.string().optional(),
  }),
  message: z
    .string({ required_error: "El mensaje es requerido" })
    .min(1, "Escribe las observaciones presentadas"),
  priority: z
    .string({ required_error: "La prioridad es requerida" })
    .min(1, "Debes seleccionar una prioridad"),
  photoUrl: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([]),
})

export type SolicitFormProps = z.infer<typeof solicitSchema>