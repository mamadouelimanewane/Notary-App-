"use client";

import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn, KanbanCard, KANBAN_COLUMNS, MOCK_KANBAN_CARDS, DossierStatus } from '@/lib/kanban/data';
import { KanbanColumnContainer } from './KanbanColumnContainer';
import { KanbanCardItem } from './KanbanCardItem';

export function KanbanBoard() {
    const [cards, setCards] = useState<KanbanCard[]>(MOCK_KANBAN_CARDS);
    const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Empêche le drag accidentel au clic simple
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const card = cards.find((c) => c.id === active.id);
        if (card) setActiveCard(card);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveCard = active.data.current?.type === 'Card';
        const isOverCard = over.data.current?.type === 'Card';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveCard) return;

        // Dragging a card over another card
        if (isActiveCard && isOverCard) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((c) => c.id === activeId);
                const overIndex = cards.findIndex((c) => c.id === overId);

                if (cards[activeIndex].status !== cards[overIndex].status) {
                    // Change column
                    cards[activeIndex].status = cards[overIndex].status;
                    return arrayMove(cards, activeIndex, overIndex - 1); // Insert before
                }

                return arrayMove(cards, activeIndex, overIndex);
            });
        }

        // Dragging a card over a column
        if (isActiveCard && isOverColumn) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((c) => c.id === activeId);
                const newStatus = overId as DossierStatus;

                if (cards[activeIndex].status !== newStatus) {
                    cards[activeIndex].status = newStatus;
                    return arrayMove(cards, activeIndex, activeIndex); // Force update
                }
                return cards;
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Si on lâche sur une colonne vide
        const isOverColumn = KANBAN_COLUMNS.some(col => col.id === overId);
        if (isOverColumn) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((c) => c.id === activeId);
                if (activeIndex !== -1) {
                    // Créer une nouvelle copie du tableau pour déclencher le re-render
                    const newCards = [...cards];
                    newCards[activeIndex] = {
                        ...newCards[activeIndex],
                        status: overId as DossierStatus
                    };
                    return newCards;
                }
                return cards;
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {KANBAN_COLUMNS.map((col) => (
                    <KanbanColumnContainer
                        key={col.id}
                        column={col}
                        cards={cards.filter((c) => c.status === col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeCard ? <KanbanCardItem card={activeCard} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
