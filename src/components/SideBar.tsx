import { useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, HeartIcon } from "lucide-react";
import { LuSearch } from "react-icons/lu";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar.tsx";

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Explore",
        url: "/explore",
        icon: LuSearch,
    },
    {
        title: "My favorite",
        url: "/favorite",
        icon: HeartIcon,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <div className="lg:mr-10 cursor-pointer" onClick={() => navigate("/")}>
                            <img src="/icon/emobeat_horizontal.png" alt={"icon"} className="h-16 w-44" />
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={
                                                isActive
                                                    ? "bg-[#518EE6] text-white hover:bg-[#518EE6]"
                                                    : "hover:bg-[#e7e7e7]"
                                            }
                                            onClick={() => navigate(item.url)}
                                        >
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer">
                                                <item.icon className={isActive ? "text-white" : "text-[#333] font-semibold"} />
                                                <span className={isActive ? "text-white font-semibold" : "text-[#333] font-semibold"}>
                                                    {item.title}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}