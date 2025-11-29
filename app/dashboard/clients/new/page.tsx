"use client";

import { createClient } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { IdCardScanner } from "@/components/ai/IdCardScanner";
import { ExtractedIdentity } from "@/lib/ai/ocr-service";

export default function NewClientPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        zipCode: '',
        city: '',
        type: 'PARTICULIER',
        // Entreprise fields
        companyName: '',
        ninea: '',
        legalForm: '',
        registrationNumber: '',
        contactPerson: ''
    });

    const handleScanComplete = (data: ExtractedIdentity) => {
        setFormData(prev => ({
            ...prev,
            firstName: data.firstName || prev.firstName,
            lastName: data.lastName || prev.lastName,
            // On pourrait aussi extraire l'adresse si l'OCR est assez puissant
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/clients" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Nouveau Client</h1>
            </div>

            {/* Zone de Scan IA */}
            <IdCardScanner onScanComplete={handleScanComplete} />

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <form action={createClient} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Jean"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nom</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Dupont"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="jean.dupont@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="06 01 02 03 04"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Adresse</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="10 Rue de la Paix"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="zipCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Code Postal</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="75001"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ville</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Paris"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Type de Client</label>
                        <select
                            id="type"
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="PARTICULIER">Particulier</option>
                            <option value="ENTREPRISE">Entreprise</option>
                        </select>
                    </div>

                    {/* Champs spécifiques aux entreprises */}
                    {formData.type === 'ENTREPRISE' && (
                        <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-lg font-semibold">Informations Entreprise</h3>

                            <div className="space-y-2">
                                <label htmlFor="companyName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nom de l'Entreprise</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="SARL Tech Solutions"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="ninea" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">NINEA</label>
                                    <input
                                        type="text"
                                        id="ninea"
                                        name="ninea"
                                        value={formData.ninea}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="123456789"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="legalForm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Forme Juridique</label>
                                    <select
                                        id="legalForm"
                                        name="legalForm"
                                        value={formData.legalForm}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="SARL">SARL</option>
                                        <option value="SAS">SAS</option>
                                        <option value="SA">SA</option>
                                        <option value="SUARL">SUARL</option>
                                        <option value="SNC">SNC</option>
                                        <option value="GIE">GIE</option>
                                        <option value="AUTRE">Autre</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="registrationNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">N° RCCM</label>
                                    <input
                                        type="text"
                                        id="registrationNumber"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="SN-DKR-2024-A-12345"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="contactPerson" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Personne de Contact</label>
                                    <input
                                        type="text"
                                        id="contactPerson"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Amadou Diop"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2"
                        >
                            Créer le client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
