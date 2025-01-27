
import { ProgramAssetLoader } from "common/loaders/ProgramAssetLoader";
import { ShaderAssetLoader } from "common/loaders/ShaderAssetLoader";
import { AssetManager, Wall, Ground, Character, State } from "@haizor/rotmg-utils";
import PlayerManager from "../../common/PlayerManager";
import Game from "../engine/Game";
import Vec2 from "../engine/logic/Vec2";
import EnemyObject from "./obj/EnemyObject";
import { LevelObject } from "./obj/LevelObject";
import PlayerCamera from "./obj/PlayerCamera";
import PlayerObject from "./obj/PlayerObject";
import WallTile from "./obj/WallTile";
import { RenderHelper } from "./RenderHelper";

export default class RotMGGame extends Game {
	player: PlayerObject | undefined;
	renderHelper: RenderHelper | undefined;
	playerManager: PlayerManager;
	textCanvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D | null;

	static instance: RotMGGame;

	constructor(glCanvas: HTMLCanvasElement, textCanvas: HTMLCanvasElement, manager: AssetManager, player: PlayerManager) {
		super(glCanvas, manager);
		this.textCanvas = textCanvas;
		this.playerManager = player; 
		this.ctx = textCanvas.getContext("2d");
		RotMGGame.instance = this;
	}

	populateAssetManager(): AssetManager {
		this.assetManager.registerLoader("shader-loader", new ShaderAssetLoader(this.gl));
		this.assetManager.registerLoader("program-loader", new ProgramAssetLoader(this.gl, this.assetManager));
		return this.assetManager;
	}

	getAssetConfig() {
		return config;
	}

	onAssetsLoaded() {
		super.onAssetsLoaded();

		this.renderHelper = new RenderHelper(this.gl, this.assetManager);

		this.scene.addObject(new LevelObject(this.assetManager.get<Ground>("rotmg/ground", "Castle Stone Floor Tile")?.value));

		this.player = new PlayerObject(this.playerManager);
		this.player.updatePosition(new Vec2(0, 0));

		for (let x = 0; x < 20; x++) {
			if (x !== 5)
			this.scene.addObject(new WallTile(new Vec2(x, 5), this.assetManager.get<Wall>("rotmg", "Castle Brick Wall2")?.value as Wall));
		}


		const enemy = new EnemyObject(
			this.assetManager.get<Character>("rotmg", "Archdemon Malphas")?.value as Character,
			this.assetManager.get("rotmg/states", "test")?.value as State
		);
		enemy.move(new Vec2(0, 10))
		this.scene.addObject(enemy);

		this.scene.camera = new PlayerCamera(this.player, this.canvas)
		this.scene.addObject(this.player)
	}

	render(time: number) {
		this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
		super.render(time);

	}

	stop() {
		super.stop();
		const bundle = this.assetManager.getBundle("rotmg/engine")
		if (bundle !== undefined) this.assetManager.deleteAssetBundle(bundle);
		// this.gl.getExtension("WEBGL_lose_context")?.loseContext()
	}
}

const config = {
	name: "rotmg/engine",
	containers: [
		{
			type: "shaders",
			loader: "shader-loader",
			sources: [
				{
					name: "vertex/base",
					src: "./shaders/vertex/base.glsl",
					type: "vertex"
				},
				{
					name: "vertex/textured",
					src: "./shaders/vertex/textured.glsl",
					type: "vertex"
				},
				{
					name: "vertex/billboard",
					src: "./shaders/vertex/billboard.glsl",
					type: "vertex"
				},
				{
					name: "fragment/color",
					src: "./shaders/fragment/color.glsl",
					type: "fragment"
				},
				{
					name: "fragment/textured",
					src: "./shaders/fragment/textured.glsl",
					type: "fragment"
				}
			]
		},
		{
			type: "programs",
			loader: "program-loader",
			depends: [
				"shaders"
			],
			sources: [
				{
					name: "base",
					vertex: "vertex/base",
					fragment: "fragment/color",
					attribs: [
						"aVertexPosition"
					],
					uniforms: [
						"uModelViewMatrix",
						"uProjectionMatrix",

						"uColor"
					]
				},
				{
					name: "textured",
					vertex: "vertex/textured",
					fragment: "fragment/textured",
					attribs: [
						"aVertexPosition",
						"aTextureCoord"
					],
					uniforms: [
						"uViewMatrix",
						"uModelViewMatrix",
						"uProjectionMatrix",

						"uSampler",
						"uColor",
						"uGrayscale",
						"uTextureRes"
					]
				},
				{
					name: "billboard",
					vertex: "vertex/billboard",
					fragment: "fragment/textured",
					attribs: [
						"aVertexPosition",
						"aTextureCoord"
					],
					uniforms: [
						"uViewMatrix",
						"uModelViewMatrix",
						"uProjectionMatrix",
						"uWorldPos",
						"uOffset",

						"uSampler",
						"uColor",
						"uGrayscale",
						"uTextureRes"
					]
					
				},
				{
					name: "billboard/color",
					vertex: "vertex/billboard",
					fragment: "fragment/color",
					attribs: [
						"aVertexPosition",
						"aTextureCoord"
					],
					uniforms: [
						"uViewMatrix",
						"uModelViewMatrix",
						"uProjectionMatrix",
						"uWorldPos",
						"uOffset",

						"uColor",
					]
				},
			]
		},
		{
			type: "textures",
			loader: "texture-loader",
			sources: [
				{
					name: "spriteAtlas/4",
					src: "https://rotmg-mirror.github.io/rotmg-metadata/assets/production/atlases/mapObjects.png"
				},
				{
					name: "spriteAtlas/2",
					src: "https://rotmg-mirror.github.io/rotmg-metadata/assets/production/atlases/characters.png"
				},
				{
					name: "spriteAtlas/1",
					src: "https://rotmg-mirror.github.io/rotmg-metadata/assets/production/atlases/groundTiles.png"
				}
			]
		}
	]
}