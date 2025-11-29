"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Scan, Upload, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import { OcrService, ExtractedIdentity } from '@/lib/ai/ocr-service';

interface IdCardScannerProps {
    onScanComplete: (data: ExtractedIdentity) => void;
}

export function IdCardScanner({ onScanComplete }: IdCardScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scannedData, setScannedData] = useState<ExtractedIdentity | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setError(null);
        setScannedData(null);
        setIsScanning(true);

        try {
            const data = await OcrService.scanIdentityCard(file);
            setScannedData(data);
            onScanComplete(data);
        } catch (err) {
            console.error(err);
            setError("Impossible de lire le document. Veuillez réessayer avec une image plus nette.");
        } finally {
            setIsScanning(false);
        }
    }, [onScanComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className="w-full mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Scan className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Scan Intelligent (IA)</h3>
                        <p className="text-xs text-gray-500">Remplissage automatique via CNI ou Passeport</p>
                    </div>
                </div>
                {isScanning && (
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-medium animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyse en cours...
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Zone de Drop */}
                    <div
                        {...getRootProps()}
                        className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              flex flex-col items-center justify-center min-h-[200px]
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
              ${preview ? 'bg-gray-50' : ''}
            `}
                    >
                        <input {...getInputProps()} />

                        {preview ? (
                            <div className="relative w-full h-full flex flex-col items-center">
                                <img
                                    src={preview}
                                    alt="Aperçu"
                                    className="max-h-[180px] object-contain rounded-lg shadow-sm mb-4"
                                />
                                <button
                                    className="text-xs text-gray-500 hover:text-blue-600 underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreview(null);
                                        setScannedData(null);
                                    }}
                                >
                                    Scanner un autre document
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    Glissez votre pièce d'identité ici
                                </p>
                                <p className="text-xs text-gray-500">
                                    ou cliquez pour sélectionner (JPG, PNG)
                                </p>
                            </>
                        )}
                    </div>

                    {/* Résultats */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            Données Extraites
                        </h4>

                        {error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        ) : scannedData ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-xs text-gray-500 uppercase">Nom</span>
                                    <span className="font-medium text-gray-900">{scannedData.lastName || 'Non détecté'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-xs text-gray-500 uppercase">Prénoms</span>
                                    <span className="font-medium text-gray-900">{scannedData.firstName || 'Non détecté'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-xs text-gray-500 uppercase">Né(e) le</span>
                                    <span className="font-medium text-gray-900">{scannedData.birthDate || 'Non détecté'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-xs text-gray-500 uppercase">N° Pièce</span>
                                    <span className="font-medium text-gray-900">{scannedData.idNumber || 'Non détecté'}</span>
                                </div>

                                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-xs flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Formulaire pré-rempli avec succès !
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm text-center">
                                <Scan className="w-8 h-8 mb-2 opacity-50" />
                                <p>En attente d'un document...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
