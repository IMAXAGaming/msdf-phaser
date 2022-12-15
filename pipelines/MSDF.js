const fragShader = `
precision mediump float;
uniform sampler2D uMainSampler[%count%];

uniform float uDistanceFieldScale;
uniform vec4 uFgColor;
uniform vec4 uBgColor;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main()
{
    vec4 texture;
    %forloop%
    float sd = median(texture.r, texture.g, texture.b);
    float screenPxDistance = uDistanceFieldScale*2.0*(sd - 0.5);
    float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);
	gl_FragColor = mix(opacity*uBgColor, opacity*uFgColor, opacity);
	// gl_FragColor = mix(uBgColor, uFgColor, opacity); This is the correct for blending with a background color but it doesn't blend the alpha
}
`;

export default class MSDFPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
	constructor(game) {
		super({
			game,
			fragShader,
			uniforms: [
				'uProjectionMatrix',
				'uMainSampler',
				'uDistanceFieldScale',
				'uFgColor',
				'uBgColor'
			]
		});

		this._distanceFieldScale = 1;
		this._fgColor = [1, 1, 1, 1];
		this._bgColor = [1, 1, 1, 0];
	}

	onBind(gameObject) {
		super.onBind();

		const data = gameObject.pipelineData;

		let scale = 1;
		if (data.scale)
			scale = data.scale;
		this.set1f('uDistanceFieldScale', scale);

		let color = [1, 1, 1, 1];
		if (data.color)
			color = data.color;
		this.set4f('uFgColor', color[0], color[1], color[2], color[3]);

		let bgColor = [1, 1, 1, 0];
		if (data.backgroundColor)
			bgColor = data.backgroundColor;
		this.set4f('uBgColor', bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
	}

	onBatch(gameObject) {
		if (gameObject)
			this.flush();
	}
}