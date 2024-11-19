"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandFormValues, brandSchema } from "@/schemas/admin/brandSchema";
import { Category } from "@/utils/types";
import InputField from "@/components/admin/shared/InputField";
import FileUpload from "@/components/admin/shared/FileUpload";
import GCheckbox from "@/components/admin/shared/Checkbox";
import ToggleButton from "@/components/admin/shared/ToggleButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { imageUrlToFile, validateSelectedData } from "@/utils/functions";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { updateBrand } from "@/actions/brands";

interface IProps {
    brand: {
        _id: string;
        name: string;
        categories: {
            category: string;
            imageUrl: string;
            isActive: boolean;
        }[];
    };
    categories: Category[];
}

const EditBrandScreen = ({ brand, categories }: IProps) => {
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
        reset,
    } = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
    });

    useEffect(() => {
        const fetchImagesAsFiles = async () => {
            // Pre-populate the form with brand data
            reset({ name: brand.name });

            // Set the selected categories state based on the brand data
            const updatedCategories = await Promise.all(
                categories.map(async (category) => {
                    const brandCategory = brand.categories.find(
                        (c) => c.category === category._id
                    );

                    let file = null;
                    if (brandCategory && brandCategory.imageUrl) {
                        try {
                            file = await imageUrlToFile(brandCategory.imageUrl);
                        } catch (error) {
                            console.error(
                                "Error converting image URL to File:",
                                error
                            );
                            toast({
                                variant: "destructive",
                                title: "خطا",
                                description:
                                    "در هنگام بارگذاری تصویر مشکلی به وجود آمد",
                            });
                        }
                    }

                    return {
                        file, // Set the file if available
                        isSelected: Boolean(brandCategory),
                        isActive: brandCategory
                            ? brandCategory.isActive
                            : false,
                        category: category._id,
                    };
                })
            );

            setSelectedCategories(updatedCategories);
        };

        fetchImagesAsFiles(); // Call the async function to load images
    }, [brand, categories, reset, toast]);

    const onSubmit = async (data: BrandFormValues) => {
        console.log({ selectedCategories });
        if (!validateSelectedData(selectedCategories, toast, "دسته بندی")) {
            return;
        }

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
            const result = await updateBrand(formData, brand._id);
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
                    "هنگام ویرایش دسته بندی مشکلی به وجود آمد لطفا مجددا سعی کنید",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (index: number, file: File | null) => {
        const updatedFiles = [...selectedCategories];
        updatedFiles[index].file = file;
        setSelectedCategories(updatedFiles);
    };

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
                                {/* ToggleButton for isActive state */}
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
            <Button>{loading ? <Loading /> : "ویرایش برند"}</Button>
        </form>
    );
};

export default EditBrandScreen;
