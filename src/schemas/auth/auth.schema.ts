import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Correo electronico invalido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  role: z.enum(["admin", "engineer"])
})

export type LoginFormProps = z.infer<typeof loginSchema>
export type RegisterFormProps = z.infer<typeof registerSchema>