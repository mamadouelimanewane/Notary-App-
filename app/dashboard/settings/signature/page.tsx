'use client';

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Save, Trash2, Download } from "lucide-react";

export default function SignatureSettingsPage() {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const clearSignature = () => {
        sigCanvas.current?.clear();
        setSaved(false);
    };

    const saveSignature = () => {
        if (sigCanvas.current) {
            const dataURL = sigCanvas.current.toDataURL();
            setSignature(dataURL);
            setSaved(true);
            // TODO: Save to database via API
            alert("Signature sauvegardée ! (A implémenter: sauvegarde en base)");
        }
    };

    const downloadSignature = () => {
        if (signature) {
            const link = document.createElement('a');
            link.download = 'ma_signature.png';
            link.href = signature;
            link.click();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Ma Signature Électronique</h1>
                <p className="text-muted-foreground mt-1">Dessinez votre signature pour signer des actes</p>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white">
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{
                            className: 'w-full h-64',
                            style: { touchAction: 'none' }
                        }}
                        backgroundColor="white"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={clearSignature}
                        className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent h-10 px-4"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Effacer
                    </button>
                    <button
                        onClick={saveSignature}
                        className="flex-1 inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 h-10 px-4"
                    >
                        <Save className="mr-2 h-4 w-4" /> Enregistrer
                    </button>
                </div>

                {saved && signature && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-sm text-green-800 font-medium">✅ Signature enregistrée avec succès</p>
                        <button
                            onClick={downloadSignature}
                            className="mt-2 text-sm text-green-700 hover:underline inline-flex items-center"
                        >
                            <Download className="mr-1 h-4 w-4" /> Télécharger ma signature
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-900 font-medium">ℹ️ À propos de la signature électronique</p>
                <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Votre signature sera utilisée pour signer les actes</li>
                    <li>Une seule signature active par utilisateur</li>
                    <li>Horodatée et traçable</li>
                </ul>
            </div>
        </div>
    );
}
