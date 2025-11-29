"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { InternalNotification } from "@/types/db";
import { getNotifications, markNotificationRead } from "@/app/actions";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface NotificationCenterProps {
    userId: string;
    className?: string;
}

export function NotificationCenter({ userId, className }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<InternalNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const data = await getNotifications(userId);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [userId]);

    const handleMarkAsRead = async (id: string, link?: string) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (link) {
                router.push(link);
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications?.length > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {notifications?.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {notifications.length} nouvelles
                        </Badge>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {!notifications || notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Aucune nouvelle notification
                        </div>
                    ) : (
                        <div className="space-y-1 p-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="flex items-start gap-3 p-3 text-sm hover:bg-muted rounded-md cursor-pointer transition-colors"
                                    onClick={() => handleMarkAsRead(notification.id, notification.link)}
                                >
                                    <div className="mt-0.5">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium leading-none">{notification.title}</p>
                                        <p className="text-muted-foreground text-xs line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
