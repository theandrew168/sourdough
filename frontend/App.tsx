import React, { useEffect, useRef } from "react";

type Props = {
	main: (canvas: HTMLCanvasElement) => void;
};

/**
 * Load and render a WebGL application.
 */
export default function App({ main }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			throw new Error("Failed to find canvas.");
		}

		main(canvas);
	}, []);

	return (
		<div className="relative h-full w-hull">
			<canvas className="h-full w-full" width={512} height={512} ref={canvasRef}></canvas>
			<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white p-4 font-mono">
				<p>Hello world!</p>
				<p>Neat overlay</p>
			</div>
		</div>
	);
}
