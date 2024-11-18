import {
    Home as HiOutlineHome,
    ShoppingCart as BiCart,
    LayoutGrid as RxDashboard,
    PenTool as TbBrandBlogger,
    Users as FiUsers,
    Package as BsFillBasketFill,
    PanelBottom as LuPanelBottom,
    Palette as MdOutlineColorLens,
} from "lucide-react";

export const sidebarItems = [
    { id: 1, name: "داشبورد", icon: HiOutlineHome, link: "/" },
    { id: 2, name: "محصولات", icon: BiCart, link: "/products" },
    { id: 3, name: "دسته بندی ها", icon: RxDashboard, link: "/categories" },
    { id: 4, name: "برندها", icon: TbBrandBlogger, link: "/brands" },
    { id: 5, name: "کاربران", icon: FiUsers, link: "/users" },
    { id: 6, name: "سفارشات", icon: BsFillBasketFill, link: "/orders" },
    { id: 7, name: "بنرها", icon: LuPanelBottom, link: "/banners" },
    { id: 8, name: "رنگ ها", icon: MdOutlineColorLens, link: "/colors" },
];
