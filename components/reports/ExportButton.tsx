'use client';

import { FileDown, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
    onExportPDF: () => void;
    onExportExcel: () => void;
    label?: string;
}

export default function ExportButton({ onExportPDF, onExportExcel, label = "Exporter" }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 text-sm font-medium"
            >
                <FileDown className="mr-2 h-4 w-4" />
                {label}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    onExportPDF();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                <FileDown className="mr-2 h-4 w-4 text-red-600" />
                                Exporter en PDF
                            </button>
                            <button
                                onClick={() => {
                                    onExportExcel();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                Exporter en Excel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
