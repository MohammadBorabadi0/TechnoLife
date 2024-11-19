"use client";

import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { En_To_Fa } from "@/utils/functions";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    label: string;
    basePath: string;
    onPageChange: (page: number) => void;
}

const GPagination = ({
    currentPage,
    totalPages,
    label,
    basePath,
    onPageChange,
}: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentLimit = Number(searchParams.get("limit")) || 10;
    const [limit, setLimit] = useState(currentLimit);
    const options = [5, 10, 15, 20];

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            router.push(`${basePath}?page=${page}&limit=${limit}`);
        }
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        router.push(`${basePath}?page=1&limit=${newLimit}`);
    };

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
                <label
                    htmlFor="limit"
                    className="font-semibold text-sm whitespace-nowrap"
                >
                    تعداد {label} در هر صفحه:
                </label>
                <select
                    id="limit"
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {En_To_Fa(option)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination Controls */}
            <Pagination className="flex items-center space-x-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageClick(currentPage - 1);
                            }}
                            className={`px-3 py-2 rounded-md transition-all duration-200 ${
                                currentPage === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            قبلی
                        </PaginationPrevious>
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                isActive={index + 1 === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageClick(index + 1);
                                }}
                            >
                                {En_To_Fa(index + 1)}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageClick(currentPage + 1);
                            }}
                            className={`${
                                currentPage === totalPages &&
                                "opacity-50 cursor-not-allowed"
                            }`}
                        ></PaginationNext>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default GPagination;
