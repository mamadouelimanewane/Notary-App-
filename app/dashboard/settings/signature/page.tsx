'use client';

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Save, Trash2, Download } from "lucide-react";

export default function SignatureSettingsPage() {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSignature, setLoadingSignature] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger la signature existante au montage
    useEffect(() => {
        async function loadSignature() {
            try {
                const response = await fetch('/api/signatures/current');
                const data = await response.json();

                if (data.signature) {
                    setSignature(data.signature.signatureData);
                    setSaved(true);

                    // Charger dans le canvas
                    if (sigCanvas.current) {
                        sigCanvas.current.fromDataURL(data.signature.signatureData);
                    }
                }
            } catch (err) {
                console.error('Erreur lors du  chargement de la signature:', err);
            } finally {
                setLoadingSignature(false);
            }
        }

        loadSignature();
    }, []);

    const clearSignature = () => {
        sigCanvas.current?.clear();
        setSaved(false);
        setError(null);
    };

    const saveSignature = async () => {
        if (!sigCanvas.current) return;

        const dataURL = sigCanvas.current.toDataURL();

        if (sigCanvas.current.isEmpty()) {
            setError('Veuillez dessiner une signature d\'abord');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/signatures/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ signatureData: dataURL }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la sauvegarde');
            }

            setSignature(dataURL);
            setSaved(true);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la sauvegarde de la signature');
            setSaved(false);
        } finally {
            setLoading(false);
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

    if (loadingSignature) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

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
                        disabled={loading}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Effacer
                    </button>
                    <button
                        onClick={saveSignature}
                        className="flex-1 inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 h-10 px-4"
                        disabled={loading}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-800 font-medium">❌ {error}</p>
                    </div>
                )}

                {saved && !error && (
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
