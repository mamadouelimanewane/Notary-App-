import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const transaction = db.getTransaction(params.id);

        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de la transaction" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updates = await request.json();
        const updatedTransaction = db.updateTransaction(params.id, updates);

        if (!updatedTransaction) {
            return NextResponse.json(
                { error: "Transaction non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la transaction" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const success = db.deleteTransaction(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Transaction non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de la transaction" },
            { status: 500 }
        );
    }
}
