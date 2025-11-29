'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function ClientPortalLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/client-portal/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Sauvegarder le token et les infos utilisateur
                localStorage.setItem('client_portal_token', data.token);
                localStorage.setItem('client_portal_user', JSON.stringify(data.user));

                // Rediriger vers le dashboard
                router.push('/client-portal/dashboard');
            } else {
                setError(data.error || 'Erreur lors de la connexion');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo et Titre */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🏛️</div>
                    <h1 className="text-3xl font-bold mb-2">Cabinet Notaire Keur Jaraaf</h1>
                    <p className="text-muted-foreground">Portail Client</p>
                </div>

                {/* Carte de Connexion */}
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle>Connexion</CardTitle>
                        <CardDescription>
                            Accédez à vos dossiers en toute sécurité
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </Button>

                            <div className="text-center text-sm">
                                <a href="#" className="text-primary hover:underline">
                                    Mot de passe oublié ?
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Première connexion ?</p>
                    <p className="mt-1">
                        Contactez votre notaire pour obtenir vos identifiants
                    </p>
                </div>

                {/* Demo Credentials */}
                <Card className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                    <CardContent className="pt-6">
                        <p className="text-sm font-semibold mb-2 text-blue-900 dark:text-blue-100">
                            🔑 Identifiants de démonstration :
                        </p>
                        <div className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                            <p><strong>Email :</strong> client@demo.fr</p>
                            <p><strong>Mot de passe :</strong> client123</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
