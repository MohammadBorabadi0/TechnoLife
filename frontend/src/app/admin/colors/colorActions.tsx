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
import { deleteColor, updateColorStatus } from "@/actions/colors";
import { Color } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const ColorsActions = ({ color }: { color: Color }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleToggleColorStatus = async () => {
        try {
            const { success, message } = await updateColorStatus(
                color._id,
                !color.isActive
            );
            if (success) {
                toast({
                    title: "موفقیت",
                    description: message,
                });
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
                description: "هنگام ویرایش وضعیت رنگ مشکلی به وجود آمد",
                variant: "destructive",
            });
        }
    };

    const handleDeleteColor = async () => {
        try {
            const { success, message } = await deleteColor(color._id);
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
                            router.push(`/admin/colors/${color._id}`)
                        }
                    >
                        ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleColorStatus}>
                        {color.isActive ? "غیرفعال" : "فعال"}
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
                            اگر دکمه تایید را بزنید این رنگ به صورت کامل حذف می
                            شود.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel onClick={() => setOpen(false)}>
                            لغو
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteColor}>
                            تایید
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ColorsActions;
