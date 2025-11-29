'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createTemplate } from "@/app/actions";
import { ACTE_TYPES, ACTE_CATEGORIES, getActesByCategory, type ActeCategory } from "@/lib/acte-types";
import { extractVariables, validateTemplate, getSampleData, parseTemplate } from "@/lib/template-engine";
import Link from "next/link";
import { ArrowLeft, Eye, Code } from "lucide-react";

export default function NewTemplatePage() {
    const searchParams = useSearchParams();
    const initialContent = searchParams.get('content') || "";

    const [name, setName] = useState("");
    const [acteType, setActeType] = useState("");
    const [content, setContent] = useState(initialContent);
    const [showPreview, setShowPreview] = useState(false);
    const [fileData, setFileData] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Remove data URL prefix (e.g., "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,")
                const base64Content = base64String.split(',')[1];
                setFileData(base64Content);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation if no file is uploaded, check content
        if (!fileData) {
            const validation = validateTemplate(content);
            if (!validation.valid) {
                alert(`Erreurs de validation:\n${validation.errors.join('\n')}`);
                return;
            }
        }

        const variables = extractVariables(content);

        // Find category for this acte type
        const acteInfo = ACTE_TYPES[acteType as keyof typeof ACTE_TYPES];
        if (!acteInfo) {
            alert("Type d'acte invalide");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('acteType', acteType);
        formData.append('category', acteInfo.category);
        formData.append('content', content);
        formData.append('variables', JSON.stringify(variables));
        if (fileData) {
            formData.append('fileData', fileData);
        }

        await createTemplate(formData);
    };

    const previewHtml = showPreview ? parseTemplate(content, getSampleData()) : '';
    const detectedVariables = extractVariables(content);

    const insertVariable = (variable: string) => {
        const newContent = content + `{{${variable}}}`;
        setContent(newContent);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/templates" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nouveau Template</h1>
                    <p className="text-muted-foreground">Créez un modèle personnalisé pour vos actes</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Nom du template</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Ex: Mon modèle de vente personnalisé"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="acteType" className="text-sm font-medium">Type d'acte</label>
                        <select
                            id="acteType"
                            value={acteType}
                            onChange={(e) => setActeType(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="">Sélectionner un type...</option>
                            {Object.entries(ACTE_CATEGORIES).map(([key, label]) => (
                                <optgroup key={key} label={label}>
                                    {getActesByCategory(key as ActeCategory).map((acte) => (
                                        <option key={acte.type} value={acte.type}>
                                            {acte.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="file" className="text-sm font-medium">Fichier modèle (.docx)</label>
                        <input
                            type="file"
                            id="file"
                            accept=".docx"
                            onChange={handleFileChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <p className="text-xs text-muted-foreground">
                            Téléchargez un fichier Word (.docx) contenant les variables entre accolades (ex: {'{client.firstName}'}).
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Contenu du template</label>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="inline-flex items-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                            {showPreview ? <Code className="mr-1 h-4 w-4" /> : <Eye className="mr-1 h-4 w-4" />}
                            {showPreview ? 'Mode Édition' : 'Aperçu'}
                        </button>
                    </div>

                    {!showPreview ? (
                        <>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={20}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                placeholder="<h1>Compromis de Vente</h1>&#10;<p>Entre {{vendeur.firstName}} {{vendeur.lastName}}</p>&#10;<p>Et {{client.firstName}} {{client.lastName}}</p>"
                            />
                            <div className="bg-slate-50 p-4 rounded-md">
                                <p className="text-sm font-medium mb-2">Variables rapides :</p>
                                <div className="flex flex-wrap gap-2">
                                    {['client.firstName', 'client.lastName', 'dossier.ref', 'vendeur.firstName', 'bien.address', 'bien.price'].map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => insertVariable(v)}
                                            className="text-xs px-2 py-1 bg-white border rounded hover:bg-slate-100"
                                        >
                                            + {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="border rounded-md p-6 bg-white" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    )}

                    {detectedVariables.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-blue-900">Variables détectées ({detectedVariables.length}) :</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {detectedVariables.map((v) => (
                                    <span key={v} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                        {v}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/dashboard/templates" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2"
                    >
                        Créer le template
                    </button>
                </div>
            </form>
        </div>
    );
}
