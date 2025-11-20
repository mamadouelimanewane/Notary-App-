// Bank statement CSV parser

export interface ParsedBankTransaction {
    date: string;
    description: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
}

/**
 * Parse CSV bank statement
 * Expected format: Date,Description,Montant,Type
 */
export function parseCSVBankStatement(csvContent: string): ParsedBankTransaction[] {
    const lines = csvContent.trim().split('\n');

    if (lines.length < 2) {
        throw new Error('Fichier CSV vide ou invalide');
    }

    // Skip header
    const dataLines = lines.slice(1);
    const transactions: ParsedBankTransaction[] = [];

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;

        // Parse CSV line (handle quotes and commas)
        const parts = line.split(',');

        if (parts.length < 4) {
            console.warn(`Ligne ${i + 2} invalide, ignorée`);
            continue;
        }

        const [dateStr, description, amountStr, typeStr] = parts;

        // Parse date (DD/MM/YYYY to ISO)
        const dateParts = dateStr.trim().split('/');
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            const amount = parseFloat(amountStr.trim());
            const type = typeStr.trim().toUpperCase() as 'DEBIT' | 'CREDIT';

            if (!isNaN(amount) && (type === 'DEBIT' || type === 'CREDIT')) {
                transactions.push({
                    date: isoDate,
                    description: description.trim(),
                    amount,
                    type
                });
            }
        }
    }

    return transactions;
}

/**
 * Validate CSV format
 */
export function validateCSV(csvContent: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const lines = csvContent.trim().split('\n');

    if (lines.length < 2) {
        errors.push('Le fichier doit contenir au moins une ligne de données');
    }

    // Check header
    const header = lines[0];
    const expectedHeaders = ['Date', 'Description', 'Montant', 'Type'];
    const actualHeaders = header.split(',').map(h => h.trim());

    for (const expected of expectedHeaders) {
        if (!actualHeaders.includes(expected)) {
            errors.push(`Colonne manquante: ${expected}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
