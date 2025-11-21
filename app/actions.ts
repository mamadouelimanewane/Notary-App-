'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// Union des valeurs acceptées par ton formulaire / UI
type ActeType = "CONTRAT_MARIAGE" | "DONATION_SIMPLE" | "DONATION_EPOUX" | "DON_PARTAGE" | "DONATION_USUFRUIT" | "TESTAMENT" | "NOTORIÉTÉ" | "PARTAGE_SUCCESSION" | "PACS" | "CONSENTEMENT_PMA" | "VENTE_IMMOBILIERE" | "PERSONNALISÉ";

// Mapping pour normaliser les accents (ex: "NOTORiete" → "NOTORIÉTÉ")
const ACTE_TYPE_MAP: Record<string, ActeType> = {
  CONTRAT_MARIAGE: "CONTRAT_MARIAGE",
  DONATION_SIMPLE: "DONATION_SIMPLE",
  DONATION_EPOUX: "DONATION_EPOUX",
  DON_PARTAGE: "DON_PARTAGE",
  DONATION_USUFRUIT: "DONATION_USUFRUIT",
  TESTAMENT: "TESTAMENT",
  NOTORIETE: "NOTORIÉTÉ",
  "NOTORIÉTÉ": "NOTORIÉTÉ",
  PARTAGE_SUCCESSION: "PARTAGE_SUCCESSION",
  PACS: "PACS",
  CONSENTEMENT_PMA: "CONSENTEMENT_PMA",
  VENTE_IMMOBILIERE: "VENTE_IMMOBILIERE",
  PERSONNALISE: "PERSONNALISÉ",
  PERSONNALISÉ: "PERSONNALISÉ",
  PERSONNALISER: "PERSONNALISÉ",
} as const;

// Mapping final → valeurs EXACTES attendues par la DB (fix clé "DON_PARTAGE" → "DONATION_PARTAGE")
const DB_ACTE_TYPE_MAP: Record<ActeType, string> = {
  "CONTRAT_MARIAGE": "CONTRAT_MARIAGE",
  "DONATION_SIMPLE": "DONATION_SIMPLE",
  "DONATION_EPOUX": "DONATION_EPOUX",
  "DON_PARTAGE": "DONATION_PARTAGE",     // ← LA FIX MAGIQUE
  "DONATION_USUFRUIT": "DONATION_USUFRUIT",
  "TESTAMENT": "TESTAMENT",
  "NOTORIÉTÉ": "NOTORIÉTÉ",
  "PARTAGE_SUCCESSION": "PARTAGE_SUCCESSION",
  "PACS": "PACS",
  "CONSENTEMENT_PMA": "CONSENTEMENT_PMA",
  "VENTE_IMMOBILIERE": "VENTE_IMMOBILIERE",
  "PERSONNALISÉ": "PERSONNALISÉ",
} as const;

export async function createAppointment(formData: FormData) { /* ... reste identique ... */ }
export async function createClient(formData: FormData) { /* ... reste identique ... */ }
export async function createDossier(formData: FormData) { /* ... reste identique ... */ }
export async function createTransaction(formData: FormData) { /* ... reste identique ... */ }

// FONCTION CORRIGÉE DÉFINITIVEMENT
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

  // 1. Normalisation des accents
  const key = typeRaw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  // 2. Récupère le type propre (ex: "DON_PARTAGE")
  const acteType: ActeType = ACTE_TYPE_MAP[key] ?? "PERSONNALISÉ";

  // 3. Traduit vers la valeur EXACTE attendue par la DB
  const typeForDb = DB_ACTE_TYPE_MAP[acteType];

  const newActe = {
    id: `acte-${uuidv4()}`,
    type: typeForDb,           // ← 100 % compatible avec db.addActe
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

export async function createTemplate(formData: FormData) { /* ... reste identique ... */ }
export async function updateTemplate(formData: FormData) { /* ... reste identique ... */ }
export async function deleteTemplate(id: string) { /* ... reste identique ... */ }