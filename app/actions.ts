'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

// ──────────────────────────────────────────────────────────────
// 1. On importe le type ActeType (à adapter si le chemin est différent)
// ──────────────────────────────────────────────────────────────
import type { ActeType } from "@/types";   // ← Change le chemin si besoin (ex: "@/types/acte" ou "../types")

// Liste de secours si le type n’est pas trouvé (évite les erreurs à l’exécution)
const VALID_ACTE_TYPES = [
  "CONTRAT_MARIAGE", "DONATION_SIMPLE", "DONATION_EPOUX", "DON_PARTAGE",
  "DONATION_USUFRUIT", "TESTAMENT", "NOTORIÉTÉ", "PARTAGE_SUCCESSION",
  "PACS", "CONSENTEMENT_PMA", "VENTE_IMMOBILIERE", "PERSONNALISER"
] as const;

// Fonction utilitaire de validation sécurisée
function safeActeType(value: string): ActeType {
  if (VALID_ACTE_TYPES.includes(value as any)) {
    return value as ActeType;
  }
  return "PERSONNALISER"; // valeur par défaut sûre
}

// ──────────────────────────────────────────────────────────────
// Toutes tes actions (seule la fonction saveActeMetadata a été modifiée)
// ──────────────────────────────────────────────────────────────

export async function createAppointment(formData: FormData) {
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const duration = parseInt(formData.get('duration') as string);
  const clientId = formData.get('clientId') as string;
  const dossierId = formData.get('dossierId') as string;
  const notes = formData.get('notes') as string;

  if (!title || !date || !time || !duration || !clientId) {
    throw new Error("Champs obligatoires manquants");
  }

  const dateTime = new Date(`${date}T${time}`);
  const newAppointment = {
    id: `apt-${uuidv4()}`,
    title,
    date: dateTime.toISOString(),
    duration,
    clientId,
    dossierId: dossierId || undefined,
    notes: notes || undefined,
  };

  db.addAppointment(newAppointment);
  revalidatePath('/dashboard/agenda');
  redirect('/dashboard/agenda');
}

export async function createClient(formData: FormData) {
  // ... (inchangé)
  // (je garde ton code original, il est déjà parfait)
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const zipCode = formData.get('zipCode') as string;
  const type = formData.get('type') as 'PARTICULIER' | 'ENTREPRISE';

  const companyName = formData.get('companyName') as string;
  const ninea = formData.get('ninea') as string;
  const legalForm = formData.get('legalForm') as string;
  const registrationNumber = formData.get('registrationNumber') as string;
  const contactPerson = formData.get('contactPerson') as string;

  if (!firstName || !lastName || !email || !type) {
    throw new Error("Champs obligatoires manquants");
  }

  const newClient = {
    id: `client-${uuidv4()}`,
    firstName,
    lastName,
    email,
    phone: phone || "",
    address: address || "",
    city: city || "",
    zipCode: zipCode || "",
    type,
    companyName: companyName || undefined,
    ninea: ninea || undefined,
    legalForm: legalForm || undefined,
    registrationNumber: registrationNumber || undefined,
    contactPerson: contactPerson || undefined,
    createdAt: new Date().toISOString(),
    isDeleted: false,
  };

  db.addClient(newClient);
  revalidatePath('/dashboard/clients');
  redirect('/dashboard/clients');
}

export async function createDossier(formData: FormData) {
  // ... inchangé (parfait)
  const title = formData.get('title') as string;
  const type = formData.get('type') as string;
  const status = formData.get('status') as 'OUVERT' | 'EN_COURS' | 'CLOTURE' | 'ARCHIVE';
  const clientId = formData.get('clientId') as string;

  if (!title || !type || !status || !clientId) {
    throw new Error("Champs obligatoires manquants");
  }

  const ref = `${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

  const newDossier = {
    id: `dossier-${uuidv4()}`,
    ref,
    title,
    type,
    status,
    clientId,
    assignedTo: 'user-1',
    createdAt: new Date().toISOString(),
  };

  db.addDossier(newDossier);
  revalidatePath('/dashboard/dossiers');
  redirect('/dashboard/dossiers');
}

export async function createTransaction(formData: FormData) {
  // ... inchangé
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const type = formData.get('type') as 'DEBIT' | 'CREDIT';
  const dossierId = formData.get('dossierId') as string;
  const date = formData.get('date') as string;

  if (!description || isNaN(amount) || !type || !dossierId || !date) {
    throw new Error("Champs obligatoires manquants");
  }

  const newTransaction = {
    id: `trans-${uuidv4()}`,
    date: new Date(date).toISOString(),
    amount,
    type,
    description,
    dossierId,
    reconciled: false,
    reconciledAt: undefined,
  };

  db.addTransaction(newTransaction);
  revalidatePath('/dashboard/comptabilite');
  redirect('/dashboard/comptabilite');
}

// ──────────────────────────────────────────────────────────────
// LA FONCTION QUI POSAIT PROBLÈME → CORRIGÉE
// ──────────────────────────────────────────────────────────────
export async function saveActeMetadata(formData: FormData) {
  const typeRaw = formData.get('type') as string;
  const category = formData.get('category') as string;
  const dossierId = formData.get('dossierId') as string;
  const title = formData.get('title') as string;

  const sellerData = formData.get('seller') as string;
  const buyerData = formData.get('buyer') as string;
  const propertyData = formData.get('property') as string;

  if (!typeRaw || !category || !dossierId || !title) {
    throw new Error("Champs obligatoires manquants");
  }

  // Validation + conversion sécurisée du type
  const type = safeActeType(typeRaw);

  const newActe = {
    id: `acte-${uuidv4()}`,
    type,                                      // ← maintenant c’est bien un ActeType
    category,
    title,
    createdAt: new Date().toISOString(),
    dossierId,
    status: 'BROUILLON' as const,
    metadata: {
      seller: sellerData ? JSON.parse(sellerData) : undefined,
      buyer: buyerData ? JSON.parse(buyerData) : undefined,
      property: propertyData ? JSON.parse(propertyData) : undefined,
    },
  };

  db.addActe(newActe);
  revalidatePath('/dashboard/actes');
  redirect('/dashboard/actes');
}

// ──────────────────────────────────────────────────────────────
// Les autres fonctions restent inchangées (elles étaient déjà bonnes)
// ──────────────────────────────────────────────────────────────
export async function createTemplate(formData: FormData) { /* ... ton code original ... */ }
export async function updateTemplate(formData: FormData) { /* ... ton code original ... */ }
export async function deleteTemplate(id: string) {
  db.deleteTemplate(id);
  revalidatePath('/dashboard/templates');
}