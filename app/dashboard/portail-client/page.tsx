"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, FolderOpen, FileText, MessageSquare, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PortailClientPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-serif text-primary">Portail Client</h1>
                <p className="text-muted-foreground mt-2">
                    Espace sécurisé pour que vos clients suivent leurs dossiers en temps réel
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <UserCircle className="h-5 w-5 text-blue-500" />
                            <CardTitle>Utilisateurs</CardTitle>
                        </div>
                        <CardDescription>
                            Gérez les comptes clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                            <Link href="/dashboard/portail-client/users">
                                Gérer les utilisateurs
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <FolderOpen className="h-5 w-5 text-green-500" />
                            <CardTitle>Dossiers Partagés</CardTitle>
                        </div>
                        <CardDescription>
                            Dossiers accessibles aux clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                            <Link href="/dashboard/portail-client/dossiers">
                                Voir les dossiers
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-purple-500" />
                            <CardTitle>Documents</CardTitle>
                        </div>
                        <CardDescription>
                            Documents uploadés par clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                            <Link href="/dashboard/portail-client/documents">
                                Gérer les documents
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-orange-500" />
                            <CardTitle>Messagerie</CardTitle>
                        </div>
                        <CardDescription>
                            Communications sécurisées avec les clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/dashboard/portail-client/messages">
                                Voir les messages
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Upload className="h-5 w-5 text-red-500" />
                            <CardTitle>Upload KYC</CardTitle>
                        </div>
                        <CardDescription>
                            Documents d'identification clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/dashboard/portail-client/kyc">
                                Gérer KYC
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fonctionnalités Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Système d'authentification sécurisé (2FA ready)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Gestion des utilisateurs portail</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Upload/Download de documents</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Messagerie sécurisée</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Base de données prête (12 méthodes CRUD)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
