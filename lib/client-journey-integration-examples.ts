// Example: How to integrate Timeline and Notifications in your existing code

import { TimelineService } from '@/lib/timeline-service';
import { NotificationService } from '@/lib/notification-service';

// Example 1: When creating a new dossier
export async function createDossierWithTimeline(dossierData: any, userId: string) {
    // 1. Create the dossier (existing code)
    const dossier = await createDossier(dossierData);

    // 2. Add timeline event
    const timelineService = TimelineService.getInstance();
    timelineService.onDossierCreated(dossier.id, dossier.reference, userId);

    // 3. Send notification to client
    const notificationService = NotificationService.getInstance();
    await notificationService.sendNotification(
        'EMAIL',
        dossier.clientEmail,
        'DOSSIER_CREATED',
        {
            clientName: dossier.clientName,
            reference: dossier.reference
        }
    );

    return dossier;
}

// Example 2: When receiving a payment
export async function recordPaymentWithTimeline(paymentData: any, userId: string) {
    // 1. Record payment (existing code)
    const payment = await recordPayment(paymentData);

    // 2. Add timeline event
    const timelineService = TimelineService.getInstance();
    timelineService.onPaymentReceived(
        payment.dossierId,
        payment.amount,
        userId
    );

    // 3. Send notification
    const notificationService = NotificationService.getInstance();
    await notificationService.sendNotification(
        'EMAIL',
        payment.clientEmail,
        'PAYMENT_RECEIVED',
        {
            clientName: payment.clientName,
            amount: payment.amount,
            reference: payment.dossierReference
        }
    );

    return payment;
}

// Example 3: When scheduling an appointment
export async function scheduleAppointmentWithTimeline(appointmentData: any, userId: string) {
    // 1. Create appointment (existing code)
    const appointment = await createAppointment(appointmentData);

    // 2. Add timeline event
    const timelineService = TimelineService.getInstance();
    timelineService.onAppointmentScheduled(
        appointment.dossierId,
        appointment.date,
        appointment.purpose,
        userId
    );

    // 3. Send reminder notification
    const notificationService = NotificationService.getInstance();
    await notificationService.sendNotification(
        'SMS',
        appointment.clientPhone,
        'APPOINTMENT_REMINDER',
        {
            clientName: appointment.clientName,
            date: appointment.date,
            time: appointment.time,
            purpose: appointment.purpose
        }
    );

    return appointment;
}

// Example 4: When changing dossier status
export async function updateDossierStatusWithTimeline(
    dossierId: string,
    oldStatus: string,
    newStatus: string,
    userId: string
) {
    // 1. Update status (existing code)
    await updateDossierStatus(dossierId, newStatus);

    // 2. Add timeline event
    const timelineService = TimelineService.getInstance();
    timelineService.onStatusChange(dossierId, oldStatus, newStatus, userId);

    // 3. Optionally notify client
    const notificationService = NotificationService.getInstance();
    await notificationService.sendNotification(
        'EMAIL',
        clientEmail,
        'STATUS_CHANGED',
        {
            clientName,
            reference: dossierReference,
            newStatus,
            message: `Votre dossier est maintenant ${newStatus}`
        }
    );
}
