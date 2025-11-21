'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// Liste complète des types valides (doit correspondre exactement à ta DB)
const VALID_ACTE_TYPES = [
  "CONTRAT_MARIAGE",
  "DONATION_SIMPLE",
  "DONATION_EPOUX",
  "DONATION_PARTAGE",
  "DONATION_USUFRUIT",
  "TESTAMENT",
  "NOTORIETE",
  "PARTAGE_SUCCESSION",
  "PACS",
  "CONSENTEMENT_PMA",
  "VENTE_IMMOBILIERE",
  "PERSONNALISE"
] as const;

type ActeType = typeof VALID_ACTE_TYPES[number];

const ACTE_TYPE_MAP: Record<string, ActeType> = {
  CONTRATMARIAGE: "CONTRAT_MARIAGE",
  DONATIONSIMPLE: "DONATION_SIMPLE",
  DONATIONEPOUX: "DONATION_EPOUX",
  DONPARTAGE: "DONATION_PARTAGE",
  DONATIONUSUFRUIT: "DONATION_USUFRUIT",
  TESTAMENT: "TESTAMENT",
  NOTORIETE: "NOTORIETE",
  NOTORIÉTÉ: "NOTORIETE",
  PARTAGESUCCESSION: "PARTAGE_SUCCESSION",
  PACS: "PACS",
  CONSENTEMENTPMA: "CONSENTEMENT_PMA",
  VENTEIMMOBILIERE: "VENTE_IMMOBILIERE",
  PERSONNALISE: "PERSONNALISE",
  PERSONNALISÉ: "PERSONNALISE",
  PERSONNALISER: "PERSONNALISE",
} as const;

function normalizeType(input: string): ActeType {
  const key = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .toUpperCase();

  return ACTE_TYPE_MAP[key] ?? "PERSONNALISE";
}

// Toutes tes autres fonctions (createAppointment, createClient, etc.) restent identiques
// ... (je les omette pour la brièveté, garde-les telles quelles)

export async function saveActeMetadata(formData: FormData) {
  const typeRaw = formData.get("type") as string;
  const category = formData.get("category") as string;
  const dossierId = formData.get("dossierId") as string;
  const title = formData.get("title") as string;

  const sellerData = formData.get("seller") as string;
  const buyerData = formData.get("buyer") as string;
  const propertyData = formData.get("property") as string;

  if (!typeRaw || !category || !dossierId || !title) {
    throw new Error("Champs obligatoires manquants");
  }

  const acteType = normalizeType(typeRaw);

  const newActe = {
    id: `acte-${uuidv4()}`,
    type: acteType,  // TypeScript est content : c’est un ActeType valide
    category,
    title,
    createdAt: new Date().toISOString(),
    dossierId,
    status: "BROUILLON" as const,
    metadata: {
      seller: sellerData ? JSON.parse(sellerData) : undefined,
      buyer: buyerData ? JSON.parse(buyerData) : undefined,
      property: propertyData ? JSON.parse(propertyData) : undefined,
    },
  };

  db.addActe(newActe);
  revalidatePath("/dashboard/actes");
  redirect("/dashboard/actes");
}

// Garde toutes les autres fonctions (createTemplate, updateTemplate, etc.)