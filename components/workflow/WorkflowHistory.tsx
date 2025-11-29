import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WorkflowHistoryProps {
    history: any[];
}

export function WorkflowHistory({ history }: WorkflowHistoryProps) {
    if (!history || history.length === 0) {
        return <div className="text-sm text-muted-foreground">Aucun historique disponible.</div>;
    }

    // Sort by newest first
    const sortedHistory = [...history].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
                {sortedHistory.map((entry) => (
                    <div key={entry.id} className="flex flex-col space-y-1 border-l-2 border-slate-200 pl-4 pb-2 relative">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-300" />
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{entry.action}</span>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(entry.timestamp), "d MMM yyyy à HH:mm", { locale: fr })}
                            </span>
                        </div>
                        <div className="text-xs text-slate-600">
                            Par <span className="font-medium">{entry.userName}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex gap-2">
                            <span className="bg-slate-100 px-1 rounded">{entry.oldStatus}</span>
                            <span>→</span>
                            <span className="bg-slate-100 px-1 rounded">{entry.newStatus}</span>
                        </div>
                        {entry.metadata?.comment && (
                            <div className="mt-1 text-xs italic text-slate-600 bg-yellow-50 p-2 rounded border border-yellow-100">
                                "{entry.metadata.comment}"
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
