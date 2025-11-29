import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export class DocumentGenerator {
    /**
     * Generates a DOCX document from a template and data.
     * @param templateBase64 The base64 encoded string of the .docx template
     * @param data The data object to inject into the template
     * @returns A Buffer containing the generated document
     */
    static generate(templateBase64: string, data: any): Buffer {
        try {
            // Decode base64 to binary
            const content = Buffer.from(templateBase64, 'base64');

            // Load the zip
            const zip = new PizZip(content);

            // Create the docxtemplater instance
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Render the document
            doc.render(data);

            // Get the zip document and generate it as a nodebuffer
            const buf = doc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            return buf;
        } catch (error) {
            console.error('Error generating document:', error);
            throw new Error('Failed to generate document');
        }
    }

    /**
     * Helper to extract variables from a template (simple regex approach)
     * This is a basic implementation and might not catch all complex tags.
     */
    static extractVariables(templateBase64: string): string[] {
        try {
            // This is tricky with binary docx. 
            // Docxtemplater doesn't easily expose a "list variables" method without inspecting the compiled object.
            // For now, we might rely on the user defining them, or just return empty.
            // A robust way involves inspecting the `doc` object after loading.

            const content = Buffer.from(templateBase64, 'base64');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);

            // Inspecting the text content of the xml files in the zip could work, 
            // but docxtemplater has an internal 'inspector' module in newer versions or we can parse the text.
            // For simplicity in this MVP, we will return an empty array or implement a basic text scan if needed later.
            return [];
        } catch (e) {
            return [];
        }
    }
}
