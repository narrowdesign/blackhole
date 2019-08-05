/* global UV , THREE , Util */

/*
	a globe
*/

import * as THREE from "../../../lib/three.module.js";

class Rings {
	constructor(parent3d, renderer, eventhub, gui, name) {
		this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.el = document.querySelector('.rings__container');

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.el.appendChild( this.renderer.domElement );
    
    
		this.material = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: {type: 'f', value: 0}
			},
		vertexShader: `
			uniform float u_time;
			varying vec2 vUv;
			void main() {
		vec4 modelViewPosition = modelViewMatrix * vec4(position.x, position.y, position.z / 2., 1.);
							gl_Position = projectionMatrix * modelViewPosition;
			}`,
						
		fragmentShader: `
			uniform float u_time;
			void main() {
				gl_FragColor = vec4(1.,1.,1.,1.);
			}`
    });

    this.rings = new THREE.Group();

		for (let i = 0; i < 40; i++) {
      let geometry = new THREE.RingGeometry( .2 + i/3, .22 + i/3, 52 + i * 2 );
      let ring = new THREE.Mesh( geometry, this.material );

      this.rings.add( ring );
    }
    this.scene.add(this.rings);
		this.light = new THREE.AmbientLight( 0x404040 );
		this.light2 = new THREE.PointLight( 0xffffff, 1, 100 );
		// scene.add( light );
		this.scene.add( this.light2 );
		this.light2.position.set(0,0,5);


		this.camera.position.z = 5;

    this.update = this.update.bind(this);
    this.frame = 0;
    this.update();
	}

	update() {
    this.frame++;
		// this.material.uniforms.u_time.value = performance.now();
		// console.log(        this.material.uniforms.u_time.value)
		requestAnimationFrame( this.update );
    this.renderer.render( this.scene, this.camera );
    this.el.style.height = this.frame + 'px';

    for (let i = 0; i < this.rings.children.length; i++) {
      this.rings.children[i].position.z += i / (1000 + this.frame);
    }
	};
}

export default Rings;
