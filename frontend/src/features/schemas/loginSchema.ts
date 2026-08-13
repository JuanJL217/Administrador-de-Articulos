import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "El correo electrónico es inválido" }),
    password: z.string().min(1, { message: "La contraseña es obligatoria" })
});

export type LoginFormData = z.infer<typeof loginSchema>;
