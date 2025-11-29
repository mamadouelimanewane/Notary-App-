"use client";

import { FileText, Download, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

// Mock Data pour le client
const CLIENT_DOSSIERS = [
    {
        id: 'd-123',
        title: 'Acquisition Villa Saly',
        type: 'Vente Immobilière',
        progress: 75,
        status: 'SIGNATURE',
        lastUpdate: 'Il y a 2 jours',
        nextStep: 'Signature de l\'acte authentique le 15/04 à 10h00',
        documents: [
            { name: 'Compromis de vente.pdf', date: '10/03/2024' },
            { name: 'Appel de fonds.pdf', date: '12/03/2024' },
        ]
    },
    {
        id: 'd-456',
        title: 'Constitution SCI Familiale',
        type: 'Droit des Sociétés',
        progress: 30,
        status: 'REDACTION',
        lastUpdate: 'Il y a 1 semaine',
        nextStep: 'Validation des statuts par les associés',
        documents: [
            { name: 'Projet de statuts v1.pdf', date: '01/03/2024' },
        ]
    }
];

export default function PortalDashboard() {
    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Bonjour, Monsieur Diop 👋</h1>
                <p className="text-indigo-100 text-lg">
                    Bienvenue sur votre espace sécurisé. Vous avez <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">2 dossiers</span> en cours de traitement.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Colonne Principale : Dossiers */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Vos Dossiers en cours
                    </h2>

                    {CLIENT_DOSSIERS.map((dossier) => (
                        <div key={dossier.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wide">
                                            {dossier.type}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 mt-2">{dossier.title}</h3>
                                        <p className="text-sm text-slate-500">Mis à jour {dossier.lastUpdate}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-slate-900">{dossier.progress}%</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000"
                                        style={{ width: `${dossier.progress}%` }}
                                    ></div>
                                </div>

                                {/* Next Step Alert */}
                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3 mb-6">
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-900">Prochaine étape</h4>
                                        <p className="text-sm text-amber-700">{dossier.nextStep}</p>
                                    </div>
                                </div>

                                {/* Documents du dossier */}
                                <div className="border-t border-slate-100 pt-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Documents disponibles</h4>
                                    <div className="space-y-2">
                                        {dossier.documents.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-50 p-2 rounded text-red-600">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                                                        <p className="text-xs text-slate-400">{doc.date}</p>
                                                    </div>
                                                </div>
                                                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Réf: {dossier.id}</span>
                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                    Voir le détail <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Colonne Latérale : Infos & Contact */}
                <div className="space-y-6">

                    {/* Contact Rapide */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Votre Notaire</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                MD
                            </div>
                            <div>
                                <p className="font-bold text-sm">Maître Dupont</p>
                                <p className="text-xs text-slate-500">Notaire Associé</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500">Téléphone</span>
                                <span className="font-medium">33 800 00 00</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500">Email</span>
                                <span className="font-medium">contact@etude.sn</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                            Envoyer un message
                        </button>
                    </div>

                    {/* FAQ / Aide */}
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-2">Besoin d'aide ?</h3>
                        <p className="text-sm text-indigo-700 mb-4">
                            Consultez notre guide pour comprendre les étapes de votre dossier.
                        </p>
                        <ul className="space-y-2 text-sm text-indigo-800">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-indigo-500" />
                                Comprendre les frais de notaire
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-indigo-500" />
                                Liste des pièces à fournir
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
