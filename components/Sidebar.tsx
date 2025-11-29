"use client";

// FORCE RELOAD - Last update: 2024-11-28 10:40
// Fixed: cursor-pointer added to all links
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FolderOpen,
    FileText,
    Calendar,
    Calculator,
    Settings,
    Archive,
    Wallet,
    RefreshCw,
    BarChart3,
    Scale,
    FileCode,
    Shield,
    Mail,
    UserCircle,
    Home,
    List,
    GitBranch,
    Bot,
    Link,
    Glasses,
    BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Assistant IA", href: "/dashboard/assistant", icon: Bot },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Dossiers", href: "/dashboard/dossiers", icon: FolderOpen },
    { name: "Actes", href: "/dashboard/actes", icon: FileText },
    { name: "Types d'Actes", href: "/dashboard/types-actes", icon: List },
    { name: "Templates", href: "/dashboard/templates", icon: FileCode },
    { name: "Workflows", href: "/dashboard/workflows", icon: GitBranch },
    { name: "Archives", href: "/dashboard/archives", icon: Archive },
    { name: "Comptabilité", href: "/dashboard/comptabilite", icon: Calculator },
    { name: "Trésorerie", href: "/dashboard/tresorerie/caisse", icon: Wallet },
    { name: "Facturation", href: "/dashboard/facturation", icon: FileText },
    { name: "Rapprochement", href: "/dashboard/rapprochement", icon: RefreshCw },
    { name: "Rapports", href: "/dashboard/rapports", icon: BarChart3 },
    { name: "Calculateurs", href: "/dashboard/calculateurs", icon: Calculator },
    { name: "Recherche Juridique", href: "/dashboard/recherche-juridique", icon: Scale },
    { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { name: "Formalités", href: "/dashboard/formalites", icon: FileText },
    { name: "CRM", href: "/dashboard/crm", icon: Mail },
    { name: "Portail Client", href: "/dashboard/portail-client", icon: UserCircle },
    { name: "Négociation", href: "/dashboard/negociation", icon: Home },
    { name: "Documentation", href: "/dashboard/documentation", icon: FileText },

    // INNOVATION LAB
    { name: "Blockchain & Smart Contracts", href: "/dashboard/innovation/blockchain", icon: Link },
    { name: "Visites 3D & VR", href: "/dashboard/innovation/vr", icon: Glasses },
    { name: "Justice Prédictive", href: "/dashboard/innovation/predictive", icon: BrainCircuit },
];

const adminNavigation = [
    { name: "Utilisateurs", href: "/dashboard/admin/users", icon: Users },
    { name: "Privilèges", href: "/dashboard/admin/privileges", icon: Shield },
    { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';
    const [officeName, setOfficeName] = useState('Cabinet Notaire');

    useEffect(() => {
        fetch('/api/office-name')
            .then(res => res.json())
            .then(data => setOfficeName(data.officeName))
            .catch(() => setOfficeName('Cabinet Notaire'));
    }, []);

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            {/* Header */}
            <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4 flex-shrink-0">
                <h1 className="text-lg font-bold text-center text-white">
                    {officeName}
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = item.href;
                                }}
                                className={cn(
                                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0",
                                        isActive
                                            ? "text-white"
                                            : "text-slate-400 group-hover:text-blue-400"
                                    )}
                                    aria-hidden="true"
                                />
                                <span className={isActive ? "font-semibold" : "font-medium"}>
                                    {item.name}
                                </span>
                            </a>
                        );
                    })}

                    {/* Section Admin */}
                    {isAdmin && (
                        <>
                            <div className="my-4 border-t border-slate-700"></div>
                            <div className="px-3 py-2 mb-2">
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <Shield className="h-3.5 w-3.5 mr-2 text-red-400" />
                                    Administration
                                </div>
                            </div>
                            {adminNavigation.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                const Icon = item.icon;

                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = item.href;
                                        }}
                                        className={cn(
                                            "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                                            isActive
                                                ? "bg-red-600 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "mr-3 h-5 w-5 flex-shrink-0",
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-red-400"
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className={isActive ? "font-semibold" : "font-medium"}>
                                            {item.name}
                                        </span>
                                    </a>
                                );
                            })}
                        </>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-800 p-4 flex-shrink-0">
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">MD</span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Maître Dupont</p>
                        <p className="text-xs text-slate-400">Notaire</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
