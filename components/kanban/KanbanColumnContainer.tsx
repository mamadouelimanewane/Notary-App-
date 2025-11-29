"use client";

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumn, KanbanCard } from '@/lib/kanban/data';
import { KanbanCardItem } from './KanbanCardItem';

interface Props {
    column: KanbanColumn;
    cards: KanbanCard[];
}

export function KanbanColumnContainer({ column, cards }: Props) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="bg-gray-100 w-[300px] min-w-[300px] rounded-xl flex flex-col max-h-full"
        >
            {/* Header */}
            <div className={`p-4 rounded-t-xl border-b border-gray-200 flex items-center justify-between ${column.color}`}>
                <h3 className="font-bold text-sm text-gray-700">
                    {column.title}
                </h3>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600">
                    {cards.length}
                </span>
            </div>

            {/* Cards Area */}
            <div className="flex-1 p-2 overflow-y-auto space-y-2 min-h-[100px]">
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map((card) => (
                        <KanbanCardItem key={card.id} card={card} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
