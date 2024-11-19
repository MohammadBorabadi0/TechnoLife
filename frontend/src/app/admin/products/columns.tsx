import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/utils/types";
import ProductActions from "./productActions";
import { En_To_Fa } from "@/utils/functions";

export const columns = (startRowIndex: number): ColumnDef<Product>[] => [
    {
        id: "row",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting()}>
                ردیف
                <ArrowUpDown className="mr-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                {En_To_Fa(startRowIndex + row.index)}
            </div>
        ),
    },
    {
        accessorKey: "images",
        header: () => <div className="text-center">تصویر محصول</div>,
        cell: ({ row }) => {
            const images = row.getValue("images") as { file: string }[];
            return (
                <Image
                    src={images[0].file}
                    alt={row.getValue("name")}
                    width={200}
                    height={200}
                    className="size-12 object-cover"
                />
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                نام محصول
                <ArrowUpDown className="mr-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{En_To_Fa(row.getValue("name"))}</div>
        ),
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                دسته بندی
                <ArrowUpDown className="mr-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("category")}</div>
        ),
    },
    {
        accessorKey: "brand",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                برند
                <ArrowUpDown className="mr-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("brand")}</div>
        ),
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                وضعیت
                <ArrowUpDown className="mr-2 size-4" />
            </Button>
        ),
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
            const product = row.original;
            return <ProductActions product={product} />;
        },
    },
];
