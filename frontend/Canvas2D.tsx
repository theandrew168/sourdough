import React, { useEffect, useRef, useState } from "react";

type Props = {
	draw: (time: DOMHighResTimeStamp, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
};

export default function Canvas2D({ draw }: Props) {
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const requestIdRef = useRef<number>(0);

	const callback: FrameRequestCallback = (time: DOMHighResTimeStamp) => {
		requestIdRef.current = requestAnimationFrame(callback);
		if (!canvas || !context) {
			return;
		}

		draw(time, canvas, context);
	};

	// initialize the canvas and 2D drawing context
	useEffect(() => {
		const canvasElement = canvasRef.current;
		if (!canvasElement) {
			throw new Error("Failed to find canvas element.");
		}
		const context2D = canvasElement.getContext("2d");
		if (!context2D) {
			throw new Error("Canvas 2D not supported on this browser.");
		}

		setCanvas(canvasElement);
		setContext(context2D);
	}, []);

	// once initialized, kick off the render loop
	useEffect(() => {
		requestIdRef.current = requestAnimationFrame(callback);
		return () => cancelAnimationFrame(requestIdRef.current);
	}, [canvas, context]);

	return <canvas className="h-full w-full" ref={canvasRef} />;
}
