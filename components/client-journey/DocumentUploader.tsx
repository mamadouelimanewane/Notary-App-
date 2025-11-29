"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Tesseract from 'tesseract.js';

interface DocumentUploaderProps {
    onDataExtracted?: (data: any) => void;
}

export function DocumentUploader({ onDataExtracted }: DocumentUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        setExtractedData(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 2
    });

    const extractTextFromImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            Tesseract.recognize(
                file,
                'fra', // French language
                {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            ).then(({ data: { text } }) => {
                resolve(text);
            }).catch(reject);
        });
    };

    const parseIDCardData = (text: string) => {
        // Simple parsing logic for French ID cards / Senegalese CNI
        const data: any = {};

        // Extract name (usually in caps)
        const nameMatch = text.match(/([A-Z]{2,}\s+[A-Z]{2,})/);
        if (nameMatch) {
            const parts = nameMatch[1].split(' ');
            data.lastName = parts[0];
            data.firstName = parts.slice(1).join(' ');
        }

        // Extract birth date (format: DD/MM/YYYY or DD.MM.YYYY)
        const birthDateMatch = text.match(/(\d{2})[\/\.](\d{2})[\/\.](\d{4})/);
        if (birthDateMatch) {
            data.birthDate = `${birthDateMatch[3]}-${birthDateMatch[2]}-${birthDateMatch[1]}`;
        }

        // Extract ID number (varies by country)
        const idNumberMatch = text.match(/N[°º]?\s*(\d{10,})/i);
        if (idNumberMatch) {
            data.idNumber = idNumberMatch[1];
        }

        // Extract address (usually after "Adresse" or "Domicile")
        const addressMatch = text.match(/(?:Adresse|Domicile)[:\s]+([^\n]+)/i);
        if (addressMatch) {
            data.address = addressMatch[1].trim();
        }

        return data;
    };

    const processDocuments = async () => {
        if (files.length === 0) {
            toast({
                title: "Aucun fichier",
                description: "Veuillez d'abord sélectionner des documents.",
                variant: "destructive"
            });
            return;
        }

        setProcessing(true);
        setProgress(0);

        try {
            const results = [];

            for (const file of files) {
                toast({
                    title: "Traitement en cours",
                    description: `Extraction des données de ${file.name}...`
                });

                const text = await extractTextFromImage(file);
                results.push({ file: file.name, text });
            }

            // Parse the first document (assumed to be ID card)
            const parsedData = parseIDCardData(results[0].text);
            setExtractedData(parsedData);

            if (onDataExtracted) {
                onDataExtracted(parsedData);
            }

            toast({
                title: "Extraction réussie",
                description: "Les données ont été extraites avec succès."
            });
        } catch (error: any) {
            console.error('OCR Error:', error);
            toast({
                title: "Erreur",
                description: "Impossible d'extraire les données du document.",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Upload de Documents</CardTitle>
                    <CardDescription>
                        Glissez-déposez vos pièces d'identité (recto/verso) ou cliquez pour sélectionner
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        {isDragActive ? (
                            <p className="text-sm text-muted-foreground">Déposez les fichiers ici...</p>
                        ) : (
                            <>
                                <p className="text-sm font-medium mb-1">
                                    Glissez-déposez vos documents ici
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ou cliquez pour parcourir (PNG, JPG, PDF)
                                </p>
                            </>
                        )}
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium">Fichiers sélectionnés :</h4>
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                                    <FileText className="h-4 w-4" />
                                    <span>{file.name}</span>
                                    <span className="text-muted-foreground">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {processing && (
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Extraction en cours... {progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <Button
                            onClick={processDocuments}
                            disabled={files.length === 0 || processing}
                            className="w-full"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Extraction en cours...
                                </>
                            ) : (
                                'Extraire les données'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {extractedData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Données Extraites
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {extractedData.firstName && (
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">Prénom :</span>
                                <span className="text-sm">{extractedData.firstName}</span>
                            </div>
                        )}
                        {extractedData.lastName && (
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">Nom :</span>
                                <span className="text-sm">{extractedData.lastName}</span>
                            </div>
                        )}
                        {extractedData.birthDate && (
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">Date de naissance :</span>
                                <span className="text-sm">{extractedData.birthDate}</span>
                            </div>
                        )}
                        {extractedData.idNumber && (
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">N° Pièce :</span>
                                <span className="text-sm">{extractedData.idNumber}</span>
                            </div>
                        )}
                        {extractedData.address && (
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">Adresse :</span>
                                <span className="text-sm">{extractedData.address}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
