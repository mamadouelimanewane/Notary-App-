"use client";

import { Check } from "lucide-react";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterSelectProps {
    label: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    multiSelect?: boolean;
}

export default function FilterSelect({
    label,
    options,
    selectedValues,
    onChange,
    multiSelect = false
}: FilterSelectProps) {
    const handleToggle = (value: string) => {
        if (multiSelect) {
            if (selectedValues.includes(value)) {
                onChange(selectedValues.filter(v => v !== value));
            } else {
                onChange([...selectedValues, value]);
            }
        } else {
            onChange([value]);
        }
    };

    const handleClear = () => {
        onChange([]);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleToggle(option.value)}
                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isSelected
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                }`}
                        >
                            {isSelected && <Check className="mr-1 h-3 w-3" />}
                            {option.label}
                        </button>
                    );
                })}
                {selectedValues.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-red-100 text-red-900 hover:bg-red-200"
                    >
                        Effacer
                    </button>
                )}
            </div>
        </div>
    );
}
