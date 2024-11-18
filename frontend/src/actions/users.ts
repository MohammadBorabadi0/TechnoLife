"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/utils/functions";

const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`;

export async function getUsers(page?: number, limit?: number, search?: string) {
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const searchQuery = search
        ? `&search=${encodeURIComponent(search.trim())}`
        : "";

    try {
        const res = await fetch(
            `${url}/users?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            {
                cache: "no-store",
            }
        );

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const getUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const response = await fetch(`${url}/user/profile`, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });
    const data = await response.json();
    return data;
};

export const getUserProfile = async (id: string) => {
    try {
        const response = await fetch(`${url}/user/${id}`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await fetch(`${url}/user/${id}`, { method: "DELETE" });
        const data = await response.json();
        revalidatePath("/users");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = async (formData: FormData, id: string) => {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const mobile = formData.get("mobile");
    const isAdmin = formData.get("isAdmin");
    const avatar = formData.get("avatar");

    try {
        let avatarUrl = null;

        if (avatar instanceof File) {
            const folder = "users";
            avatarUrl = await uploadFileToSupabase(avatar, folder);
        }

        const userData = {
            firstName,
            lastName,
            email,
            mobile,
            isAdmin: isAdmin ?? false,
            avatar: avatarUrl ?? "",
        };

        const response = await fetch(`${url}/user/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        revalidatePath("/users");
        return data;
    } catch (error) {
        console.log(error);
    }
};
