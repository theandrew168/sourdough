import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import APPS from "./apps";
import Home from "./Home";
import App from "./App";

export default function Router() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
		},
		...APPS.map((app) => ({ path: app.path, element: <App main={app.main} /> })),
	]);

	return <RouterProvider router={router} />;
}
