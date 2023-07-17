import React from "react";
import { createRoot } from "react-dom/client";

import Router from "./Router";

const main = document.getElementById("main");
if (!main) {
	throw new Error("Failed to find root element.");
}

const root = createRoot(main);
root.render(
	<React.StrictMode>
		<Router />
	</React.StrictMode>,
);
