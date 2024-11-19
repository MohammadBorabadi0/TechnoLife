"use client";

import { columns } from "@/app/admin/brands/columns";
import { DataTable } from "@/components/admin/shared/DataTable";
import GPagination from "@/components/Pagination";
import { Brand } from "@/utils/types";
import { FC } from "react";

interface IProps {
    brands: Brand[];
    page: number;
    limit: number;
    totalPages: number;
}

const BrandsScreen: FC<IProps> = ({ brands, page, limit, totalPages }) => {
    const startRowIndex = (page - 1) * limit + 1;

    return (
        <>
            <DataTable<Brand>
                data={brands}
                columns={columns(startRowIndex)}
                basePath="/admin/brands"
                title="افزودن برند"
                url="/admin/brands/add"
                searchPlaceholder="جستجوی برند با نام ..."
                notFoundMessage="هیچ برندی پیدا نشد."
            />
            <GPagination
                currentPage={page}
                totalPages={totalPages}
                label="برندها"
                basePath="/admin/brands"
                onPageChange={(newPage: number) => {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("page", newPage.toString());
                    window.history.pushState({}, "", newUrl);
                }}
            />
        </>
    );
};

export default BrandsScreen;
