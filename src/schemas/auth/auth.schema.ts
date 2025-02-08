import { z } from "zod"

/*--------------------------------------------------authSchema--------------------------------------------------*/
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
})

export const loginSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------userSchema--------------------------------------------------*/
export const userSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(15, "El nombre de usuario es demasiado largo"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z
    .string()
    .min(1, "Debes seleccionar un rol"),
  headquarters: z
    .array(z.string())
}).refine(data => data.role === 'admin' ? true : data.headquarters.length > 0, {
  message: "Debes seleccionar al menos una sede", path: ["headquarters"]
})

export const clientSchema = z.object({
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
    .min(10, "El NIT es requerido")
    .max(20, "El NIT es demasiado largo")
}).refine(data => { return /^[0-9]+$/.test(data.phone) }, {
  message: "El teléfono debe contener solo números", path: ["phone"]
})

export const clientFlowSchema = z.object({
  client: clientSchema,
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

export type ClientFlowProps = z.infer<typeof clientFlowSchema>
/*---------------------------------------------------------------------------------------------------------*/