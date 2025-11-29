// CRM & Communication CRUD Methods Extension for db.ts
// Add these methods to the JsonDB class

import { CommunicationTemplate, CommunicationLog, AutomationRule, ClientPortalUser, ClientDocument, ClientMessage, Property, PropertyVisit, PropertyOffer } from './types';

// =====================================
// CRM & COMMUNICATION METHODS
// =====================================

// Communication Templates
addCommunicationTemplate(template: CommunicationTemplate) {
    this.data.communicationTemplates.push(template);
    this.save();
    return template;
}

updateCommunicationTemplate(id: string, updates: Partial<CommunicationTemplate>) {
    const index = this.data.communicationTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
        this.data.communicationTemplates[index] = {
            ...this.data.communicationTemplates[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.save();
        return this.data.communicationTemplates[index];
    }
    return null;
}

getCommunicationTemplate(id: string) {
    return this.data.communicationTemplates.find(t => t.id === id);
}

deleteCommunicationTemplate(id: string) {
    const index = this.data.communicationTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
        this.data.communicationTemplates.splice(index, 1);
        this.save();
        return true;
    }
    return false;
}

// Communication Logs
addCommunicationLog(log: CommunicationLog) {
    this.data.communicationLogs.push(log);
    this.save();
    return log;
}

updateCommunicationLog(id: string, updates: Partial<CommunicationLog>) {
    const index = this.data.communicationLogs.findIndex(l => l.id === id);
    if (index !== -1) {
        this.data.communicationLogs[index] = {
            ...this.data.communicationLogs[index],
            ...updates
        };
        this.save();
        return this.data.communicationLogs[index];
    }
    return null;
}

getCommunicationLogsByDossier(dossierId: string) {
    return this.data.communicationLogs.filter(l => l.metadata.dossierId === dossierId);
}

getCommunicationLogsByClient(clientId: string) {
    return this.data.communicationLogs.filter(l => l.metadata.clientId === clientId);
}

// Automation Rules
addAutomationRule(rule: AutomationRule) {
    this.data.automationRules.push(rule);
    this.save();
    return rule;
}

updateAutomationRule(id: string, updates: Partial<AutomationRule>) {
    const index = this.data.automationRules.findIndex(r => r.id === id);
    if (index !== -1) {
        this.data.automationRules[index] = {
            ...this.data.automationRules[index],
            ...updates
        };
        this.save();
        return this.data.automationRules[index];
    }
    return null;
}

getAutomationRule(id: string) {
    return this.data.automationRules.find(r => r.id === id);
}

getActiveAutomationRules() {
    return this.data.automationRules.filter(r => r.isActive);
}

// =====================================
// CLIENT PORTAL METHODS
// =====================================

// Client Portal Users
addClientPortalUser(user: ClientPortalUser) {
    this.data.clientPortalUsers.push(user);
    this.save();
    return user;
}

updateClientPortalUser(id: string, updates: Partial<ClientPortalUser>) {
    const index = this.data.clientPortalUsers.findIndex(u => u.id === id);
    if (index !== -1) {
        this.data.clientPortalUsers[index] = {
            ...this.data.clientPortalUsers[index],
            ...updates
        };
        this.save();
        return this.data.clientPortalUsers[index];
    }
    return null;
}

getClientPortalUser(id: string) {
    return this.data.clientPortalUsers.find(u => u.id === id);
}

getClientPortalUserByEmail(email: string) {
    return this.data.clientPortalUsers.find(u => u.email === email);
}

getClientPortalUserByClientId(clientId: string) {
    return this.data.clientPortalUsers.find(u => u.clientId === clientId);
}

// Client Documents
addClientDocument(document: ClientDocument) {
    this.data.clientDocuments.push(document);
    this.save();
    return document;
}

updateClientDocument(id: string, updates: Partial<ClientDocument>) {
    const index = this.data.clientDocuments.findIndex(d => d.id === id);
    if (index !== -1) {
        this.data.clientDocuments[index] = {
            ...this.data.clientDocuments[index],
            ...updates
        };
        this.save();
        return this.data.clientDocuments[index];
    }
    return null;
}

getClientDocumentsByClient(clientId: string) {
    return this.data.clientDocuments.filter(d => d.clientId === clientId);
}

getClientDocumentsByDossier(dossierId: string) {
    return this.data.clientDocuments.filter(d => d.dossierId === dossierId);
}

// Client Messages
addClientMessage(message: ClientMessage) {
    this.data.clientMessages.push(message);
    this.save();
    return message;
}

getClientMessagesByDossier(dossierId: string) {
    return this.data.clientMessages.filter(m => m.dossierId === dossierId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

markMessageAsRead(id: string) {
    const index = this.data.clientMessages.findIndex(m => m.id === id);
    if (index !== -1) {
        this.data.clientMessages[index].readAt = new Date().toISOString();
        this.save();
        return this.data.clientMessages[index];
    }
    return null;
}

// =====================================
// REAL ESTATE METHODS
// =====================================

// Properties
addProperty(property: Property) {
    this.data.properties.push(property);
    this.save();
    return property;
}

updateProperty(id: string, updates: Partial<Property>) {
    const index = this.data.properties.findIndex(p => p.id === id);
    if (index !== -1) {
        this.data.properties[index] = {
            ...this.data.properties[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.save();
        return this.data.properties[index];
    }
    return null;
}

getProperty(id: string) {
    return this.data.properties.find(p => p.id === id);
}

getPropertiesByStatus(status: PropertyStatus) {
    return this.data.properties.filter(p => p.status === status);
}

getPropertiesByOwner(ownerId: string) {
    return this.data.properties.filter(p => p.ownerId === ownerId);
}

searchProperties(criteria: {
    type?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    city?: string;
}) {
    return this.data.properties.filter(p => {
        if (criteria.type && p.type !== criteria.type) return false;
        if (criteria.minPrice && p.price < criteria.minPrice) return false;
        if (criteria.maxPrice && p.price > criteria.maxPrice) return false;
        if (criteria.minSurface && p.surface < criteria.minSurface) return false;
        if (criteria.city && p.city !== criteria.city) return false;
        return true;
    });
}

// Property Visits
addPropertyVisit(visit: PropertyVisit) {
    this.data.propertyVisits.push(visit);
    this.save();
    return visit;
}

updatePropertyVisit(id: string, updates: Partial<PropertyVisit>) {
    const index = this.data.propertyVisits.findIndex(v => v.id === id);
    if (index !== -1) {
        this.data.propertyVisits[index] = {
            ...this.data.propertyVisits[index],
            ...updates
        };
        this.save();
        return this.data.propertyVisits[index];
    }
    return null;
}

getPropertyVisitsByProperty(propertyId: string) {
    return this.data.propertyVisits.filter(v => v.propertyId === propertyId);
}

getPropertyVisitsByClient(clientId: string) {
    return this.data.propertyVisits.filter(v => v.clientId === clientId);
}

// Property Offers
addPropertyOffer(offer: PropertyOffer) {
    this.data.propertyOffers.push(offer);
    this.save();
    return offer;
}

updatePropertyOffer(id: string, updates: Partial<PropertyOffer>) {
    const index = this.data.propertyOffers.findIndex(o => o.id === id);
    if (index !== -1) {
        this.data.propertyOffers[index] = {
            ...this.data.propertyOffers[index],
            ...updates
        };
        this.save();
        return this.data.propertyOffers[index];
    }
    return null;
}

getPropertyOffersByProperty(propertyId: string) {
    return this.data.propertyOffers.filter(o => o.propertyId === propertyId);
}

getPropertyOffersByClient(clientId: string) {
    return this.data.propertyOffers.filter(o => o.clientId === clientId);
}
