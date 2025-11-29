import { db } from '@/lib/db';
import JournalViewClient from './JournalViewClient';
import { notFound } from 'next/navigation';

export default function JournalViewPage({ params }: { params: { id: string } }) {
    const journal = db.journals.find(j => j.id === params.id);

    if (!journal) {
        notFound();
    }

    return (
        <div className="p-8">
            <JournalViewClient journal={journal} />
        </div>
    );
}
