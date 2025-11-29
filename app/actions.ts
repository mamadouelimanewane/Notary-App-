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
    type: acteType,
    category: category as "FAMILLE" | "IMMOBILIER" | "AFFAIRES" | "AUTRE",
    title,
    createdAt: new Date().toISOString(),
    dossierId,
    status: "BROUILLON" as const,
    metadata: {
      seller: sellerData ? JSON.parse(sellerData) : undefined,
      buyer: buyerData ? JSON.parse(buyerData) : undefined,
      property: propertyData ? JSON.parse(propertyData) : undefined,
    },
    comments: [],
    history: [],
    blockchain: [],
  };

  db.addActe(newActe);
  revalidatePath("/dashboard/actes");
  redirect("/dashboard/actes");
}

export async function getNotifications(userId: string) {
  return db.getUnreadNotifications(userId);
}

export async function markNotificationRead(id: string) {
  return db.markNotificationAsRead(id);
}

export async function reconcileTransaction(bankTransactionId: string, accountingTransactionId: string) {
  const success = db.reconcileTransactions(bankTransactionId, accountingTransactionId);
  if (success) {
    revalidatePath("/dashboard/rapprochement");
    return { success: true };
  }
  return { success: false, error: "Transaction introuvable" };
}

export async function createDossier(formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as any;
  const clientId = formData.get("clientId") as string;
  const assignedTo = formData.get("assignedTo") as string;
  const workflowTemplateId = formData.get("workflowTemplateId") as string;

  if (!title || !type || !status || !clientId || !assignedTo) {
    throw new Error("Champs obligatoires manquants");
  }

  const dossierId = `dossier-${uuidv4()}`;
  let workflowId = undefined;

  // Création du Workflow si sélectionné
  if (workflowTemplateId) {
    const wfId = `wf-${uuidv4()}`;
    let steps: any[] = [];
    let templateId = workflowTemplateId;

    if (workflowTemplateId === 'VENTE_IMMOBILIERE') {
      steps = [
        // 1. Phase Initiale
        { id: uuidv4(), templateId: '1.1', title: 'Contact et Rendez-vous', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '1.2', title: 'Ouverture du Dossier', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '1.3', title: 'Collecte des Pièces Initiales', status: 'PENDING' as const, notes: '' },
        // 2. Phase Pré-Contractuelle
        { id: uuidv4(), templateId: '2.1', title: 'Rédaction de l\'Avant-Contrat', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '2.2', title: 'Réception du Dépôt de Garantie', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '2.3', title: 'Signature de l\'Avant-Contrat', status: 'PENDING' as const, notes: '' },
        // 3. Phase d'étude
        { id: uuidv4(), templateId: '3.1', title: 'Vérifications Administratives (TF, Urbanisme...)', status: 'PENDING' as const, notes: '' },
        // 4. Phase de production
        { id: uuidv4(), templateId: '4.1', title: 'Préparation Financière (Taxe et Frais)', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '4.2', title: 'Rédaction et Impression de l\'Acte', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '4.3', title: 'Signature et Solde', status: 'PENDING' as const, notes: '' },
        // 5. Après signature
        { id: uuidv4(), templateId: '5.1', title: 'Enregistrement Fiscal', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '5.2', title: 'Mutation du Titre Foncier', status: 'PENDING' as const, notes: '' },
        { id: uuidv4(), templateId: '5.3', title: 'Clôture du Dossier', status: 'PENDING' as const, notes: '' },
      ];
    } else {
      const template = db.workflows.find(w => w.id === workflowTemplateId);
      if (template) {
        let accumulatedDays = 0;
        steps = template.steps.map(s => {
          if (s.estimatedDuration) {
            accumulatedDays += s.estimatedDuration;
          }
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + accumulatedDays);

          return {
            id: uuidv4(),
            templateId: s.id,
            title: s.title,
            status: 'PENDING' as const,
            notes: '',
            dueDate: s.estimatedDuration ? dueDate.toISOString() : undefined
          };
        });
      }
    }

    if (steps.length > 0) {
      // Set first step to IN_PROGRESS
      steps[0].status = 'IN_PROGRESS';

      workflowId = wfId;
      const workflowInstance = {
        id: wfId,
        templateId,
        dossierId: dossierId,
        currentStepIndex: 0,
        status: 'IN_PROGRESS' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        steps
      };
      db.addWorkflowInstance(workflowInstance);
    }
  }

  const newDossier = {
    id: dossierId,
    ref: `DOS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    title,
    type,
    status,
    clientId,
    assignedTo,
    createdAt: new Date().toISOString(),
    workflowId,
  };

  db.addDossier(newDossier);
  revalidatePath("/dashboard/dossiers");
  redirect("/dashboard/dossiers");
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dossierId = formData.get("dossierId") as string;
  const assignedTo = formData.get("assignedTo") as string;
  const dueDate = formData.get("dueDate") as string;
  const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH";

  if (!title || !dossierId || !assignedTo) {
    throw new Error("Champs obligatoires manquants");
  }

  const newTask = {
    id: `task-${uuidv4()}`,
    title,
    description: description || "",
    dossierId,
    assignedTo,
    status: "TODO" as const,
    priority: priority || "MEDIUM",
    dueDate: dueDate || undefined,
    createdAt: new Date().toISOString(),
  };

  db.addTask(newTask);
  revalidatePath(`/dashboard/dossiers/${dossierId}`);
  return { success: true, task: newTask };
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE", dossierId: string) {
  // Get all tasks
  const allTasks = db.getTasksByDossier(dossierId);
  const task = allTasks.find((t: any) => t.id === taskId);

  if (!task) {
    throw new Error("Tâche introuvable");
  }

  const updatedTask = { ...task, status };
  db.updateTask(updatedTask);
  revalidatePath(`/dashboard/dossiers/${dossierId}`);
  return { success: true };
}

export async function uploadDossierDocument(formData: FormData) {
  const dossierId = formData.get("dossierId") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const fileData = formData.get("fileData") as string;
  const size = parseInt(formData.get("size") as string);

  if (!dossierId || !name || !fileData) {
    throw new Error("Champs obligatoires manquants");
  }

  const newDocument = {
    id: `doc-${uuidv4()}`,
    dossierId,
    name,
    type: type || "application/octet-stream",
    fileData,
    uploadedAt: new Date().toISOString(),
    uploadedBy: "current-user", // Should be from session
    size,
  };

  db.addDossierDocument(newDocument);
  revalidatePath(`/dashboard/dossiers/${dossierId}`);
  return { success: true, document: newDocument };
}

export async function updateWorkflowStep(workflowId: string, stepId: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED', notes?: string) {
  const workflow = db.workflowInstances.find(w => w.id === workflowId);
  if (!workflow) {
    throw new Error("Workflow introuvable");
  }

  const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) {
    throw new Error("Étape introuvable");
  }

  const updatedSteps = [...workflow.steps];
  updatedSteps[stepIndex] = {
    ...updatedSteps[stepIndex],
    status,
    notes: notes !== undefined ? notes : updatedSteps[stepIndex].notes,
    completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined,
    completedBy: status === 'COMPLETED' ? 'current-user' : undefined, // Should use session user
  };

  // Update currentStepIndex if needed
  let currentStepIndex = workflow.currentStepIndex;
  if (status === 'COMPLETED') {
    // Execute Automations
    const workflowTemplate = db.workflows.find(t => t.id === workflow.templateId);
    if (workflowTemplate) {
      const stepTemplate = workflowTemplate.steps.find(s => s.id === updatedSteps[stepIndex].templateId);
      if (stepTemplate && stepTemplate.automations) {
        for (const automation of stepTemplate.automations) {
          console.log(`[AUTOMATION] Executing ${automation.type} for dossier ${workflow.dossierId}`);
          // Placeholder for actual automation logic
          if (automation.type === 'SEND_EMAIL') {
            db.addInternalNotification({
              id: `notif-${uuidv4()}`,
              userId: 'admin', // Should be dynamic
              title: 'Automation Executed',
              message: `Email sent for step ${stepTemplate.title}`,
              type: 'INFO',
              read: false,
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    }

    if (currentStepIndex === stepIndex) {
      // Find next pending step
      const nextStepIndex = updatedSteps.findIndex((s, idx) => idx > stepIndex && s.status === 'PENDING');
      if (nextStepIndex !== -1) {
        currentStepIndex = nextStepIndex;
        updatedSteps[nextStepIndex].status = 'IN_PROGRESS';
      }
    }
  }

  const updatedWorkflow = {
    ...workflow,
    steps: updatedSteps,
    currentStepIndex,
    updatedAt: new Date().toISOString(),
    status: (updatedSteps.every(s => s.status === 'COMPLETED') ? 'COMPLETED' : 'IN_PROGRESS') as "COMPLETED" | "IN_PROGRESS" | "PAUSED"
  };

  db.updateWorkflowInstance(workflowId, updatedWorkflow);
  revalidatePath(`/dashboard/dossiers/${workflow.dossierId}`);
  return { success: true };
}

export async function assignWorkflowStep(workflowId: string, stepId: string, assigneeId: string) {
  const workflow = db.workflowInstances.find(w => w.id === workflowId);
  if (!workflow) {
    throw new Error("Workflow introuvable");
  }

  const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) {
    throw new Error("Étape introuvable");
  }

  const updatedSteps = [...workflow.steps];
  updatedSteps[stepIndex] = {
    ...updatedSteps[stepIndex],
    assigneeId
  };

  const updatedWorkflow = {
    ...workflow,
    steps: updatedSteps,
    updatedAt: new Date().toISOString()
  };

  db.updateWorkflowInstance(workflowId, updatedWorkflow);
  revalidatePath(`/dashboard/dossiers/${workflow.dossierId}`);
  return { success: true };
}

export async function createWorkflowTemplate(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const stepsJson = formData.get("steps") as string;

  if (!title || !stepsJson) {
    throw new Error("Champs obligatoires manquants");
  }

  const steps = JSON.parse(stepsJson);

  const newWorkflowTemplate = {
    id: `wf-tpl-${uuidv4()}`,
    title,
    description: description || "",
    steps: steps.map((step: any) => ({
      id: `step-tpl-${uuidv4()}`,
      title: step.title,
      description: step.description || "",
      role: step.role || "NOTARY",
      requiredDocuments: step.requiredDocuments || [],
      estimatedDuration: step.estimatedDuration ? parseInt(step.estimatedDuration) : undefined,
      automations: step.automationType ? [{
        type: step.automationType,
        templateId: 'default',
        target: 'CLIENT'
      }] : []
    }))
  };

  db.addWorkflow(newWorkflowTemplate);
  revalidatePath("/dashboard/workflows");
  redirect("/dashboard/workflows");
}

export async function createTransaction(formData: FormData) {
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "DEBIT" | "CREDIT";
  const dossierId = formData.get("dossierId") as string;

  if (!date || !description || isNaN(amount) || !type || !dossierId) {
    throw new Error("Champs obligatoires manquants");
  }

  const newTransaction = {
    id: `trans-${uuidv4()}`,
    date,
    amount,
    type,
    description,
    dossierId,
    reconciled: false,
  };

  db.addTransaction(newTransaction);
  revalidatePath("/dashboard/comptabilite");
  revalidatePath(`/dashboard/dossiers/${dossierId}`);
  redirect("/dashboard/comptabilite");
}

export async function createAppointment(formData: FormData) {
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const duration = parseInt(formData.get("duration") as string);
  const clientId = formData.get("clientId") as string;
  const dossierId = formData.get("dossierId") as string;
  const notes = formData.get("notes") as string;

  if (!title || !date || isNaN(duration)) {
    throw new Error("Champs obligatoires manquants");
  }

  const newAppointment = {
    id: `appt-${uuidv4()}`,
    title,
    date,
    duration,
    clientId: clientId || undefined,
    dossierId: dossierId || undefined,
    notes: notes || "",
  };

  db.addAppointment(newAppointment);
  revalidatePath("/dashboard/agenda");
  redirect("/dashboard/agenda");
}

export async function createTemplate(formData: FormData) {
  const name = formData.get("name") as string;
  const acteType = formData.get("acteType") as string;
  const category = formData.get("category") as any;
  const content = formData.get("content") as string;

  if (!name || !acteType || !category || !content) {
    throw new Error("Champs obligatoires manquants");
  }

  const newTemplate = {
    id: `tpl-${uuidv4()}`,
    name,
    acteType,
    category,
    content,
    variables: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false
  };

  db.addTemplate(newTemplate);
  revalidatePath("/dashboard/templates");
  redirect("/dashboard/templates");
}

export async function createClient(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;
  const type = formData.get("type") as "PARTICULIER" | "ENTREPRISE";

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
    createdAt: new Date().toISOString()
  };

  db.addClient(newClient);
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function updateClient(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;
  const type = formData.get("type") as "PARTICULIER" | "ENTREPRISE";

  if (!firstName || !lastName || !email || !type) {
    throw new Error("Champs obligatoires manquants");
  }

  const updates = {
    firstName,
    lastName,
    email,
    phone: phone || "",
    address: address || "",
    city: city || "",
    zipCode: zipCode || "",
    type
  };

  db.updateClient(id, updates);
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function deleteClient(id: string) {
  db.deleteClient(id);
  revalidatePath("/dashboard/clients");
}

export async function updateDossierStatus(id: string, status: any) {
  db.updateDossier(id, { status });
  revalidatePath(`/dashboard/dossiers/${id}`);
}