import { DraggableLocation } from 'react-beautiful-dnd';
import { DiscordChannel } from '../types/DiscordTypes';

// a little function to help us with reordering the result
export const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number
): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const reorderColumns = (
  columns: DiscordChannel[],
  source: DraggableLocation,
  destination: DraggableLocation
) => {
  const current = columns.find((x) => x.id === source.droppableId)!;
  const next = columns.find((x) => x.id === destination.droppableId)!;
  const target = current.currentUsers[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(
      current.currentUsers,
      source.index,
      destination.index
    );
    return columns.map((x) =>
      x.id === current.id ? { ...x, currentUsers: reordered } : x
    );
  }

  // moving to different list

  // remove from original
  current.currentUsers.splice(source.index, 1);
  // insert into next
  next.currentUsers.splice(destination.index, 0, target);

  return columns.map((x) => {
    if (current.id === x.id) {
      return {
        ...x,
        currentUsers: current.currentUsers,
      };
    } else if (next.id === x.id) {
      return {
        ...x,
        currentUsers: next.currentUsers,
      };
    }

    return x;
  });
};
