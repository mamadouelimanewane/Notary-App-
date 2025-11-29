"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, MapPin, Calendar, FileText, TrendingUp, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function NegociationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-serif text-primary">Négociation Immobilière</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez votre catalogue de biens, visites et offres immobilières
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Home className="h-5 w-5 text-blue-500" />
                            <CardTitle>Catalogue</CardTitle>
                        </div>
                        <CardDescription>
                            Tous les biens disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                            <Link href="/dashboard/negociation/catalogue">
                                Voir le catalogue
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-green-500" />
                            <CardTitle>Ajouter un Bien</CardTitle>
                        </div>
                        <CardDescription>
                            Nouveau bien immobilier
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                            <Link href="/dashboard/negociation/properties/new">
                                Créer un bien
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-purple-500" />
                            <CardTitle>Recherche</CardTitle>
                        </div>
                        <CardDescription>
                            Recherche avancée de biens
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                            <Link href="/dashboard/negociation/search">
                                Rechercher
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-orange-500" />
                            <CardTitle>Visites</CardTitle>
                        </div>
                        <CardDescription>
                            Planification des visites
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/dashboard/negociation/visits">
                                Gérer les visites
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-red-500" />
                            <CardTitle>Offres</CardTitle>
                        </div>
                        <CardDescription>
                            Suivi des offres d'achat
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/dashboard/negociation/offers">
                                Voir les offres
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-indigo-500" />
                            <CardTitle>Mandats</CardTitle>
                        </div>
                        <CardDescription>
                            Génération de mandats
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/dashboard/negociation/mandates">
                                Gérer les mandats
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
                            <span>✅ Catalogue de biens avec photos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Recherche avancée (type, prix, surface, ville)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Gestion des visites et feedback</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Suivi des offres et contre-offres</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>✅ Base de données prête (14 méthodes CRUD)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
