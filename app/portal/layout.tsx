import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header Client Simplifié */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 leading-tight">Espace Client</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Cabinet Notarial Sécurisé</p>
                        </div>
                    </div>

                    <Link
                        href="/portal/login"
                        className="text-sm font-medium text-slate-600 hover:text-red-600 flex items-center gap-2 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Déconnexion</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} Cabinet Notaire. Tous droits réservés.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Accès sécurisé par chiffrement SSL. Vos données sont protégées.
                    </p>
                </div>
            </footer>
        </div>
    );
}
