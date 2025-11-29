import { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
    title: string;
    description: string;
    icon: LucideIcon;
    stats?: {
        label: string;
        value: string | number;
    }[];
}

export function HeroSection({ title, description, icon: Icon, stats }: HeroSectionProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <Icon className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {title}
                            </h1>
                            <p className="text-blue-100 text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Optional stats */}
                    {stats && stats.length > 0 && (
                        <div className="flex gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                    <div className="text-sm text-blue-100">{stat.label}</div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
    );
}
