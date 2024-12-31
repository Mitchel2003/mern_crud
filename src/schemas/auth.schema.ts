import { z } from "zod"

/*--------------------------------------------------authSchema--------------------------------------------------*/
export const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido")
})

export const loginSchema = z.object({
  email: z.string().email("Correo electronico invalido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------userSchema--------------------------------------------------*/
export const userSchema = z.object({
  email: z
    .string()
    .email("Correo electronico invalido"),
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

export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre es requerido")
    .max(15, "El nombre es demasiado largo")
    .optional(),
  role: z
    .string()
    .min(1, "Debes seleccionar un rol")
    .optional(),
  permissions: z.object({
    overwrite: z.object({ read: z.boolean(), create: z.boolean(), update: z.boolean(), delete: z.boolean() }),
    headquarters: z.array(z.string())
  }).optional()
}).refine((data) => Object.keys(data).length > 0, { message: "Al menos un campo debe ser proporcionado", path: ["root"] })
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------clientSchema--------------------------------------------------*/
export const clientSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(35, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Correo electrónico inválido"),
  phone: z
    .string()
    .min(4, "El teléfono es requerido")
    .max(15, "El teléfono es demasiado largo"),
  nit: z
    .string()
    .min(10, "El NIT es requerido")
    .max(20, "El NIT es demasiado largo")
}).refine(data => { return /^[0-9]+$/.test(data.phone) }, { message: "El teléfono debe contener solo números", path: ["phone"] })

export const clientUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(35, "El nombre es demasiado largo")
    .optional(),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .optional(),
  phone: z
    .string()
    .min(4, "El teléfono es requerido")
    .max(15, "El teléfono es demasiado largo")
    .optional(),
  nit: z
    .string()
    .min(10, "El NIT es requerido")
    .max(20, "El NIT es demasiado largo")
    .optional()
}).refine(data => { return /^[0-9]+$/.test(data.phone || '0') }, { message: "El teléfono debe contener solo números", path: ["phone"] })
  .refine((data) => Object.keys(data).length > 0, { message: "Al menos un campo debe ser proporcionado", path: ["root"] })
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------types--------------------------------------------------*/
export type LoginFormProps = z.infer<typeof loginSchema>
export type ForgotPasswordFormProps = z.infer<typeof forgotPasswordSchema>

export type UserFormProps = z.infer<typeof userSchema>
export type UserUpdateFormProps = z.infer<typeof userUpdateSchema>

export type ClientFormProps = z.infer<typeof clientSchema>
export type ClientUpdateFormProps = z.infer<typeof clientUpdateSchema>
/*---------------------------------------------------------------------------------------------------------*/