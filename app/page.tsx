export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
            <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
                <h1 className="text-4xl font-bold text-slate-900">Application Notaire</h1>
                <p className="text-lg text-slate-600">Gestion complète de cabinet notarial</p>
                <a
                    href="/dashboard"
                    className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition-colors"
                >
                    Accéder au Tableau de Bord
                </a>
            </div>
        </main>
    );
}
