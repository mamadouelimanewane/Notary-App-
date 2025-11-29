"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SignatureSettingsPage() {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        // In a real app, this would send the base64 string to the API
        toast({
            title: "Signature enregistrée",
            description: "Votre signature a été mise à jour avec succès.",
        });
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-serif text-primary">Signature Numérique</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez votre signature numérique pour la validation des actes et documents.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ma Signature</CardTitle>
                    <CardDescription>
                        Importez une image de votre signature (PNG ou JPG, fond transparent recommandé).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 bg-muted/10">
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Signature Preview" className="max-h-40 object-contain" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                                    onClick={handleClear}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full inline-block">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Cliquez pour uploader ou glissez-déposez</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu'à 2MB</p>
                                </div>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    Sélectionner un fichier
                                </Button>
                            </div>
                        )}
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleUpload} disabled={!preview} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enregistrer la signature
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Utilisation</CardTitle>
                    <CardDescription>
                        Comment votre signature sera utilisée
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Apposition automatique sur les actes générés en PDF.</li>
                        <li>Validation des flux de travail (workflows).</li>
                        <li>Signature des courriers et factures.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
