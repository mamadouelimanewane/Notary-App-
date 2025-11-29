"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function SidebarPure() {
    const pathname = usePathname();
    const [officeName, setOfficeName] = useState('Cabinet Notaire Keur Jaraaf');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Toujours visible maintenant

    useEffect(() => {
        // Récupérer le nom de l'office
        fetch('/api/office-name')
            .then(res => res.json())
            .then(data => setOfficeName(data.officeName || 'Cabinet Notaire'))
            .catch(() => setOfficeName('Cabinet Notaire Keur Jaraaf'));

        // Vérifier si admin
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(session => {
                if (session?.user?.role === 'ADMIN') {
                    setIsAdmin(true);
                }
            })
            .catch(() => { });
    }, []);

    const navigation = [
        { name: "Tableau de bord", href: "/dashboard" },
        { name: "Assistant IA", href: "/dashboard/assistant" },
        { name: "Clients", href: "/dashboard/clients" },
        { name: "Dossiers", href: "/dashboard/dossiers" },
        { name: "Actes", href: "/dashboard/actes" },
        { name: "Types d'Actes", href: "/dashboard/types-actes" },
        { name: "Templates", href: "/dashboard/templates" },
        { name: "Archives", href: "/dashboard/archives" },
        { name: "Comptabilité", href: "/dashboard/comptabilite" },
        { name: "Trésorerie", href: "/dashboard/tresorerie/caisse" },
        { name: "Facturation", href: "/dashboard/facturation" },
        { name: "Barème", href: "/dashboard/bareme/calcul-provision" },
        { name: "Rapprochement", href: "/dashboard/rapprochement" },
        { name: "Rapports", href: "/dashboard/rapports" },
        { name: "Recherche Juridique", href: "/dashboard/recherche-juridique" },
        { name: "Agenda", href: "/dashboard/agenda" },
        { name: "Formalités", href: "/dashboard/formalites" },
        { name: "CRM", href: "/dashboard/crm" },
        { name: "Portail Client", href: "/dashboard/portail-client" },
        { name: "Négociation", href: "/dashboard/negociation" },
    ];

    const innovationNavigation = [
        { name: "Blockchain & Smart Contracts", href: "/dashboard/innovation/blockchain" },
        { name: "Visites 3D & VR", href: "/dashboard/innovation/vr" },
        { name: "Justice Prédictive", href: "/dashboard/innovation/predictive" },
        { name: "Coffre-fort Biométrique", href: "/dashboard/innovation/biometric" },
        { name: "Scribe IA", href: "/dashboard/innovation/scribe" },
        { name: "Carte Interactive 3D", href: "/dashboard/innovation/map" },
        { name: "Réunion Virtuelle", href: "/dashboard/innovation/meeting" },
    ];

    const adminNavigation = [
        { name: "Utilisateurs", href: "/dashboard/admin/users" },
        { name: "Privilèges", href: "/dashboard/admin/privileges" },
        { name: "Paramètres", href: "/dashboard/parametres" },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '256px',
            backgroundColor: '#0f172a',
            color: 'white',
            position: 'fixed',
            left: 0,
            top: 0,
            overflowY: 'auto',
            zIndex: 40,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-in-out',
            willChange: 'opacity'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '64px',
                borderBottom: '1px solid #1e293b',
                padding: '0 16px'
            }}>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0
                }}>{officeName}</h1>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '16px 8px' }}>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                marginBottom: '4px',
                                color: isActive ? 'white' : '#cbd5e1',
                                textDecoration: 'none',
                                borderRadius: '6px',
                                backgroundColor: isActive ? '#1e293b' : 'transparent',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = '#1e293b';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#cbd5e1';
                                }
                            }}
                        >
                            {item.name}
                        </a>
                    );
                })}

                {/* Section Innovation Lab */}
                <div style={{
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid #1e293b'
                }}>
                    <div style={{
                        padding: '0 16px 8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Innovation Lab
                    </div>
                    {innovationNavigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 16px',
                                    marginBottom: '4px',
                                    color: isActive ? 'white' : '#cbd5e1',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    backgroundColor: isActive ? '#1e293b' : 'transparent',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = '#1e293b';
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#cbd5e1';
                                    }
                                }}
                            >
                                {item.name}
                            </a>
                        );
                    })}
                </div>

                {/* Section Admin */}
                {isAdmin && (
                    <div style={{
                        marginTop: '24px',
                        paddingTop: '16px',
                        borderTop: '1px solid #1e293b'
                    }}>
                        <div style={{
                            padding: '0 16px 8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Administration
                        </div>
                        {adminNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 16px',
                                        marginBottom: '4px',
                                        color: isActive ? 'white' : '#cbd5e1',
                                        textDecoration: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: isActive ? '#1e293b' : 'transparent',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = '#1e293b';
                                            e.currentTarget.style.color = 'white';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#cbd5e1';
                                        }
                                    }}
                                >
                                    {item.name}
                                </a>
                            );
                        })}


                    </div>
                )}
            </nav>

            {/* Scrollbar styles */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    width: 6px;
                }
                div::-webkit-scrollbar-track {
                    background: #0f172a;
                }
                div::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}
