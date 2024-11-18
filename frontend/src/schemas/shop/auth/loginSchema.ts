import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "لطفا ایمیل خود را وارد کنید")
        .email("لطفا ایمیل معتبر وارد کنید"),
    password: z.string().min(4, "رمز عبور باید بیشتر از 4 کاراکتر باشد"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
