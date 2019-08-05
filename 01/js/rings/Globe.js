/* global UV , THREE , Util */

/*
	a globe
*/

import * as THREE from "../../../lib/three.module.js";
import GlobePointsShader from "./GlobePointsShader.js";

class Globe {
	constructor(parent3d, renderer, eventhub, gui, name) {
		eventhub.on("update", this.update.bind(this));
		//eventhub.on('resize', this.resize.bind(this));

		this.renderer = renderer;
		this.targetPos = 0;

		this.vizParams = {
			scale: 1,
			spinSpeed: 0,
			pointsSize: 10,
			pointsOpac: 0.9,
		};

		//INIT GUI
		gui.add(this.vizParams, "scale", 0.001, 2).onChange(this.onParamsChange.bind(this));
		gui.add(this.vizParams, "spinSpeed", 0, 1, 0.01).onChange(this.onParamsChange.bind(this));
		gui.add(this.vizParams, "pointsSize", 0.1, 20).onChange(this.onParamsChange.bind(this));
		gui.add(this.vizParams, "pointsOpac", 0, 1).onChange(this.onParamsChange.bind(this));
		gui.open();

		//INIT POINTS
		this.holder = new THREE.Group();
		parent3d.add(this.holder);

		let earthImg = new THREE.ImageLoader().load("earth-600.jpg", this.onEarthImgLoaded.bind(this));
	}

	onEarthImgLoaded(earthImg) {
		console.log("onEarthImgLoaded");

		let imageW = earthImg.width;
		let imageH = earthImg.height;

		// draw img to canvas
		let imgCanvas = document.createElement("canvas");
		imgCanvas.width = imageW;
		imgCanvas.height = imageH;
		let context = imgCanvas.getContext("2d");
		context.drawImage(earthImg, 0, 0);
		let pixels = context.getImageData(0, 0, imageW, imageH).data;
		let index = 0;
		let BRIGHTNESS_CUTOFF = 100;
		let EARTH_RAD = 30;

		//add a pt for each white pixel
		this.pointsGeom = new THREE.Geometry();
		for (let x = 0; x < imageW; ++x) {
			for (let y = 0; y < imageH; ++y) {
				index = x * 4 + y * (4 * imageW);
				let r = pixels[index];

				if (r > 33) {
					//this pixel white so make a 3d point
					//points in range
					//x: 0 -> Math.PI/2;
					//y: 0 - Math.PI
					let pt = {
						x: ((x - imageW / 2) * Math.PI * 2) / imageW,
						y: ((y - imageH / 2) * Math.PI) / imageH,
					};
					let v = new THREE.Vector3();
					//convert to 3d sphere coords
					v.x = EARTH_RAD * Math.cos(pt.y) * Math.cos(pt.x);
					v.y = EARTH_RAD * Math.cos(pt.y) * Math.sin(pt.x);
					v.z = EARTH_RAD * -Math.sin(pt.y);
					this.pointsGeom.vertices.push(v);
				}
			}
		}

		this.pointsGeom.rotateX(-Math.PI / 2);
		this.pointsGeom.rotateY(-Math.PI / 2);

		console.log("pointCount", this.pointsGeom.vertices.length);

		this.pointsMat = new THREE.RawShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(GlobePointsShader.uniforms),
			vertexShader: GlobePointsShader.vertexShader,
			fragmentShader: GlobePointsShader.fragmentShader,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true,
		});

		let tl = new THREE.TextureLoader();
		this.pointsMat.uniforms.texture.value = tl.load("glow.png");
		this.pointsMat.uniforms.color.value = new THREE.Color(0xff00ff);

		this.points = new THREE.Points(this.pointsGeom, this.pointsMat);
		this.holder.add(this.points);

		this.onParamsChange();
	}

	onParamsChange() {
		this.points.scale.setScalar(this.vizParams.scale);
		this.pointsMat.uniforms.opacity.value = this.vizParams.pointsOpac;
		this.pointsMat.uniforms.size.value = this.vizParams.pointsSize;
	}

	update() {
		if (this.points) {
			this.points.rotation.y += this.vizParams.spinSpeed / 10;
		}
	}
}

export default Globe;
