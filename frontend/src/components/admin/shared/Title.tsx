"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface IProps {
    title: string;
    url?: string;
}

const Title: FC<IProps> = ({ title, url }) => {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center border-b p-3 mb-6">
            <h2 className="font-bold text-lg">{title}</h2>
            {url && (
                <Button onClick={() => router.push(url)}>
                    <MoveLeft />
                </Button>
            )}
        </div>
    );
};

export default Title;
