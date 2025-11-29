"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
    {
        id: "default",
        name: "Moderne (Défaut)",
        description: "Thème sombre et ardoise, épuré et professionnel.",
        colors: {
            primary: "bg-slate-900",
            secondary: "bg-slate-100",
            accent: "bg-slate-200"
        }
    },
    {
        id: "blue",
        name: "Notaire Classique",
        description: "Bleu roi traditionnel, inspire confiance et autorité.",
        colors: {
            primary: "bg-blue-600",
            secondary: "bg-slate-50",
            accent: "bg-blue-100"
        }
    },
    {
        id: "gold",
        name: "Premium Gold",
        description: "Touche d'or et de bordeaux pour une élégance supérieure.",
        colors: {
            primary: "bg-orange-600",
            secondary: "bg-orange-50",
            accent: "bg-orange-100"
        }
    },
    {
        id: "green",
        name: "Sérénité Nature",
        description: "Vert forêt apaisant, idéal pour une ambiance calme.",
        colors: {
            primary: "bg-green-700",
            secondary: "bg-green-50",
            accent: "bg-green-100"
        }
    }
];

export default function ThemeSettingsPage() {
    const { theme, setTheme, font, setFont } = useTheme();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Apparence</h1>
                <p className="text-muted-foreground">
                    Personnalisez l'apparence de l'application selon vos préférences.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Thème de l'interface</CardTitle>
                        <CardDescription>
                            Choisissez le thème qui correspond le mieux à l'identité de votre étude.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            defaultValue={theme}
                            onValueChange={(value) => setTheme(value as any)}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {themes.map((t) => (
                                <div key={t.id}>
                                    <RadioGroupItem
                                        value={t.id}
                                        id={t.id}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={t.id}
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                    >
                                        <div className="w-full aspect-video rounded-md bg-slate-50 border mb-3 overflow-hidden relative">
                                            {/* Mockup de l'interface */}
                                            <div className="absolute top-0 left-0 w-1/4 h-full border-r bg-white z-10"></div>
                                            <div className="absolute top-0 left-0 w-full h-3 border-b bg-white z-20"></div>

                                            {/* Couleurs du thème */}
                                            <div className="absolute top-8 left-[30%] w-[60%] h-4 rounded-sm" className={cn("absolute top-8 left-[30%] w-[60%] h-4 rounded-sm", t.colors.primary)}></div>
                                            <div className="absolute top-14 left-[30%] w-[20%] h-20 rounded-sm" className={cn("absolute top-14 left-[30%] w-[20%] h-20 rounded-sm", t.colors.secondary)}></div>
                                            <div className="absolute top-14 left-[55%] w-[35%] h-20 rounded-sm" className={cn("absolute top-14 left-[55%] w-[35%] h-20 rounded-sm", t.colors.accent)}></div>

                                            {theme === t.id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <span className="font-semibold">{t.name}</span>
                                            <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Typographie</CardTitle>
                        <CardDescription>
                            Choisissez le style de police pour l'interface.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            defaultValue={font}
                            onValueChange={(value) => setFont(value as any)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="sans" id="font-sans" className="peer sr-only" />
                                <Label
                                    htmlFor="font-sans"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <div className="w-full h-24 flex items-center justify-center bg-slate-50 border mb-3 rounded-md">
                                        <span className="text-4xl font-sans">Aa</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold">Moderne (Sans-Serif)</span>
                                        <p className="text-xs text-muted-foreground mt-1">Inter - Lisible et contemporain</p>
                                    </div>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem value="serif" id="font-serif" className="peer sr-only" />
                                <Label
                                    htmlFor="font-serif"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <div className="w-full h-24 flex items-center justify-center bg-slate-50 border mb-3 rounded-md">
                                        <span className="text-4xl font-serif">Aa</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold">Classique (Serif)</span>
                                        <p className="text-xs text-muted-foreground mt-1">Playfair Display - Élégant et officiel</p>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
