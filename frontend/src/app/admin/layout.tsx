import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "@/styles/globals.css";
import ThemeProvider from "@/components/admin/ThemeProvider";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster } from "@/components/ui/toaster";
import { getUser } from "@/actions/users";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
    title: "تکنولایف - فروشگاه اینترنتی موبایل و تکنولوژی",
    description:
        "در فروشگاه آنلاین تکنولایف می توانید به مقایسه و خرید انواع گوشی، لپ تاپ، هدفون، تجهیزات شبکه، گیمینگ، لوازم خانگی و ابزارآلات با گارانتی و ارسال سریع بپردازید.",
};

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: user } = await getUser();

    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning={true}>
            <link rel="icon" href="/favicon.webp" sizes="32*32" />
            <body
                className={`${vazir.className}`}
                suppressHydrationWarning={true}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AdminLayout user={user}>{children}</AdminLayout>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
