import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorkflowCommentsProps {
    comments: any[];
}

export function WorkflowComments({ comments }: WorkflowCommentsProps) {
    if (!comments || comments.length === 0) {
        return <div className="text-sm text-muted-foreground p-4 text-center">Aucun commentaire.</div>;
    }

    // Sort by newest first
    const sortedComments = [...comments].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
                {sortedComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {comment.userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(comment.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-md">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
