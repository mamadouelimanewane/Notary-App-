'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface InvoiceWithPayments {
    id: string;
    number: string;
    acteId: string;
    dossierId: string;
    clientId: string;
    date: string;
    dueDate: string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
    lineItems: Array<{
        id: string;
        type: 'EMOLUMENT' | 'DEBOURS' | 'DROIT' | 'TVA';
        description: string;
        quantity: number;
        unitPrice: number;
        totalHT: number;
        tvaRate: number;
        totalTTC: number;
    }>;
    totalEmoluments: number;
    totalDebours: number;
    totalDroits: number;
    totalTVA: number;
    totalHT: number;
    totalTTC: number;
    paidAmount: number;
    remainingAmount: number;
    payments?: Array<{
        id: string;
        amount: number;
        method: string;
        date: string;
        reference?: string;
    }>;
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [invoice, setInvoice] = useState<InvoiceWithPayments | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        method: 'TRANSFER',
        reference: ''
    });

    useEffect(() => {
        loadInvoice();
    }, [params.id]);

    const loadInvoice = async () => {
        try {
            const response = await fetch(`/api/billing/invoices/${params.id}`);
            const data = await response.json();
            setInvoice(data);
        } catch (error) {
            console.error('Error loading invoice:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de charger la facture',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRecordPayment = async () => {
        try {
            const response = await fetch('/api/billing/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId: params.id,
                    amount: parseFloat(paymentForm.amount),
                    method: paymentForm.method,
                    reference: paymentForm.reference
                })
            });

            if (!response.ok) throw new Error('Payment failed');

            toast({
                title: 'Paiement enregistré',
                description: 'Le paiement a été enregistré avec succès'
            });

            setIsPaymentDialogOpen(false);
            setPaymentForm({ amount: '', method: 'TRANSFER', reference: '' });
            loadInvoice();
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible d\'enregistrer le paiement',
                variant: 'destructive'
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
            DRAFT: { label: 'Brouillon', variant: 'secondary' },
            SENT: { label: 'Envoyée', variant: 'default' },
            PAID: { label: 'Payée', variant: 'default' },
            PARTIALLY_PAID: { label: 'Partiellement payée', variant: 'outline' },
            OVERDUE: { label: 'En retard', variant: 'destructive' },
            CANCELLED: { label: 'Annulée', variant: 'destructive' }
        };

        const config = variants[status] || variants.DRAFT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Facture introuvable</p>
                <Button onClick={() => router.back()} className="mt-4">
                    Retour
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{invoice.number}</h1>
                        <p className="text-muted-foreground">
                            Émise le {new Date(invoice.date).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    {getStatusBadge(invoice.status)}
                </div>
                <div className="flex gap-2">
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={invoice.status === 'PAID' || invoice.status === 'CANCELLED'}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Enregistrer un paiement
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enregistrer un paiement</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Montant</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Reste à payer: {formatCurrency(invoice.remainingAmount)}
                                    </p>
                                </div>
                                <div>
                                    <Label>Méthode de paiement</Label>
                                    <Select value={paymentForm.method} onValueChange={(value) => setPaymentForm({ ...paymentForm, method: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH">Espèces</SelectItem>
                                            <SelectItem value="CHECK">Chèque</SelectItem>
                                            <SelectItem value="TRANSFER">Virement</SelectItem>
                                            <SelectItem value="CARD">Carte bancaire</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Référence (optionnel)</Label>
                                    <Input
                                        placeholder="Numéro de chèque, référence..."
                                        value={paymentForm.reference}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                                    />
                                </div>
                                <Button onClick={handleRecordPayment} className="w-full">
                                    Enregistrer
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Détails de la facture</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Numéro:</span>
                            <span className="font-medium">{invoice.number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date d'émission:</span>
                            <span>{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date d'échéance:</span>
                            <span>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Montants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total HT:</span>
                            <span>{formatCurrency(invoice.totalHT)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">TVA:</span>
                            <span>{formatCurrency(invoice.totalTVA)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total TTC:</span>
                            <span>{formatCurrency(invoice.totalTTC)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Payé:</span>
                            <span>{formatCurrency(invoice.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between text-orange-600 font-medium">
                            <span>Reste à payer:</span>
                            <span>{formatCurrency(invoice.remainingAmount)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Line Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Détail des prestations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Quantité</TableHead>
                                <TableHead className="text-right">Prix unitaire</TableHead>
                                <TableHead className="text-right">Total HT</TableHead>
                                <TableHead className="text-right">TVA</TableHead>
                                <TableHead className="text-right">Total TTC</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.lineItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Badge variant="outline">{item.type}</Badge>
                                    </TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.totalHT)}</TableCell>
                                    <TableCell className="text-right">{item.tvaRate}%</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(item.totalTTC)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Payments */}
            {invoice.payments && invoice.payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Historique des paiements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Méthode</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                        <TableCell>{payment.reference || '-'}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
