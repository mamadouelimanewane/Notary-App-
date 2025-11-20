"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface SortOption {
    label: string;
    field: string;
}

interface SortDropdownProps {
    options: SortOption[];
    currentSort: { field: string; direction: 'asc' | 'desc' } | null;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
}

export default function SortDropdown({ options, currentSort, onSort }: SortDropdownProps) {
    const handleSort = (field: string) => {
        if (currentSort?.field === field) {
            // Toggle direction
            onSort(field, currentSort.direction === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to ascending
            onSort(field, 'asc');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Trier par:</span>
            <div className="flex gap-2">
                {options.map((option) => {
                    const isActive = currentSort?.field === option.field;
                    const Icon = !isActive
                        ? ArrowUpDown
                        : currentSort?.direction === 'asc'
                            ? ArrowUp
                            : ArrowDown;

                    return (
                        <button
                            key={option.field}
                            type="button"
                            onClick={() => handleSort(option.field)}
                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                }`}
                        >
                            <Icon className="mr-1 h-3 w-3" />
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
