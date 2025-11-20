import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseCSVBankStatement, validateCSV } from '@/lib/bank-parser';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Read file content
        const content = await file.text();

        // Validate CSV
        const validation = validateCSV(content);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
        }

        // Parse transactions
        const parsedTransactions = parseCSVBankStatement(content);

        // Create bank statement
        const statementId = `stmt-${uuidv4()}`;
        const statement = {
            id: statementId,
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
            totalTransactions: parsedTransactions.length,
            reconciledCount: 0,
        };

        // Create bank transactions
        const bankTransactions = parsedTransactions.map(t => ({
            id: `btx-${uuidv4()}`,
            statementId,
            date: t.date,
            description: t.description,
            amount: t.amount,
            type: t.type,
            reconciled: false,
        }));

        // Add to database (we need to add methods to db)
        db.data.bankStatements = db.data.bankStatements || [];
        db.data.bankTransactions = db.data.bankTransactions || [];

        db.data.bankStatements.push(statement);
        db.data.bankTransactions.push(...bankTransactions);
        db['save'](); // Force save

        return NextResponse.json({
            success: true,
            statement,
            transactionsCount: bankTransactions.length
        });

    } catch (error) {
        console.error('Error uploading bank statement:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
