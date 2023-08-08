import React, { type PropsWithChildren } from "react";
import { Draggable } from "react-beautiful-dnd";

type Props = {
	id: string;
	index: number;
	[key: string]: any;
};

export default function Drag({ id, index, ...props }: PropsWithChildren<Props>) {
	return (
		<Draggable draggableId={id} index={index}>
			{(provided, snapshot) => {
				return (
					<div ref={provided.innerRef} {...provided.draggableProps} {...props}>
						<div {...provided.dragHandleProps}>Drag handle</div>
						{props.children}
					</div>
				);
			}}
		</Draggable>
	);
}
