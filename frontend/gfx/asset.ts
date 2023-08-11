export async function loadText(path: string): Promise<string> {
	const resp = await fetch(path);
	return resp.text();
}

export async function loadImage(path: string): Promise<ImageBitmap> {
	const resp = await fetch(path);
	const blob = await resp.blob();
	return createImageBitmap(blob, { imageOrientation: "flipY" });
}
