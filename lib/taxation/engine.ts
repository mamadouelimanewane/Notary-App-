import { ActTemplate, CalculationItem, ScaleSegment, TaxDefinition } from "./types";

export interface SimulationResult {
    sections: SectionResult[];
    total: number;
    grandTotal: number; // Including taxes
}

export interface SectionResult {
    label: string;
    items: ItemResult[];
    total: number;
}

export interface ItemResult {
    label: string;
    baseAmount: number; // The amount calculated (fee)
    taxes: TaxResult[];
    totalWithTax: number;
}

export interface TaxResult {
    taxId: string;
    label: string;
    amount: number;
}

export class TaxationEngine {
    static calculate(template: ActTemplate, inputValue: number, allTaxes: TaxDefinition[]): SimulationResult {
        const sections: SectionResult[] = template.sections.map(section => {
            const items = section.items.map(item => this.calculateItem(item, inputValue, allTaxes));
            const total = items.reduce((sum, item) => sum + item.baseAmount, 0);
            return {
                label: section.label,
                items,
                total
            };
        });

        const total = sections.reduce((sum, section) => sum + section.total, 0);
        const grandTotal = sections.reduce((sum, section) =>
            sum + section.items.reduce((s, i) => s + i.totalWithTax, 0)
            , 0);

        return {
            sections,
            total,
            grandTotal
        };
    }

    private static calculateItem(item: CalculationItem, inputValue: number, allTaxes: TaxDefinition[]): ItemResult {
        let baseAmount = 0;

        switch (item.type) {
            case 'FIXED':
                baseAmount = item.value || 0;
                break;
            case 'PERCENTAGE':
                baseAmount = inputValue * ((item.value || 0) / 100);
                break;
            case 'SCALE':
                if (item.scale) {
                    baseAmount = this.calculateScale(inputValue, item.scale);
                }
                break;
            case 'USER_INPUT':
                // For simulation, we might need a way to pass specific inputs for these items.
                // For now, default to 0 or handle separately.
                baseAmount = 0;
                break;
        }

        // Calculate Taxes
        const taxes: TaxResult[] = [];
        if (item.taxIds && item.taxIds.length > 0) {
            item.taxIds.forEach(taxId => {
                const taxDef = allTaxes.find(t => t.id === taxId);
                if (taxDef) {
                    let taxAmount = 0;
                    if (taxDef.type === 'PERCENTAGE') {
                        taxAmount = baseAmount * (taxDef.rate / 100);
                    } else if (taxDef.type === 'FIXED') {
                        taxAmount = taxDef.rate;
                    }
                    // TODO: Handle Scale taxes if necessary (rare for taxes on fees)

                    taxes.push({
                        taxId: taxDef.id,
                        label: taxDef.label,
                        amount: taxAmount
                    });
                }
            });
        }

        const totalTax = taxes.reduce((sum, t) => sum + t.amount, 0);

        return {
            label: item.label,
            baseAmount,
            taxes,
            totalWithTax: baseAmount + totalTax
        };
    }

    private static calculateScale(value: number, scale: ScaleSegment[]): number {
        let totalFee = 0;
        let remainingValue = value;

        // Sort segments by min value to ensure correct order
        const sortedScale = [...scale].sort((a, b) => a.min - b.min);

        for (const segment of sortedScale) {
            // Determine the taxable amount in this segment
            const lowerBound = segment.min;
            const upperBound = segment.max === null ? Infinity : segment.max;

            // If value is below this segment, we are done (shouldn't happen if sorted and starting at 0)
            if (value < lowerBound) continue;

            // Calculate the portion of value falling into this segment
            // Example: Segment 0-10M. Value 50M.
            // Overlap is min(50M, 10M) - 0 = 10M.

            // Actually, a simpler way:
            // Calculate the effective range of this segment that applies to the value
            const effectiveMax = Math.min(value, upperBound);
            const effectiveMin = Math.max(0, lowerBound); // Assuming value starts at 0

            if (effectiveMax > effectiveMin) {
                const taxableAmount = effectiveMax - effectiveMin;

                if (segment.isFixedAmount) {
                    // If it's a fixed amount per segment (unusual for standard scales, usually it's rate)
                    // But sometimes it's "For this slice, pay X".
                    // Or "For every X amount, pay Y".
                    // Let's assume standard cumulative scale: Rate applied to the amount in the slice.
                    totalFee += segment.rate; // This interprets rate as a fixed fee for the WHOLE segment? 
                    // No, usually it's a percentage.
                    // Let's stick to: isFixedAmount means the rate is a fixed value, else percentage.
                    // If fixed amount, is it per unit? Or flat?
                    // Standard OHADA/Senegal scales are usually percentage based.
                    // Let's assume if isFixedAmount is true, it's just added once if the segment is touched? 
                    // Or is it a flat fee for that range?
                    // Let's implement as: Rate is a flat fee if isFixedAmount is true.
                    totalFee += segment.rate;
                } else {
                    totalFee += taxableAmount * (segment.rate / 100);
                }
            }
        }

        return totalFee;
    }
}
