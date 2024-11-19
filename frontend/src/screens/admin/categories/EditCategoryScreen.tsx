"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import InputField from "@/components/admin/shared/InputField";
import FileUpload from "@/components/admin/shared/FileUpload";
import { imageUrlToFile } from "@/utils/functions";
import { updateCategory } from "@/actions/categories";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    CategoryFormValues,
    categorySchema,
} from "@/schemas/admin/categorySchema";
import { Category } from "@/utils/types";

const EditCategoryScreen = ({ category }: { category: Category }) => {
    const [file, setFile] = useState<File | null>(null);
    const [icon, setIcon] = useState<File | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        defaultValues: category,
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        const convertImageUrlToFile = async () => {
            const image = await imageUrlToFile(category.imageUrl!);
            const icon = await imageUrlToFile(category.iconUrl);
            setIcon(icon);
            setFile(image);
        };
        convertImageUrlToFile();
    }, [category]);

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("file", file as File);
            formData.append("icon", icon as File);

            const { success, message } = await updateCategory(
                formData,
                category._id
            );
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
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg bg-primary-foreground rounded-lg space-y-8 mx-auto p-4"
        >
            {/* Name field using InputField */}
            <InputField
                label="نام دسته بندی"
                id="name"
                errorMessage={errors.name?.message}
                {...register("name")}
            />

            <div className="flex justify-between">
                {/* FileUpload component for image */}
                <FileUpload
                    onFileChange={setFile}
                    file={file}
                    alt="Category Image"
                />

                {/* FileUpload component for icon */}
                <FileUpload
                    onFileChange={setIcon}
                    file={icon}
                    alt="Category Icon"
                    label="انتخاب آیکون"
                />
            </div>

            {/* Submit button */}
            <Button>ویرایش دسته بندی</Button>
        </form>
    );
};

export default EditCategoryScreen;
