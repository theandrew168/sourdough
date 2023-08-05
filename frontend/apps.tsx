import React from "react";

import * as triangle from "./app/triangle";
import * as square from "./app/square";
import * as box from "./app/box";
import * as materials from "./app/materials";
import * as metal from "./app/metal";
import * as skybox from "./app/skybox";
import * as reflect from "./app/reflect";
import * as life from "./app/life";
import * as bugs from "./app/bugs";

type AppMetadata = {
	name: string;
	icon: string;
	path: string;
	element: React.JSX.Element;
	hidden?: boolean;
};

const APPS: AppMetadata[] = [
	{
		name: "Triangle",
		icon: "/static/icon/triangle.webp",
		path: "/app/triangle",
		element: <triangle.App />,
	},
	{
		name: "Square",
		icon: "/static/icon/square.webp",
		path: "/app/square",
		element: <square.App />,
	},
	{
		name: "Box",
		icon: "/static/icon/box.webp",
		path: "/app/box",
		element: <box.App />,
	},
	{
		name: "Materials",
		icon: "/static/icon/materials.webp",
		path: "/app/materials",
		element: <materials.App />,
	},
	{
		name: "Metal",
		icon: "/static/icon/metal.webp",
		path: "/app/metal",
		element: <metal.App />,
	},
	{
		name: "Skybox",
		icon: "/static/icon/skybox.webp",
		path: "/app/skybox",
		element: <skybox.App />,
	},
	{
		name: "Reflect",
		icon: "/static/icon/reflect.webp",
		path: "/app/reflect",
		element: <reflect.App />,
	},
	{
		name: "Life",
		icon: "/static/icon/triangle.webp",
		path: "/app/life",
		element: <life.App />,
		hidden: true,
	},
	{
		name: "Bugs",
		icon: "/static/icon/bugs.webp",
		path: "/app/bugs",
		element: <bugs.App />,
	},
];

export default APPS;
