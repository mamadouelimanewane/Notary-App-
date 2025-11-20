"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (value: string) => void;
    debounceMs?: number;
}

export default function SearchBar({
    placeholder = "Rechercher...",
    onSearch,
    debounceMs = 300
}: SearchBarProps) {
    const [value, setValue] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [value, onSearch, debounceMs]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
        </div>
    );
}
