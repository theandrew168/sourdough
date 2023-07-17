import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./Home";
import App from "./App";
import APPS from "./apps";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	...APPS.map((app) => ({ path: app.path, element: <App main={app.main} /> })),
]);

const main = document.getElementById("main");
if (!main) {
	throw new Error("Failed to find root element.");
}

const root = createRoot(main);
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
