"use client";

import { formatPrintDateTime } from "@/lib/print-utils";

interface PrintHeaderProps {
    title: string;
    subtitle?: string;
    officeName?: string;
    officeAddress?: string;
    officePhone?: string;
    showDate?: boolean;
}

export default function PrintHeader({
    title,
    subtitle,
    officeName = "Cabinet Notaire Keur Jaraaf",
    officeAddress,
    officePhone,
    showDate = true
}: PrintHeaderProps) {
    return (
        <div className="print-header border-b-2 border-slate-900 pb-4 mb-6">
            {/* Logo et informations cabinet */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{officeName}</h1>
                    {officeAddress && (
                        <p className="text-sm text-slate-600 mt-1">{officeAddress}</p>
                    )}
                    {officePhone && (
                        <p className="text-sm text-slate-600">Tél: {officePhone}</p>
                    )}
                </div>
                {showDate && (
                    <div className="text-right text-sm text-slate-600">
                        <p>{formatPrintDateTime()}</p>
                    </div>
                )}
            </div>

            {/* Titre du document */}
            <div className="text-center mt-6">
                <h2 className="text-xl font-bold text-slate-900 uppercase">{title}</h2>
                {subtitle && (
                    <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
