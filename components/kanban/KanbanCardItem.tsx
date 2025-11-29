"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard } from '@/lib/kanban/data';
import { Calendar, User, Briefcase, AlertCircle } from 'lucide-react';

interface Props {
    card: KanbanCard;
}

export function KanbanCardItem({ card }: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-white p-4 rounded-lg border-2 border-blue-500 opacity-50 h-[120px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                    {card.type}
                </span>
                {card.priority === 'HAUTE' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                )}
            </div>

            <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                {card.title}
            </h4>

            <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 mr-1.5" />
                    {card.client}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {card.date}
                </div>
            </div>

            {card.amount && (
                <div className="mt-3 pt-2 border-t border-gray-50 flex justify-end">
                    <span className="text-xs font-bold text-slate-700">
                        {(card.amount / 1000000).toFixed(1)} M FCFA
                    </span>
                </div>
            )}
        </div>
    );
}
