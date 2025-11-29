export type DossierStatus = 'OUVERTURE' | 'PIECES' | 'REDACTION' | 'SIGNATURE' | 'FORMALITES' | 'CLOTURE';

export interface KanbanColumn {
    id: DossierStatus;
    title: string;
    color: string;
}

export interface KanbanCard {
    id: string;
    title: string;
    client: string;
    type: string;
    status: DossierStatus;
    date: string;
    amount?: number;
    priority: 'HAUTE' | 'MOYENNE' | 'BASSE';
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
    { id: 'OUVERTURE', title: 'Ouverture', color: 'bg-gray-100' },
    { id: 'PIECES', title: 'Attente Pièces', color: 'bg-blue-50' },
    { id: 'REDACTION', title: 'Rédaction', color: 'bg-yellow-50' },
    { id: 'SIGNATURE', title: 'Signature', color: 'bg-purple-50' },
    { id: 'FORMALITES', title: 'Formalités', color: 'bg-orange-50' },
    { id: 'CLOTURE', title: 'Clôturé', color: 'bg-green-50' },
];

export const MOCK_KANBAN_CARDS: KanbanCard[] = [
    {
        id: 'dossier_1',
        title: 'Vente Villa Saly',
        client: 'M. Diop',
        type: 'Vente Immobilière',
        status: 'OUVERTURE',
        date: '2024-03-15',
        amount: 150000000,
        priority: 'MOYENNE'
    },
    {
        id: 'dossier_2',
        title: 'Succession Famille Ndiaye',
        client: 'Mme Ndiaye',
        type: 'Succession',
        status: 'PIECES',
        date: '2024-02-20',
        priority: 'HAUTE'
    },
    {
        id: 'dossier_3',
        title: 'Constitution SARL Tech',
        client: 'StartUp SA',
        type: 'Droit des Sociétés',
        status: 'REDACTION',
        date: '2024-03-10',
        amount: 1000000,
        priority: 'HAUTE'
    },
    {
        id: 'dossier_4',
        title: 'Prêt Bancaire BICIS',
        client: 'SCI Les Palmiers',
        type: 'Prêt Hypothécaire',
        status: 'SIGNATURE',
        date: '2024-03-01',
        amount: 500000000,
        priority: 'BASSE'
    },
    {
        id: 'dossier_5',
        title: 'Donation Partage',
        client: 'Famille Sow',
        type: 'Donation',
        status: 'FORMALITES',
        date: '2024-01-15',
        priority: 'MOYENNE'
    }
];
