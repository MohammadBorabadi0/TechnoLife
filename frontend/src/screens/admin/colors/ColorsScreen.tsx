"use client";

import { FC } from "react";
import { Color } from "@/utils/types";
import GPagination from "@/components/Pagination";
import { columns } from "@/app/admin/colors/columns";
import { DataTable } from "@/components/admin/shared/DataTable";

interface IProps {
    colors: Color[];
    page: number;
    limit: number;
    totalPages: number;
}

const ColorsScreen: FC<IProps> = ({ colors, page, limit, totalPages }) => {
    const startRowIndex = (page - 1) * limit + 1;

    return (
        <>
            <DataTable<Color>
                data={colors}
                columns={columns(startRowIndex)}
                basePath="/admin/colors"
                title="افزودن رنگ"
                url="/admin/colors/add"
                searchPlaceholder="جستجو با نام یا کد رنگ ..."
                notFoundMessage="هیچ رنگی پیدا نشد."
            />
            <GPagination
                currentPage={page}
                totalPages={totalPages}
                label="رنگ ها"
                basePath="/admin/colors"
                onPageChange={(newPage: number) => {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("page", newPage.toString());
                    window.history.pushState({}, "", newUrl);
                }}
            />
        </>
    );
};

export default ColorsScreen;
