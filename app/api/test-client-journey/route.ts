import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { TimelineService } from '@/lib/timeline-service';
import { NotificationService } from '@/lib/notification-service';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const timelineService = TimelineService.getInstance();
        const notificationService = NotificationService.getInstance();

        // Get first dossier for testing
        const testDossier = db.dossiers[0];
        if (!testDossier) {
            return NextResponse.json({
                error: 'No dossier found. Please create a dossier first.'
            }, { status: 400 });
        }

        const dossierId = testDossier.id;
        const dossierRef = testDossier.reference;
        const clientName = 'Client Test';
        const clientEmail = 'client@example.com';

        const results = [];

        // Test 1: Dossier Created
        const event1 = timelineService.onDossierCreated(dossierId, dossierRef, session.user.id);
        const notif1 = await notificationService.sendNotification(
            'EMAIL',
            clientEmail,
            'DOSSIER_CREATED',
            { clientName, reference: dossierRef }
        );
        results.push({ test: 'Dossier Created', event: event1.id, notification: notif1.id });

        // Test 2: Payment Received
        const event2 = timelineService.onPaymentReceived(dossierId, 500000, session.user.id);
        const notif2 = await notificationService.sendNotification(
            'EMAIL',
            clientEmail,
            'PAYMENT_RECEIVED',
            { clientName, amount: '500,000', reference: dossierRef }
        );
        results.push({ test: 'Payment Received', event: event2.id, notification: notif2.id });

        // Test 3: Appointment Scheduled
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + 7);

        const event3 = timelineService.onAppointmentScheduled(
            dossierId,
            appointmentDate.toLocaleDateString('fr-FR'),
            'Signature de l\'acte',
            session.user.id
        );
        const notif3 = await notificationService.sendNotification(
            'SMS',
            '+221771234567',
            'APPOINTMENT_REMINDER',
            {
                clientName,
                date: appointmentDate.toLocaleDateString('fr-FR'),
                time: '10:00',
                purpose: 'Signature de l\'acte'
            }
        );
        results.push({ test: 'Appointment Scheduled', event: event3.id, notification: notif3.id });

        // Test 4: Acte Generated
        const event4 = timelineService.onActeGenerated(dossierId, 'Acte de Vente', session.user.id);
        const notif4 = await notificationService.sendNotification(
            'EMAIL',
            clientEmail,
            'SIGNATURE_READY',
            { clientName, acteType: 'Acte de Vente' }
        );
        results.push({ test: 'Acte Generated', event: event4.id, notification: notif4.id });

        // Test 5: Status Change
        const event5 = timelineService.onStatusChange(
            dossierId,
            'En cours',
            'Prêt pour signature',
            session.user.id
        );
        const notif5 = await notificationService.sendNotification(
            'EMAIL',
            clientEmail,
            'STATUS_CHANGED',
            {
                clientName,
                reference: dossierRef,
                newStatus: 'Prêt pour signature',
                message: 'Tous les documents sont prêts.'
            }
        );
        results.push({ test: 'Status Changed', event: event5.id, notification: notif5.id });

        // Test 6: Signature
        const event6 = timelineService.onSignature(dossierId, 'Acte de Vente', session.user.id);
        results.push({ test: 'Signature', event: event6.id, notification: null });

        const summary = {
            dossierId,
            dossierRef,
            testsRun: results.length,
            eventsCreated: timelineService.getEventsByDossier(dossierId).length,
            notificationsSent: notificationService.getNotifications().length,
            timelineUrl: `/dashboard/dossiers/${dossierId}/timeline`,
            results
        };

        return NextResponse.json(summary);
    } catch (error: any) {
        console.error('Test failed:', error);
        return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
    }
}
