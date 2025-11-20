import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TransactionDetailPageClient from "./TransactionDetailPageClient";

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
    const transaction = db.getTransaction(params.id);

    if (!transaction) {
        redirect('/dashboard/comptabilite');
    }

    const dossiers = db.dossiers;

    return <TransactionDetailPageClient transaction={transaction} dossiers={dossiers} />;
}
