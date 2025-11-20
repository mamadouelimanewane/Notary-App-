import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const acte = db.getActe(params.id);

        if (!acte) {
            return NextResponse.json(
                { error: "Acte non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(acte);
    } catch (error) {
        console.error("Error fetching acte:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de l'acte" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const updates = await request.json();
        const updatedActe = db.updateActe(params.id, updates);

        if (!updatedActe) {
            return NextResponse.json(
                { error: "Acte non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedActe);
    } catch (error) {
        console.error("Error updating acte:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'acte" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const success = db.deleteActe(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Acte non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting acte:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de l'acte" },
            { status: 500 }
        );
    }
}
