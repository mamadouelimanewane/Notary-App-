import { Badge } from "@/components/ui/badge";
import { WorkflowStatus } from "@/lib/workflow";

interface WorkflowStatusBadgeProps {
    status: WorkflowStatus;
}

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
    BROUILLON: { label: "Brouillon", variant: "secondary" },
    EN_REVISION: { label: "En Révision", variant: "warning" },
    VALIDE: { label: "Validé", variant: "success" },
    SIGNE: { label: "Signé", variant: "default" },
    ENREGISTRE: { label: "Enregistré", variant: "outline" },
    ARCHIVE: { label: "Archivé", variant: "outline" }
};

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.BROUILLON;

    // Custom styling for variants that might not exist in default Badge
    const getStyle = () => {
        switch (config.variant) {
            case 'success':
                return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
            case 'warning':
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";
            case 'secondary':
                return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
            default:
                return "";
        }
    };

    return (
        <Badge variant={config.variant as any} className={getStyle()}>
            {config.label}
        </Badge>
    );
}
