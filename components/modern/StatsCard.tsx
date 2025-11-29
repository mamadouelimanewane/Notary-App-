import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { memo } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    gradient: string;
    description?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    onClick?: () => void;
}

export const StatsCard = memo(function StatsCard({
    title,
    value,
    icon: Icon,
    gradient,
    description,
    trend,
    onClick
}: StatsCardProps) {
    return (
        <Card
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${gradient} text-white overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('from-', 'from-').replace('to-', 'to-').split(' ').map(c => c.replace(/500/g, '600')).join(' ')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

            <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-white/80">
                        {title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-white/60" />
                </div>
            </CardHeader>

            <CardContent className="relative z-10">
                <div className="text-5xl font-bold mb-1">{value}</div>
                {description && (
                    <p className="text-xs text-white/70">{description}</p>
                )}
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend.isPositive
                            ? 'text-green-200'
                            : 'text-red-200'
                        }`}>
                        {trend.isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {trend.value}
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

StatsCard.displayName = 'StatsCard';
