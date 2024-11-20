"use server";

import { Color } from "@/utils/types";
import { revalidatePath } from "next/cache";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const nameExists = (colors: Color[], name: string, id?: string) =>
    colors.some(
        (color: Color) => color.name === name.toLowerCase() && color._id !== id
    );

const codeExists = (colors: Color[], code: string, id?: string) =>
    colors.some(
        (color: Color) =>
            color.code.toLowerCase() === code.toLowerCase() && color._id !== id
    );

export const getColors = async (
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
            `${url}/colors?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            { cache: "no-store" }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getColor = async (id: string) => {
    try {
        const response = await fetch(`${url}/colors/${id}`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createColor = async (formData: FormData) => {
    const { data: colors } = await getColors();

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    //   Return Errors
    if (nameExists(colors, name)) {
        return { success: false, message: "نام رنگ از قبل وجود دارد." };
    }

    if (codeExists(colors, code)) {
        return { success: false, message: "کد رنگ از قبل وجود دارد." };
    }

    try {
        const response = await fetch(`${url}/colors`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, code }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateColorStatus = async (id: string, value: boolean) => {
    try {
        const response = await fetch(`${url}/colors/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
        });
        const data = await response.json();
        revalidatePath("/admin/colors");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateColor = async (id: string, formData: FormData) => {
    const { data: colors } = await getColors();

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    //   Return Errors
    if (nameExists(colors, name, id)) {
        return { success: false, message: "نام رنگ از قبل وجود دارد." };
    }

    if (codeExists(colors, code, id)) {
        return { success: false, message: "کد رنگ از قبل وجود دارد." };
    }

    try {
        const response = await fetch(`${url}/colors/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, code }),
        });
        const data = await response.json();
        revalidatePath("/admin/colors");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteColor = async (id: string) => {
    try {
        const response = await fetch(`${url}/colors/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        revalidatePath("/colors");
        return data;
    } catch (error) {
        console.log(error);
    }
};
