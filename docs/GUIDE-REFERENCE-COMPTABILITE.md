# Guide de Référence Rapide - Comptabilité Clients & Facturation

## Services Disponibles

### ClientAccountService

**Import**:
```typescript
import { ClientAccountService } from '@/lib/accounting/client-account-service';
```

**Méthodes**:

#### `createClientAccount(clientId: string, clientName: string): Account`
Crée un compte client 411.XXXX

```typescript
const account = ClientAccountService.createClientAccount(
  'client-123',
  'Jean Dupont'
);
// → Retourne: { code: '411.0001', label: 'Client - Jean Dupont', ... }
```

#### `getClientAccount(clientId: string): Account | undefined`
Récupère le compte d'un client

```typescript
const account = ClientAccountService.getClientAccount('client-123');
```

#### `getClientBalance(clientId: string): number`
Calcule le solde du compte client

```typescript
const balance = ClientAccountService.getClientBalance('client-123');
// → Retourne le solde (positif = créance)
```

#### `getAllClientAccounts(): Account[]`
Liste tous les comptes clients

```typescript
const accounts = ClientAccountService.getAllClientAccounts();
```

---

### BillingIntegrationService

**Import**:
```typescript
import { BillingIntegrationService } from '@/lib/accounting/billing-integration';
```

**Méthodes**:

#### `generateInvoiceEntries(invoice: Invoice)`
Génère les écritures comptables pour une facture

```typescript
const { entry, entries } = BillingIntegrationService.generateInvoiceEntries(invoice);
```

#### `generatePaymentEntries(payment: Payment)`
Génère les écritures comptables pour un paiement

```typescript
const { entry, entries } = BillingIntegrationService.generatePaymentEntries(payment);
```

#### `recordInvoiceWithAccounting(invoice: Invoice)`
Enregistre une facture ET génère les écritures

```typescript
const { invoice: savedInvoice, journalEntry } = 
  await BillingIntegrationService.recordInvoiceWithAccounting(invoice);
```

#### `recordPaymentWithAccounting(payment: Payment)`
Enregistre un paiement ET génère les écritures

```typescript
const { payment: savedPayment, journalEntry } = 
  await BillingIntegrationService.recordPaymentWithAccounting(payment);
```

#### `getClientStatement(clientId: string)`
Récupère le relevé de compte d'un client

```typescript
const { invoices, payments, balance } = 
  BillingIntegrationService.getClientStatement('client-123');
```

---

## Exemples d'Utilisation

### Scénario 1: Créer un Client

```typescript
// Dans app/dashboard/actions.ts
export async function createClient(formData: FormData) {
  // 1. Créer le client
  const client = db.addClient({
    id: `client-${uuidv4()}`,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    // ...
  });

  // 2. Créer automatiquement le compte 411.XXXX
  const { ClientAccountService } = await import('@/lib/accounting/client-account-service');
  ClientAccountService.createClientAccount(
    client.id,
    `${client.firstName} ${client.lastName}`
  );
}
```

### Scénario 2: Facturer un Acte

```typescript
import { BillingService } from '@/lib/billing/service';
import { BillingIntegrationService } from '@/lib/accounting/billing-integration';

// 1. Générer la facture depuis l'acte
const invoice = BillingService.generateInvoiceFromActe(acte);

// 2. Enregistrer la facture + écritures comptables
const { invoice: savedInvoice, journalEntry } = 
  await BillingIntegrationService.recordInvoiceWithAccounting(invoice);

console.log('Facture créée:', savedInvoice.number);
console.log('Écriture créée:', journalEntry.reference);
```

### Scénario 3: Enregistrer un Paiement

```typescript
import { BillingIntegrationService } from '@/lib/accounting/billing-integration';

const payment = {
  id: uuidv4(),
  invoiceId: 'invoice-123',
  dossierId: 'dossier-456',
  amount: 50000,
  method: 'TRANSFER',
  reference: 'VIR-2024-001',
  date: new Date().toISOString(),
  createdBy: 'user-1',
  createdAt: new Date().toISOString(),
};

const { payment: savedPayment, journalEntry } = 
  await BillingIntegrationService.recordPaymentWithAccounting(payment);

// La facture est automatiquement mise à jour (paidAmount, remainingAmount, status)
```

### Scénario 4: Consulter la Situation d'un Client

```typescript
import { ClientAccountService } from '@/lib/accounting/client-account-service';
import { BillingIntegrationService } from '@/lib/accounting/billing-integration';

const clientId = 'client-123';

// Solde comptable
const balance = ClientAccountService.getClientBalance(clientId);

// Détail factures/paiements
const { invoices, payments, balance: calculatedBalance } = 
  BillingIntegrationService.getClientStatement(clientId);

console.log('Solde:', balance);
console.log('Factures:', invoices.length);
console.log('Paiements:', payments.length);
```

### Scénario 5: Afficher la Fiche Financière d'un Dossier

```typescript
// Dans un composant React
const DossierFinancialSheet = ({ dossierId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/dossiers/${dossierId}/financial-sheet`)
      .then(res => res.json())
      .then(setData);
  }, [dossierId]);

  const totalInvoiced = data?.invoices.reduce((sum, inv) => sum + inv.totalTTC, 0);
  const totalPaid = data?.payments.reduce((sum, pay) => sum + pay.amount, 0);
  const balance = totalInvoiced - totalPaid;

  return (
    <div>
      <h2>Fiche Financière</h2>
      <p>Facturé: {totalInvoiced} FCFA</p>
      <p>Payé: {totalPaid} FCFA</p>
      <p>Solde: {balance} FCFA</p>
    </div>
  );
};
```

---

## Structure des Données

### Account (Compte Client)

```typescript
{
  id: string;
  code: string;              // Ex: "411.0001"
  label: string;             // Ex: "Client - Jean Dupont"
  type: 'TIERS';
  class: '4';
  parentCode: '411';
  isActive: boolean;
  metadata: {
    clientId: string;        // Lien vers le client
    autoCreated: boolean;
    createdAt: string;
  }
}
```

### JournalEntry (Écriture Comptable)

```typescript
{
  id: string;
  journalId: string;         // 'VE', 'BQ', 'CA', etc.
  date: string;
  reference: string;         // Ex: "FAC-2024-001"
  label: string;
  dossierId?: string;
  entries: AccountEntry[];   // Lignes débit/crédit
  validated: boolean;
  createdAt: string;
  createdBy: string;
  metadata?: {
    invoiceId?: string;
    paymentId?: string;
    type?: 'INVOICE' | 'PAYMENT';
  }
}
```

### AccountEntry (Ligne d'Écriture)

```typescript
{
  id: string;
  journalEntryId: string;
  accountCode: string;       // Ex: "411.0001"
  accountLabel: string;
  debit: number;
  credit: number;
  label: string;
}
```

---

## Codes de Comptes Utilisés

| Code | Libellé | Type | Usage |
|------|---------|------|-------|
| 411.XXXX | Client - [Nom] | Tiers | Créances clients |
| 7061 | Honoraires d'actes | Produit | Émoluments HT |
| 7062 | Débours refacturés | Produit | Débours |
| 7063 | Droits refacturés | Produit | Droits d'enregistrement |
| 443 | État - TVA facturée | Passif | TVA collectée |
| 521 | Banques locales | Actif | Encaissements par virement/carte |
| 57 | Caisse | Actif | Encaissements en espèces |

---

## Règles de Gestion

### Création de Compte Client
- Un compte est créé automatiquement à la création du client
- Format: `411.XXXX` (numérotation séquentielle)
- Le compte ne peut pas être supprimé (seulement désactivé)
- Le libellé est mis à jour si le nom du client change

### Facturation
- Une facture génère automatiquement une écriture au journal des ventes (VE)
- L'écriture est liée à la facture via `metadata.invoiceId`
- Le compte client (411.XXXX) est débité du montant TTC
- Les comptes de produits sont crédités selon la répartition

### Paiement
- Un paiement génère automatiquement une écriture au journal de banque (BQ) ou caisse (CA)
- L'écriture est liée au paiement via `metadata.paymentId`
- Le compte de trésorerie est débité
- Le compte client (411.XXXX) est crédité
- Le statut de la facture est mis à jour automatiquement

### Solde Client
- Solde = Somme des débits - Somme des crédits du compte 411.XXXX
- Solde positif = Créance (client doit de l'argent)
- Solde négatif = Avoir (cabinet doit de l'argent au client)
- Solde nul = Situation soldée

---

## API Endpoints

### GET `/api/dossiers/[id]/financial-sheet`

Récupère la fiche financière d'un dossier

**Réponse**:
```json
{
  "invoices": [...],
  "payments": [...],
  "journalEntries": [...]
}
```

---

## Tests Recommandés

### Test 1: Création de Client
```typescript
// Créer un client
const client = await createClient(formData);

// Vérifier que le compte existe
const account = ClientAccountService.getClientAccount(client.id);
expect(account).toBeDefined();
expect(account.code).toMatch(/^411\.\d{4}$/);
```

### Test 2: Facturation
```typescript
// Créer une facture
const { invoice, journalEntry } = 
  await BillingIntegrationService.recordInvoiceWithAccounting(invoice);

// Vérifier l'écriture
expect(journalEntry.entries.length).toBeGreaterThan(0);
const totalDebit = journalEntry.entries.reduce((s, e) => s + e.debit, 0);
const totalCredit = journalEntry.entries.reduce((s, e) => s + e.credit, 0);
expect(totalDebit).toBe(totalCredit); // Partie double
```

### Test 3: Paiement
```typescript
// Enregistrer un paiement
const { payment, journalEntry } = 
  await BillingIntegrationService.recordPaymentWithAccounting(payment);

// Vérifier la mise à jour de la facture
const updatedInvoice = db.getInvoice(payment.invoiceId);
expect(updatedInvoice.paidAmount).toBe(payment.amount);
```

---

## Dépannage

### Problème: Le compte client n'est pas créé

**Solution**:
```typescript
// Vérifier que le service est bien importé
import { ClientAccountService } from '@/lib/accounting/client-account-service';

// Créer manuellement si nécessaire
ClientAccountService.createClientAccount(clientId, clientName);
```

### Problème: Les écritures ne sont pas équilibrées

**Solution**:
```typescript
import { AccountingRules } from '@/lib/accounting/accounting-rules';

const { balanced, difference } = AccountingRules.validateBalance(entries);
if (!balanced) {
  console.error('Écritures déséquilibrées:', difference);
}
```

### Problème: La facture n'est pas mise à jour après paiement

**Solution**:
Utiliser `BillingIntegrationService.recordPaymentWithAccounting()` au lieu de créer le paiement manuellement. Cette méthode met à jour automatiquement la facture.

---

## Ressources

- **Documentation OHADA**: https://www.ohada.org/
- **SYSCOHADA**: Plan comptable de référence
- **Code source**: `lib/accounting/`
- **Tests**: `__tests__/accounting/`
