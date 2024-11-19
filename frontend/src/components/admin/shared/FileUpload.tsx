import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
    file: File | null;
    label?: string;
    alt?: string;
    width?: string;
    height?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileChange,
    file,
    label = "انتخاب تصویر",
    alt = "selected-image",
    width,
    height,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFilePreviewUrl(url);

            return () => URL.revokeObjectURL(url);
        } else {
            setFilePreviewUrl(null);
        }
    }, [file]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        onFileChange(selectedFile);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        onFileChange(null);
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            {filePreviewUrl ? (
                <div className="relative mb-2">
                    <Image
                        src={filePreviewUrl}
                        alt={alt}
                        className="size-24 object-cover rounded-md"
                        style={{ width, height }}
                        width={200}
                        height={200}
                    />
                    <Button
                        type="button"
                        onClick={handleRemoveFile}
                        variant="danger"
                        size="sm"
                        className="absolute top-0 right-0"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    onClick={handleButtonClick}
                    variant="warn"
                >
                    {label}
                </Button>
            )}
        </div>
    );
};

export default FileUpload;
