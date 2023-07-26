import React from "react";
import { Link } from "react-router-dom";

import APPS from "./apps";

/**
 * Home screen of "apps".
 */
export default function Home() {
	return (
		<div className="h-full bg-gray-100">
			<div className="text-center mx-auto max-w-3xl py-16 px-8">
				<h1 className="text-6xl underline mb-8">Sourdough</h1>
				<ul className="flex flex-wrap justify-center gap-6">
					{APPS.map((app) => (
						<li key={app.path}>
							<h2 className="text-xl font-bold mb-2">{app.name}</h2>
							<Link to={app.path}>
								<img className="rounded-2xl w-32 shadow-2xl transition-all hover:scale-105" src={app.icon}></img>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
