import Link from "next/link";
import {
    UserPlus,
    FolderPlus,
    FileSignature,
    CalendarPlus,
    Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
    {
        title: "Nouveau Dossier",
        icon: FolderPlus,
        href: "/dashboard/dossiers/new",
        color: "text-blue-600",
        bg: "bg-blue-50",
        description: "Ouvrir un nouveau dossier client"
    },
    {
        title: "Nouvel Acte",
        icon: FileSignature,
        href: "/dashboard/actes/new",
        color: "text-purple-600",
        bg: "bg-purple-50",
        description: "Rédiger un acte ou un contrat"
    },
    {
        title: "Nouveau Client",
        icon: UserPlus,
        href: "/dashboard/clients/new",
        color: "text-green-600",
        bg: "bg-green-50",
        description: "Enregistrer un nouveau client"
    },
    {
        title: "Rendez-vous",
        icon: CalendarPlus,
        href: "/dashboard/agenda/new",
        color: "text-orange-600",
        bg: "bg-orange-50",
        description: "Planifier une signature ou un RDV"
    }
];

export function QuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {actions.map((action) => (
                <Link key={action.title} href={action.href}>
                    <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary h-full">
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${action.bg}`}>
                                <action.icon className={`h-6 w-6 ${action.color}`} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold leading-none tracking-tight">{action.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {action.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
