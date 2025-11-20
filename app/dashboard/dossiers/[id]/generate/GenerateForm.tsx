"use client";

import { useState } from "react";
import { generateCompromisPDF } from "@/lib/pdf-generator";
import { saveActeMetadata } from "@/app/actions";
import { Download } from "lucide-react";

interface GenerateFormProps {
    dossier: any;
    client: any;
}

export default function GenerateForm({ dossier, client }: GenerateFormProps) {
    const [seller, setSeller] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: ""
    });

    const [property, setProperty] = useState({
        address: "",
        city: "",
        zipCode: "",
        price: 0,
        description: "Appartement T3 comprenant : entrée, séjour, cuisine, 2 chambres, salle de bains, WC."
    });

    const handleGenerateAndSave = async () => {
        // Generate PDF for download
        generateCompromisPDF(dossier, client, seller, property);

        // Save metadata to database
        const formData = new FormData();
        formData.append('type', 'COMPROMIS');
        formData.append('category', 'IMMOBILIER');
        formData.append('dossierId', dossier.id);
        formData.append('title', `Compromis de Vente - ${dossier.ref}`);
        formData.append('seller', JSON.stringify(seller));
        formData.append('buyer', JSON.stringify(client));
        formData.append('property', JSON.stringify(property));

        await saveActeMetadata(formData);
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Vendeur */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-2">1</span>
                        Le Vendeur
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prénom</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={seller.firstName} onChange={(e) => setSeller({ ...seller, firstName: e.target.value })} placeholder="Pierre" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={seller.lastName} onChange={(e) => setSeller({ ...seller, lastName: e.target.value })} placeholder="Martin" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={seller.address} onChange={(e) => setSeller({ ...seller, address: e.target.value })} placeholder="12 Avenue des Champs" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code Postal</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={seller.zipCode} onChange={(e) => setSeller({ ...seller, zipCode: e.target.value })} placeholder="75008" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ville</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={seller.city} onChange={(e) => setSeller({ ...seller, city: e.target.value })} placeholder="Paris" />
                        </div>
                    </div>
                </div>

                {/* Bien Immobilier */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-2">2</span>
                        Le Bien Immobilier
                    </h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse du bien</label>
                        <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={property.address} onChange={(e) => setProperty({ ...property, address: e.target.value })} placeholder="10 Rue de la Paix" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code Postal</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={property.zipCode} onChange={(e) => setProperty({ ...property, zipCode: e.target.value })} placeholder="75001" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ville</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={property.city} onChange={(e) => setProperty({ ...property, city: e.target.value })} placeholder="Paris" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Prix de vente (€)</label>
                        <input type="number" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={property.price} onChange={(e) => setProperty({ ...property, price: parseInt(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={property.description} onChange={(e) => setProperty({ ...property, description: e.target.value })} rows={3} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleGenerateAndSave}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800 h-11 px-8"
                >
                    <Download className="mr-2 h-4 w-4" /> Générer le Compromis de Vente (PDF)
                </button>
            </div>
        </div>
    );
}
