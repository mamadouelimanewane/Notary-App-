"use client";

import { Printer } from "lucide-react";
import { triggerPrint, preparePrintDocument, PrintSettings } from "@/lib/print-utils";

interface PrintButtonProps {
    label?: string;
    settings?: PrintSettings;
    variant?: 'default' | 'outline' | 'icon';
    onBeforePrint?: () => void;
}

export default function PrintButton({
    label = "Imprimer",
    settings = {},
    variant = 'default',
    onBeforePrint
}: PrintButtonProps) {
    const handlePrint = () => {
        if (onBeforePrint) {
            onBeforePrint();
        }
        preparePrintDocument(settings);
        setTimeout(() => triggerPrint(), 100);
    };

    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantClasses = {
        default: "bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2",
        outline: "border border-slate-300 bg-white hover:bg-slate-50 h-10 px-4 py-2",
        icon: "bg-slate-100 hover:bg-slate-200 h-9 w-9 p-0"
    };

    return (
        <button
            onClick={handlePrint}
            className={`${baseClasses} ${variantClasses[variant]}`}
            title={label}
        >
            <Printer className={variant === 'icon' ? "h-4 w-4" : "mr-2 h-4 w-4"} />
            {variant !== 'icon' && label}
        </button>
    );
}
