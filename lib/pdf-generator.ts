import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateActePDF = (title: string, content: string, parties: { name: string; role: string }[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("ÉTUDE NOTARIALE", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Maître Dupont - Notaire à Paris", 105, 30, { align: "center" });

    doc.line(20, 35, 190, 35);

    // Title
    doc.setFontSize(16);
    doc.text(title, 105, 50, { align: "center" });

    // Parties
    doc.setFontSize(12);
    doc.text("ENTRE LES SOUSSIGNÉS :", 20, 70);

    const partiesData = parties.map(p => [p.name, p.role]);

    autoTable(doc, {
        startY: 75,
        head: [['Nom', 'Qualité']],
        body: partiesData,
        theme: 'plain',
        styles: { fontSize: 11 },
    });

    // Content
    const finalY = (doc as any).lastAutoTable.finalY || 75;
    doc.text("IL A ÉTÉ CONVENU CE QUI SUIT :", 20, finalY + 20);

    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, finalY + 30);

    // Signatures
    doc.text("Fait à Paris, le " + new Date().toLocaleDateString(), 20, finalY + 100);

    doc.text("Le Notaire", 150, finalY + 120);
    doc.text("Les Parties", 20, finalY + 120);

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};

export const generateCompromisPDF = (
    dossier: { ref: string; title: string },
    client: { firstName: string; lastName: string; address: string; city: string; zipCode: string },
    seller: { firstName: string; lastName: string; address: string; city: string; zipCode: string },
    property: { address: string; city: string; zipCode: string; price: number; description: string }
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper for centering text
    const centerText = (text: string, y: number, size: number = 12, font: string = "helvetica", style: string = "normal") => {
        doc.setFont(font, style);
        doc.setFontSize(size);
        doc.text(text, pageWidth / 2, y, { align: "center" });
    };

    // --- EN-TÊTE ---
    centerText("ÉTUDE NOTARIALE", 20, 18, "times", "bold");
    centerText("Maître Dupont - Notaire à Paris", 28, 12, "times", "normal");
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    // --- TITRE ---
    centerText("COMPROMIS DE VENTE", 50, 22, "helvetica", "bold");
    centerText(`Dossier Réf: ${dossier.ref}`, 60, 12, "helvetica", "italic");

    let y = 80;

    // --- PARTIES ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ENTRE LES SOUSSIGNÉS :", margin, y);
    y += 10;

    // Vendeur
    doc.setFontSize(12);
    doc.text("LE VENDEUR :", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`M./Mme ${seller.firstName} ${seller.lastName}`, margin + 10, y);
    y += 6;
    doc.text(`Demeurant à : ${seller.address}, ${seller.zipCode} ${seller.city}`, margin + 10, y);
    y += 15;

    // Acquéreur
    doc.setFont("helvetica", "bold");
    doc.text("L'ACQUÉREUR :", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`M./Mme ${client.firstName} ${client.lastName}`, margin + 10, y);
    y += 6;
    doc.text(`Demeurant à : ${client.address}, ${client.zipCode} ${client.city}`, margin + 10, y);
    y += 20;

    // --- OBJET ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OBJET DU CONTRAT :", margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const introText = "Le Vendeur vend à l'Acquéreur, qui accepte, le bien immobilier désigné ci-après :";
    doc.text(doc.splitTextToSize(introText, contentWidth), margin, y);
    y += 15;

    // --- DÉSIGNATION DU BIEN ---
    doc.setFont("helvetica", "bold");
    doc.text("DÉSIGNATION :", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Adresse du bien : ${property.address}, ${property.zipCode} ${property.city}`, margin + 10, y);
    y += 10;
    doc.text("Description :", margin + 10, y);
    y += 7;
    const descLines = doc.splitTextToSize(property.description, contentWidth - 10);
    doc.text(descLines, margin + 10, y);
    y += (descLines.length * 7) + 10;

    // --- PRIX ---
    doc.setFont("helvetica", "bold");
    doc.text("PRIX :", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`La présente vente est consentie et acceptée moyennant le prix principal de :`, margin, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(`${property.price.toLocaleString('fr-FR')} Euros`, margin + 10, y);
    y += 20;

    // --- SIGNATURES ---
    const pageHeight = doc.internal.pageSize.height;
    y = Math.min(y + 20, pageHeight - 60); // Ensure signatures are at bottom or after text

    doc.setFont("helvetica", "normal");
    doc.text(`Fait à Paris, le ${new Date().toLocaleDateString('fr-FR')}`, margin, y);
    y += 15;

    doc.text("L'Acquéreur", margin, y);
    doc.text("Le Vendeur", pageWidth / 2, y);
    doc.text("Le Notaire", pageWidth - margin - 30, y);

    doc.save(`Compromis_${dossier.ref}.pdf`);
};
