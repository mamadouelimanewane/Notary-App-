/**
 * Formate un montant en FCFA (Franc CFA) sans décimales
 * @param amount - Montant à formater
 * @returns Montant formaté (ex: "15 000 FCFA")
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.round(amount)) + ' FCFA';
}

/**
 * Formate une date en français
 * @param date - Date à formater (string ISO ou Date)
 * @returns Date formatée (ex: "20/11/2025")
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR');
}

/**
 * Obtient la classe CSS pour le type de transaction
 */
export function getTransactionTypeClass(type: 'CREDIT' | 'DEBIT'): string {
    return type === 'CREDIT'
        ? 'text-green-600 font-semibold'
        : 'text-red-600 font-semibold';
}
