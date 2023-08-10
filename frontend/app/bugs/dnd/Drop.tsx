import React, { type PropsWithChildren } from "react";
import { Droppable } from "react-beautiful-dnd";

type Props = {
	id: string;
	type?: string;
	[key: string]: any;
};

export default function Drop({ id, type, ...props }: PropsWithChildren<Props>) {
	return (
		<Droppable droppableId={id} type={type}>
			{(provided) => {
				return (
					<div ref={provided.innerRef} {...provided.droppableProps} {...props}>
						{props.children}
						{provided.placeholder}
					</div>
				);
			}}
		</Droppable>
	);
}
