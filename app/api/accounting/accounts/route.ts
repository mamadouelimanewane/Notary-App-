import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { accountService } from '@/lib/accounting/account-service';
import { Account } from '@/lib/accounting/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');
        const classCode = searchParams.get('class');

        let accounts = db.accounts;

        // If DB is empty, initialize from service (JSON)
        if (accounts.length === 0) {
            accounts = accountService.getAllAccounts();
            // Optionally save to DB here if we want to persist JSON data to our mutable DB
            // accounts.forEach(acc => db.addAccount(acc));
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            accounts = accounts.filter(a =>
                a.code.includes(query) ||
                a.label.toLowerCase().includes(lowerQuery)
            );
        }

        if (classCode) {
            accounts = accounts.filter(a => a.classCode === classCode);
        }

        return NextResponse.json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, label, classCode, type, parent } = body;

        if (!code || !label || !classCode || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if account already exists
        const existingAccount = db.accounts.find(a => a.code === code);
        if (existingAccount) {
            return NextResponse.json(
                { error: 'Account code already exists' },
                { status: 409 }
            );
        }

        const newAccount: Account = {
            code,
            label,
            classCode,
            type,
            parent,
            isActive: true,
            isSummary: false, // Default to imputable
            description: body.description,
            nature: 'DEBIT' // Default nature, should ideally be passed from body or inferred from class
        };

        const savedAccount = db.addAccount(newAccount);
        return NextResponse.json(savedAccount);
    } catch (error) {
        console.error('Error creating account:', error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { code, label, description } = body;

        if (!code || !label) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const updatedAccount = db.updateAccount(code, { label, description });

        if (!updatedAccount) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedAccount);
    } catch (error) {
        console.error('Error updating account:', error);
        return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json(
                { error: 'Account code is required' },
                { status: 400 }
            );
        }

        // Check if account has entries
        const entries = db.getEntriesByAccount(code);
        if (entries.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete account with existing entries' },
                { status: 409 }
            );
        }

        const success = db.deleteAccount(code);

        if (!success) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}
