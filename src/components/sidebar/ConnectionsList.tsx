import React, { useCallback, useState } from "react";
import { DatabaseConnection } from "@/lib/types";
import { applyConnectionOrder } from "@/lib/connection-order";
import { Button } from "@/components/ui/button";
import { ConnectionItem } from "./ConnectionItem";

interface ConnectionsListProps {
  connections: DatabaseConnection[];
  activeConnection: DatabaseConnection | null;
  onSelectConnection: (conn: DatabaseConnection) => void;
  onDeleteConnection: (id: string) => void;
  onEditConnection?: (conn: DatabaseConnection) => void;
  onDuplicateConnection?: (conn: DatabaseConnection) => void;
  /** The user's saved custom order (#748). Absent means reordering is not wired up. */
  connectionOrder?: string[];
  /** Persists a new full order after a drag-and-drop completes. */
  onReorderConnections?: (order: string[]) => void;
  onAddConnection: () => void;
}

export function ConnectionsList({
  connections,
  activeConnection,
  onSelectConnection,
  onDeleteConnection,
  onEditConnection,
  onDuplicateConnection,
  connectionOrder,
  onReorderConnections,
  onAddConnection,
}: ConnectionsListProps) {
  const ordered = applyConnectionOrder(connections, connectionOrder ?? []);
  const reorderable = onReorderConnections !== undefined;

  // Drag state lives here, not in ConnectionItem: a drop needs the full ordered list to
  // compute the new order, and only this component holds it.
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const clearDragState = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (targetId: string) => {
      if (draggedId !== null && draggedId !== targetId) {
        const ids = ordered.map((c) => c.id);
        const fromIndex = ids.indexOf(draggedId);
        const toIndex = ids.indexOf(targetId);
        if (fromIndex !== -1 && toIndex !== -1) {
          const reordered = [...ids];
          const [moved] = reordered.splice(fromIndex, 1);
          reordered.splice(toIndex, 0, moved);
          onReorderConnections?.(reordered);
        }
      }
      clearDragState();
    },
    [draggedId, ordered, onReorderConnections, clearDragState],
  );

  return (
    <section>
      <div className="px-3 mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Connections</span>
        <div className="h-[1px] flex-1 bg-border/30 ml-3" />
      </div>

      <div className="space-y-0.5">
        {ordered.length === 0 ? (
          <div className="px-3 py-6 text-center border border-dashed border-border/50 rounded-lg mx-2">
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              No database connections established yet.
            </p>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onAddConnection}>
              Add Connection
            </Button>
          </div>
        ) : (
          ordered.map((conn) => (
            <ConnectionItem
              key={conn.id}
              connection={conn}
              isActive={activeConnection?.id === conn.id}
              onSelect={onSelectConnection}
              onDelete={onDeleteConnection}
              onEdit={onEditConnection}
              onDuplicate={onDuplicateConnection}
              draggable={reorderable && ordered.length > 1}
              isDragging={draggedId === conn.id}
              isDragOver={dragOverId === conn.id && draggedId !== conn.id}
              onDragStart={() => setDraggedId(conn.id)}
              onDragEnter={() => setDragOverId(conn.id)}
              onDragEnd={clearDragState}
              onDrop={() => handleDrop(conn.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
