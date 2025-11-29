"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Download, Server, Database, Code, Cpu, Globe } from "lucide-react";
import jsPDF from "jspdf";

export default function DocumentationPage() {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185); // Blue
        doc.text("Spécifications Techniques", 20, 20);
        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text("Application de Gestion Notariale", 20, 30);

        let y = 50;

        // Section 1: Infrastructure
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("1. Infrastructure Matérielle Requise", 20, y);
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text("• CPU: Intel Core i5 (8ème gen+) ou AMD Ryzen 5", 25, y); y += 7;
        doc.text("• RAM: 16 GB recommandé (Min 8 GB)", 25, y); y += 7;
        doc.text("• Stockage: SSD 256 GB+ (NVMe recommandé)", 25, y); y += 7;
        doc.text("• OS: Windows 10/11 Pro, Linux (Ubuntu 22.04+)", 25, y); y += 15;

        // Section 2: Stack
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("2. Stack Technologique", 20, y);
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text("• Frontend: React 18, Tailwind CSS, Shadcn/ui", 25, y); y += 7;
        doc.text("• Backend: Next.js 14+ (App Router), Server Actions", 25, y); y += 7;
        doc.text("• Langage: TypeScript v5+", 25, y); y += 7;
        doc.text("• Outils: Node.js v18+, Git, VS Code", 25, y); y += 15;

        // Section 3: Database
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("3. Base de Données", 20, y);
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text("• Type: JSON File System (NoSQL local)", 25, y); y += 7;
        doc.text("• Avantages: Portable, Zéro config, Lisible", 25, y); y += 7;
        doc.text("• Limites: Concurrence d'écriture, Volume (<100MB/fichier)", 25, y); y += 7;
        doc.text("• Migration possible: PostgreSQL / SQLite (Prisma)", 25, y); y += 15;

        // Section 4: Services
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("4. Services Tiers & APIs", 20, y);
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text("• IA: Google Gemini (Requis pour modules intelligents)", 25, y); y += 7;
        doc.text("• Email: SendGrid / SMTP Standard", 25, y); y += 7;
        doc.text("• Stockage: Local (ou AWS S3 optionnel)", 25, y); y += 15;

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Généré le " + new Date().toLocaleDateString(), 20, 280);

        doc.save("Specifications_Techniques_NotaryApp.pdf");
    };

    return (
        <div className="space-y-8 p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documentation Technique</h1>
                    <p className="text-muted-foreground mt-2">
                        Caractéristiques techniques, infrastructure et prérequis de l'application.
                    </p>
                </div>
                <Button onClick={handleDownloadPDF} size="lg" className="gap-2">
                    <Download className="w-5 h-5" />
                    Télécharger en PDF
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-blue-600" />
                            Infrastructure Matérielle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                            <span className="font-semibold">Processeur</span>
                            <span>Intel Core i5 (8ème gen+) ou AMD Ryzen 5</span>

                            <span className="font-semibold">Mémoire</span>
                            <span>16 GB RAM recommandé (Min 8 GB)</span>

                            <span className="font-semibold">Stockage</span>
                            <span>SSD 256 GB+ (NVMe recommandé)</span>

                            <span className="font-semibold">OS</span>
                            <span>Windows 10/11 Pro, Linux, macOS</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-green-600" />
                            Stack Technologique
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                            <span className="font-semibold">Framework</span>
                            <span>Next.js 14+ (App Router)</span>

                            <span className="font-semibold">Langage</span>
                            <span>TypeScript v5+</span>

                            <span className="font-semibold">UI Libs</span>
                            <span>React 18, Tailwind CSS, Shadcn/ui</span>

                            <span className="font-semibold">Runtime</span>
                            <span>Node.js v18.17+</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-purple-600" />
                            Base de Données
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="space-y-2">
                            <p><span className="font-semibold">Type:</span> JSON File System (Custom Adapter)</p>
                            <p className="text-muted-foreground">
                                Stockage local dans des fichiers JSON structurés. Idéal pour la portabilité et la simplicité de déploiement.
                            </p>
                            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-2">
                                <p className="font-semibold text-yellow-800 text-xs mb-1">LIMITES</p>
                                <ul className="list-disc list-inside text-yellow-700 text-xs">
                                    <li>Concurrence d'écriture limitée</li>
                                    <li>Performance dégradée sur très gros volumes</li>
                                    <li>Pas de contraintes relationnelles strictes (SQL)</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-orange-600" />
                            Services & APIs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                            <span className="font-semibold">IA / LLM</span>
                            <span>Google Gemini (Requis)</span>

                            <span className="font-semibold">Email</span>
                            <span>SendGrid / SMTP</span>

                            <span className="font-semibold">SMS</span>
                            <span>Twilio (Optionnel)</span>
                        </div>
                        <div className="pt-4 border-t mt-2">
                            <h4 className="font-semibold mb-2">Liens Utiles</h4>
                            <ul className="space-y-1 text-blue-600">
                                <li><a href="https://nextjs.org" target="_blank" className="hover:underline">Documentation Next.js</a></li>
                                <li><a href="https://tailwindcss.com" target="_blank" className="hover:underline">Tailwind CSS</a></li>
                                <li><a href="https://aistudio.google.com" target="_blank" className="hover:underline">Google AI Studio</a></li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
