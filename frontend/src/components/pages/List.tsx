import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

export interface ItemComponentProps<T> {
  item: T;
}

export type OwnProps<M> = {
  onDragEndCallback: (items: M[]) => void;
  items: M[];
  ItemComponent: React.ComponentType<ItemComponentProps<M>>;
};

export const DropDownComponent = <M,>({
  onDragEndCallback,
  items,
  ItemComponent,
}: OwnProps<M>) => {
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
                    <ItemComponent item={item}/>
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
