import { db } from "@/lib/db";
import TemplatesPageClient from "./TemplatesPageClient";

export const dynamic = 'auto';

export default function TemplatesPage() {
    const templates = db.templates;

    return <TemplatesPageClient initialTemplates={templates} />;
}
