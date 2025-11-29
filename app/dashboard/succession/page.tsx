"use client";

import React, { useState, useMemo } from 'react';
import { Plus, User, Trash2, Calculator, Users, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { SuccessionEngine, FamilyMember, HeirType } from '@/lib/succession/engine';

export default function SuccessionSimulatorPage() {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberType, setNewMemberType] = useState<HeirType>('ENFANT');
    const [totalAssets, setTotalAssets] = useState(10000000); // 10 Millions CFA par défaut

    // Ajouter un membre
    const addMember = () => {
        if (!newMemberName.trim()) return;

        // Contrainte : Un seul conjoint
        if (newMemberType === 'CONJOINT' && members.some(m => m.type === 'CONJOINT')) {
            alert("Il ne peut y avoir qu'un seul conjoint survivant.");
            return;
        }

        const newMember: FamilyMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: newMemberName,
            type: newMemberType,
            isAlive: true
        };

        setMembers([...members, newMember]);
        setNewMemberName('');
    };

    // Supprimer un membre
    const removeMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    // Calculer les résultats en temps réel
    const results = useMemo(() => {
        return SuccessionEngine.calculate(members, totalAssets);
    }, [members, totalAssets]);

    // Préparer les données pour le graphique
    const chartData = useMemo(() => {
        return results.shares.map(share => {
            const member = members.find(m => m.id === share.heirId);
            return {
                name: member?.name || 'Inconnu',
                value: share.percentage,
                amount: share.value
            };
        });
    }, [results, members]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">🌳 Simulateur Successoral</h1>
                <p className="text-muted-foreground mt-1">
                    Modélisez la famille et visualisez instantanément la répartition de l'héritage.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLONNE GAUCHE : Configuration Famille */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Formulaire Ajout */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Ajouter un héritier
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Rôle</label>
                                <select
                                    value={newMemberType}
                                    onChange={(e) => setNewMemberType(e.target.value as HeirType)}
                                    className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3 text-sm"
                                >
                                    <option value="CONJOINT">Conjoint Survivant</option>
                                    <option value="ENFANT">Enfant</option>
                                    <option value="PERE">Père</option>
                                    <option value="MERE">Mère</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Nom & Prénom</label>
                                <input
                                    type="text"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    placeholder="Ex: Jean Dupont"
                                    className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && addMember()}
                                />
                            </div>

                            <button
                                onClick={addMember}
                                className="w-full bg-slate-900 text-white h-10 rounded-md text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter à l'arbre
                            </button>
                        </div>
                    </div>

                    {/* Liste des Membres */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center justify-between">
                            <span>Membres de la famille</span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                {members.length}
                            </span>
                        </h3>

                        {members.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                Aucun membre ajouté.
                                <br />Commencez par ajouter le conjoint ou les enfants.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member.type === 'CONJOINT' ? 'bg-pink-100 text-pink-600' :
                                                    member.type === 'ENFANT' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-gray-200 text-gray-600'
                                                }`}>
                                                {member.type[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.type}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeMember(member.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Configuration Patrimoine */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-green-600" />
                            Masse à partager
                        </h3>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Actif Net (FCFA)</label>
                            <input
                                type="number"
                                value={totalAssets}
                                onChange={(e) => setTotalAssets(Number(e.target.value))}
                                className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3 text-sm font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE : Résultats & Visualisation */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Graphique de Répartition */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px] flex flex-col">
                        <h3 className="font-semibold mb-2">Répartition Visuelle</h3>
                        {chartData.length > 0 ? (
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Part']}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                Ajoutez des héritiers pour voir le graphique
                            </div>
                        )}
                    </div>

                    {/* Détails et Explications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Tableau des Parts */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="font-semibold mb-4">Détail des Parts</h3>
                            <div className="space-y-3">
                                {chartData.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{item.amount?.toLocaleString('fr-FR')} FCFA</div>
                                            <div className="text-xs text-gray-500">{item.value.toFixed(2)}%</div>
                                        </div>
                                    </div>
                                ))}
                                {chartData.length === 0 && <p className="text-sm text-gray-500 italic">Aucune donnée.</p>}
                            </div>
                        </div>

                        {/* Analyse Juridique */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                <ArrowRight className="w-5 h-5" />
                                Analyse Juridique
                            </h3>
                            <div className="space-y-3">
                                {results.details.map((detail, idx) => (
                                    <p key={idx} className="text-sm text-blue-800 leading-relaxed">
                                        • {detail}
                                    </p>
                                ))}
                                {results.details.length === 0 && <p className="text-sm text-blue-800 italic">En attente de configuration...</p>}
                            </div>

                            <div className="mt-6 pt-4 border-t border-blue-200 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-blue-600 uppercase font-semibold">Réserve Héréditaire</p>
                                    <p className="text-xl font-bold text-blue-900">{results.reserve}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 uppercase font-semibold">Quotité Disponible</p>
                                    <p className="text-xl font-bold text-blue-900">{results.quotiteDisponible}%</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
