import { ReactNode } from 'react';

interface ModernPageLayoutProps {
    children: ReactNode;
    className?: string;
}

export function ModernPageLayout({ children, className = "" }: ModernPageLayoutProps) {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className}`}>
            <div className="container mx-auto p-6 space-y-8">
                {children}
            </div>
        </div>
    );
}
