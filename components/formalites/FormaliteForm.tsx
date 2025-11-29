"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, AlertCircle } from 'lucide-react';
import { FormaliteType, FormalitePriorite, FormaliteStatus, type Formalite } from '@/types/formalite-types';
import { v4 as uuidv4 } from 'uuid';

export default function FormaliteForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Formalite>>({
        type: FormaliteType.AUTRE,
        priorite: FormalitePriorite.NORMALE,
        statut: FormaliteStatus.EN_ATTENTE,
        titre: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const now = new Date().toISOString();
            const newFormalite: Formalite = {
                id: uuidv4(),
                acteId: formData.acteId || '',
                dossierId: formData.dossierId || '',
                type: formData.type as FormaliteType,
                statut: FormaliteStatus.EN_ATTENTE,
                priorite: formData.priorite as FormalitePriorite,
                titre: formData.titre || 'Nouvelle Formalité',
                description: formData.description,
                reference: formData.reference,
                dateCreation: now,
                dateEcheance: formData.dateEcheance,
                organisme: formData.organisme,
                frais: formData.frais || { montantBase: 0, taxe: 0, fraisGestion: 0, total: 0, devise: 'FCFA' },
                detailsSpecifiques: formData.detailsSpecifiques,
                responsable: formData.responsable,
                observations: formData.observations,
                creePar: 'manual'
            };

            const response = await fetch('/api/formalites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormalite)
            });
            if (!response.ok) {
                throw new Error('Failed to create formalité');
            }
            router.push('/dashboard/formalites');
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la création de la formalité');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Créer une Formalité
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                    type="text"
                    name="titre"
                    required
                    value={formData.titre || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                    name="type"
                    required
                    value={formData.type as string}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    {Object.values(FormaliteType).map(t => (
                        <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité *</label>
                <select
                    name="priorite"
                    required
                    value={formData.priorite as string}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    {Object.values(FormalitePriorite).map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                <input
                    type="date"
                    name="dateEcheance"
                    value={formData.dateEcheance?.split('T')[0] || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisme destinataire</label>
                <input
                    type="text"
                    name="organisme"
                    value={formData.organisme || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-5 focus:ring-blue-5"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}
