import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

export interface ItemComponentProps<T> {
  index: number;
  item: T;
}

export type OwnProps<T> = {
  onDragEndCallback: (items: T[]) => void;
  items: T[];
  children: (props: ItemComponentProps<T>) => React.ReactElement<HTMLElement>;
};

export const DropDownComponent = <T,>({
  onDragEndCallback,
  items,
  children: ItemComponent,
}: OwnProps<T>) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    onDragEndCallback(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={index} draggableId={`${index}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ItemComponent index={index} item={item} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
