import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ModernSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    debounceMs?: number;
}

// Hook useDebounce pour optimiser les performances
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function ModernSearchBar({
    value,
    onChange,
    placeholder = "Rechercher...",
    className = "",
    debounceMs = 300
}: ModernSearchBarProps) {
    const [localValue, setLocalValue] = useState(value);
    const debouncedValue = useDebounce(localValue, debounceMs);

    // Sync debounced value with parent
    useEffect(() => {
        if (debouncedValue !== value) {
            onChange(debouncedValue);
        }
    }, [debouncedValue, onChange, value]);

    // Sync with external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="pl-12 pr-12 h-14 text-lg border-2 focus:border-blue-500 rounded-xl shadow-sm"
            />
            {localValue && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted"
                    onClick={() => {
                        setLocalValue('');
                        onChange('');
                    }}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
