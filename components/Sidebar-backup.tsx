// BACKUP DE L'ANCIENNE SIDEBAR REACT
// Ce fichier est une sauvegarde de la sidebar React originale
// En cas de besoin, vous pouvez restaurer ce fichier

"use client";

import Link from "next/link";
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
    Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Dossiers", href: "/dashboard/dossiers", icon: FolderOpen },
    { name: "Actes", href: "/dashboard/actes", icon: FileText },
    { name: "Templates", href: "/dashboard/templates", icon: FileCode },
    { name: "Archives", href: "/dashboard/archives", icon: Archive },
    { name: "Comptabilité", href: "/dashboard/comptabilite", icon: Calculator },
    { name: "Trésorerie", href: "/dashboard/tresorerie/caisse", icon: Wallet },
    { name: "Facturation", href: "/dashboard/facturation", icon: FileText },
    { name: "Rapprochement", href: "/dashboard/rapprochement", icon: RefreshCw },
    { name: "Rapports", href: "/dashboard/rapports", icon: BarChart3 },
    { name: "Recherche Juridique", href: "/dashboard/recherche-juridique", icon: Scale },
    { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { name: "Formalités", href: "/dashboard/formalites", icon: FileText },
    { name: "CRM", href: "/dashboard/crm", icon: Mail },
    { name: "Portail Client", href: "/dashboard/portail-client", icon: UserCircle },
    { name: "Négociation", href: "/dashboard/negociation", icon: Home },
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
            <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
                <h1 className="text-lg font-bold text-center">{officeName}</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <div className="mt-8 pt-4 border-t border-slate-800">
                        <div className="px-2 mb-2">
                            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Administration
                            </h2>
                        </div>
                        {adminNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "mr-3 h-5 w-5 flex-shrink-0",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>
        </div>
    );
}
