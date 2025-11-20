import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, formatDate } from './format';

/**
 * Export data to Excel
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Data') {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `${filename}_${date}.xlsx`);
}

/**
 * Export to PDF with custom header
 */
export function exportToPDF(
    title: string,
    data: any[][],
    columns: string[],
    filename: string,
    officeName: string = 'Cabinet Notaire'
) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text(officeName, 14, 20);
    doc.setFontSize(12);
    doc.text(title, 14, 30);
    doc.setFontSize(10);
    doc.text(`Date: ${formatDate(new Date().toISOString())}`, 14, 38);

    // Table
    autoTable(doc, {
        head: [columns],
        body: data,
        startY: 45,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [15, 23, 42] }, // slate-900
    });

    const date = new Date().toISOString().split('T')[0];
    doc.save(`${filename}_${date}.pdf`);
}

/**
 * Export clients list
 */
export function exportClientsList(clients: any[], format: 'pdf' | 'excel', officeName?: string) {
    if (format === 'excel') {
        const data = clients.map(c => ({
            'Nom': `${c.firstName} ${c.lastName}`,
            'Email': c.email,
            'Téléphone': c.phone || '',
            'Adresse': c.address || '',
            'Type': c.type,
            'Date création': formatDate(c.createdAt)
        }));
        exportToExcel(data, 'clients', 'Liste clients');
    } else {
        const data = clients.map(c => [
            `${c.firstName} ${c.lastName}`,
            c.email,
            c.phone || '',
            c.type,
            formatDate(c.createdAt)
        ]);
        exportToPDF(
            'Liste des clients',
            data,
            ['Nom', 'Email', 'Téléphone', 'Type', 'Date création'],
            'clients',
            officeName
        );
    }
}

/**
 * Export actes registry
 */
export function exportActesRegistry(actes: any[], format: 'pdf' | 'excel', officeName?: string) {
    if (format === 'excel') {
        const data = actes.map(a => ({
            'Référence': a.ref,
            'Type': a.type,
            'Parties': a.parties?.join(', ') || '',
            'Montant': a.amount || '',
            'Statut': a.status,
            'Date': formatDate(a.createdAt)
        }));
        exportToExcel(data, 'registre_actes', 'Registre des actes');
    } else {
        const data = actes.map(a => [
            a.ref,
            a.type,
            a.parties?.join(', ') || '',
            a.amount ? formatCurrency(a.amount) : '',
            a.status,
            formatDate(a.createdAt)
        ]);
        exportToPDF(
            'Registre des actes',
            data,
            ['Référence', 'Type', 'Parties', 'Montant', 'Statut', 'Date'],
            'registre_actes',
            officeName
        );
    }
}

/**
 * Export financial journal
 */
export function exportFinancialJournal(transactions: any[], format: 'pdf' | 'excel', officeName?: string) {
    if (format === 'excel') {
        const data = transactions.map(t => ({
            'Date': formatDate(t.date),
            'Description': t.description,
            'Type': t.type,
            'Montant': t.amount,
            'Dossier': t.dossierId
        }));
        exportToExcel(data, 'journal_comptable', 'Journal');
    } else {
        const data = transactions.map(t => [
            formatDate(t.date),
            t.description,
            t.type,
            formatCurrency(t.amount),
            t.dossierId
        ]);
        exportToPDF(
            'Journal comptable',
            data,
            ['Date', 'Description', 'Type', 'Montant', 'Dossier'],
            'journal_comptable',
            officeName
        );
    }
}
