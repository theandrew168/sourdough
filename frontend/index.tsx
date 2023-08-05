import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./Home";
import APPS from "./apps";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	...APPS.map((app) => ({ path: app.path, element: app.element })),
]);

const main = document.getElementById("main");
if (!main) {
	throw new Error("Failed to find root element.");
}

const root = createRoot(main);
root.render(<RouterProvider router={router} />);
