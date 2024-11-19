"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import FileUpload from "@/components/admin/shared/FileUpload";
import { Button } from "@/components/ui/button";
import InputField from "@/components/admin/shared/InputField";
import { useToast } from "@/hooks/use-toast";
import { createCategory } from "@/actions/categories";
import { useRouter } from "next/navigation";
import {
    CategoryFormValues,
    categorySchema,
} from "@/schemas/admin/categorySchema";

const AddCategoryScreen: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
    });

    const router = useRouter();
    const { toast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [icon, setIcon] = useState<File | null>(null);

    // Form submission handler
    const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
        if (!(file && icon)) {
            toast({
                title: "خطا",
                description: "آپلود و آیکون تصویر دسته‌بندی ضروری است",
                variant: "destructive",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("file", file);
            formData.append("icon", icon);

            const { success, message } = await createCategory(formData);

            if (success) {
                toast({
                    title: "موفقیت",
                    description: "دسته بندی با موفقیت ایجاد شد.",
                });
                router.push("/admin/categories");
                return;
            }
            toast({
                title: "خطا",
                description: message,
                variant: "destructive",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "خطا",
                description:
                    "هنگام ایجاد دسته بندی مشکلی به وجود آمد لطفا مجددا سعی کنید",
                variant: "destructive",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md bg-primary-foreground mx-auto space-y-4 p-6 rounded-md shadow-md"
        >
            {/* Category Name */}
            <InputField
                label="نام دسته‌بندی"
                id="category-name"
                {...register("name")}
                errorMessage={errors.name?.message}
            />

            <div className="flex justify-between">
                {/* Image Upload */}
                <FileUpload
                    onFileChange={setFile}
                    file={file}
                    alt="Category Image"
                />

                {/* Icon Upload */}
                <FileUpload
                    onFileChange={setIcon}
                    file={icon}
                    alt="Category Icon"
                    label="انتخاب آیکون"
                />
            </div>

            {/* Submit Button */}
            <Button className="w-full">ایجاد دسته‌بندی</Button>
        </form>
    );
};

export default AddCategoryScreen;
