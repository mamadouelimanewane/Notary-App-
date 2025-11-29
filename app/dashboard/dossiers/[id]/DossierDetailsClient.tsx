"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Dossier, Client, Task, User, Acte, DossierDocument, WorkflowInstance } from "@/types/db";
import { createTask, updateTaskStatus, uploadDossierDocument, updateWorkflowStep } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, CheckCircle2, Clock, AlertCircle, User as UserIcon, Briefcase, FileText, Plus, Folder, Upload, File, Download, GitBranch } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WorkflowTimeline } from "@/components/workflow/WorkflowTimeline";
import { WorkflowStats } from "@/components/workflow/WorkflowStats";
import { WorkflowVisualizer } from "@/components/workflow/WorkflowVisualizer";

interface DossierDetailsClientProps {
    dossier: Dossier;
    client?: Client;
    tasks: Task[];
    actes?: Acte[];
    documents?: DossierDocument[];
    users: User[];
    workflow?: WorkflowInstance;
}

export default function DossierDetailsClient({ dossier, client, tasks, actes = [], documents = [], users, workflow }: DossierDetailsClientProps) {
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCompleteStep = async (stepId: string, notes?: string) => {
        if (!workflow) return;
        try {
            await updateWorkflowStep(workflow.id, stepId, 'COMPLETED', notes);
        } catch (error) {
            console.error("Failed to complete step", error);
        }
    };

    const handleStartStep = async (stepId: string) => {
        if (!workflow) return;
        try {
            await updateWorkflowStep(workflow.id, stepId, 'IN_PROGRESS');
        } catch (error) {
            console.error("Failed to start step", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OUVERT": return "bg-green-100 text-green-800";
            case "EN_COURS": return "bg-blue-100 text-blue-800";
            case "CLOTURE": return "bg-gray-100 text-gray-800";
            case "ARCHIVE": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return "text-red-600 bg-red-50 border-red-200";
            case "MEDIUM": return "text-orange-600 bg-orange-50 border-orange-200";
            case "LOW": return "text-blue-600 bg-blue-50 border-blue-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const handleCreateTask = async (formData: FormData) => {
        setIsLoading(true);
        try {
            // Append dossierId to formData
            formData.append("dossierId", dossier.id);
            await createTask(formData);
            setIsTaskDialogOpen(false);
        } catch (error) {
            console.error("Failed to create task", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
        try {
            await updateTaskStatus(taskId, newStatus, dossier.id);
        } catch (error) {
            console.error("Failed to update task status", error);
        }
    };

    const handleUploadDocument = async (formData: FormData) => {
        setIsLoading(true);
        try {
            formData.append("dossierId", dossier.id);
            formData.append("uploadedBy", "current-user-id"); // Replace with actual user ID

            const file = formData.get("file") as File;
            if (file) {
                formData.append("name", file.name);
                formData.append("type", file.type);
                formData.append("size", file.size.toString());

                // Convert file to base64
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64 = reader.result as string;
                    formData.append("fileData", base64);
                    await uploadDossierDocument(formData);
                    setIsUploadDialogOpen(false);
                    setIsLoading(false);
                };
            }
        } catch (error) {
            console.error("Failed to upload document", error);
            setIsLoading(false);
        }
    };

    const todoTasks = tasks.filter(t => t.status === 'TODO');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const doneTasks = tasks.filter(t => t.status === 'DONE');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight font-serif text-primary">{dossier.title}</h1>
                        <Badge variant="outline" className={getStatusColor(dossier.status)}>
                            {dossier.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            Ref: {dossier.ref}
                        </span>
                        <span className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            Client: {client ? `${client.firstName} ${client.lastName}` : "Inconnu"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Créé le {format(new Date(dossier.createdAt), "d MMMM yyyy", { locale: fr })}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Modifier</Button>
                    <Link href={`/dashboard/dossiers/${dossier.id}/generate`}>
                        <Button>Générer un acte</Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="workflow" className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
                    <TabsTrigger value="workflow">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Workflow
                    </TabsTrigger>
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="tasks">Tâches</TabsTrigger>
                    <TabsTrigger value="actes">Actes</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="workflow" className="mt-6 space-y-6">
                    {workflow ? (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Visualisation du Workflow</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <WorkflowVisualizer steps={workflow.steps} />
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="lg:col-span-1">
                                    <WorkflowStats workflow={workflow} />
                                </div>
                                <div className="lg:col-span-2">
                                    <WorkflowTimeline
                                        workflowId={workflow.id}
                                        steps={workflow.steps}
                                        currentStepIndex={workflow.currentStepIndex}
                                        onStepComplete={handleCompleteStep}
                                        users={users}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Aucun workflow actif pour ce dossier.</p>
                            <p className="text-sm mt-2">Les workflows sont créés lors de la création du dossier.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du Dossier</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Type</Label>
                                        <p className="font-medium">{dossier.type}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Statut</Label>
                                        <p className="font-medium">{dossier.status}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Responsable</Label>
                                        <p className="font-medium">
                                            {users.find(u => u.id === dossier.assignedTo)?.firstName} {users.find(u => u.id === dossier.assignedTo)?.lastName}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Associé</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {client ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {client.firstName[0]}{client.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium">{client.firstName} {client.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{client.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground">Téléphone</Label>
                                                <p>{client.phone}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Ville</Label>
                                                <p>{client.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Aucun client associé</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Suivi des Tâches</h3>
                        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouvelle Tâche
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Ajouter une tâche</DialogTitle>
                                    <DialogDescription>
                                        Créez une nouvelle tâche pour ce dossier.
                                    </DialogDescription>
                                </DialogHeader>
                                <form action={handleCreateTask} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre</Label>
                                        <Input id="title" name="title" required placeholder="Ex: Récupérer l'état civil" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" placeholder="Détails supplémentaires..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dueDate">Échéance</Label>
                                            <Input id="dueDate" name="dueDate" type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="priority">Priorité</Label>
                                            <Select name="priority" defaultValue="MEDIUM">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LOW">Basse</SelectItem>
                                                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                                    <SelectItem value="HIGH">Haute</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="assignedTo">Assigné à</Label>
                                        <Select name="assignedTo">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un collaborateur" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map(user => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.firstName} {user.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Création..." : "Créer la tâche"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* TODO Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    À Faire ({todoTasks.length})
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {todoTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} users={users} />
                                ))}
                                {todoTasks.length === 0 && (
                                    <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                                        Aucune tâche
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* IN PROGRESS Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    En Cours ({inProgressTasks.length})
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {inProgressTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} users={users} />
                                ))}
                                {inProgressTasks.length === 0 && (
                                    <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                                        Aucune tâche
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DONE Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Terminé ({doneTasks.length})
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {doneTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} users={users} />
                                ))}
                                {doneTasks.length === 0 && (
                                    <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                                        Aucune tâche
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="actes" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Actes du Dossier</h3>
                        <Link href={`/dashboard/dossiers/${dossier.id}/generate`}>
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvel Acte
                            </Button>
                        </Link>
                    </div>

                    {actes && actes.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {actes.map((acte) => (
                                <Card key={acte.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="mb-2">
                                                {acte.type.replace(/_/g, " ")}
                                            </Badge>
                                            <Badge className={
                                                acte.status === 'SIGNE' ? 'bg-green-100 text-green-800' :
                                                    acte.status === 'VALIDE' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }>
                                                {acte.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-base line-clamp-1" title={acte.title}>
                                            {acte.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Créé le {format(new Date(acte.createdAt), "d MMMM yyyy", { locale: fr })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <Link href={`/dashboard/actes/${acte.id}`}>
                                                <Button variant="ghost" size="sm">Voir</Button>
                                            </Link>
                                            <Link href={`/dashboard/actes/${acte.id}/edit`}>
                                                <Button variant="outline" size="sm">Éditer</Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Aucun acte associé à ce dossier.</p>
                            <Link href={`/dashboard/dossiers/${dossier.id}/generate`} className="mt-4 inline-block">
                                <Button variant="link">Générer un premier acte</Button>
                            </Link>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Documents du Dossier</h3>
                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Importer un document
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Importer un document</DialogTitle>
                                    <DialogDescription>
                                        Ajoutez un document au dossier (PDF, Image, Word, etc.)
                                    </DialogDescription>
                                </DialogHeader>
                                <form action={handleUploadDocument} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="file">Fichier</Label>
                                        <Input id="file" name="file" type="file" required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Importation..." : "Importer"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {documents && documents.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {documents.map((doc) => (
                                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <File className="w-6 h-6 text-primary" />
                                            </div>
                                            <Badge variant="outline" className="uppercase text-[10px]">
                                                {doc.type.split('/')[1] || 'Fichier'}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-base line-clamp-1 mt-2" title={doc.name}>
                                            {doc.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Ajouté le {format(new Date(doc.uploadedAt), "d MMM yyyy", { locale: fr })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                            <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={doc.fileData} download={doc.name}>
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Télécharger
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Folder className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Aucun document dans ce dossier.</p>
                            <Button variant="link" onClick={() => setIsUploadDialogOpen(true)}>
                                Importer un premier document
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TaskCard({ task, onStatusChange, users }: { task: Task, onStatusChange: (id: string, status: any) => void, users: User[] }) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return "text-red-700 bg-red-50 border-red-200";
            case "MEDIUM": return "text-orange-700 bg-orange-50 border-orange-200";
            case "LOW": return "text-blue-700 bg-blue-50 border-blue-200";
            default: return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    const assignedUser = users.find(u => u.id === task.assignedTo);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h5 className="font-medium text-sm leading-tight">{task.title}</h5>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'HIGH' ? 'Haute' : task.priority === 'MEDIUM' ? 'Moyenne' : 'Basse'}
                    </Badge>
                </div>

                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t mt-2">
                    <div className="flex items-center gap-2">
                        {assignedUser && (
                            <div className="flex items-center gap-1" title={`Assigné à ${assignedUser.firstName} ${assignedUser.lastName}`}>
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {assignedUser.firstName[0]}{assignedUser.lastName[0]}
                                </div>
                            </div>
                        )}
                        {task.dueDate && (
                            <div className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-medium' : ''}`}>
                                <Calendar className="w-3 h-3" />
                                {format(new Date(task.dueDate), "d MMM", { locale: fr })}
                            </div>
                        )}
                    </div>

                    <Select defaultValue={task.status} onValueChange={(val) => onStatusChange(task.id, val)}>
                        <SelectTrigger className="h-6 w-[24px] p-0 border-none shadow-none focus:ring-0">
                            <div className="p-1 hover:bg-muted rounded-full cursor-pointer">
                                <Clock className="w-3 h-3" />
                            </div>
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="TODO">À faire</SelectItem>
                            <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                            <SelectItem value="DONE">Terminé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
