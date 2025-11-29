import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

export interface FilterOption {
    id: string;
    label: string;
    icon?: LucideIcon;
    count?: number;
    gradient?: string;
}

interface FilterPillsProps {
    options: FilterOption[];
    selected: string;
    onSelect: (id: string) => void;
    className?: string;
}

export function FilterPills({ options, selected, onSelect, className = "" }: FilterPillsProps) {
    return (
        <div className={`flex flex-wrap gap-3 ${className}`}>
            {options.map((option) => {
                const Icon = option.icon;
                const isSelected = selected === option.id;

                return (
                    <Button
                        key={option.id}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => onSelect(option.id)}
                        className={`rounded-full transition-all ${isSelected && option.gradient
                                ? `bg-gradient-to-r ${option.gradient} shadow-lg text-white border-0`
                                : isSelected
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                                    : 'hover:border-blue-400 hover:shadow-md'
                            }`}
                    >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        <span className="hidden sm:inline">{option.label}</span>
                        <span className="sm:hidden">{option.label.slice(0, 3)}</span>
                        {option.count !== undefined && (
                            <Badge
                                variant={isSelected ? "secondary" : "outline"}
                                className="ml-2"
                            >
                                {option.count}
                            </Badge>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
