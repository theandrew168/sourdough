export class Sprite {
	public width: number;
	public height: number;
	public xMin: number;
	public xMax: number;
	public yMin: number;
	public yMax: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.xMin = 0.0;
		this.xMax = 1.0;
		this.yMin = 0.0;
		this.yMax = 1.0;
	}

	public slice(width: number, height: number, x: number, y: number): Sprite {
		// calc number of rows and cols in the sheet
		const cols = this.width / width;
		const rows = this.height / height;

		// calc the texcoord step size for each sub sprite
		const xStep = (this.xMax - this.xMin) / cols;
		const yStep = (this.yMax - this.yMin) / rows;

		// create a new sprite with the dimensions and texcoords
		// of a sub sprite contained within the parent sheet
		const sprite = new Sprite(width, height);
		sprite.xMin = xStep * x;
		sprite.xMax = xStep * (x + 1);
		sprite.yMin = this.yMax - yStep * (y + 1);
		sprite.yMax = this.yMax - yStep * y;
		return sprite;
	}
}
