"use client";

import { columns } from "@/app/admin/categories/columns";
import { DataTable } from "@/components/admin/shared/DataTable";
import GPagination from "@/components/Pagination";
import { Category } from "@/utils/types";
import { FC } from "react";

interface IProps {
    categories: Category[];
    page: number;
    limit: number;
    totalPages: number;
}

const CategoriesScreen: FC<IProps> = ({
    categories,
    page,
    limit,
    totalPages,
}) => {
    const startRowIndex = (page - 1) * limit + 1;

    return (
        <>
            <DataTable<Category>
                data={categories}
                columns={columns(startRowIndex)}
                title="افزودن دسته بندی"
                url="/admin/categories/add"
                basePath="/admin/categories"
                searchPlaceholder="جستجوی دسته بندی با نام..."
                notFoundMessage="هیچ دسته بندی پیدا نشد."
            />
            <GPagination
                currentPage={page}
                totalPages={totalPages}
                label="دسته بندی ها"
                basePath="/admin/categories"
                onPageChange={(newPage: number) => {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("page", newPage.toString());
                    window.history.pushState({}, "", newUrl);
                }}
            />
        </>
    );
};

export default CategoriesScreen;
