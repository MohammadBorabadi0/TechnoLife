"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { Brand } from "@/utils/types";
import BrandActions from "./brandActions";
import { En_To_Fa } from "@/utils/functions";

export const columns = (startRowIndex: number): ColumnDef<Brand>[] => [
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    نام برند
                    <ArrowUpDown className="mr-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{En_To_Fa(row.getValue("name"))}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const brand = row.original;

            return <BrandActions brand={brand} />;
        },
    },
];
