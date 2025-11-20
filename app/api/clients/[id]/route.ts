import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = db.getClient(params.id);

        if (!client) {
            return NextResponse.json(
                { error: "Client non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération du client" },
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
        const updatedClient = db.updateClient(params.id, updates);

        if (!updatedClient) {
            return NextResponse.json(
                { error: "Client non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour du client" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const success = db.deleteClient(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Client non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression du client" },
            { status: 500 }
        );
    }
}
