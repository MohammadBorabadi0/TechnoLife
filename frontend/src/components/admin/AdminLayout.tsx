"use client";

import { User } from "@/utils/types";
import { FC, ReactNode } from "react";
import Nav from "@/components/admin/Nav";
import Sidebar from "@/components/admin/Sidebar";
import { useUIStore } from "@/stores/useUIStore";

interface IProps {
    user: User;
    children: ReactNode;
}

const AdminLayout: FC<IProps> = ({ user, children }) => {
    const { isSidebarOpen } = useUIStore();

    return (
        <div className="flex max-w-screen-2xl mx-auto">
            <Sidebar user={user} />
            <main
                style={{
                    width: isSidebarOpen
                        ? "calc(100% - 230px)"
                        : "calc(100% - 75px)",
                }}
            >
                <Nav />
                <div className="m-2">{children}</div>
            </main>
        </div>
    );
};

export default AdminLayout;
