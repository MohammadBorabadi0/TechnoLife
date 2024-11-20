"use server";

import { uploadFileToSupabase } from "@/utils/functions";
import { ProductUpload, Specifications } from "@/utils/types";
import { extractImages, extractSpecifications } from "@/utils/products";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ProductWithUrl {
    color: string;
    file: string | null;
    price: number;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getProducts(
    page?: number,
    limit?: number,
    search?: string
) {
    const currentPage = page ? page : 1;
    const currentLimit = limit ? limit : 10;
    const searchQuery = search
        ? `&search=${encodeURIComponent(search.trim())}`
        : "";

    try {
        const res = await fetch(
            `${url}/products?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            {
                cache: "no-store",
            }
        );

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getProduct = async (id: string) => {
    const response = await fetch(`${url}/products/${id}`, {
        cache: "no-store",
    });
    const data = await response.json();
    return data;
};

export const createProduct = async (formData: FormData) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const specifications: Specifications = extractSpecifications(formData);

    const productData: ProductUpload = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
        isActive: formData.get("isActive") === "true",
        description: formData.get("description") as string,
        discount: parseFloat(formData.get("discount") as string),
        discountTime: parseFloat(formData.get("discountTime") as string),
        countInStock: parseInt(formData.get("countInStock") as string, 10),
        images: extractImages(formData),
        specifications,
    };

    try {
        let productsWithUrls: ProductWithUrl[] = [];

        if (productData.images.length > 0) {
            productsWithUrls = await Promise.all(
                productData.images.map(async (item) => {
                    if (item.file) {
                        const url = await uploadFileToSupabase(
                            item.file as File,
                            "products"
                        );
                        return {
                            color: item.color,
                            file: url,
                            price: item.price,
                        };
                    }
                    return {
                        color: item.color,
                        file: null,
                        price: item.price,
                    };
                })
            );
        }

        const response = await fetch(`${url}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({
                ...productData,
                images: productsWithUrls,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (formData: FormData, id: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }
    const specifications: Specifications = extractSpecifications(formData);

    const productData: ProductUpload = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
        isActive: formData.get("isActive") === "true",
        description: formData.get("description") as string,
        discount: parseFloat(formData.get("discount") as string),
        discountTime: parseFloat(formData.get("discountTime") as string),
        countInStock: parseInt(formData.get("countInStock") as string, 10),
        images: extractImages(formData),
        specifications,
    };

    try {
        let productsWithUrls: ProductWithUrl[] = [];

        if (productData.images.length > 0) {
            productsWithUrls = await Promise.all(
                productData.images.map(async (item) => {
                    if (item.file) {
                        const url = await uploadFileToSupabase(
                            item.file,
                            "products"
                        );
                        return {
                            color: item.color,
                            file: url,
                            price: item.price,
                        };
                    }
                    return {
                        color: item.color,
                        file: null,
                        price: item.price,
                    };
                })
            );
        }

        const response = await fetch(`${url}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            credentials: "include",
            body: JSON.stringify({
                ...productData,
                images: productsWithUrls,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error update product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token?.value) {
            return {
                success: false,
                message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
            };
        }

        const response = await fetch(`${url}/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        const data = await response.json();
        revalidatePath("/products");
        return data;
    } catch (error) {
        console.log(error);
    }
};

// Product Status
export const updateProductStatus = async (id: string, value: boolean) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token?.value) {
            return {
                success: false,
                message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
            };
        }
        const response = await fetch(`${url}/products/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({ value }),
        });
        const data = await response.json();
        revalidatePath("/products");
        return data;
    } catch (error) {
        console.log(error);
    }
};

// Product Reviews
export const createProductReview = async (formData: FormData, id: string) => {
    const rating = formData.get("rating");
    const comment = formData.get("comment");
    const positivePoints = formData.get("positivePointsString");
    const negativePoints = formData.get("negativePointsString");

    const sendData = {
        rating,
        comment,
        positivePoints,
        negativePoints,
    };

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token?.value) {
            return {
                success: false,
                message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
            };
        }

        const response = await fetch(`${url}/products/${id}/reviews`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendData),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
