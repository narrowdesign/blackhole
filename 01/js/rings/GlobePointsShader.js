/**

 	Simple Points Shader

 */

const GlobePointsShader = {
	uniforms: {
		texture: { type: 't' }, //particle textur
		opacity: { type: 'f' }, //global opac
		size: { type: 'f' }, //global size
		color: { type: 'v3' }, //global size
	},

	attributes: {
		position: { type: 'v3', value: [] },
	},

	vertexShader: `
		precision highp float;
		
		uniform mat4 modelMatrix;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		uniform float size;

		attribute vec3 position;
		
		void main() {
			
			vec3 p = position;//scale * texture2D( tPositions, uv ).xyz;
			vec4 mvPosition = modelViewMatrix * vec4( p, 1. );
			//perspective size
			float distance = 300.0 / -mvPosition.z;
			gl_PointSize = 0.1 * size * distance;
			gl_Position = projectionMatrix * mvPosition;

		}`,

	fragmentShader: `
		precision highp float;

		uniform sampler2D texture;
		uniform float opacity;
		uniform vec3 color;

		void main() {
			gl_FragColor = vec4(color, opacity ) * texture2D( texture, gl_PointCoord );
		}`,
};

export default GlobePointsShader;
