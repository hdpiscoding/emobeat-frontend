import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import SideBar from "@/components/SideBar.tsx";

export default function MainLayout({ children }: { children: React.ReactNode }){
    return (
        <SidebarProvider>
            <SideBar/>
            <main className={`flex transition-all duration-300`}>
                {children}
            </main>
        </SidebarProvider>
    );
}