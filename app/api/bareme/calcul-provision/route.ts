import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
    calculerSARLNumeraire,
    calculerSARLAugmentation,
    calculerSARLAugmentationNature,
    calculerSARLNature,
    calculerSCINumeraire,
    calculerSCIAugmentation,
    calculerSCIAugmentationNature,
    calculerSCINature,
    calculerSAAugmentation,
    calculerSAConseilAdmin,
    calculerSAAdminGeneral,
    calculerSANature,
    calculerCreditHypothecaire,
    calculerCessionCreances,
    calculerMainlevee,
    calculerDissolution,
    calculerReductionCapital,
    calculerTransformation,
    calculerCessionPartsSCI,
    calculerDationPaiement,
    calculerDationPaiement10,
    calculerVente1,
    calculerVenteAdjudication,
    calculerLocationGerance,
    calculerBailCommercial,
    calculerBailHabitation,
    calculerPartageCommunaute,
    calculerPartageIndivis,
    calculerTaxePlusValue,
    TypeSociete
} from '@/lib/bareme';

/**
 * API Route pour calculer une provision - 29 TYPES D'ACTES
 * POST /api/bareme/calcul-provision
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { type } = body;

        const validTypes: TypeSociete[] = [
            'SARL_NUMERAIRE', 'SARL_AUGMENTATION', 'SARL_AUGMENTATION_NATURE', 'SARL_NATURE',
            'SCI_NUMERAIRE', 'SCI_AUGMENTATION', 'SCI_AUGMENTATION_NATURE', 'SCI_NATURE',
            'SA_AUGMENTATION', 'SA_CA_NUMERAIRE', 'SA_AG_NUMERAIRE', 'SA_NATURE',
            'CREDIT_HYPOTHECAIRE', 'CESSION_CREANCES', 'MAINLEVEE', 'DISSOLUTION',
            'REDUCTION_CAPITAL', 'TRANSFORMATION', 'CESSION_PARTS_SCI',
            'DATION_PAIEMENT', 'DATION_PAIEMENT_10',
            'VENTE_1', 'VENTE_ADJUDICATION',
            'LOCATION_GERANCE', 'BAIL_COMMERCIAL', 'BAIL_HABITATION',
            'PARTAGE_COMMUNAUTE', 'PARTAGE_INDIVIS',
            'TAXE_PLUS_VALUE'
        ];

        if (!type || !validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Type d\'acte requis' },
                { status: 400 }
            );
        }

        let result;

        switch (type) {
            // --- SOCIÉTÉS ---
            case 'SARL_NUMERAIRE':
                result = calculerSARLNumeraire(body.capital);
                break;
            case 'SARL_AUGMENTATION':
                result = calculerSARLAugmentation(body.ancienCapital, body.nouveauCapital);
                break;
            case 'SARL_AUGMENTATION_NATURE':
                result = calculerSARLAugmentationNature(body.ancienCapital, body.nouveauCapital, body.augmentationNumeraire, body.augmentationNature);
                break;
            case 'SARL_NATURE':
                result = calculerSARLNature(body.capitalTotal, body.capitalNature, body.capitalNumeraire);
                break;
            case 'SCI_NUMERAIRE':
                result = calculerSCINumeraire(body.capital);
                break;
            case 'SCI_AUGMENTATION':
                result = calculerSCIAugmentation(body.ancienCapital, body.nouveauCapital);
                break;
            case 'SCI_AUGMENTATION_NATURE':
                result = calculerSCIAugmentationNature(body.ancienCapital, body.nouveauCapital, body.augmentationNumeraire, body.augmentationNature);
                break;
            case 'SCI_NATURE':
                result = calculerSCINature(body.capitalTotal, body.capitalNature, body.capitalNumeraire);
                break;
            case 'SA_AUGMENTATION':
                result = calculerSAAugmentation(body.ancienCapital, body.nouveauCapital);
                break;
            case 'SA_CA_NUMERAIRE':
                result = calculerSAConseilAdmin(body.capital);
                break;
            case 'SA_AG_NUMERAIRE':
                result = calculerSAAdminGeneral(body.capital);
                break;
            case 'SA_NATURE':
                result = calculerSANature(body.capitalTotal, body.capitalNature, body.capitalNumeraire);
                break;

            // --- AUTRES ACTES ---
            case 'CREDIT_HYPOTHECAIRE':
                result = calculerCreditHypothecaire(body.montant);
                break;
            case 'CESSION_CREANCES':
                result = calculerCessionCreances(body.montant);
                break;
            case 'MAINLEVEE':
                result = calculerMainlevee(body.montant);
                break;
            case 'DISSOLUTION':
                result = calculerDissolution(body.capital);
                break;
            case 'REDUCTION_CAPITAL':
                result = calculerReductionCapital(body.montantReduction);
                break;
            case 'TRANSFORMATION':
                result = calculerTransformation(body.capital);
                break;
            case 'CESSION_PARTS_SCI':
                result = calculerCessionPartsSCI(body.prixCession);
                break;
            case 'DATION_PAIEMENT':
                result = calculerDationPaiement(body.valeurBien);
                break;
            case 'DATION_PAIEMENT_10':
                result = calculerDationPaiement10(body.valeurBien);
                break;
            case 'VENTE_1':
                result = calculerVente1(body.prixVente);
                break;
            case 'VENTE_ADJUDICATION':
                result = calculerVenteAdjudication(body.prixAdjudication);
                break;
            case 'LOCATION_GERANCE':
                result = calculerLocationGerance(body.loyerMensuel, body.dureeMois);
                break;
            case 'BAIL_COMMERCIAL':
                result = calculerBailCommercial(body.loyerMensuel, body.dureeMois);
                break;
            case 'BAIL_HABITATION':
                result = calculerBailHabitation(body.loyerMensuel, body.dureeMois);
                break;
            case 'PARTAGE_COMMUNAUTE':
                result = calculerPartageCommunaute(body.prix, body.nombreTitres);
                break;
            case 'PARTAGE_INDIVIS':
                result = calculerPartageIndivis(body.montant, body.soulte);
                break;
            case 'TAXE_PLUS_VALUE':
                result = calculerTaxePlusValue(body.prixAcquisition, body.anneeAcquisition, body.prixVente, body.depensesTravaux);
                break;

            default:
                return NextResponse.json(
                    { error: 'Type non supporté' },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Erreur calcul provision:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors du calcul' },
            { status: 500 }
        );
    }
}
