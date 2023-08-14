import React, { useEffect, useRef, useState } from "react";
import { initGL, resizeGL } from "./webgl/utils";

type Graphics = {
	init: (canvas: HTMLCanvasElement, context: WebGL2RenderingContext) => Promise<void>;
	draw: (dt: number) => void;
};

type Props = {
	graphics: Graphics;
};

export default function CanvasWebGL2({ graphics }: Props) {
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const [context, setContext] = useState<WebGL2RenderingContext | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const requestIdRef = useRef<number>(0);

	const callback: FrameRequestCallback = (time: DOMHighResTimeStamp) => {
		requestIdRef.current = requestAnimationFrame(callback);
		if (!canvas || !context) {
			return;
		}

		// TODO: move these to draw -> renderer.startFrame?
		resizeGL(context);
		context.clearColor(0.2, 0.3, 0.4, 1.0);
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
		graphics.draw(time);
	};

	// initialize the canvas and WebGL2 context
	useEffect(() => {
		const canvasElement = canvasRef.current;
		if (!canvasElement) {
			throw new Error("Failed to find canvas element.");
		}

		const contextWebGL2 = initGL(canvasElement);

		// TODO: useAsyncEffect? React Async?
		(async () => {
			await graphics.init(canvasElement, contextWebGL2);
		})();

		setCanvas(canvasElement);
		setContext(contextWebGL2);
	}, []);

	// once initialized, kick off the render loop
	useEffect(() => {
		requestIdRef.current = requestAnimationFrame(callback);
		return () => cancelAnimationFrame(requestIdRef.current);
	}, [canvas, context]);

	console.log("!!! CanvasWebGL2 Render !!!");
	return <canvas className="h-full w-full" ref={canvasRef} />;
}
