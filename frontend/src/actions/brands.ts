"use server";

import { uploadFileToSupabase } from "@/utils/functions";
import { Brand } from "@/utils/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getBrands = async (
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
            `${url}/brands?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            { cache: "no-store" }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getBrand = async (id: string) => {
    try {
        const response = await fetch(`${url}/brands/${id}`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createBrand = async (formData: FormData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token?.value) {
            return {
                success: false,
                message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
            };
        }

        const { data: brands } = await getBrands();

        const brandData = [];

        const name = formData.get("name");
        const files = formData.getAll("file");
        const actives = formData.getAll("isActive");
        const categories = formData.getAll("category");

        if (brands.find((b: Brand) => b.name === name)) {
            return {
                success: false,
                message: "برند با این نام از قبل وجود دارد.",
            };
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isActive = actives[i] === "true";
            const category = categories[i];

            // Upload File To Supabase And Get Url
            const imageUrl = await uploadFileToSupabase(file as File, "brands");

            brandData.push({
                imageUrl,
                isActive,
                category,
            });
        }

        const response = await fetch(`${url}/brands`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({ name, categories: brandData }),
        });
        const data = await response.json();
        console.log("DATA", data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteBrand = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token?.value) {
            return {
                success: false,
                message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
            };
        }

        const response = await fetch(`${url}/brands/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        const data = await response.json();
        revalidatePath("/admin/brands");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateBrand = async (formData: FormData, id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token?.value) {
            return {
                success: false,
                message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
            };
        }

        const { data: brands } = await getBrands();

        const brandData = [];

        const name = formData.get("name");
        const files = formData.getAll("file");
        const actives = formData.getAll("isActive");
        const categories = formData.getAll("category");

        if (brands.find((b: Brand) => b.name === name && b._id !== id)) {
            return {
                success: false,
                message: "برند با این نام از قبل وجود دارد.",
            };
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isActive = actives[i] === "true";
            const category = categories[i];

            // Upload File To Supabase And Get Url
            const imageUrl = await uploadFileToSupabase(file as File, "brands");

            brandData.push({
                imageUrl,
                isActive,
                category,
            });
        }

        const response = await fetch(`${url}/brands/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({ name, categories: brandData }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
