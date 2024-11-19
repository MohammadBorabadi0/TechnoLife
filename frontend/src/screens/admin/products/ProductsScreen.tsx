"use client";

import { FC } from "react";
import { Product } from "@/utils/types";
import GPagination from "@/components/Pagination";
import { columns } from "@/app/admin/products/columns";
import { DataTable } from "@/components/admin/shared/DataTable";

interface IProps {
    products: Product[];
    totalPages: number;
    page: number;
    limit: number;
}

const ProductsScreen: FC<IProps> = ({ products, page, limit, totalPages }) => {
    const startRowIndex = (page - 1) * limit + 1;

    return (
        <>
            <DataTable<Product>
                data={products}
                columns={columns(startRowIndex)}
                basePath="/admin/products"
                title="افزودن محصول"
                url="/admin/products/add"
                searchPlaceholder="جستجوی محصول ..."
                notFoundMessage="هیچ محصولی پیدا نشد."
            />
            <GPagination
                currentPage={page}
                totalPages={totalPages}
                label="محصولات"
                basePath="/admin/products"
                onPageChange={(newPage: number) => {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("page", newPage.toString());
                    window.history.pushState({}, "", newUrl);
                }}
            />
        </>
    );
};

export default ProductsScreen;
