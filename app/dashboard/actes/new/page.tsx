import { db } from "@/lib/db";
import NewActeForm from "./NewActeForm";

export default function NewActePage() {
    const dossiers = db.dossiers;

    return <NewActeForm dossiers={dossiers} />;
}
