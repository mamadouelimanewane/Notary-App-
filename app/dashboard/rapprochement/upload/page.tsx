'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileText } from "lucide-react";

export default function UploadBankStatementPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload-bank-statement', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                router.push('/dashboard/rapprochement');
            } else {
                alert('Erreur lors de l\'import');
            }
        } catch (error) {
            alert('Erreur lors de l\'import');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/rapprochement" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Importer un relevé bancaire</h1>
                    <p className="text-muted-foreground">Format CSV attendu: Date,Description,Montant,Type</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card p-8 space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <label htmlFor="file-upload" className="mt-4 inline-flex items-center cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Sélectionner un fichier CSV
                        </span>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    {file && (
                        <div className="mt-4 flex items-center justify-center text-sm">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">{file.name}</span>
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-2">💡 Format attendu :</p>
                    <pre className="text-xs bg-white p-2 rounded border">
                        {`Date,Description,Montant,Type
19/11/2025,Virement Client,15000.00,CREDIT
20/11/2025,Frais bancaires,12.50,DEBIT`}
                    </pre>
                    <a
                        href="/sample-bank-statement.csv"
                        download
                        className="mt-2 text-xs text-blue-600 hover:underline block"
                    >
                        📥 Télécharger un exemple de fichier CSV
                    </a>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/dashboard/rapprochement" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4">
                        Annuler
                    </Link>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Import en cours...' : 'Importer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
