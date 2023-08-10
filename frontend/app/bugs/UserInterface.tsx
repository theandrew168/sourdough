import React, { useState } from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";

import { DragAndDrop, Drag, Drop, reorder } from "./dnd";
import { tryStepBug } from "./game";
import { STATE } from "./state";

const handleDragEnd: OnDragEndResponder = (result) => {
	const { source, destination } = result;

	// if no dest, remove the word
	if (!destination) {
		STATE.bug.program.words.splice(source.index, 1);
		STATE.bug = {
			direction: "up",
			position: { x: 0, y: 1 },
			program: { pc: 0, words: [...STATE.bug.program.words] },
		};
		return;
	}

	const reorderedItems = reorder(STATE.bug.program.words, source.index, destination.index);
	STATE.bug = { direction: "up", position: { x: 0, y: 1 }, program: { pc: 0, words: reorderedItems } };
};

export default function UserInterface() {
	const [isEditOpen, setIsEditOpen] = useState(false);

	return (
		<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white p-4 font-mono">
			<button
				className="border border-white p-2 mr-4"
				onClick={() => {
					STATE.bug = tryStepBug(STATE.bug, STATE.level);
				}}
			>
				Step
			</button>
			<button className="border border-white p-2" onClick={() => setIsEditOpen(!isEditOpen)}>
				Edit
			</button>
			{isEditOpen && (
				<div className="border border-white p-2 mt-4">
					<DragAndDrop onDragEnd={handleDragEnd}>
						<Drop id="droppable-id">
							{STATE.bug.program.words.map((item, index) => {
								return (
									<Drag key={index} id={index.toString()} index={index}>
										<span>{item}</span>
									</Drag>
								);
							})}
						</Drop>
					</DragAndDrop>
				</div>
			)}
		</div>
	);
}
