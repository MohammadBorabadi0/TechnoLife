"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertOctagon, MoreHorizontal } from "lucide-react";
import { deleteCategory, updateCategoryStatus } from "@/actions/categories";
import { Category } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const CategoriesActions = ({ category }: { category: Category }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleToggleCategoryStatus = async () => {
        try {
            const data = await updateCategoryStatus(
                category._id,
                !category.isActive
            );
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            const { success, message } = await deleteCategory(category._id);
            if (success) {
                toast({
                    title: "موفقیت",
                    description: message,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">باز شدن منو</span>
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel className="font-bold">
                        عملیات
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/admin/categories/${category._id}`)
                        }
                    >
                        ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleCategoryStatus}>
                        {category.isActive ? "غیرفعال" : "فعال"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        حذف
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* AlertDialog for deletion confirmation */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            آیا از انجام این عملیات مطمئن هستید؟
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex items-center gap-2">
                            <AlertOctagon />
                            اگر دکمه تایید را بزنید این دسته بندی به صورت کامل
                            حذف می شود.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel onClick={() => setOpen(false)}>
                            لغو
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCategory}>
                            تایید
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CategoriesActions;
