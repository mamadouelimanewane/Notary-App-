"use client";

import { useSession } from "next-auth/react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Search, FileText, Users, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSearchResults(data.results || []);
                        setIsSearchOpen(true);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsLoading(false);
                }
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setSearchResults(null);
            setIsSearchOpen(false);
        }
    }, [searchQuery]);

    const handleNavigate = (url: string) => {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults(null);
        router.push(url);
    };

    const totalResults = searchResults ? searchResults.length : 0;

    // Group results by type
    const groupedResults = searchResults ? {
        clients: searchResults.filter((r: any) => r.type === 'CLIENT'),
        dossiers: searchResults.filter((r: any) => r.type === 'DOSSIER'),
        actes: searchResults.filter((r: any) => r.type === 'ACTE'),
    } : null;

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center flex-1 gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher un dossier, un client, un acte..."
                            className="w-full bg-gray-50 pl-9 md:w-[300px] lg:w-[400px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {userId && <NotificationCenter userId={userId} />}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {session?.user?.name?.[0] || "U"}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium">{session?.user?.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {session?.user?.role?.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Résultats de recherche</DialogTitle>
                        <DialogDescription>
                            {isLoading ? "Recherche en cours..." : `${totalResults} résultat${totalResults > 1 ? 's' : ''} trouvé${totalResults > 1 ? 's' : ''} pour "${searchQuery}"`}
                        </DialogDescription>
                    </DialogHeader>

                    {groupedResults && !isLoading && (
                        <div className="space-y-6 mt-4">
                            {/* Clients */}
                            {groupedResults.clients && groupedResults.clients.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>Clients ({groupedResults.clients.length})</span>
                                    </div>
                                    <div className="space-y-2">
                                        {groupedResults.clients.map((result: any) => (
                                            <div
                                                key={result.id}
                                                className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
                                                onClick={() => handleNavigate(result.url)}
                                            >
                                                <div className="font-medium">{result.title}</div>
                                                <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{result.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dossiers */}
                            {groupedResults.dossiers && groupedResults.dossiers.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <FolderOpen className="h-4 w-4" />
                                        <span>Dossiers ({groupedResults.dossiers.length})</span>
                                    </div>
                                    <div className="space-y-2">
                                        {groupedResults.dossiers.map((result: any) => (
                                            <div
                                                key={result.id}
                                                className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between"
                                                onClick={() => handleNavigate(result.url)}
                                            >
                                                <div>
                                                    <div className="font-medium">{result.title}</div>
                                                    <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{result.description}</div>
                                                </div>
                                                {result.status && (
                                                    <Badge variant={result.status === "EN_COURS" ? "default" : "secondary"}>
                                                        {result.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actes */}
                            {groupedResults.actes && groupedResults.actes.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span>Actes ({groupedResults.actes.length})</span>
                                    </div>
                                    <div className="space-y-2">
                                        {groupedResults.actes.map((result: any) => (
                                            <div
                                                key={result.id}
                                                className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between"
                                                onClick={() => handleNavigate(result.url)}
                                            >
                                                <div>
                                                    <div className="font-medium">{result.title}</div>
                                                    <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{result.description}</div>
                                                </div>
                                                {result.status && (
                                                    <Badge>{result.status}</Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {totalResults === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Aucun résultat trouvé pour "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
