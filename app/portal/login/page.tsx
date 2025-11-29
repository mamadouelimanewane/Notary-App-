"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export default function PortalLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulation d'authentification
        setTimeout(() => {
            router.push('/portal/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center">
                    <div className="inline-flex bg-white/20 p-3 rounded-xl mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Accès Client</h2>
                    <p className="text-indigo-100 mt-2 text-sm">
                        Consultez vos dossiers et téléchargez vos actes en toute sécurité.
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Code d'accès</label>
                            <input
                                type="password"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Accéder à mon espace
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <Lock className="w-3 h-3" />
                        Connexion chiffrée de bout en bout
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm text-slate-500">
                Vous n'avez pas vos codes ? Contactez l'étude au <span className="font-semibold text-slate-900">+221 33 800 00 00</span>
            </p>
        </div>
    );
}
