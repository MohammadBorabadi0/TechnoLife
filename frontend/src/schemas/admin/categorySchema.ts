import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().trim().min(1, "نام دسته‌بندی ضروری است").default(""),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
