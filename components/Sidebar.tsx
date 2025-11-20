"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderOpen, FileText, Calculator, Calendar, FileCode, RefreshCw, Scale, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Dossiers", href: "/dashboard/dossiers", icon: FolderOpen },
    { name: "Actes", href: "/dashboard/actes", icon: FileText },
    { name: "Templates", href: "/dashboard/templates", icon: FileCode },
    { name: "Archives", href: "/dashboard/archives", icon: Archive },
    { name: "Comptabilité", href: "/dashboard/comptabilite", icon: Calculator },
    { name: "Rapprochement", href: "/dashboard/rapprochement", icon: RefreshCw },
    { name: "Recherche Juridique", href: "/dashboard/recherche-juridique", icon: Scale },
    { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-slate-800">
                <h1 className="text-xl font-bold">Notary App</h1>
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
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-xs font-medium">MD</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Maître Dupont</p>
                        <p className="text-xs text-slate-400">Notaire</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
