import { Phone, Mail, User, Building2, MapPin, Users } from "lucide-react";
import { db } from "@/lib/db";
import AnnuairePageClient from "./AnnuairePageClient";

export default function AnnuairePage() {
    // Récupérer les données côté serveur
    const clients = db.clients;
    const users = db.users;

    return <AnnuairePageClient clients={clients} users={users} />;
}
