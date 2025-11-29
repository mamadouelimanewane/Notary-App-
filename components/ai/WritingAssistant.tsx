"use client";

import React, { useState } from 'react';
import { GenerationService, GenerationType } from '@/lib/ai/generation-service';
import {
    Bot,
    Sparkles,
    Copy,
    RefreshCw,
    Check,
    PenTool,
    Mail,
    FileText,
    Wand2,
    Edit3
} from 'lucide-react';

export function WritingAssistant() {
    const [prompt, setPrompt] = useState('');
    const [type, setType] = useState<GenerationType>('CLAUSE');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setResult('');

        try {
            const response = await GenerationService.generate(type, prompt);
            setResult(response.content);
        } catch (error) {
            console.error(error);
            setResult("Une erreur est survenue lors de la génération.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getTypeIcon = (t: GenerationType) => {
        switch (t) {
            case 'CLAUSE': return <FileText className="w-4 h-4" />;
            case 'EMAIL': return <Mail className="w-4 h-4" />;
            case 'CORRECTION': return <Check className="w-4 h-4" />;
            default: return <Sparkles className="w-4 h-4" />;
        }
    };

    const getLabel = (t: GenerationType) => {
        switch (t) {
            case 'CLAUSE': return "Rédiger une Clause";
            case 'EMAIL': return "Rédiger un Email";
            case 'CORRECTION': return "Corriger / Améliorer";
            case 'SUMMARY': return "Résumer un texte";
            default: return t;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Assistant de Rédaction IA</h3>
                        <p className="text-xs text-gray-500">Génération de contenu juridique & notarial</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar / Configuration */}
                <div className="w-1/3 border-r border-gray-100 p-4 bg-gray-50 flex flex-col gap-4 overflow-y-auto">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Type de tâche
                        </label>
                        <div className="space-y-2">
                            {(['CLAUSE', 'EMAIL', 'CORRECTION', 'SUMMARY'] as GenerationType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${type === t
                                        ? 'bg-white text-purple-600 shadow-sm border border-purple-100'
                                        : 'text-gray-600 hover:bg-white hover:text-gray-900'
                                        }`}
                                >
                                    {getTypeIcon(t)}
                                    {getLabel(t)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Votre demande
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={
                                type === 'CLAUSE' ? "Ex: Clause de réserve de propriété pour une vente de matériel..." :
                                    type === 'EMAIL' ? "Ex: Email pour informer le client que son dossier est prêt..." :
                                        "Décrivez ce que vous voulez..."
                            }
                            className="w-full h-48 p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Génération...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                Générer
                            </>
                        )}
                    </button>
                </div>

                {/* Zone de Résultat */}
                <div className="flex-1 p-6 bg-white overflow-y-auto relative">
                    {result ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Résultat généré (éditable)
                                </h4>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors px-3 py-1.5 rounded-md border border-gray-200 hover:border-purple-200"
                                >
                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {copied ? "Copié !" : "Copier"}
                                </button>
                            </div>

                            <textarea
                                value={result}
                                onChange={(e) => setResult(e.target.value)}
                                className="w-full min-h-[350px] p-4 rounded-xl border border-gray-200 text-sm leading-relaxed resize-y focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans bg-gray-50"
                                placeholder="Le résultat apparaîtra ici et sera modifiable..."
                            />

                            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs flex items-start gap-2">
                                <Bot className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>
                                    L'IA est une aide à la rédaction. Vérifiez toujours le contenu juridique avant de l'utiliser dans un acte officiel.
                                    <strong> Le texte ci-dessus est modifiable directement.</strong>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <PenTool className="w-8 h-8 text-gray-300" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">Prêt à rédiger</h4>
                            <p className="max-w-xs mx-auto text-sm">
                                Sélectionnez un type de contenu à gauche et décrivez votre besoin pour laisser l'IA générer une proposition.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
