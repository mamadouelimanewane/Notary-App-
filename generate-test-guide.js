const fs = require('fs');
const path = require('path');

// Create HTML content for PDF generation
const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide de Test - Parcours Client Complet</title>
    <style>
        @page {
            margin: 2cm;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #1e40af;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        h2 {
            color: #2563eb;
            margin-top: 25px;
            page-break-after: avoid;
        }
        h3 {
            color: #3b82f6;
            margin-top: 20px;
        }
        .step {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        .success {
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 10px;
            margin: 10px 0;
        }
        .warning {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 10px;
            margin: 10px 0;
        }
        .info {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 10px;
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
        }
        th {
            background: #f3f4f6;
            font-weight: 600;
        }
        .checklist {
            list-style: none;
            padding-left: 0;
        }
        .checklist li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .checklist li:before {
            content: "☐ ";
            color: #3b82f6;
            font-weight: bold;
            margin-right: 10px;
        }
        code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .page-break {
            page-break-after: always;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            border: none;
            margin: 0;
        }
        .header p {
            color: #6b7280;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Guide de Test Complet</h1>
        <p><strong>Application de Gestion Notariale</strong></p>
        <p>Parcours Client de Bout en Bout</p>
        <p style="font-size: 0.9em; color: #9ca3af;">Version 1.0 - Novembre 2024</p>
    </div>

    <div class="info">
        <strong>🎯 Objectif du Test</strong><br>
        Ce guide vous permet de tester l'intégralité du parcours client dans l'application notariale, 
        depuis la création du client jusqu'à l'archivage de l'acte, en passant par toutes les étapes 
        intermédiaires du workflow.
    </div>

    <div class="warning">
        <strong>⏱️ Temps Estimé</strong><br>
        Environ 15-20 minutes pour un parcours complet
    </div>

    <div class="page-break"></div>

    <h1>📑 Table des Matières</h1>
    <ol>
        <li>Création du Client</li>
        <li>Création du Dossier</li>
        <li>Création de l'Acte</li>
        <li>Workflow de Validation</li>
        <li>Facturation et Paiements</li>
        <li>Enregistrement</li>
        <li>Archivage</li>
        <li>Vérifications Finales</li>
    </ol>

    <div class="page-break"></div>

    <h1>1️⃣ Création du Client</h1>
    
    <div class="step">
        <h3>Navigation</h3>
        <p>URL: <code>http://localhost:3000/dashboard/clients/new</code></p>
        <ol>
            <li>Cliquez sur <strong>"Clients"</strong> dans le menu latéral gauche</li>
            <li>Cliquez sur le bouton <strong>"Nouveau Client"</strong> en haut à droite</li>
        </ol>
    </div>

    <div class="step">
        <h3>Formulaire à Remplir</h3>
        <table>
            <tr>
                <th>Champ</th>
                <th>Valeur</th>
            </tr>
            <tr>
                <td>Type</td>
                <td>Particulier (INDIVIDUAL)</td>
            </tr>
            <tr>
                <td>Prénom</td>
                <td>Jean</td>
            </tr>
            <tr>
                <td>Nom</td>
                <td>Dupont</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>jean.dupont@example.com</td>
            </tr>
            <tr>
                <td>Téléphone</td>
                <td>+221 77 123 45 67</td>
            </tr>
            <tr>
                <td>Adresse</td>
                <td>15 Avenue Léopold Sédar Senghor</td>
            </tr>
            <tr>
                <td>Ville</td>
                <td>Dakar</td>
            </tr>
        </table>
        <p><strong>Action:</strong> Cliquez sur <strong>"Créer le client"</strong></p>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Client créé avec succès<br>
        • Redirection vers la liste des clients<br>
        • Jean Dupont visible dans la liste<br>
        • Message de confirmation affiché
    </div>

    <div class="page-break"></div>

    <h1>2️⃣ Création du Dossier</h1>

    <div class="step">
        <h3>Navigation</h3>
        <p>URL: <code>http://localhost:3000/dashboard/dossiers/new</code></p>
        <ol>
            <li>Cliquez sur <strong>"Dossiers"</strong> dans le menu latéral</li>
            <li>Cliquez sur <strong>"Nouveau Dossier"</strong></li>
        </ol>
    </div>

    <div class="step">
        <h3>Formulaire à Remplir</h3>
        <table>
            <tr>
                <th>Champ</th>
                <th>Valeur</th>
            </tr>
            <tr>
                <td>Titre</td>
                <td>Vente Appartement Plateau</td>
            </tr>
            <tr>
                <td>Type</td>
                <td>Vente immobilière</td>
            </tr>
            <tr>
                <td>Client</td>
                <td>Jean Dupont (sélectionner dans la liste)</td>
            </tr>
            <tr>
                <td>Notaire assigné</td>
                <td>(Sélectionner un notaire disponible)</td>
            </tr>
        </table>
        <p><strong>Action:</strong> Cliquez sur <strong>"Créer le dossier"</strong></p>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Dossier créé avec référence auto-générée (ex: DOS-2024-001)<br>
        • Statut: OUVERT<br>
        • Lien avec le client Jean Dupont établi<br>
        • Dossier visible dans la liste
    </div>

    <div class="page-break"></div>

    <h1>3️⃣ Création de l'Acte</h1>

    <div class="step">
        <h3>Navigation</h3>
        <p>URL: <code>http://localhost:3000/dashboard/dossiers/[id]/generate</code></p>
        <ol>
            <li>Depuis la liste des dossiers, cliquez sur le dossier créé</li>
            <li>Cliquez sur <strong>"Générer un acte"</strong></li>
        </ol>
    </div>

    <div class="step">
        <h3>Sélection du Type d'Acte</h3>
        <p>Sélectionnez: <strong>VENTE</strong> (Acte de vente immobilière)</p>
    </div>

    <div class="step">
        <h3>Informations du Vendeur</h3>
        <table>
            <tr>
                <th>Champ</th>
                <th>Valeur</th>
            </tr>
            <tr>
                <td>Prénom</td>
                <td>Marie</td>
            </tr>
            <tr>
                <td>Nom</td>
                <td>Martin</td>
            </tr>
            <tr>
                <td>Adresse</td>
                <td>10 Rue de la République</td>
            </tr>
            <tr>
                <td>Ville</td>
                <td>Dakar</td>
            </tr>
            <tr>
                <td>Code Postal</td>
                <td>10000</td>
            </tr>
        </table>
    </div>

    <div class="step">
        <h3>Informations de l'Acheteur</h3>
        <p><em>Les informations de Jean Dupont devraient être pré-remplies automatiquement</em></p>
    </div>

    <div class="step">
        <h3>Informations du Bien</h3>
        <table>
            <tr>
                <th>Champ</th>
                <th>Valeur</th>
            </tr>
            <tr>
                <td>Adresse</td>
                <td>25 Boulevard de la République</td>
            </tr>
            <tr>
                <td>Ville</td>
                <td>Dakar</td>
            </tr>
            <tr>
                <td>Code Postal</td>
                <td>10000</td>
            </tr>
            <tr>
                <td>Prix</td>
                <td>50 000 000 FCFA</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>Appartement 3 pièces, 85m², 2ème étage</td>
            </tr>
        </table>
        <p><strong>Action:</strong> Cliquez sur <strong>"Générer l'acte"</strong></p>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Acte créé avec statut: <strong>BROUILLON</strong><br>
        • Toutes les informations enregistrées<br>
        • Acte visible dans la liste des actes<br>
        • Lien avec le dossier établi
    </div>

    <div class="page-break"></div>

    <h1>4️⃣ Workflow de Validation</h1>

    <h2>4.1 Soumission pour Révision (BROUILLON → EN_REVISION)</h2>

    <div class="step">
        <h3>Navigation</h3>
        <p>URL: <code>http://localhost:3000/dashboard/actes</code></p>
        <ol>
            <li>Cliquez sur <strong>"Actes"</strong> dans le menu</li>
            <li>Cliquez sur l'acte créé pour ouvrir la vue détaillée</li>
            <li>Allez dans l'onglet <strong>"Actions"</strong></li>
        </ol>
    </div>

    <div class="step">
        <h3>Action Workflow</h3>
        <p><strong>Rôle requis:</strong> CLERC ou ADMIN</p>
        <ol>
            <li>Cliquez sur le bouton <strong>"Soumettre pour révision"</strong></li>
            <li>Ajoutez un commentaire: <em>"Acte prêt pour révision"</em></li>
            <li>Confirmez l'action</li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Statut passe à: <strong>EN_REVISION</strong><br>
        • Entrée ajoutée dans l'historique<br>
        • Commentaire enregistré<br>
        • Badge de statut mis à jour
    </div>

    <h2>4.2 Validation (EN_REVISION → VALIDE)</h2>

    <div class="info">
        <strong>ℹ️ Changement de Rôle</strong><br>
        Déconnectez-vous et reconnectez-vous en tant que <strong>NOTAIRE</strong>
    </div>

    <div class="step">
        <h3>Action Workflow</h3>
        <p><strong>Rôle requis:</strong> NOTAIRE ou ADMIN</p>
        <ol>
            <li>Ouvrez l'acte en révision</li>
            <li>Vérifiez le contenu de l'acte</li>
            <li>Cliquez sur <strong>"Valider"</strong></li>
            <li>Ajoutez un commentaire: <em>"Acte validé, prêt pour signature"</em></li>
            <li>Confirmez</li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Statut passe à: <strong>VALIDE</strong><br>
        • Historique mis à jour<br>
        • Acte prêt pour signature
    </div>

    <h2>4.3 Signature (VALIDE → SIGNE)</h2>

    <div class="step">
        <h3>Action Workflow</h3>
        <p><strong>Rôle requis:</strong> NOTAIRE ou ADMIN</p>
        <ol>
            <li>Ouvrez l'acte validé</li>
            <li>Cliquez sur <strong>"Signer"</strong></li>
            <li>Confirmez la signature</li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Statut passe à: <strong>SIGNE</strong><br>
        • Entrée blockchain créée (vérifiable dans l'onglet "Blockchain")<br>
        • Hash de signature généré<br>
        • Acte maintenant disponible pour facturation
    </div>

    <div class="page-break"></div>

    <h1>5️⃣ Facturation et Paiements</h1>

    <h2>5.1 Génération de la Facture</h2>

    <div class="step">
        <h3>Navigation</h3>
        <p>URL: <code>http://localhost:3000/dashboard/facturation/new</code></p>
        <ol>
            <li>Cliquez sur <strong>"Facturation"</strong> dans le menu</li>
            <li>Cliquez sur <strong>"Nouvelle Facture"</strong></li>
        </ol>
    </div>

    <div class="step">
        <h3>Sélection de l'Acte</h3>
        <ol>
            <li>Dans le dropdown, sélectionnez l'acte signé</li>
            <li>Vérifiez que seuls les actes SIGNES ou ENREGISTRES sont disponibles</li>
            <li>Cliquez sur <strong>"Créer la facture"</strong></li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        <strong>Facture générée automatiquement avec:</strong><br><br>
        <table>
            <tr>
                <th>Poste</th>
                <th>Montant</th>
            </tr>
            <tr>
                <td>Émoluments (HT)</td>
                <td>50 000 FCFA</td>
            </tr>
            <tr>
                <td>TVA 18%</td>
                <td>9 000 FCFA</td>
            </tr>
            <tr>
                <td>Débours</td>
                <td>10 000 FCFA</td>
            </tr>
            <tr>
                <td>Droits d'enregistrement</td>
                <td>30 000 FCFA</td>
            </tr>
            <tr>
                <th>TOTAL TTC</th>
                <th>99 000 FCFA</th>
            </tr>
        </table>
        <br>
        • Numéro de facture: FAC-2024-XXXX<br>
        • Statut: DRAFT<br>
        • Reste à payer: 99 000 FCFA
    </div>

    <h2>5.2 Paiement Partiel</h2>

    <div class="step">
        <h3>Navigation</h3>
        <p>Depuis la page de détail de la facture créée</p>
    </div>

    <div class="step">
        <h3>Enregistrement du Paiement</h3>
        <ol>
            <li>Cliquez sur <strong>"Enregistrer un paiement"</strong></li>
            <li>Remplissez le formulaire:
                <ul>
                    <li>Montant: <strong>50 000</strong> FCFA</li>
                    <li>Méthode: <strong>Virement</strong></li>
                    <li>Référence: <strong>VIR-2024-001</strong></li>
                </ul>
            </li>
            <li>Cliquez sur <strong>"Enregistrer"</strong></li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Paiement enregistré dans l'historique<br>
        • Statut facture: <strong>PARTIALLY_PAID</strong><br>
        • Payé: 50 000 FCFA<br>
        • Reste à payer: 49 000 FCFA<br>
        • Mise à jour automatique des montants
    </div>

    <h2>5.3 Solde de la Facture</h2>

    <div class="step">
        <h3>Paiement Final</h3>
        <ol>
            <li>Cliquez à nouveau sur <strong>"Enregistrer un paiement"</strong></li>
            <li>Remplissez:
                <ul>
                    <li>Montant: <strong>49 000</strong> FCFA</li>
                    <li>Méthode: <strong>Chèque</strong></li>
                    <li>Référence: <strong>CHQ-123456</strong></li>
                </ul>
            </li>
            <li>Cliquez sur <strong>"Enregistrer"</strong></li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Statut facture: <strong>PAID</strong> (Payée)<br>
        • Payé: 99 000 FCFA<br>
        • Reste à payer: 0 FCFA<br>
        • 2 paiements dans l'historique<br>
        • Badge vert "Payée"
    </div>

    <div class="page-break"></div>

    <h1>6️⃣ Enregistrement de l'Acte</h1>

    <div class="info">
        <strong>ℹ️ Changement de Rôle</strong><br>
        Reconnectez-vous en tant que <strong>CLERC</strong> ou <strong>COMPTABLE</strong>
    </div>

    <div class="step">
        <h3>Navigation</h3>
        <p>Retournez sur la page de détail de l'acte</p>
    </div>

    <div class="step">
        <h3>Action Workflow</h3>
        <p><strong>Rôle requis:</strong> CLERC ou COMPTABLE</p>
        <ol>
            <li>Dans l'onglet "Actions"</li>
            <li>Cliquez sur <strong>"Enregistrer"</strong></li>
            <li>Ajoutez un commentaire: <em>"Acte enregistré aux impôts"</em></li>
            <li>Confirmez</li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Statut passe à: <strong>ENREGISTRE</strong><br>
        • Historique mis à jour<br>
        • Commentaire enregistré
    </div>

    <div class="page-break"></div>

    <h1>7️⃣ Archivage de l'Acte</h1>

    <div class="info">
        <strong>ℹ️ Changement de Rôle</strong><br>
        Reconnectez-vous en tant que <strong>ADMIN</strong> ou <strong>NOTAIRE</strong>
    </div>

    <div class="step">
        <h3>Action Workflow</h3>
        <p><strong>Rôle requis:</strong> ADMIN ou NOTAIRE</p>
        <ol>
            <li>Ouvrez l'acte enregistré</li>
            <li>Cliquez sur <strong>"Archiver"</strong></li>
            <li>Confirmez l'archivage</li>
        </ol>
    </div>

    <div class="success">
        <strong>✅ Résultat Attendu</strong><br>
        • Statut passe à: <strong>ARCHIVE</strong><br>
        • Acte visible dans le module "Archives"<br>
        • Workflow complet terminé<br>
        • Historique complet préservé
    </div>

    <div class="page-break"></div>

    <h1>8️⃣ Vérifications Finales</h1>

    <h2>Dashboard Principal</h2>
    <div class="step">
        <p>URL: <code>http://localhost:3000/dashboard</code></p>
        <p>Vérifiez que les statistiques sont mises à jour:</p>
        <ul class="checklist">
            <li>Nombre de clients: +1</li>
            <li>Nombre de dossiers: +1</li>
            <li>Nombre d'actes: +1</li>
            <li>Revenus: +99 000 FCFA</li>
        </ul>
    </div>

    <h2>Module Facturation</h2>
    <div class="step">
        <p>URL: <code>http://localhost:3000/dashboard/facturation</code></p>
        <ul class="checklist">
            <li>Total Facturé: 99 000 FCFA</li>
            <li>Payé: 99 000 FCFA</li>
            <li>En Attente: 0 FCFA</li>
            <li>Facture visible dans le tableau</li>
        </ul>
    </div>

    <h2>Module Archives</h2>
    <div class="step">
        <p>URL: <code>http://localhost:3000/dashboard/archives</code></p>
        <ul class="checklist">
            <li>Acte archivé visible</li>
            <li>Statut: ARCHIVE</li>
            <li>Toutes les informations accessibles</li>
        </ul>
    </div>

    <div class="page-break"></div>

    <h1>📊 Checklist Complète</h1>

    <div class="step">
        <h3>Intégrité des Données</h3>
        <ul class="checklist">
            <li>Client créé avec toutes les informations</li>
            <li>Dossier lié au client</li>
            <li>Acte lié au dossier</li>
            <li>Facture liée à l'acte</li>
            <li>Paiements liés à la facture</li>
        </ul>
    </div>

    <div class="step">
        <h3>Workflow</h3>
        <ul class="checklist">
            <li>BROUILLON → EN_REVISION (Clerc)</li>
            <li>EN_REVISION → VALIDE (Notaire)</li>
            <li>VALIDE → SIGNE (Notaire)</li>
            <li>SIGNE → ENREGISTRE (Clerc/Comptable)</li>
            <li>ENREGISTRE → ARCHIVE (Admin/Notaire)</li>
            <li>Historique complet enregistré</li>
            <li>Commentaires sauvegardés</li>
        </ul>
    </div>

    <div class="step">
        <h3>Facturation</h3>
        <ul class="checklist">
            <li>Facture générée automatiquement</li>
            <li>Calculs corrects (Émoluments + TVA + Débours + Droits)</li>
            <li>Paiement partiel enregistré</li>
            <li>Statut PARTIALLY_PAID correct</li>
            <li>Solde enregistré</li>
            <li>Statut PAID correct</li>
            <li>Historique des paiements complet</li>
        </ul>
    </div>

    <div class="step">
        <h3>Sécurité & Traçabilité</h3>
        <ul class="checklist">
            <li>Permissions par rôle respectées</li>
            <li>Blockchain créée pour signature</li>
            <li>Historique complet (qui, quoi, quand)</li>
            <li>Validation des données à chaque étape</li>
        </ul>
    </div>

    <div class="page-break"></div>

    <h1>🎓 Comptes de Test</h1>

    <table>
        <tr>
            <th>Rôle</th>
            <th>Email</th>
            <th>Mot de passe</th>
            <th>Permissions</th>
        </tr>
        <tr>
            <td>Admin</td>
            <td>admin@notaire.sn</td>
            <td>admin123</td>
            <td>Toutes les actions</td>
        </tr>
        <tr>
            <td>Notaire</td>
            <td>notaire@notaire.sn</td>
            <td>notaire123</td>
            <td>Valider, Signer, Archiver</td>
        </tr>
        <tr>
            <td>Clerc</td>
            <td>clerc@notaire.sn</td>
            <td>clerc123</td>
            <td>Soumettre, Enregistrer</td>
        </tr>
        <tr>
            <td>Comptable</td>
            <td>comptable@notaire.sn</td>
            <td>comptable123</td>
            <td>Enregistrer, Facturation</td>
        </tr>
    </table>

    <div class="page-break"></div>

    <h1>🐛 Problèmes Potentiels</h1>

    <div class="warning">
        <h3>Erreur: Acte non disponible pour facturation</h3>
        <p><strong>Cause:</strong> L'acte n'est pas au statut SIGNE ou ENREGISTRE</p>
        <p><strong>Solution:</strong> Complétez le workflow jusqu'à la signature</p>
    </div>

    <div class="warning">
        <h3>Erreur: Action workflow non disponible</h3>
        <p><strong>Cause:</strong> Rôle utilisateur insuffisant</p>
        <p><strong>Solution:</strong> Connectez-vous avec le bon rôle (voir tableau ci-dessus)</p>
    </div>

    <div class="warning">
        <h3>Erreur: Statut facture non mis à jour</h3>
        <p><strong>Cause:</strong> Problème de calcul des montants</p>
        <p><strong>Solution:</strong> Vérifiez que le montant du paiement est correct</p>
    </div>

    <div class="page-break"></div>

    <h1>✅ Résultat Final Attendu</h1>

    <div class="success">
        <h3>À la fin du parcours complet, vous devriez avoir:</h3>
        <ol>
            <li>✅ Un client dans la base de données</li>
            <li>✅ Un dossier actif lié au client</li>
            <li>✅ Un acte archivé avec historique complet</li>
            <li>✅ Une facture entièrement payée</li>
            <li>✅ Deux paiements enregistrés</li>
            <li>✅ Une trace blockchain de la signature</li>
            <li>✅ Des statistiques mises à jour sur le dashboard</li>
            <li>✅ Un workflow complet documenté</li>
        </ol>
    </div>

    <div class="info">
        <h3>🚀 Prochaines Étapes</h3>
        <p>Si tous les tests passent avec succès, le système est prêt pour:</p>
        <ul>
            <li>Tests d'acceptation utilisateur (UAT)</li>
            <li>Formation des utilisateurs finaux</li>
            <li>Déploiement en environnement de production</li>
        </ul>
    </div>

    <div class="page-break"></div>

    <div style="text-align: center; margin-top: 50px; color: #6b7280;">
        <p><strong>Fin du Guide de Test</strong></p>
        <p>Application de Gestion Notariale - Version 1.0</p>
        <p>© 2024 - Tous droits réservés</p>
    </div>

</body>
</html>
`;

// Write HTML file
const outputPath = path.join(__dirname, 'Guide_Test_Parcours_Client.html');
fs.writeFileSync(outputPath, htmlContent, 'utf-8');

console.log('✅ Guide HTML créé avec succès!');
console.log(`📄 Fichier: ${outputPath}`);
console.log('\n📝 Pour convertir en PDF:');
console.log('   1. Ouvrez le fichier HTML dans un navigateur');
console.log('   2. Utilisez Ctrl+P (Imprimer)');
console.log('   3. Sélectionnez "Enregistrer au format PDF"');
console.log('   4. Sauvegardez le fichier');
