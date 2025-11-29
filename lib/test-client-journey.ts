import { db } from './db';
import { TimelineService } from './timeline-service';
import { NotificationService } from './notification-service';

/**
 * Test Script for Client Journey Features
 * Run this to populate the database with sample timeline events and notifications
 */

export async function testClientJourney() {
    console.log('🧪 Testing Client Journey Features...\n');

    const timelineService = TimelineService.getInstance();
    const notificationService = NotificationService.getInstance();

    // Get a sample dossier (or create one)
    let testDossier = db.dossiers[0];
    if (!testDossier) {
        console.log('⚠️  No dossier found. Please create a dossier first.');
        return;
    }

    const dossierId = testDossier.id;
    const dossierRef = testDossier.reference;
    const clientName = testDossier.clientName || 'Client Test';
    const clientEmail = 'client@example.com';

    console.log(`📁 Testing with Dossier: ${dossierRef} (ID: ${dossierId})\n`);

    // Test 1: Create Timeline Event - Dossier Created
    console.log('✅ Test 1: Creating "Dossier Created" event...');
    const event1 = timelineService.onDossierCreated(dossierId, dossierRef, 'test-user');
    console.log(`   Event created: ${event1.title}`);
    console.log(`   Date: ${new Date(event1.date).toLocaleString('fr-FR')}\n`);

    // Test 2: Send Notification - Dossier Created
    console.log('📧 Test 2: Sending "Dossier Created" notification...');
    const notif1 = await notificationService.sendNotification(
        'EMAIL',
        clientEmail,
        'DOSSIER_CREATED',
        {
            clientName,
            reference: dossierRef
        }
    );
    console.log(`   Notification status: ${notif1.status}`);
    console.log(`   Sent at: ${notif1.sentAt}\n`);

    // Test 3: Payment Received
    console.log('💰 Test 3: Recording payment and creating timeline event...');
    const event2 = timelineService.onPaymentReceived(dossierId, 500000, 'test-user');
    console.log(`   Event created: ${event2.title}`);

    const notif2 = await notificationService.sendNotification(
        'EMAIL',
        clientEmail,
        'PAYMENT_RECEIVED',
        {
            clientName,
            amount: '500,000',
            reference: dossierRef
        }
    );
    console.log(`   Notification sent: ${notif2.status}\n`);

    // Test 4: Appointment Scheduled
    console.log('📅 Test 4: Scheduling appointment...');
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 7);

    const event3 = timelineService.onAppointmentScheduled(
        dossierId,
        appointmentDate.toLocaleDateString('fr-FR'),
        'Signature de l\'acte de vente',
        'test-user'
    );
    console.log(`   Event created: ${event3.title}`);

    const notif3 = await notificationService.sendNotification(
        'SMS',
        '+221771234567',
        'APPOINTMENT_REMINDER',
        {
            clientName,
            date: appointmentDate.toLocaleDateString('fr-FR'),
            time: '10:00',
            purpose: 'Signature de l\'acte de vente'
        }
    );
    console.log(`   Notification sent: ${notif3.status}\n`);

    // Test 5: Acte Generated
    console.log('📄 Test 5: Generating acte...');
    const event4 = timelineService.onActeGenerated(dossierId, 'Acte de Vente', 'test-user');
    console.log(`   Event created: ${event4.title}`);

    const notif4 = await notificationService.sendNotification(
        'EMAIL',
        clientEmail,
        'SIGNATURE_READY',
        {
            clientName,
            acteType: 'Acte de Vente'
        }
    );
    console.log(`   Notification sent: ${notif4.status}\n`);

    // Test 6: Status Change
    console.log('🔄 Test 6: Changing dossier status...');
    const event5 = timelineService.onStatusChange(
        dossierId,
        'En cours',
        'Prêt pour signature',
        'test-user'
    );
    console.log(`   Event created: ${event5.title}`);

    const notif5 = await notificationService.sendNotification(
        'EMAIL',
        clientEmail,
        'STATUS_CHANGED',
        {
            clientName,
            reference: dossierRef,
            newStatus: 'Prêt pour signature',
            message: 'Tous les documents sont prêts. Vous pouvez prendre rendez-vous pour la signature.'
        }
    );
    console.log(`   Notification sent: ${notif5.status}\n`);

    // Test 7: Signature
    console.log('✍️  Test 7: Recording signature...');
    const event6 = timelineService.onSignature(dossierId, 'Acte de Vente', 'test-user');
    console.log(`   Event created: ${event6.title}\n`);

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`   Timeline Events Created: ${timelineService.getEventsByDossier(dossierId).length}`);
    console.log(`   Notifications Sent: ${notificationService.getNotifications().length}`);
    console.log('\n✅ All tests completed successfully!');
    console.log(`\n📍 View timeline at: /dashboard/dossiers/${dossierId}/timeline`);

    return {
        dossierId,
        eventsCount: timelineService.getEventsByDossier(dossierId).length,
        notificationsCount: notificationService.getNotifications().length
    };
}

// Auto-run if executed directly
if (require.main === module) {
    testClientJourney().catch(console.error);
}
