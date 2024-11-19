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
import { deleteProduct, updateProductStatus } from "@/actions/products";
import { Product } from "@/utils/types";
import { useRouter } from "next/navigation";

const ProductActions = ({ product }: { product: Product }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleToggleProductStatus = async () => {
        try {
            const data = await updateProductStatus(
                product._id,
                !product.isActive
            );
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const data = await deleteProduct(product._id);
            console.log(data);
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
                            router.push(`/admin/products/${product._id}`)
                        }
                    >
                        ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleProductStatus}>
                        {product.isActive ? "غیرفعال" : "فعال"}
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
                            اگر دکمه تایید را بزنید این محصول به صورت کامل حذف
                            می شود.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel onClick={() => setOpen(false)}>
                            لغو
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct}>
                            تایید
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ProductActions;
