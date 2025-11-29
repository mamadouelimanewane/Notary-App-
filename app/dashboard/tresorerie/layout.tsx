"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, Building2, ArrowRightLeft } from "lucide-react";

export default function TreasuryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { name: "Caisse (Espèces)", href: "/dashboard/tresorerie/caisse", icon: Wallet },
        { name: "Comptes Bancaires", href: "/dashboard/tresorerie/banques", icon: Building2 },
        { name: "Virements & Chèques", href: "/dashboard/tresorerie/virements", icon: ArrowRightLeft },
    ];

    return (
        <div className="flex flex-col space-y-6 p-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Trésorerie</h2>
                <p className="text-muted-foreground">
                    Gestion des flux financiers, banques et caisse.
                </p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                                )}
                            >
                                <tab.icon
                                    className={cn(
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-gray-500",
                                        "-ml-0.5 mr-2 h-5 w-5"
                                    )}
                                    aria-hidden="true"
                                />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
