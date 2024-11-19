import { supabase } from "./supabase";

export const En_To_Fa = (enNumber: number | string): string => {
    const enToFa: { [key: string]: string } = {
        "0": "۰",
        "1": "۱",
        "2": "۲",
        "3": "۳",
        "4": "۴",
        "5": "۵",
        "6": "۶",
        "7": "۷",
        "8": "۸",
        "9": "۹",
    };

    const enNumberStr = enNumber.toString();

    const faNumber = enNumberStr
        .split("")
        .map((digit) => enToFa[digit] || digit)
        .join("");

    return faNumber;
};

export const uploadFileToSupabase = async (
    file: File,
    folder: string
): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;

    // Upload the file to the specified folder in Supabase storage
    const { error } = await supabase.storage
        .from("images") // Replace "images" with your bucket name
        .upload(`${folder}/${fileName}`, file);

    if (error) {
        console.error("Error uploading file:", error);
        return null;
    }

    // Retrieve the public URL of the uploaded file
    const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(`${folder}/${fileName}`);

    return publicData?.publicUrl || null;
};

// Convert Image Url To File
export const imageUrlToFile = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Detect MIME type
    const mimeType = blob.type || "image/png"; // Default to PNG if MIME type is not specified

    // File name based on MIME type
    const fileExtension = mimeType.split("/")[1]; // Get the correct extension
    const fileName = `${Date.now()}.${fileExtension}`;

    const file = new File([blob], fileName, { type: mimeType });
    return file;
};
