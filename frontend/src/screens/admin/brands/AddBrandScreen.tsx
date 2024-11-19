"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandFormValues, brandSchema } from "@/schemas/admin/brandSchema";
import { Category } from "@/utils/types";
import InputField from "@/components/admin/shared/InputField";
import FileUpload from "@/components/admin/shared/FileUpload";
import { useState } from "react";
import GCheckbox from "@/components/admin/shared/Checkbox";
import ToggleButton from "@/components/admin/shared/ToggleButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { validateSelectedData } from "@/utils/functions";
import { createBrand } from "@/actions/brands";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface IProps {
    categories: Category[];
}

const AddBrandScreen = ({ categories }: IProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(
        categories.map(() => ({
            file: null as File | null,
            isSelected: false,
            isActive: false,
            category: "",
        }))
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: BrandFormValues) => {
        if (!validateSelectedData(selectedCategories, toast, "دسته بندی")) {
            return;
        }

        console.log(selectedCategories);

        const formData = new FormData();
        formData.append("name", data.name);

        selectedCategories
            .filter((category) => category.isSelected)
            .forEach((category) => {
                if (category.file) {
                    formData.append(`file`, category.file);
                }
                formData.append(`isActive`, String(category.isActive));
                formData.append(`category`, category.category);
            });

        try {
            setLoading(true);
            const result = await createBrand(formData);
            if (result.success) {
                toast({
                    title: "موفقیت",
                    description: result.message,
                });
                router.push("/admin/brands");
                return;
            }
            toast({
                title: "خطا",
                description: result.message,
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
        } finally {
            setLoading(false);
        }
    };

    // Handle file change for a specific category
    const handleFileChange = (index: number, file: File | null) => {
        const updatedFiles = [...selectedCategories];
        updatedFiles[index].file = file;
        setSelectedCategories(updatedFiles);
    };

    // Handle checkbox change for selecting categories
    const handleCategorySelectChange = (index: number, isSelected: boolean) => {
        const updatedFiles = [...selectedCategories];
        updatedFiles[index].isSelected = isSelected;
        updatedFiles[index].category = categories[index]._id;

        if (!updatedFiles[index].isSelected) {
            updatedFiles[index].file = null;
            updatedFiles[index].category = "";
        }

        setSelectedCategories(updatedFiles);
    };

    // Handle toggle change for the active state
    const handleToggleActiveChange = (index: number, newState: boolean) => {
        const updatedFiles = [...selectedCategories];
        updatedFiles[index].isActive = newState;
        setSelectedCategories(updatedFiles);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
                label="نام برند"
                id="brand-name"
                {...register("name")}
                errorMessage={errors.name?.message}
            />

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                    <div
                        key={category._id}
                        className="space-y-4 bg-primary-foreground p-4 rounded-lg"
                    >
                        {/* Checkbox to select category */}
                        <GCheckbox
                            id={`category-${index}`}
                            label={category.name}
                            checked={selectedCategories[index].isSelected}
                            onChange={(isSelected) =>
                                handleCategorySelectChange(index, isSelected)
                            }
                        />

                        {selectedCategories[index].isSelected && (
                            <>
                                {/* ToggleButton for active state */}
                                <ToggleButton
                                    label="وضعیت"
                                    active={selectedCategories[index].isActive}
                                    onToggle={(newState) =>
                                        handleToggleActiveChange(
                                            index,
                                            newState
                                        )
                                    }
                                />

                                {/* File Upload for Category Image */}
                                <FileUpload
                                    file={selectedCategories[index].file}
                                    onFileChange={(file) =>
                                        handleFileChange(index, file)
                                    }
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <Button>{loading ? <Loading /> : "ایجاد برند"}</Button>
        </form>
    );
};

export default AddBrandScreen;
