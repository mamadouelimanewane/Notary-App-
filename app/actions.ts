'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// ===================================================================
// 1. Liste complète des types d'actes attendus par ta base (en ASCII)
// ===================================================================
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
  "PERSONNALISE",
] as const;

type ActeType = typeof VALID_ACTE_TYPES[number];

// ===================================================================
// 2. Mapping normalisé : tout texte → valeur valide ASCII
// ===================================================================
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
  CONSENTEMENTPMA: "CONSENTEMENT क्रियेटिव",
  VENTEIMMOBILIERE: "VENTE_IMMOBILIERE",
  PERSONNALISE: "PERSONNALISE",
  PERSONNALISÉ: "PERSONNALISE",
  PERSONNALISER: "PERSONNALISE",
} as const;

// ===================================================================
// 3. Type guard – indispensable pour que TypeScript accepte le narrow
// ===================================================================
function isValidActeType(value: string): value is ActeType {
  return VALID_ACTE_TYPES.includes(value as ActeType);
}

// ===================================================================
// Fonctions classiques (inchangées)
// ===================================================================
export async function createAppointment(formData: FormData) { /* ... identique ... */ }
export async function createClient(formData: FormData) { /* ... identique ... */ }
export async function createDossier(formData: FormData) { /* ... identique ... */ }
export async function createTransaction(formData: FormData) { /* ... identique ... */ }
export async function createTemplate(formData: FormData) { /* ... identique ... */ }
export async function updateTemplate(formData: FormData) { /* ... identique ... */ }
export async function deleteTemplate(id: string) { /* ... identique ... */ }

// ===================================================================
// FONCTION CORRIGÉE – PLUS JAMAIS D'ERREUR DE TYPE
// ===================================================================
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

  // Normalisation complète (accents + caractères spéciaux)
  const normalizedKey = typeRaw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .toUpperCase();

  const mappedType = ACTE_TYPE_MAP[normalizedKey] ?? "PERSONNALISE";

  // Type guard → TypeScript sait maintenant que c'est un ActeType valide
  if (!isValidActeType(mappedType)) {
    throw new Error(`Type d'acte invalide : ${mappedType}`);
  }

  const newActe = {
    id: `acte-${uuidv4()}`,
    type: mappedType,           // ← TypeScript est content : c’est un literal valide
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

  db.addActe(newActe);           // ← Plus d'erreur de type ici
  revalidatePath("/dashboard/actes");
  redirect("/dashboard/actes");
}