import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "El correo electrónico es inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export const registerSchema = z.object({
    name: z.string().min(1, { message: "El nombre debe tener al menos 2 caracteres",}),
    email: z.string().email({ message: "El correo electrónico es inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
})

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;