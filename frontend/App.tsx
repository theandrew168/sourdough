import React, { useEffect, useRef } from "react";

import { initGL } from "./webgl/utils";

type Props = {
	main: (gl: WebGL2RenderingContextStrict) => void;
};

/**
 * Load and render a WebGL application.
 */
export default function App({ main }: Props) {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) {
			throw new Error("Failed to find WebGL canvas.");
		}

		const gl = initGL(canvas);
		main(gl);
	}, []);

	return <canvas className="h-full w-full" ref={ref}></canvas>;
}
