import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { AttractionSummary } from "../hooks/useCitiesSummary";

interface SortableAttractionItemProps {
  attraction: AttractionSummary;
  onNavigate: (id: number) => void;
  getImageUrl: (path: string | null) => string | null;
}

function SortableAttractionItem({
  attraction,
  onNavigate,
  getImageUrl,
}: SortableAttractionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attraction.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 12,
        backgroundColor: isDragging ? "#e3f2fd" : "#f9f9f9",
        borderRadius: 8,
        border: isDragging ? "2px dashed #2196f3" : "1px solid #f0f0f0",
        transition: "background-color 0.2s, border 0.2s",
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          padding: 8,
          display: "flex",
          alignItems: "center",
          color: "#999",
          touchAction: "none",
        }}
      >
        <span style={{ fontSize: 16, userSelect: "none" }}>⋮⋮</span>
      </div>

      {/* Conteudo clicavel para navegar */}
      <div
        onClick={() => onNavigate(attraction.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flex: 1,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.opacity = "0.8";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        {/* Foto da Atracao */}
        {getImageUrl(attraction.photo) && (
          <img
            src={getImageUrl(attraction.photo)!}
            alt={attraction.name}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        )}

        {/* Icone placeholder */}
        {!getImageUrl(attraction.photo) && (
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e0e0e0",
              borderRadius: 6,
            }}
          >
            <span style={{ fontSize: 20 }}>📍</span>
          </div>
        )}

        {/* Informacoes da Atracao */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: "500" }}>
              {attraction.name}
            </h4>
            {attraction.visited && (
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  borderRadius: 4,
                }}
              >
                ✓ Visitado
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 4,
              fontSize: 13,
              color: "#666",
            }}
          >
            <span>{attraction.type_display}</span>
            {attraction.suggested_duration && (
              <span>⏱️ {attraction.suggested_duration} min</span>
            )}
          </div>
        </div>

        {/* Seta de navegacao */}
        <div style={{ fontSize: 20, color: "#ccc" }}>›</div>
      </div>
    </div>
  );
}

interface SortableAttractionsListProps {
  cityId: number;
  attractions: AttractionSummary[];
  onReorder: (
    cityId: number,
    newAttractions: AttractionSummary[],
    attractionIds: number[]
  ) => void;
  onNavigate: (id: number) => void;
  getImageUrl: (path: string | null) => string | null;
}

export function SortableAttractionsList({
  cityId,
  attractions,
  onReorder,
  onNavigate,
  getImageUrl,
}: SortableAttractionsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = attractions.findIndex((a) => a.id === active.id);
      const newIndex = attractions.findIndex((a) => a.id === over.id);

      const newAttractions = arrayMove(attractions, oldIndex, newIndex);
      const newIds = newAttractions.map((a) => a.id);

      onReorder(cityId, newAttractions, newIds);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={attractions.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {attractions.map((attraction) => (
            <SortableAttractionItem
              key={attraction.id}
              attraction={attraction}
              onNavigate={onNavigate}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
