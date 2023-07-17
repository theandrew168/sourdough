import * as triangle from "./app/triangle";
import * as square from "./app/square";
import * as box from "./app/box";
import * as materials from "./app/materials";
import * as metal from "./app/metal";
import * as skybox from "./app/skybox";
import * as reflect from "./app/reflect";

type AppMetadata = {
	name: string;
	icon: string;
	path: string;
	main: (gl: WebGL2RenderingContextStrict) => void;
};

const APPS: AppMetadata[] = [
	{
		name: "Triangle",
		icon: "/static/icon/triangle.webp",
		path: "/app/triangle",
		main: triangle.main,
	},
	{
		name: "Square",
		icon: "/static/icon/square.webp",
		path: "/app/square",
		main: square.main,
	},
	{
		name: "Box",
		icon: "/static/icon/box.webp",
		path: "/app/box",
		main: box.main,
	},
	{
		name: "Materials",
		icon: "/static/icon/materials.webp",
		path: "/app/materials",
		main: materials.main,
	},
	{
		name: "Metal",
		icon: "/static/icon/metal.webp",
		path: "/app/metal",
		main: metal.main,
	},
	{
		name: "Skybox",
		icon: "/static/icon/skybox.webp",
		path: "/app/skybox",
		main: skybox.main,
	},
	{
		name: "Reflect",
		icon: "/static/icon/reflect.webp",
		path: "/app/reflect",
		main: reflect.main,
	},
];

export default APPS;
