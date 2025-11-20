'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, ChevronDown, Info } from 'lucide-react';
import type { Account, AccountClass } from '@/lib/accounting/types';

interface PlanComptableClientProps {
    initialAccounts: Account[];
}

export default function PlanComptableClient({ initialAccounts }: PlanComptableClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('ALL');
    const [expandedClasses, setExpandedClasses] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8']);

    // Classes OHADA
    const classes: { code: string; label: string; color: string }[] = [
        { code: '1', label: 'Ressources durables', color: 'bg-blue-100 text-blue-800' },
        { code: '2', label: 'Actif immobilisé', color: 'bg-indigo-100 text-indigo-800' },
        { code: '3', label: 'Stocks', color: 'bg-green-100 text-green-800' },
        { code: '4', label: 'Tiers', color: 'bg-yellow-100 text-yellow-800' },
        { code: '5', label: 'Trésorerie', color: 'bg-emerald-100 text-emerald-800' },
        { code: '6', label: 'Charges', color: 'bg-red-100 text-red-800' },
        { code: '7', label: 'Produits', color: 'bg-teal-100 text-teal-800' },
        { code: '8', label: 'Comptes spéciaux', color: 'bg-gray-100 text-gray-800' },
    ];

    // Filtrage des comptes
    const filteredAccounts = useMemo(() => {
        return initialAccounts.filter(account => {
            const matchesSearch =
                account.code.includes(searchQuery) ||
                account.label.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = selectedClass === 'ALL' || account.classCode === selectedClass;

            return matchesSearch && matchesClass;
        });
    }, [initialAccounts, searchQuery, selectedClass]);

    // Groupement par classe pour l'affichage
    const accountsByClass = useMemo(() => {
        const grouped: Record<string, Account[]> = {};
        classes.forEach(c => grouped[c.code] = []);

        filteredAccounts.forEach(account => {
            if (grouped[account.classCode]) {
                grouped[account.classCode].push(account);
            }
        });

        // Trier les comptes par code dans chaque classe
        Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => a.code.localeCompare(b.code));
        });

        return grouped;
    }, [filteredAccounts, classes]);

    const toggleClass = (classCode: string) => {
        setExpandedClasses(prev =>
            prev.includes(classCode)
                ? prev.filter(c => c !== classCode)
                : [...prev, classCode]
        );
    };

    return (
        <div className="space-y-6">
            {/* En-tête et Recherche */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un compte (ex: 411, Clients)..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-gold focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-gray-400 h-5 w-5" />
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-custom-gold focus:border-transparent w-full md:w-auto"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="ALL">Toutes les classes</option>
                        {classes.map(c => (
                            <option key={c.code} value={c.code}>
                                Classe {c.code} - {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Liste des comptes */}
            <div className="space-y-6">
                {classes.map((cls) => {
                    const classAccounts = accountsByClass[cls.code] || [];
                    if (classAccounts.length === 0 && searchQuery) return null;

                    const isExpanded = expandedClasses.includes(cls.code);

                    return (
                        <div key={cls.code} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* En-tête de classe */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleClass(cls.code)}
                            >
                                <div className="flex items-center gap-3">
                                    <button className="p-1 hover:bg-gray-200 rounded-full">
                                        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                                    </button>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls.color}`}>
                                        Classe {cls.code}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">{cls.label}</h3>
                                    <span className="text-sm text-gray-500">({classAccounts.length} comptes)</span>
                                </div>
                            </div>

                            {/* Liste des comptes de la classe */}
                            {isExpanded && (
                                <div className="border-t border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Compte</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Type</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Nature</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {classAccounts.map((account) => (
                                                <tr key={account.code} className={`hover:bg-gray-50 ${account.isSummary ? 'bg-gray-50 font-medium' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                        {account.code}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex flex-col">
                                                            <span>{account.label}</span>
                                                            {account.description && (
                                                                <span className="text-xs text-gray-500">{account.description}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {account.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.nature === 'DEBIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {account.nature}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {classAccounts.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                        Aucun compte dans cette classe
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
