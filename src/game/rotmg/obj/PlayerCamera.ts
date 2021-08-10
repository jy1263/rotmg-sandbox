import { mat4, vec4 } from "gl-matrix";
import Camera from "../../engine/Camera";
import Vec2 from "../../engine/logic/Vec2";
import PlayerObject from "./PlayerObject";

export default class PlayerCamera extends Camera {
	player: PlayerObject;
	zoom: number = 6;
	canvas: HTMLCanvasElement

	constructor(player: PlayerObject, canvas: HTMLCanvasElement) {
		super();
		this.player = player;
		this.canvas = canvas;
	}
	
	getViewMatrix(): mat4 {
		const matrix = mat4.create();

		mat4.translate(matrix, matrix, [0, 0, -10]);
		mat4.rotateX(matrix, matrix, 30 * (Math.PI / 180))
		mat4.rotateZ(matrix, matrix, (180 + this.player.rotation) * (Math.PI / 180));
		mat4.translate(matrix, matrix, [-this.player.position.x, -this.player.position.y, 0]);

		return matrix;
	}

	getProjectionMatrix() {
		const matrix = mat4.create();
		const xRatio = (this.canvas.width / this.canvas.height);

		mat4.ortho(matrix, this.zoom * xRatio, -(this.zoom * xRatio), (this.zoom), -(this.zoom), 0.1, 1000);
		return matrix;
	}
}