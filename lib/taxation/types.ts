export type TaxType = 'PERCENTAGE' | 'FIXED' | 'SCALE';

export interface TaxDefinition {
    id: string;
    code: string;       // e.g., 'TVA', 'ENREGISTREMENT'
    label: string;      // e.g., 'TVA 18%'
    rate: number;       // e.g., 18
    type: TaxType;
    accountCode: string; // Linked accounting account (e.g., '443100')
    description?: string;
}

export interface ScaleSegment {
    min: number;
    max: number | null; // null for infinity
    rate: number;       // Percentage or fixed amount depending on context
    isFixedAmount: boolean; // if true, rate is an amount, else percentage
}

export type CalculationItemType = 'PERCENTAGE' | 'FIXED' | 'SCALE' | 'USER_INPUT';

export interface CalculationItem {
    id: string;
    label: string;
    type: CalculationItemType;
    value?: number;          // For FIXED or PERCENTAGE
    scale?: ScaleSegment[];  // For SCALE
    taxIds: string[];        // IDs of taxes to apply to this item
    accountCode?: string;    // Revenue account (706) or Third party (442)
    isDisbursement: boolean; // True if it's a "Débours" (no revenue for notary)
}

export interface ActSection {
    id: string;
    label: string; // e.g., 'Emoluments du Notaire', 'Trésor Public'
    items: CalculationItem[];
}

export interface ActTemplate {
    id: string;
    label: string; // e.g., 'Vente Immobilière'
    description?: string;
    sections: ActSection[];
}
