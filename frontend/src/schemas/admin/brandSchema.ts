import { z } from "zod";

export const brandSchema = z.object({
    name: z.string().min(1, "لطفا نام برند را وارد کنید"),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
