export async function loadText(path: string): Promise<string> {
	const resp = await fetch(path);
	return resp.text();
}

export async function loadImage(path: string, flipY = false): Promise<ImageBitmap> {
	const resp = await fetch(path);
	const blob = await resp.blob();
	const opts: ImageBitmapOptions = {};
	if (flipY) {
		opts.imageOrientation = "flipY";
	}
	return createImageBitmap(blob, opts);
}
