'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

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

    // Combine date and time
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
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const zipCode = formData.get('zipCode') as string;
    const type = formData.get('type') as 'PARTICULIER' | 'ENTREPRISE';

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
    };

    db.addClient(newClient);

    revalidatePath('/dashboard/clients');
    redirect('/dashboard/clients');
}

export async function createDossier(formData: FormData) {
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const status = formData.get('status') as 'OUVERT' | 'EN_COURS' | 'CLOTURE' | 'ARCHIVE';
    const clientId = formData.get('clientId') as string;

    if (!title || !type || !status || !clientId) {
        throw new Error("Champs obligatoires manquants");
    }

    // Generate a simple ref based on year and random number for now
    const ref = `${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const newDossier = {
        id: `dossier-${uuidv4()}`,
        ref,
        title,
        type,
        status,
        clientId,
        assignedTo: 'user-1', // Default user for now
        createdAt: new Date().toISOString(),
    };

    db.addDossier(newDossier);

    revalidatePath('/dashboard/dossiers');
    redirect('/dashboard/dossiers');
}

export async function createTransaction(formData: FormData) {
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
    };

    db.addTransaction(newTransaction);

    revalidatePath('/dashboard/comptabilite');
    redirect('/dashboard/comptabilite');
}

export async function saveActeMetadata(formData: FormData) {
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const dossierId = formData.get('dossierId') as string;
    const title = formData.get('title') as string;

    // Parse metadata JSON strings
    const sellerData = formData.get('seller') as string;
    const buyerData = formData.get('buyer') as string;
    const propertyData = formData.get('property') as string;

    if (!type || !category || !dossierId || !title) {
        throw new Error("Champs obligatoires manquants");
    }

    const newActe = {
        id: `acte-${uuidv4()}`,
        type,
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

export async function createTemplate(formData: FormData) {
    const name = formData.get('name') as string;
    const acteType = formData.get('acteType') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const variablesStr = formData.get('variables') as string;

    if (!name || !acteType || !category || !content) {
        throw new Error("Champs obligatoires manquants");
    }

    const variables = variablesStr ? JSON.parse(variablesStr) : [];

    const newTemplate = {
        id: `template-${uuidv4()}`,
        name,
        acteType,
        category,
        content,
        variables,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
    };

    db.addTemplate(newTemplate);

    revalidatePath('/dashboard/templates');
    redirect('/dashboard/templates');
}

export async function updateTemplate(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const content = formData.get('content') as string;
    const variablesStr = formData.get('variables') as string;

    if (!id || !name || !content) {
        throw new Error("Champs obligatoires manquants");
    }

    const variables = variablesStr ? JSON.parse(variablesStr) : [];

    db.updateTemplate(id, {
        name,
        content,
        variables,
    });

    revalidatePath('/dashboard/templates');
    redirect('/dashboard/templates');
}

export async function deleteTemplate(id: string) {
    db.deleteTemplate(id);
    revalidatePath('/dashboard/templates');
}
