import { SidebarPure } from "@/components/SidebarPure";
import { TopBar } from "@/components/TopBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarPure />
            <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: '256px' }}>
                <TopBar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
