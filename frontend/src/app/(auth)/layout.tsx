import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
    title: "تکنولایف - فروشگاه اینترنتی موبایل و تکنولوژی",
    description:
        "در فروشگاه آنلاین تکنولایف می توانید به مقایسه و خرید انواع گوشی، لپ تاپ، هدفون، تجهیزات شبکه، گیمینگ، لوازم خانگی و ابزارآلات با گارانتی و ارسال سریع بپردازید.",
};

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning={true}>
            <link rel="icon" href="/favicon.webp" />
            <body
                className={`${vazir.className}`}
                suppressHydrationWarning={true}
            >
                <>
                    {children}
                    <Toaster />
                </>
            </body>
        </html>
    );
}
