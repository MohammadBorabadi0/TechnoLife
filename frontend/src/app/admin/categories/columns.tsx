import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/utils/types";
import CategoriesActions from "./categoriesActions";
import { En_To_Fa } from "@/utils/functions";
import Image from "next/image";

export const columns = (startRowIndex: number): ColumnDef<Category>[] => [
    {
        id: "row",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting();
                    }}
                >
                    ردیف
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="text-center max-w-20">
                {En_To_Fa(startRowIndex + row.index)}
            </div>
        ),
    },
    {
        accessorKey: "imageUrl",
        header: "تصویر دسته بندی",
        cell: ({ row }) => (
            <Image
                src={row.original.imageUrl as string}
                alt={row.original.name}
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                width={200}
                height={200}
            />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    نام دسته بندی
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{En_To_Fa(row.getValue("name"))}</div>
        ),
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    وضعیت
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">
                {row.getValue("isActive") ? (
                    <Badge>فعال</Badge>
                ) : (
                    <Badge variant="danger">غیرفعال</Badge>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original;

            return <CategoriesActions category={category} />;
        },
    },
];
