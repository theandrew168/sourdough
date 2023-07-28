import React, { useEffect, useRef } from "react";

type Props = {
	main: (canvas: HTMLCanvasElement) => void;
};

/**
 * Load and render a WebGL application.
 */
export default function App({ main }: Props) {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) {
			throw new Error("Failed to find canvas.");
		}

		main(canvas);
	}, []);

	return <canvas className="h-full w-full" width={512} height={512} ref={ref}></canvas>;
}
