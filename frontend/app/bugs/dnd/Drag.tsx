import { ListBulletIcon } from "@heroicons/react/24/outline";
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
			{(provided, _snapshot) => {
				return (
					<div
						className="flex items-center justify-between gap-8"
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...props}
					>
						{props.children}
						<span {...provided.dragHandleProps}>
							<ListBulletIcon className="h-10 w-10" />
						</span>
					</div>
				);
			}}
		</Draggable>
	);
}
