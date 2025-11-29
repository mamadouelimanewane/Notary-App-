# 💬 Guide du Module WhatsApp Business (CRM)

Ce module permet d'envoyer des notifications et des messages aux clients directement sur WhatsApp, le canal de communication privilégié en zone OHADA.

## Fonctionnalités

### 1. Envoi de Messages
*   **Interface Simple** : Saisie du numéro et du message.
*   **Templates (Modèles)** : Messages pré-rédigés pour gagner du temps :
    *   *Convocation Signature*
    *   *Demande de Pièces*
    *   *Dossier Clôturé*
*   **Personnalisation** : Remplacement automatique des variables (ex: `[Client]`).

### 2. Intégration API (Twilio)
*   **Provider** : Utilise l'API Twilio pour WhatsApp (robuste et mondial).
*   **Sécurité** : Les clés API ne sont jamais exposées côté client (appel via API Route `/api/whatsapp/send`).
*   **Mode Simulation** : Si aucune clé n'est configurée, le système simule l'envoi pour permettre le test de l'interface sans frais.

## Architecture Technique

*   **Service** : `lib/whatsapp/service.ts` (Gestion de l'envoi et du fallback simulation).
*   **API Route** : `app/api/whatsapp/send/route.ts` (Endpoint sécurisé).
*   **Composant UI** : `components/crm/WhatsAppSender.tsx`.
*   **Page** : `app/dashboard/crm/page.tsx`.

## Configuration

Pour activer l'envoi réel, configurez les variables d'environnement dans `.env` :

```env
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## Guide d'Utilisation

1.  Accédez au menu **CRM**.
2.  Dans la section "Envoi Rapide WhatsApp", saisissez le numéro du client (format international, ex: `+221...`).
3.  Rédigez votre message ou cliquez sur un bouton de **Template** pour pré-remplir.
4.  Cliquez sur **Envoyer**.
5.  Le client reçoit le message instantanément sur son téléphone.

## Avantages

*   **Taux d'ouverture** : ~98% (contre ~20% pour l'email).
*   **Rapidité** : Idéal pour les rappels de dernière minute.
*   **Proximité** : Renforce le lien avec le client.
