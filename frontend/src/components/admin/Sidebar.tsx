import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import { User } from "@/utils/types";
// store
import { useUIStore } from "@/stores/useUIStore";
// data
import { sidebarItems } from "@/data/data";
// icons
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface IProps {
    user: User;
}

const Sidebar: FC<IProps> = ({ user }) => {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <aside
            className="sticky top-0 bg-primary-foreground h-screen overflow-y-auto"
            style={{
                width: isSidebarOpen ? "230px" : "75px",
                minWidth: isSidebarOpen ? "230px" : "75px",
                maxWidth: isSidebarOpen ? "230px" : "75px",
            }}
        >
            <div className="flex flex-col h-full">
                {/* User Info */}
                <div className="flex items-center gap-4 p-4">
                    <div className="rounded-full overflow-hidden ring-2 ring-offset-2">
                        <Image
                            src={
                                user && user.avatar ? user.avatar : `/user.webp`
                            }
                            alt="User Image"
                            width={200}
                            height={200}
                            className={`object-cover rounded-full ${
                                isSidebarOpen ? "size-16" : "size-10"
                            }`}
                        />
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col items-center gap-1">
                            {user && (
                                <h4 className="font-semibold">
                                    {user.firstName}
                                </h4>
                            )}
                            <p className="text-xs text-primary">ادمین</p>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <ul className="flex flex-col space-y-4 px-2 mt-6">
                    {sidebarItems.map((item, index) => (
                        <li key={index} className="relative group">
                            <Link
                                href={`/admin${item.link}`}
                                className={`flex items-center gap-2 p-2.5 rounded hover:bg-secondary transition-all ${
                                    !isSidebarOpen ? "justify-center" : ""
                                }`}
                            >
                                <item.icon />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Toggle Button */}
                <button
                    className="mt-auto flex justify-center w-full bg-secondary py-2"
                    onClick={toggleSidebar}
                >
                    {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
