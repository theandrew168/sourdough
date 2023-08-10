import { DragDropContext as DragAndDrop } from "react-beautiful-dnd";
import Drag from "./Drag";
import Drop from "./Drop";

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed as T);

	return result;
}

export { DragAndDrop, Drag, Drop, reorder };
