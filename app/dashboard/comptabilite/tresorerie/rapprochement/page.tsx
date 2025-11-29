'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle, Upload, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BankStatementLine {
    id: string;
    date: string;
    reference: string;
    label: string;
    debit: number;
    credit: number;
    balance: number;
}

interface JournalEntry {
    id: string;
    date: string;
    reference: string;
    label: string;
    amount: number;
}

export default function BankReconciliationPage() {
    const [statementLines, setStatementLines] = useState<BankStatementLine[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [matches, setMatches] = useState<Map<string, string>>(new Map());
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Parser le fichier CSV/Excel du relevé bancaire
        alert('Import de relevé bancaire en cours de développement');
    };

    const handleAutoMatch = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/treasury/reconciliation/auto-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    statementLines,
                    journalEntries
                })
            });

            if (response.ok) {
                const { matches: autoMatches } = await response.json();
                const newMatches = new Map(matches);
                autoMatches.forEach((match: any) => {
                    newMatches.set(match.statementLineId, match.journalEntryId);
                });
                setMatches(newMatches);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualMatch = (statementLineId: string, journalEntryId: string) => {
        const newMatches = new Map(matches);
        newMatches.set(statementLineId, journalEntryId);
        setMatches(newMatches);
    };

    const handleUnmatch = (statementLineId: string) => {
        const newMatches = new Map(matches);
        newMatches.delete(statementLineId);
        setMatches(newMatches);
    };

    const handleComplete = async () => {
        const unmatchedLines = statementLines.filter(line => !matches.has(line.id));

        if (unmatchedLines.length > 0) {
            const confirm = window.confirm(
                `Il reste ${unmatchedLines.length} ligne(s) non rapprochée(s). Voulez-vous continuer ?`
            );
            if (!confirm) return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/treasury/reconciliation/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    matches: Array.from(matches.entries()).map(([statementLineId, journalEntryId]) => ({
                        statementLineId,
                        journalEntryId
                    }))
                })
            });

            if (response.ok) {
                alert('Rapprochement terminé avec succès');
                // Réinitialiser
                setStatementLines([]);
                setMatches(new Map());
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur lors de la finalisation');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const matchedCount = matches.size;
    const totalLines = statementLines.length;
    const matchPercentage = totalLines > 0 ? (matchedCount / totalLines) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/comptabilite/tresorerie"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Rapprochement Bancaire</h1>
                        <p className="text-slate-600 mt-1">Pointer les relevés bancaires avec la comptabilité</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleAutoMatch} disabled={loading || statementLines.length === 0}>
                        Rapprochement Auto
                    </Button>
                    <Button onClick={handleComplete} disabled={loading || statementLines.length === 0}>
                        Finaliser
                    </Button>
                </div>
            </div>

            {/* Period Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Période de Rapprochement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date de Début</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date de Fin</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Importer Relevé</label>
                            <label className="flex h-10 w-full items-center justify-center rounded-md border-2 border-dashed border-slate-300 hover:border-slate-400 cursor-pointer transition-colors">
                                <Upload className="h-4 w-4 mr-2" />
                                <span className="text-sm">Choisir un fichier</span>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Progress */}
            {statementLines.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Progression</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{matchedCount} / {totalLines} lignes rapprochées</span>
                                <span>{matchPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all"
                                    style={{ width: `${matchPercentage}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statement Lines */}
            <Card>
                <CardHeader>
                    <CardTitle>Relevé Bancaire</CardTitle>
                </CardHeader>
                <CardContent>
                    {statementLines.length === 0 ? (
                        <div className="text-center py-12 text-slate-600">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                            <p>Importez un relevé bancaire pour commencer</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Libellé</TableHead>
                                    <TableHead className="text-right">Débit</TableHead>
                                    <TableHead className="text-right">Crédit</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {statementLines.map((line) => {
                                    const isMatched = matches.has(line.id);
                                    return (
                                        <TableRow key={line.id} className={isMatched ? 'bg-green-50' : ''}>
                                            <TableCell>{formatDate(line.date)}</TableCell>
                                            <TableCell className="font-mono text-sm">{line.reference}</TableCell>
                                            <TableCell>{line.label}</TableCell>
                                            <TableCell className="text-right">
                                                {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {isMatched ? (
                                                    <Badge variant="default" className="bg-green-600">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Rapproché
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Non rapproché
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isMatched ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleUnmatch(line.id)}
                                                    >
                                                        Annuler
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            // TODO: Ouvrir modal de sélection d'écriture
                                                            alert('Sélection manuelle en cours de développement');
                                                        }}
                                                    >
                                                        Pointer
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
