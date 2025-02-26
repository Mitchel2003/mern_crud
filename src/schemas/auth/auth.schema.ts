import { z } from "zod"

/*--------------------------------------------------authSchema--------------------------------------------------*/
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Correo electrónico inválido" })
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Correo electrónico inválido" }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------userSchema--------------------------------------------------*/
export const userSchema = z.object({
  username: z
    .string({ required_error: "El nombre de usuario es requerido" })
    .min(5, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario es demasiado largo"),
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Correo electrónico inválido" }),
  phone: z
    .string({ required_error: "El teléfono es requerido" })
    .min(6, "El teléfono debe tener al menos 6 caracteres")
    .refine(value => /^[0-9]+$/.test(value), { message: "El teléfono debe contener solo números" }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z
    .string({ required_error: "El rol es requerido" })
    .min(1, "Debes seleccionar un rol"),
  company: z
    .string().optional()
}).superRefine((data, ctx) => {
  if (data.role !== "admin" && !data.company) {
    ctx.addIssue({
      path: ["company"],
      code: z.ZodIssueCode.custom,
      message: "La empresa es requerida para usuarios no administradores"
    })
  }
})

export const clientSchema = z.object({
  preview: z.string().optional(),
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(5, "El nombre es demasiado corto")
    .max(50, "El nombre es demasiado largo"),
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email("Correo electrónico inválido"),
  phone: z
    .string({ required_error: "El teléfono es requerido" })
    .min(6, "El teléfono es requerido")
    .max(15, "El teléfono es demasiado largo"),
  nit: z
    .string({ required_error: "El NIT es requerido" })
    .min(10, "El NIT es muy corto")
    .max(20, "El NIT es demasiado largo"),
  photoUrl: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([]),
}).refine(data => { return /^[0-9]+$/.test(data.phone) }, {
  message: "El teléfono debe contener solo números", path: ["phone"]
})

export const companySchema = z.object({
  previewSignature: z.string().optional(),
  previewLogo: z.string().optional(),
  name: z
    .string()
    .min(5, "El nombre es requerido")
    .max(50, "El nombre es demasiado largo"),
  nit: z
    .string({ required_error: "El NIT es requerido" })
    .min(6, "El NIT es muy corto")
    .max(50, "El NIT debe tener menos de 50 caracteres"),
  invima: z
    .string()
    .min(5, "El invima es requerido")
    .max(50, "El invima es demasiado largo"),
  profesionalLicense: z
    .string()
    .min(5, "La licencia profesional es requerida")
    .max(50, "La licencia profesional es demasiado larga"),
  photoSignature: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([]),
  photoLogo: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([]),
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------userSchema (form-step)--------------------------------------------------*/
export const clientFlowSchema = z.object({
  client: z.object({
    preview: z.string().optional(),
    name: z
      .string()
      .min(5, "El nombre es requerido")
      .max(50, "El nombre es demasiado largo"),
    email: z
      .string()
      .email("Correo electrónico inválido"),
    phone: z
      .string()
      .min(6, "El teléfono es requerido")
      .max(15, "El teléfono es demasiado largo"),
    nit: z
      .string()
      .min(8, "El NIT es requerido")
      .max(20, "El NIT es demasiado largo"),
    photoUrl: z.array(
      z.object({
        file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
          .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
          .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
      })
    ).optional().default([]),
  }).refine(data => { return /^[0-9]+$/.test(data.phone) },
    { message: "El teléfono debe contener solo números", path: ["phone"] }
  ),
  headquarter: z.array(
    z.object({
      name: z
        .string({ required_error: "El nombre es requerido" })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre debe tener menos de 50 caracteres"),
      address: z
        .string({ required_error: "La dirección es requerida" })
        .min(3, "La dirección debe tener al menos 3 caracteres")
        .max(100, "La dirección debe tener menos de 100 caracteres"),
      city: z
        .string({ required_error: "La ciudad es requerida" })
        .min(1, "Debes seleccionar una ciudad")
        .refine(
          (value) => {
            const regularExpression = /^[0-9a-fA-F]{24}$/;/* standard uid */ return regularExpression.test(value)
          }, { message: "Debes seleccionar una ciudad de la lista proporcionada" }
        )
    })
  ),
  office: z.array(
    z.object({
      headquarter: z
        .string({ required_error: "La sede es requerida" })
        .min(1, "Debes seleccionar una sede"),
      services: z
        .array(z.string({ required_error: "El servicio es requerido" }))
        .min(1, "Debes seleccionar al menos un servicio"),
      name: z
        .string({ required_error: "El nombre es requerido" })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre debe tener menos de 50 caracteres")
    })
  )
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------types--------------------------------------------------*/
export type LoginFormProps = z.infer<typeof loginSchema>
export type ForgotPasswordFormProps = z.infer<typeof forgotPasswordSchema>

export type UserFormProps = z.infer<typeof userSchema>
export type ClientFormProps = z.infer<typeof clientSchema>
export type CompanyFormProps = z.infer<typeof companySchema>
export type ClientFlowProps = z.infer<typeof clientFlowSchema>
/*---------------------------------------------------------------------------------------------------------*/