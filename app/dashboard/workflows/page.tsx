import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, FileText, ArrowRight } from "lucide-react";

export default function WorkflowsPage() {
  const workflows = db.workflows;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modèles de Workflow</h1>
          <p className="text-muted-foreground">
            Gérez les modèles de workflow pour vos dossiers.
          </p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Modèle
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{workflow.title}</CardTitle>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {workflow.steps.length} étapes
                </span>
                <Button variant="ghost" size="sm">
                  Voir détails <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {workflows.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Aucun modèle de workflow défini.</p>
                <Link href="/dashboard/workflows/new" className="text-primary hover:underline mt-2 inline-block">
                    Créer votre premier modèle
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
