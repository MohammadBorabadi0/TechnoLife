"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Color } from "@/utils/types";
import ColorActions from "./colorActions";
import { En_To_Fa } from "@/utils/functions";

export const columns = (startRowIndex: number): ColumnDef<Color>[] => [
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
        id: "colorBlock",
        header: "رنگ",
        cell: ({ row }) => {
            const colorCode = row.original.code;
            return (
                <div
                    className="size-6 border rounded"
                    style={{
                        backgroundColor: colorCode,
                    }}
                />
            );
        },
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
                    نام رنگ
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <>{row.getValue("name")}</>;
        },
    },
    {
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    کد رنگ
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <span dir="ltr">{row.getValue("code")}</span>;
        },
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
                    وضعیت رنگ
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const active = row.original.isActive;
            return (
                <Badge variant={active ? "default" : "danger"}>
                    {active ? "فعال" : "غیرفعال"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const color = row.original;

            return <ColorActions color={color} />;
        },
    },
];
