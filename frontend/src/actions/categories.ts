"use server";

import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/utils/functions";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCategories = async (
    page?: number,
    limit?: number,
    search?: string
) => {
    try {
        const currentPage = page ? page : 1;
        const currentLimit = limit ? limit : 10;
        const searchQuery = search
            ? `&search=${encodeURIComponent(search.trim())}`
            : "";

        const response = await fetch(
            `${url}/categories?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            {
                cache: "no-store",
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getCategory = async (id: string) => {
    try {
        const response = await fetch(`${url}/categories/${id}`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateCategoryStatus = async (id: string, value: boolean) => {
    try {
        const response = await fetch(`${url}/categories/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
        });
        const data = await response.json();
        revalidatePath("/admin/categories");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createCategory = async (formData: FormData) => {
    try {
        const name = formData.get("name");
        const file = formData.get("file");
        const icon = formData.get("icon");

        const imageUrl = await uploadFileToSupabase(file as File, "categories");
        const iconUrl = await uploadFileToSupabase(icon as File, "categories");

        const response = await fetch(`${url}/categories`, {
            method: "POST",
            body: JSON.stringify({ name, imageUrl, iconUrl }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateCategory = async (formData: FormData, id: string) => {
    const name = formData.get("name");
    const file = formData.get("file");
    const icon = formData.get("icon");

    const imageUrl = await uploadFileToSupabase(file as File, "categories");
    const iconUrl = await uploadFileToSupabase(icon as File, "categories");

    try {
        const response = await fetch(`${url}/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, imageUrl, iconUrl }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await fetch(`${url}/categories/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        revalidatePath("/admin/categories");
        return data;
    } catch (error) {
        console.log(error);
    }
};
